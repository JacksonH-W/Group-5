import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient
from app.auth.dependencies import get_current_user

from tests.helpers.fake_supabase import FakeSupabase


@pytest.mark.validation
def test_get_all_lessons_applies_difficulty_filter(monkeypatch):
    from app.lessons import router as lessons_router

    fake = FakeSupabase([])
    monkeypatch.setattr(lessons_router, "supabase", fake)

    app = FastAPI()
    app.dependency_overrides[get_current_user] = lambda: {
        "id": "11111111-1111-1111-1111-111111111111",
        "username": "testuser",
        "email": "test@example.com",
        "created_at": "2026-01-01T00:00:00Z",
    }
    app.include_router(lessons_router.router)
    client = TestClient(app)

    r = client.get("/api/lessons?difficulty=3&limit=10")
    assert r.status_code == 200

    # Ensure the router added the eq("difficulty", difficulty) filter
    assert fake.last_table == "lessons"
    assert ("difficulty", 3) in fake.last_query.filters
    assert ("limit", 10) in fake.last_query.calls