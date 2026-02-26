import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient
from app.auth.dependencies import get_current_user

from tests.helpers.fake_supabase import FakeSupabase


@pytest.fixture
def app_with_router(monkeypatch):
    # Import your router module
    from app.lessons import router as lessons_router

    # Patch supabase used by router
    sample = [{
        "id": "11111111-1111-1111-1111-111111111111",
        "title": "Intro",
        "description": "desc",
        "content": "hello",
        "difficulty": 1,
        "prerequisites": None
    }]
    monkeypatch.setattr(lessons_router, "supabase", FakeSupabase(sample))

    app = FastAPI()
    app.dependency_overrides[get_current_user] = lambda: {
        "id": "11111111-1111-1111-1111-111111111111",
        "username": "testuser",
        "email": "test@example.com",
        "created_at": "2026-01-01T00:00:00Z",
    }
    app.include_router(lessons_router.router)
    return app


@pytest.mark.validation
def test_get_all_lessons_returns_list(app_with_router):
    client = TestClient(app_with_router)
    r = client.get("/api/lessons")
    assert r.status_code == 200
    body = r.json()
    assert "lessons" in body
    assert isinstance(body["lessons"], list)
    assert body["lessons"][0]["title"] == "Intro"