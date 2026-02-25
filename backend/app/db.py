import os
from pathlib import Path
from dotenv import load_dotenv
from supabase import create_client, Client

ROOT_DIR = Path(__file__).resolve().parents[2]

# Prefer admin env, fallback to anon
ENV_ADMIN = ROOT_DIR / ".env.admin"
ENV_ANON = ROOT_DIR / ".env.anon"

if ENV_ADMIN.exists():
    load_dotenv(dotenv_path=ENV_ADMIN)
    print("Loaded .env.admin")
elif ENV_ANON.exists():
    load_dotenv(dotenv_path=ENV_ANON)
    print("Loaded .env.anon")
else:
    raise RuntimeError("No .env.admin or .env.anon found in Group-5 root")

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL:
    raise RuntimeError("Missing SUPABASE_URL in environment")

supabase_admin: Client | None = None 
if SUPABASE_SERVICE_ROLE_KEY:
    supabase_admin = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    print("Supabase admin client: enabled")
else:
    print("Supabase admin client: disabled")

supabase = Client = supabase_admin or supabase_public

if supabase is None:
    raise RuntimeError("No valid Supabase credentials found")
