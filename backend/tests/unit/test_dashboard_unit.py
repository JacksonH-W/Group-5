import pytest
import app.dashboard.router as dashboard_router
from fastapi import HTTPException

def test_get_dashboard_by_user_id_forbidden(monkeypatch):
    def fake_user(request):
        return {"id": "user-1"}

    monkeypatch.setattr(dashboard_router, "get_current_user", fake_user)

    with pytest.raises(HTTPException) as exc:
        dashboard_router.get_dashboard_by_user_id(
            user_id="user-2",
            request=None,
            recent_limit=10
        )

    assert exc.value.status_code == 403
