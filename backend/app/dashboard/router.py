from uuid import UUID
from app.db import supabase
from fastapi import HTTPException, Request, status
from app.auth.dependencies import get_current_user
from fastapi import APIRouter, HTTPException, Query, Request, status

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])

@router.get("/{user_id}")
def get_dashboard_by_user_id(user_id: UUID, request: Request):
    """
    Get aggregated user dashboard data for a specific user_id.
    Security: only allow a user to fetch their own dashboard.
    """
    current = get_current_user(request)
    if str(current["id"]) != str(user_id):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not allowed")
    try:
        resp = supabase.rpc("get_users_dashboard", {"p_user_id": str(user_id)}).execute()
        data = getattr(resp, "data", None)
        if data is not None:
            return data
    except Exception:
        pass
    out = {"user_id": str(user_id)}
    try:
        completed = (
            supabase.table("lesson_progress")
            .select("id", count="exact")
            .eq("user_id", str(user_id))
            .eq("status", "completed")
            .execute()
        )
        out["lessons_completed"] = completed.count or 0
    except Exception:
        out["lessons_completed"] = 0
    try:
        attempts = (
            supabase.table("practice_results")
            .select("id", count="exact")
            .eq("user_id", str(user_id))
            .execute()
        )
        out["practice_attempts"] = attempts.count or 0
    except Exception:
        out["practice_attempts"] = 0

    return out

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




