import pytest
import app.auth.controller as auth_controller
from app.auth.security import hash_password


class FakeResp:
    def __init__(self, data):
        self.data = data


class FakeRequest:
    def __init__(self):
        self.session = {}

# Tests specifically for register API
@pytest.mark.validation
class TestRegisterValidation:
    """High-level checks that the register endpoint rejects bad input."""

    # Testing registration that doesn't have certain fields filled out
    def test_register_missing_fields(self, client):
        r = client.post("/api/auth/register", json={})
        assert r.status_code == 422

    # Testing password that doesn't fill length requirements
    def test_register_short_password(self, client):
        r = client.post(
            "/api/auth/register",
            json={"username": "user1", "email": "u@example.com", "password": "short"},
        )
        assert r.status_code == 422

    # Testing invalid email input
    def test_register_invalid_email(self, client):
        r = client.post(
            "/api/auth/register",
            json={"username": "user1", "email": "notanemail", "password": "password123"},
        )
        assert r.status_code == 422

# Tests specifically for login API
@pytest.mark.validation
class TestLoginValidation:
    """High-level checks that the login endpoint rejects bad input."""

    def test_login_missing_fields(self, client):
        r = client.post("/api/auth/login", json={})
        assert r.status_code == 422

    def test_login_invalid_email(self, client):
        r = client.post(
            "/api/auth/login",
            json={"email": "notanemail", "password": "password123"},
        )
        assert r.status_code == 422
