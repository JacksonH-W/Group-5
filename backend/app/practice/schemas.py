from pydantic import BaseModel, Field
from typing import Any, Dict, Optional, List
from uuid import UUID


class PracticeStartRequest(BaseModel):
    lesson_id: Any
    mode: Optional[str] = "practice"
    tier: Optional[Any] = None
    metadata: Optional[Dict[str, Any]] = Field(default_factory=dict)


class PracticeStartResponse(BaseModel):
    session_id: str
    lesson_id: Any
    mode: str
    status: str
    created_at: str


class PracticeSubmitRequest(BaseModel):
    session_id: UUID

    # aggregate metrics
    wpm: Optional[Any] = None
    accuracy: Optional[Any] = None
    error_count: Optional[Any] = 0
    time_seconds: Optional[Any] = 0
    duration_seconds: Optional[Any] = None

    # score breakdown (optional)
    score: Optional[Any] = None
    correct: Optional[Any] = 0
    total: Optional[Any] = 0

    tier: Optional[Any] = None
    results: Optional[Dict[str, Any]] = Field(default_factory=dict)
    details: Optional[Dict[str, Any]] = Field(default_factory=dict)


class PracticeSubmitResponse(BaseModel):
    ok: bool
    session_id: str
    result_id: str
    submitted_at: str


class PracticeSessionsResponse(BaseModel):
    sessions: List[Dict[str, Any]]


class PracticeSessionDetailResponse(BaseModel):
    session: Dict[str, Any]
    latest_result: Optional[Dict[str, Any]] = None


class PracticeStatsResponse(BaseModel):
    total_sessions: int
    total_time_seconds: int
    avg_wpm: Optional[float] = None
    best_wpm: Optional[float] = None
    avg_accuracy: Optional[float] = None
    best_accuracy: Optional[float] = None
    last_session: Optional[Dict[str, Any]] = None