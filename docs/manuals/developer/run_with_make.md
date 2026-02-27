# Running Group-5 with Make (Developer)

This guide is for **developers** running the backend + frontend **locally** (not Docker).

---

## Prerequisites

### Required
- **Python 3.x** (match the project’s backend requirement)
- **Node.js + npm**
- **make**

Confirm:
```bash
python --version
node --version
npm --version
make --version
```
Go to [install_dev_requirements.md](https://github.com/JacksonH-W/Group-5/tree/docker_implementation/docs/manuals/user/install_dev_requirements.md) for more information.

---

## Required environment files

### A) Backend env: `.env (repo root)

Local backend expects backend configuration via environment variables. Use the same file Docker uses:

Create `Group-5/.env:
```bash
cat > .env <<'EOF'
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY
EOF
```

### B) Frontend env: `frontend/.env.local`

Create `Group-5/frontend/.env.local`:
```bash
cat > frontend/.env.local <<'EOF'
VITE_API_BASE_URL=http://localhost:8000
EOF
```

---

## One-time setup

From the repo root:
### Backend
```bash
make backend-venv
make backend-install
```

### Frontend
```bash
make frontend-install
```
If `frontend-install` presents `npm EACCES permission denied ...` then:
```
# Check what is owed by root, this can still presents "chown: invalid group: .."
sudo chown -R $USER:$USER frontend

# Remove the broken install:
rm -rf frontend/node_modules frontend/package-lock.json

# And install again
make frontend-install
```

---

## Run locally (two terminals)

### Terminal 1 (backend)
```bash
make backend-dev
```

### Terminal 2 (frontend)
```bash
make frontend-dev
```

To access the frontend either:
- http://localhost:3000/
- http://127.0.0.1:3000/

And backend will be at:
- http://localhost:8000

---

## Notes / common fixes

### `No module named uvicorn`
Your backend venv is missing dependencies. Re-run:
```bash
make backend-install
```

### `vite: command not found`
You haven’t installed frontend deps. Run:
```bash
make frontend-install
```
---

## Cleanup

```bash
make clean
```

## Help
As there are many make commands there is a little helper. Run:
```bash
make
```
This will display the order in which you run them and some more information about the commands.
