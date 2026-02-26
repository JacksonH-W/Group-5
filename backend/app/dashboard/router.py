from uuid import UUID
from app.db import supabase
from fastapi import HTTPException, Request, status
from app.auth.dependencies import get_current_user
from fastapi import APIRouter, HTTPException, Query, Request, status

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])

@router.get("/me")
def get_dashboard(
    request: Request, 
    recent_limit: int = Query(10, ge=1, le=100),
):
    user = get_current_user(request)
    user_id = user["id"]

    try:
        resp = supabase.rpc(
            "get_users_dashboard", 
            {
                "p_user_id": str(user_id), 
                "p_recent_limit": 10
            }
        ).execute()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Supabase RPC call failed: {e}")

    # supabase-py usually returns data in resp.data
    data = getattr(resp, "data", None)
    if data is None:
        raise HTTPException(status_code=404, detail="No dashboard data returned")

    #in case supabase returns list as the data, checking
    if isinstance(data, list):
        return data[0] if data else  {"use_id": str(user_id)}

    return data

@router.get("/{user_id}")
def get_dashboard_by_user_id(
    user_id: UUID, 
    request: Request, 
    #default 10, lest 1, max 100
    recent_limit: int = Query(10, ge=1, le=100),
):
    """
    Get aggregated user dashboard data for a specific user_id.
    Security: only allow a user to fetch their own dashboard.
    """
    current = get_current_user(request)
    if str(current["id"]) != str(user_id):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not allowed")
    try:
        resp = supabase.rpc(
            "get_users_dashboard", 
            {
                "p_user_id": str(user_id),
                "p_recent_limit": recent_limit,
            },
        ).execute()

    except Execution as e:
        raise HTTPException(status_code=500, detail=f"Supabase RPC call failed {e}")
    
    data = getattr(resp, "data", None)
    if data is None:
        raise HTTPException(status_code=404, detail=f"No data returned")

    #in case supabase returns list as the data, checking
    if isinstance(data, list):
            return data[0] if data else  {"use_id": str(user_id)}

    return data


