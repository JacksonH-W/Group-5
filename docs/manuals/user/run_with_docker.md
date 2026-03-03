# Running Group-5 with Docker (Recommended)

This guide is for **anyone** (devs, TAs, testers) who wants to run the app from scratch using Docker.

---

## Prerequisites

### Required
- **Git**
- **Docker Engine** + **Docker Compose v2**
  - Confirm with:
	```bash
    docker --version
    docker compose version
    ```
    Go to [install_git_docker.md](https://github.com/JacksonH-W/Group-5/tree/docker_implementation/docs/manuals/user/install_git_docker.md) for more information.

### Recommended
- Linux/macOS: run Docker without `sudo` (Linux: add your user to the `docker` group).

---

## Repo layout (expected)

From the repo root you should have:
```text
Group-5/
  docker-compose.yml
  backend/
  frontend/
  db/
  .env.anon           (you create this)
  frontend/.env.local (you create this)
```

---

## 1) Create required environment files

### A) Backend env: `.env` (repo root)

Create `Group-5/.env`:

```bash
cat > .env <<'EOF'
# Backend / server-side configuration
# Fill these with your real values.
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
EOF
```
### B) Frontend env: `frontend/.env.local`

Create `Group-5/frontend/.env.local`:

```bash
cat > frontend/.env.local <<'EOF'
# Browser-visible API URL
VITE_API_BASE_URL=http://localhost:8000
EOF
```

---

## 2) Build and run

From the repo root:

```bash
docker compose up --build
```

To access the frontend either:
- http://localhost:3000/
- http://172.18.0.3:3000/

And backend will be at:
- http://localhost:8000

Stop containers with:
```bash
Ctrl+C
```

Or in another terminal:
```bash
docker compose down
```


