from fastapi import HTTPException, status, Request
from db import supabase

# Get the current user in the session
def get_current_user(request: Request) -> dict:
    user_id = request.session.get("user_id")
    
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )
    
    # Get user from Supabase table
    result = supabase.table("users").select("*").eq("id", user_id).execute()
    
    # If SELECT statement fails
    if not result.data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    
    return result.data[0]