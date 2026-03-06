from fastapi import APIRouter, HTTPException, Request, Query
from typing import Any, Dict, Optional, List
from uuid import uuid4
from datetime import datetime, timezone
import traceback

from postgrest.exceptions import APIError

from app.db import supabase
from app.auth.dependencies import get_current_user
from app.practice.schemas import (
    PracticeSessionsResponse,
    PracticeSessionDetailResponse,  # imported even if unused, ok
    PracticeStatsResponse,
    PracticeStartRequest,
    PracticeStartResponse,
    PracticeSubmitRequest,
    PracticeSubmitResponse,
)

router = APIRouter(prefix="/api/practice", tags=["practice"])


# =========================
# Helpers (no resp.error)
# =========================

def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def safe_float(value: Any, default: Optional[float] = None) -> Optional[float]:
    if value is None:
        return default
    try:
        return float(value)
    except Exception:
        return default


def safe_int(value: Any, default: int = 0) -> int:
    if value is None:
        return default
    try:
        return int(float(value))
    except Exception:
        return default


def normalize_tier_int(value: Any) -> Optional[int]:
    if value is None:
        return None
    if isinstance(value, int):
        return value
    if isinstance(value, float):
        return int(value)
    if isinstance(value, str):
        digits = "".join(c for c in value.strip() if c.isdigit())
        return int(digits) if digits else None
    return None


def sb_data(resp: Any) -> Any:
    # supabase-py APIResponse has .data
    return getattr(resp, "data", None)


def sb_raise(e: Exception, context: str = "Supabase error") -> None:
    """
    Raises an HTTPException and ALSO prints traceback to terminal so we can see
    the true root cause of 500s (FK violations, RLS, bad UUIDs, etc.).
    """
    print("\n=== SUPABASE ERROR ===")
    print("Context:", context)
    print("Error:", str(e))
    traceback.print_exc()
    print("=== END SUPABASE ERROR ===\n")

    if isinstance(e, APIError):
        # APIError often contains dict payload in args[0]
        try:
            payload = e.args[0]
        except Exception:
            payload = str(e)
        raise HTTPException(status_code=500, detail=f"{context}: {payload}")

    raise HTTPException(status_code=500, detail=f"{context}: {str(e)}")


# =========================
# POST /start
# =========================

@router.post("/start", response_model=PracticeStartResponse)
def start_practice(payload: PracticeStartRequest, request: Request):
    user = get_current_user(request)
    user_id = user["id"]

    session_id = str(uuid4())
    now = now_iso()

    tier_int = normalize_tier_int(payload.tier)

    row = {
        "id": session_id,
        "user_id": user_id,
        "lesson_id": payload.lesson_id,
        "mode": payload.mode or "practice",
        "status": "active",
        "metadata": payload.metadata or {},
        "started_at": now,
        "tier": tier_int,
    }

    try:
        supabase.table("practice_sessions").insert(row).execute()
    except Exception as e:
        sb_raise(e, "Supabase insert error (practice_sessions)")

    # NOTE: response schema expects created_at; we mirror started_at here
    return {
        "session_id": session_id,
        "lesson_id": payload.lesson_id,
        "mode": row["mode"],
        "status": "active",
        "created_at": now,
    }


# =========================
# POST /submit
# =========================

@router.post("/submit", response_model=PracticeSubmitResponse)
def submit_practice(payload: PracticeSubmitRequest, request: Request):
    user = get_current_user(request)
    user_id = user["id"]

    session_id = str(payload.session_id)
    now = now_iso()

    # 1) verify session exists + ownership
    try:
        s = (
            supabase.table("practice_sessions")
            .select("id,user_id")
            .eq("id", session_id)
            .limit(1)
            .execute()
        )
    except Exception as e:
        sb_raise(e, "Supabase session read error")

    srows = sb_data(s) or []
    if not srows:
        raise HTTPException(status_code=404, detail="Session not found")

    if str(srows[0].get("user_id")) != str(user_id):
        raise HTTPException(status_code=403, detail="Not your session")

    # 2) normalize values
    wpm = safe_float(payload.wpm)
    accuracy = safe_float(payload.accuracy)
    error_count = safe_int(payload.error_count, 0)

    # IMPORTANT: sessions.time_seconds is double precision in your DB summary
    # We'll accept float-ish but you currently store int here; ok for now.
    time_seconds = safe_int(payload.time_seconds, 0)
    duration_seconds = safe_int(payload.duration_seconds, time_seconds)

    correct = safe_int(payload.correct, 0)
    total = safe_int(payload.total, 0)
    score = safe_int(payload.score, correct)

    tier_int = normalize_tier_int(payload.tier)
    tier_text = f"tier{tier_int}" if tier_int is not None else None

    # 3) insert result row (practice_results tier is TEXT in your DB)
    result_row = {
        "id": str(uuid4()),
        "session_id": session_id,
        "user_id": user_id,
        "results": payload.results or {},
        "score": score,
        "correct": correct,
        "total": total,
        "duration_seconds": duration_seconds,
        "wpm": wpm,
        "accuracy": accuracy,
        "error_count": error_count,
        "time_seconds": time_seconds,
        "tier": tier_text,
        "details": payload.details or {},
        "created_at": now,
    }

    try:
        supabase.table("practice_results").insert(result_row).execute()
    except Exception as e:
        sb_raise(e, "Supabase insert error (practice_results)")

    # 4) update session summary (practice_sessions tier is INTEGER in your DB)
    update_row = {
        "status": "submitted",
        "submitted_at": now,
        "completed_at": now,
        "wpm": wpm,
        "accuracy": accuracy,
        "error_count": error_count,
        "time_seconds": time_seconds,
        "duration_seconds": duration_seconds,
        "tier": tier_int,
        "details": payload.details or {},
    }

    try:
        (
            supabase.table("practice_sessions")
            .update(update_row)
            .eq("id", session_id)
            .execute()
        )
    except Exception as e:
        sb_raise(e, "Supabase update error (practice_sessions)")

    return {
        "ok": True,
        "session_id": session_id,
        "result_id": result_row["id"],
        "submitted_at": now,
    }


# =========================
# GET /sessions
# =========================

@router.get("/sessions", response_model=PracticeSessionsResponse)
def list_sessions(request: Request, limit: int = Query(20, ge=1, le=200)):
    user = get_current_user(request)
    user_id = user["id"]

    try:
        resp = (
            supabase.table("practice_sessions")
            .select("*")
            .eq("user_id", user_id)
            .order("submitted_at", desc=True)
            .order("started_at", desc=True)
            .limit(limit)
            .execute()
        )
    except Exception as e:
        sb_raise(e, "Supabase sessions read error")

    return {"sessions": sb_data(resp) or []}


# =========================
# GET /stats
# =========================

@router.get("/stats", response_model=PracticeStatsResponse)
def stats(request: Request, window: int = Query(50, ge=1, le=500)):
    user = get_current_user(request)
    user_id = user["id"]

    try:
        resp = (
            supabase.table("practice_sessions")
            .select("id,lesson_id,submitted_at,wpm,accuracy,error_count,time_seconds,duration_seconds,tier,status")
            .eq("user_id", user_id)
            .eq("status", "submitted")
            .order("submitted_at", desc=True)
            .limit(window)
            .execute()
        )
    except Exception as e:
        sb_raise(e, "Supabase stats read error")

    sessions = sb_data(resp) or []

    if not sessions:
        return {
            "total_sessions": 0,
            "total_time_seconds": 0,
            "avg_wpm": None,
            "best_wpm": None,
            "avg_accuracy": None,
            "best_accuracy": None,
            "last_session": None,
        }

    wpms = [float(s["wpm"]) for s in sessions if s.get("wpm") is not None]
    accs = [float(s["accuracy"]) for s in sessions if s.get("accuracy") is not None]
    times = [safe_int(s.get("time_seconds"), 0) for s in sessions]

    total_time = sum(times) if times else 0

    def safe_mean(vals: List[float]) -> Optional[float]:
        return (sum(vals) / len(vals)) if vals else None

    last = sessions[0]

    return {
        "total_sessions": len(sessions),
        "total_time_seconds": total_time,
        "avg_wpm": safe_mean(wpms),
        "best_wpm": max(wpms) if wpms else None,
        "avg_accuracy": safe_mean(accs),
        "best_accuracy": max(accs) if accs else None,
        "last_session": {
            "id": last.get("id"),
            "lesson_id": last.get("lesson_id"),
            "submitted_at": last.get("submitted_at"),
            "wpm": last.get("wpm"),
            "accuracy": last.get("accuracy"),
            "error_count": last.get("error_count"),
            "time_seconds": last.get("time_seconds"),
            "duration_seconds": last.get("duration_seconds"),
            "tier": last.get("tier"),
            "status": last.get("status"),
        },
    }