from pydantic import BaseModel
from typing import Optional


class ExecuteRequest(BaseModel):
    source_code: str
    language: str


class ExecuteResponse(BaseModel):
    stdout: Optional[str] = None
    stderr: Optional[str] = None
    compile_output: Optional[str] = None
    status: str
