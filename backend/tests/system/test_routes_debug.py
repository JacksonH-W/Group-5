def test_print_routes(app):
    paths = sorted([r.path for r in app.routes])
    assert "/api/dashboard/{user_id}" in paths or "/api/dashboard/me" in paths, paths
