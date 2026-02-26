import os
import pytest
from fastapi.testclient import TestClient


# Ensure imports don't crash due to db.py env checks
os.environ.setdefault("SUPABASE_URL", "http://localhost")
os.environ.setdefault("SUPABASE_SERVICE_ROLE_KEY", "ci-dev")
os.environ.setdefault("SUPABASE_ANON_KEY", "ci-anon") # harmless if not used

@pytest.fixture
def app():
    from app.main import app as real_app
    real_app.dependency_overrides = {}  # keep tests isolated
    return real_app

@pytest.fixture
def client(app):
    return TestClient(app)

@pytest.fixture
def authed_app(app):
    # Import AFTER env vars are set
    from app.auth.dependencies import get_current_user
    # return a FULL user matching response schema expectations
    app.dependency_overrides[get_current_user] = lambda: {
        "id": "11111111-1111-1111-1111-111111111111",
        "username": "testuser",
        "email": "test@example.com",
        "created_at": "2026-01-01T00:00:00Z",
    }
    return app
