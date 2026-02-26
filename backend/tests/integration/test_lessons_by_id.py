import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient
from app.auth.dependencies import get_current_user

from tests.helpers.fake_supabase import FakeSupabase


@pytest.mark.integration
def test_get_lesson_by_id_success(monkeypatch):
    from app.lessons import router as lessons_router

    lesson_id = "22222222-2222-2222-2222-222222222222"
    sample = [{
        "id": lesson_id,
        "title": "Arrays",
        "description": None,
        "content": "arrays content",
        "difficulty": 2,
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
    client = TestClient(app)

    r = client.get(f"/api/lessons/{lesson_id}")
    assert r.status_code == 200
    body = r.json()
    assert body["id"] == lesson_id
    assert body["title"] == "Arrays"


@pytest.mark.integration
def test_get_lesson_by_id_404(monkeypatch):
    from app.lessons import router as lessons_router

    monkeypatch.setattr(lessons_router, "supabase", FakeSupabase([]))  # no results

    app = FastAPI()
    app.dependency_overrides[get_current_user] = lambda: {
        "id": "11111111-1111-1111-1111-111111111111",
        "username": "testuser",
        "email": "test@example.com",
        "created_at": "2026-01-01T00:00:00Z",
    }

    app.include_router(lessons_router.router)
    client = TestClient(app)

    missing_id = "33333333-3333-3333-3333-333333333333"
    r = client.get(f"/api/lessons/{missing_id}")

    assert r.status_code == 404