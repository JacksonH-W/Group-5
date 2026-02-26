import app.dashboard.router as dashboard_router

class FakeResp:
    def __init__(self, data):
        self.data = data

def test_dashboard_by_user_id_success(client, monkeypatch):
    valid_user_id = "123e4567-e89b-12d3-a456-426614174000"

    def fake_user(request):
        return {"id": valid_user_id}

    class FakeSB:
        def rpc(self, *args, **kwargs):
            class Q:
                def execute(self_inner):
                    return FakeResp([{"streak": 7}])
            return Q()

    monkeypatch.setattr(dashboard_router, "get_current_user", fake_user)
    monkeypatch.setattr(dashboard_router, "supabase", FakeSB())

    r = client.get(f"/api/dashboard/{valid_user_id}")
    assert r.status_code == 200
    assert r.json()["streak"] == 7
