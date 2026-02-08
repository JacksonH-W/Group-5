from fastapi import FastAPI
from app.dashboard.router import router as dashboard_router

app = FastAPI(title="Type2Code API")

app.include_router(dashboard_router)

@app.get("/health")
def health():
    return {"status": "ok"}

