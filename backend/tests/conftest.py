import os
import pytest
from fastapi.testclient import TestClient

# Ensure imports don't crash due to db.py env checks
os.environ.setdefault("SUPABASE_URL", "http://localhost")
os.environ.setdefault("SUPABASE_SERVICE_ROLE_KEY", "ci-dev")
os.environ.setdefault("SUPABASE_ANON_KEY", "ci-anon")  # harmless if not used

@pytest.fixture
def app():
    # Import AFTER env vars are set
    from app.main import app as real_app
    return real_app

@pytest.fixture
def client(app):
    return TestClient(app)
