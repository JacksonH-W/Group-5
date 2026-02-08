from uuid import UUID
from fastapi import APIRouter, HTTPException, Query

from app.db import supabase

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])

@router.get("/{user_id}")
def get_dashboard(
    user_id: UUID,
    recent_limit: int = Query(default=10, ge=1, le=50),
):
    """
    Calls Supabase RPC: public.get_user_dashboard(p_user_id uuid, p_recent_limit int)
    Returns JSON (currently your 'summary' only, plus user_id wrapper if you included it).
    """
    try:
        resp = supabase.rpc(
            "get_users_dashboard",
            {"p_user_id": str(user_id)}
            ).execute()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Supabase RPC call failed: {e}")

    # supabase-py usually returns data in resp.data
    data = getattr(resp, "data", None)
    if data is None:
        raise HTTPException(status_code=404, detail="No dashboard data returned")

    return data


@router.get("/_debug/ping")
def ping():
    resp = supabase.table("lessons").select("id").limit(1).execute()
    return {"ok": True, "data": getattr(resp, "data", None), "raw": str(resp)}


