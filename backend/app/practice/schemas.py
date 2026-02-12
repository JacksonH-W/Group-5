from pydantic import BaseModel, Field
from typing import Any, Dict, Optional
from uuid import UUID


class PracticeStartRequest(BaseModel):
    lesson_id: Optional[UUID] = None
    mode: str = Field(default="practice", max_length=50)     # Used for "practice", "quizs", and "typing practice".
    metadata: Dict[str, Any] = Field(default_factory=dict)


class PracticeStartResponse(BaseModel):
    session_id: UUID


class PracticeSubmitRequest(BaseModel):
    session_id: UUID
    results: Dict[str, Any] = Field(default_factory=dict)  # This is used to store relevant results, such as score, time taken.
    score: Optional[float] = None
    correct: Optional[int] = None
    total: Optional[int] = None
    duration_seconds: Optional[int] = None


class PracticeSubmitResponse(BaseModel):
    ok: bool = True
