from fastapi import HTTPException, status, Request


def get_current_user(request: Request) -> dict:
    """
    Returns the authenticated user's UUID from the session.

    Assumes:
    - SessionMiddleware is installed
    - request.session["user_id"] stores auth.users.id (UUID string)
    """

    # Ensure SessionMiddleware is active
    session = getattr(request, "session", None)
    if session is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session middleware not configured.",
        )

    user_id = session.get("user_id")

    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )

    # We trust this UUID is from auth.users.id
    # Do NOT query public.users here.
    # Let Supabase RLS handle access control.

    return {"id": user_id}