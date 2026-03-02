import os
import requests
from fastapi import APIRouter, HTTPException, Request, status

from app.auth.dependencies import get_current_user
from app.execute.schemas import ExecuteRequest, ExecuteResponse

router = APIRouter(prefix="/api/execute", tags=["execute"])

PISTON_URL = os.getenv("PISTON_URL", "http://localhost:2000/api/v2/execute")


@router.post("", response_model=ExecuteResponse, status_code=status.HTTP_200_OK)
def execute_code(payload: ExecuteRequest, request: Request):
    get_current_user(request)

    try:
        resp = requests.post(
            PISTON_URL,
            json={
                "language": payload.language,
                "version": "*",
                "files": [{"content": payload.source_code}],
            },
            timeout=15,
        )
        resp.raise_for_status()
    except requests.Timeout:
        raise HTTPException(status_code=504, detail="Code execution timed out.")
    except requests.RequestException as e:
        raise HTTPException(status_code=502, detail=f"Execution request failed: {e}")

    data = resp.json()
    run = data.get("run", {})

    stdout = run.get("stdout") or None
    stderr = run.get("stderr") or None
    exit_code = run.get("code", 0)
    status_desc = "Accepted" if exit_code == 0 else "Runtime Error"

    return ExecuteResponse(
        stdout=stdout,
        stderr=stderr,
        compile_output=None,
        status=status_desc,
    )
