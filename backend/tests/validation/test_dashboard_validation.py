import app.dashboard.router as dashboard_router

class FakeResp:
    def __init__(self, data):
        self.data = data

def test_dashboard_me_returns_data(client, monkeypatch):
    def fake_user(request):
        return {"id": "user-123"}

    class FakeSB:
        def rpc(self, *args, **kwargs):
            class Q:
                def execute(self_inner):
                    return FakeResp([{"total_sessions": 5}])
            return Q()

    monkeypatch.setattr(dashboard_router, "get_current_user", fake_user)
    monkeypatch.setattr(dashboard_router, "supabase", FakeSB())

    r = client.get("/api/dashboard/me")
    assert r.status_code == 200
    assert r.json()["total_sessions"] == 5
