import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient

from tests.helpers.fake_supabase import FakeSupabase


@pytest.mark.system
def test_lessons_ping_works_in_test_env(monkeypatch):
    from app.lessons import router as lessons_router

    monkeypatch.setenv("ENV", "test")
    monkeypatch.setattr(lessons_router, "get_current_user", lambda: {"id": "test"})
    monkeypatch.setattr(lessons_router, "supabase", FakeSupabase([{"id": "x"}]))

    app = FastAPI()
    app.include_router(lessons_router.router)
    client = TestClient(app)

    r = client.get("/api/lessons/_debug/ping")
    assert r.status_code == 200
    body = r.json()
    assert body["ok"] is True