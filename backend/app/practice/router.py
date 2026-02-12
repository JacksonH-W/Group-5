from fastapi import APIRouter, HTTPException, Request, status
from datetime import datetime, timezone

from app.db import supabase
from app.auth.dependencies import get_current_user
from app.practice.schemas import (
    PracticeStartRequest,
    PracticeStartResponse,
    PracticeSubmitRequest,
    PracticeSubmitResponse,
)

router = APIRouter(prefix="/api/practice", tags=["practice"])


@router.post("/start", response_model=PracticeStartResponse, status_code=status.HTTP_201_CREATED)
def start_practice(payload: PracticeStartRequest, request: Request):
    user = get_current_user(request)
    user_id = str(user["id"])

    if payload.lesson_id:
        lesson_check = (
            supabase.table("lessons")
            .select("id")
            .eq("id", str(payload.lesson_id))
            .limit(1)
            .execute()
        )

        lesson_err = getattr(lesson_check, "error", None)
        if lesson_err:
            raise HTTPException(status_code=500, detail=f"Supabase lesson lookup error: {lesson_err}")

        if not getattr(lesson_check, "data", None):
            raise HTTPException(status_code=400, detail="Invalid lesson_id (lesson does not exist)")

    resp = (
        supabase.table("practice_sessions")
        .insert(
            {
                "user_id": user_id,
                "lesson_id": str(payload.lesson_id) if payload.lesson_id else None,
                "mode": payload.mode,
                "status": "active",
                "metadata": payload.metadata,
            }
        )
        .execute()
    )

    err = getattr(resp, "error", None)
    if err:
        raise HTTPException(status_code=500, detail=f"Supabase insert error: {err}")

    data = getattr(resp, "data", None) or []
    if not data:
        raise HTTPException(status_code=500, detail=f"Insert returned no data. Raw resp: {resp}")

    return {"session_id": data[0]["id"]}


@router.post("/submit", response_model=PracticeSubmitResponse)
def submit_practice(payload: PracticeSubmitRequest, request: Request):
    user = get_current_user(request)
    user_id = str(user["id"])

    s = (
        supabase.table("practice_sessions")
        .select("id,user_id,status")
        .eq("id", str(payload.session_id))
        .limit(1)
        .execute()
    )

    s_err = getattr(s, "error", None)
    if s_err:
        raise HTTPException(status_code=500, detail=f"Supabase read error: {s_err}")

    sdata = getattr(s, "data", None) or []
    if not sdata:
        raise HTTPException(status_code=404, detail="Practice session not found")

    session = sdata[0]
    if str(session["user_id"]) != user_id:
        raise HTTPException(status_code=403, detail="Not allowed to submit for this session")

    if session.get("status") == "submitted":
        return {"ok": True}

    r = (
        supabase.table("practice_results")
        .insert(
            {
                "session_id": str(payload.session_id),
                "user_id": user_id,
                "score": payload.score,
                "correct": payload.correct,
                "total": payload.total,
                "duration_seconds": payload.duration_seconds,
                "results": payload.results,
            }
        )
        .execute()
    )

    r_err = getattr(r, "error", None)
    if r_err:
        raise HTTPException(status_code=500, detail=f"Supabase results insert error: {r_err}")

    submitted_at = datetime.now(timezone.utc).isoformat()

    u = (
        supabase.table("practice_sessions")
        .update({"status": "submitted", "submitted_at": submitted_at})
        .eq("id", str(payload.session_id))
        .execute()
    )

    u_err = getattr(u, "error", None)
    if u_err:
        raise HTTPException(status_code=500, detail=f"Supabase session update error: {u_err}")

    return {"ok": True}
