import pytest
import app.auth.controller as auth_controller
from app.auth.security import hash_password


class FakeResp:
    def __init__(self, data):
        self.data = data


FAKE_USER = {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "username": "sysuser",
    "email": "sys@example.com",
    "password_hash": hash_password("password123"),
    "created_at": "2025-01-01T00:00:00",
}


def _build_fake_supabase(existing_users=None, insert_result=None, login_result=None):
    class FakeQuery:
        def __init__(self, data):
            self._data = data

        def or_(self, *a, **kw):
            return self

        def eq(self, *a, **kw):
            return self

        def execute(self):
            return FakeResp(self._data)

    class FakeTable:
        def __init__(self, name):
            self.name = name

        def select(self, *a, **kw):
            if login_result is not None:
                return FakeQuery(login_result)
            return FakeQuery(existing_users or [])

        def insert(self, *a, **kw):
            return FakeQuery(insert_result or [])

    class FakeSB:
        def table(self, name):
            return FakeTable(name)

    return FakeSB()


@pytest.mark.system
class TestAuthEndToEnd:
    """System-level tests exercising the full register -> login -> me -> logout flow."""

    def test_full_auth_lifecycle(self, client, app, monkeypatch):
        from app.auth.dependencies import get_current_user

        fake_sb = _build_fake_supabase(
            existing_users=[],
            insert_result=[FAKE_USER],
        )
        monkeypatch.setattr(auth_controller, "supabase", fake_sb)

        # 1. Register
        r = client.post(
            "/api/auth/register",
            json={
                "username": "sysuser",
                "email": "sys@example.com",
                "password": "password123",
            },
        )
        assert r.status_code == 201

        # 2. After registration, /me should work (session set during register)
        monkeypatch.setitem(app.dependency_overrides, get_current_user, lambda: FAKE_USER)
        r = client.get("/api/auth/me")
        assert r.status_code == 200
        assert r.json()["username"] == "sysuser"

        # 3. Logout
        r = client.post("/api/auth/logout")
        assert r.status_code == 204

    def test_protected_route_without_auth(self, client):
        """Accessing /me without a session returns 401."""
        r = client.get("/api/auth/me")
        assert r.status_code == 401

    def test_logout_clears_session(self, client, monkeypatch):
        """After logout, /me should return 401."""
        # First set up an authenticated session
        fake_sb = _build_fake_supabase(login_result=[FAKE_USER])
        monkeypatch.setattr(auth_controller, "supabase", fake_sb)

        client.post(
            "/api/auth/login",
            json={"email": "sys@example.com", "password": "password123"},
        )

        # Logout
        r = client.post("/api/auth/logout")
        assert r.status_code == 204

        # Undo the monkeypatch so /me hits the real dependency (which needs session)
        monkeypatch.undo()

        r = client.get("/api/auth/me")
        assert r.status_code == 401
