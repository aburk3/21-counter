# 21 Counter

Blackjack card-count training web application focused on running-count accuracy, basic-strategy correctness, and speed.

## Stack

- Frontend: React, TypeScript, Vite, styled-components, Vitest
- Backend: Django REST Framework, PostgreSQL (SQLite fallback when Postgres env vars are not set)

## Project Structure

- `backend/` Django REST API, game engine, persistence models
- `frontend/` React app for auth, dashboard, and gameplay

## Backend Setup

### 1) Create and activate a virtual environment

```bash
cd backend
pyenv local 3.14.3
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

If `pip` access was previously blocked, rerun explicitly:

```bash
python3 -m pip install --upgrade pip
python3 -m pip install -r requirements.txt
```

### 2) Configure environment variables

Create `.env` (or export variables):

```bash
export DJANGO_SECRET_KEY="change-me"
export DJANGO_DEBUG=1
export DJANGO_ALLOWED_HOSTS="localhost,127.0.0.1"
export CORS_ALLOWED_ORIGINS="http://localhost:5173"
export POSTGRES_DB=counter
export POSTGRES_USER=$USER
export POSTGRES_PASSWORD=
export POSTGRES_HOST=localhost
export POSTGRES_PORT=5432
export REDIS_URL=redis://127.0.0.1:6379/1
export DEFAULT_FROM_EMAIL="no-reply@21-counter.local"
export FRONTEND_EMAIL_VERIFY_URL="http://localhost:5173/auth"
export FRONTEND_GOOGLE_COMPLETE_URL="http://localhost:5173/auth"
export GOOGLE_OAUTH_CLIENT_ID=""
export GOOGLE_OAUTH_CLIENT_SECRET=""
export GOOGLE_OAUTH_REDIRECT_URI="http://localhost:8000/api/auth/google/callback"
```

If `POSTGRES_DB` is not set, backend uses `backend/db.sqlite3` for local development.

### 3) Create database and run migrations

```bash
# Create database in postgres (example)
createdb counter

# Run migrations
python manage.py migrate
```

Start services when needed:

```bash
brew services start postgresql@16
brew services start redis
```

### 4) Run backend

```bash
python manage.py runserver
```

### Backend Quality Commands

```bash
python manage.py test
ruff check .
black --check .
```

## Frontend Setup

### 1) Install dependencies

```bash
cd frontend
npm install
```

### 2) Configure API base URL

```bash
export VITE_API_URL="http://localhost:8000/api"
```

### 3) Run frontend

```bash
npm run dev
```

### Frontend Quality Commands

```bash
npm run test
npm run lint
npm run build
```

## Gameplay Notes

- Setup dialog saves default decks/hands/shoes per user.
- User starts with `$500` chips in persisted profile.
- Actions: Hit, Stand, Split, Double (no surrender).
- End-of-round dialog requires running count submission and displays:
  - correct/incorrect count
  - actual running count
  - round time
  - strategy feedback (played vs recommended action)
- Game visuals are top-down and 2D with no gameplay animations.

## API Overview

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/email/verify/request`
- `POST /api/auth/email/verify/confirm`
- `GET /api/auth/google/start`
- `GET /api/auth/google/callback`
- `POST /api/auth/google/complete`
- `GET /api/me`
- `PATCH /api/me/settings`
- `GET /api/dashboard`
- `POST /api/sessions`
- `GET /api/sessions/{id}`
- `POST /api/sessions/{id}/bet`
- `POST /api/sessions/{id}/deal`
- `POST /api/sessions/{id}/action`
- `POST /api/sessions/{id}/round/submit-count`
- `POST /api/sessions/{id}/next-round`
- `POST /api/sessions/{id}/exit`

## Safe Commit Checklist

- Set local hook path once: `git config core.hooksPath .githooks`
- Run `./scripts/check-staged-security.sh` before each commit.
- Confirm no `.env*`, key material (`*.pem`, `*.key`), or credential JSON files are staged.
- Review staged diff with `git diff --cached`.
