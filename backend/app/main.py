from fastapi import FastAPI
import os
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from auth.controller import router as auth_router
from dashboard.router import router as dashboard_router

app = FastAPI(title="Type2Code API")

# Middleware for the session
app.add_middleware(
    SessionMiddleware,
    secret_key=os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
)

# Middleware for CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)
app.include_router(auth_router)
app.include_router(dashboard_router)

@app.get("/")
def root():
    return {"message": "Type2Code API"}

@app.get("/health")
def health():
    return {"status": "ok"}

