import pytest
from pydantic import ValidationError

from app.lessons.schemas import LessonResponse


@pytest.mark.unit
def test_lesson_schema_rejects_invalid_difficulty():
    with pytest.raises(ValidationError):
        LessonResponse(
            id="44444444-4444-4444-4444-444444444444",
            title="Bad Difficulty",
            description=None,
            content="x",
            difficulty=10,  # invalid; must be 1..5
            prerequisites=None,
        )


@pytest.mark.unit
def test_lesson_schema_requires_nonempty_title_and_content():
    with pytest.raises(ValidationError):
        LessonResponse(
            id="55555555-5555-5555-5555-555555555555",
            title="",
            description=None,
            content="",
            difficulty=1,
            prerequisites=None,
        )