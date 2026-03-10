from fastapi import APIRouter, HTTPException, Request, status
from app.db import supabase
from app.auth.auth import UserRegister, UserLogin, UserResponse, CurrentUser
from app.auth.dependencies import get_current_user

router = APIRouter(prefix="/api/auth", tags=["authentication"])


@router.post("/register", response_model=UserResponse)
def register(payload: UserRegister):
    """
    Creates a Supabase Auth user (email/password), then upserts a profile row in public.users.
    public.users has: id, username, email, created_at
    """
    # 1) Create auth user
    auth_res = supabase.auth.sign_up(
        {
            "email": payload.email,
            "password": payload.password,
        }
    )

    auth_user = getattr(auth_res, "user", None)
    auth_error = getattr(auth_res, "error", None)

    if auth_error or not auth_user:
        # auth_error may be None depending on client version; handle generically
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(auth_error) if auth_error else "Auth sign_up failed",
        )

    user_id = auth_user.id  # UUID string

    # 2) Create or update profile row
    # Upsert is safe if the row already exists.
    profile_res = (
        supabase.table("users")
        .upsert(
            {
                "id": user_id,
                "username": payload.username,
                "email": payload.email,
            }
        )
        .execute()
    )

    if not getattr(profile_res, "data", None):
        raise HTTPException(status_code=500, detail="Profile upsert failed")

    return profile_res.data[0]


@router.post("/login")
def login(payload: UserLogin, request: Request):
    """
    Authenticates with Supabase Auth (email/password), then stores auth user id in cookie session.
    """
    auth_res = supabase.auth.sign_in_with_password(
        {"email": payload.email, "password": payload.password}
    )

    auth_user = getattr(auth_res, "user", None)
    auth_error = getattr(auth_res, "error", None)

    if auth_error or not auth_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )

    # Store auth.users.id in session cookie
    request.session["user_id"] = auth_user.id

    return {"message": "Login successful"}


@router.post("/logout")
def logout(request: Request):
    request.session.clear()
    return {"message": "Logged out successfully"}


@router.get("/me", response_model=CurrentUser)
def me(request: Request):
    return get_current_user(request)