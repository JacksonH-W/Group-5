from pydantic import BaseModel, Field
from typing import List, Optional
from uuid import UUID


class LessonResponse(BaseModel):
    id: UUID
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=500)
    content: str = Field(..., min_length=1)
    difficulty: int = Field(..., ge=1, le=5)
    prerequisites: Optional[List[UUID]] = None

    class Config:
        from_attributes = True


class LessonListResponse(BaseModel):
    lessons: List[LessonResponse]
