from uuid import UUID
from app.db import supabase
from app.auth.security import hash_password, verify_password
from app.auth.dependencies import get_current_user
from app.auth.auth import UserRegister, UserLogin, UserResponse
from fastapi import APIRouter, HTTPException, Query, status, Request


router = APIRouter(prefix="/api/auth", tags=["authentication"])

# Register new user and create a session
@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(user_data: UserRegister, request: Request):
    
    # Check if the user already exists
    existing = supabase.table("users").select("id").or_(
        f"username.eq.{user_data.username},email.eq.{user_data.email}"
    ).execute()
    
    if existing.data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username or email already exists"
        )
    
    print("PW length:", len(user_data.password), "bytes:", len(user_data.password.encode("utf-8")))

    # Hash password and create user
    hashed_password = hash_password(user_data.password)
    
    # Insert new account into database
    result = supabase.table("users").insert({
        "username": user_data.username,
        "email": user_data.email,
        "password_hash": hashed_password
    }).execute()
    
    # If insert fails
    if not result.data:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create user"
        )
    
    new_user = result.data[0]
    
    # Create session
    request.session["user_id"] = str(new_user["id"])
    
    return new_user

# Login user and create a session
@router.post("/login", response_model=UserResponse)
def login(login_data: UserLogin, request: Request):
    
    # Find user by email
    result = supabase.table("users").select("*").eq("email", login_data.email).execute()
    
    # If SELECT query fails
    if not result.data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    user = result.data[0]
    
    # Verify user password
    if not verify_password(login_data.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Create session
    request.session["user_id"] = str(user["id"])
    
    return user

# End session to logout user
@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(request: Request):
    """Logout user and clear session"""
    request.session.clear()
    return None