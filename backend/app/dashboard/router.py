from fastapi import APIRouter, HTTPException, Query, Request, status
from app.db import supabase
from app.auth.dependencies import get_current_user

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])

@router.get("/me")
def get_dashboard(
    request: Request, 
):
    user = get_current_user(request)
    user_id = user["id"]

    try:
        resp = supabase.rpc(
            "get_users_dashboard",
            {
                "p_user_id": str(user_id),
            }
        ).execute()

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Supabase RPC call failed: {e}")

    # supabase-py usually returns data in resp.data
    data = getattr(resp, "data", None)
    if data is None:
        raise HTTPException(status_code=404, detail="No dashboard data returned")

    return data




