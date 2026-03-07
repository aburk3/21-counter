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

### Email Verification Setup (Production)

Registration requires sending a verification email. Configure SMTP on the backend
service.

Example (Resend SMTP):

```bash
export DJANGO_EMAIL_BACKEND="django.core.mail.backends.smtp.EmailBackend"
export EMAIL_HOST="smtp.resend.com"
export EMAIL_PORT="587"
export EMAIL_HOST_USER="resend"
export EMAIL_HOST_PASSWORD="<resend-api-key>"
export EMAIL_USE_TLS="1"
export DEFAULT_FROM_EMAIL="no-reply@your-domain.com"
export FRONTEND_EMAIL_VERIFY_URL="https://<your-frontend-domain>/auth"
```

Notes:
- Set these in Railway backend service Variables for production.
- If SMTP is unavailable, registration returns `503` and user creation is rolled
  back.
- For local development, you can use:
  - `DJANGO_EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend`

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

## Deployment (Low Cost)

Recommended setup:
- Frontend: Vercel (Hobby)
- Backend API: Railway (service)
- Database: Railway Postgres

### 1) Accounts to create

- GitHub account (if your repo is not already on GitHub)
- Railway account: https://railway.com
- Vercel account: https://vercel.com
- Optional (if using Google login): Google Cloud project + OAuth credentials

### 2) Code/dependency prerequisites

- Backend now includes `gunicorn` in `backend/requirements.txt` for production WSGI serving.
- Frontend includes `frontend/vercel.json` rewrite config for React Router deep links.

### 3) Deploy backend on Railway

1. Push this repo to GitHub.
2. In Railway, create a new project from your GitHub repo.
3. Add a PostgreSQL service in the same Railway project.
4. Add a service for this repo with:
   - Root directory: `backend`
   - Build command: `pip install -r requirements.txt`
   - Start command: `gunicorn config.wsgi:application --bind 0.0.0.0:$PORT`
5. In Railway service variables, set values from `backend/env.production.example`:
   - `DJANGO_SECRET_KEY`
   - `DJANGO_DEBUG=0`
   - `DJANGO_ALLOWED_HOSTS` (your Railway backend hostname)
   - `CORS_ALLOWED_ORIGINS` (your Vercel frontend URL)
   - Database:
     - Preferred: keep Railway-native vars (`PGDATABASE`, `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`)
     - Or set manual mapping (`POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_HOST`, `POSTGRES_PORT`)
     - Or set `DATABASE_URL`
   - `DEFAULT_FROM_EMAIL`
   - `FRONTEND_EMAIL_VERIFY_URL`
   - `FRONTEND_GOOGLE_COMPLETE_URL`
   - Optional OAuth: `GOOGLE_OAUTH_CLIENT_ID`, `GOOGLE_OAUTH_CLIENT_SECRET`, `GOOGLE_OAUTH_REDIRECT_URI`
6. Run migrations in Railway once after first deploy:
   - `python manage.py migrate`

### 4) Deploy frontend on Vercel

1. In Vercel, import the same GitHub repo.
2. Configure:
   - Framework preset: Vite
   - Root directory: `frontend`
3. Add environment variable (from `frontend/env.production.example`):
   - `VITE_API_URL=https://<your-backend-domain>/api`
4. Deploy.

### 5) Final wiring checklist

1. Confirm backend has:
   - `DJANGO_ALLOWED_HOSTS=<backend-domain>`
   - `CORS_ALLOWED_ORIGINS=<frontend-domain>`
2. Confirm frontend has:
   - `VITE_API_URL=https://<backend-domain>/api`
3. Redeploy both services after any env var change.

### 6) Secrets you must set (do not commit)

Required:
- `DJANGO_SECRET_KEY`
- one valid Postgres configuration:
  - Railway native `PG*` vars, or
  - `POSTGRES_*` mapped vars, or
  - `DATABASE_URL`

Optional depending on features:
- `GOOGLE_OAUTH_CLIENT_ID`
- `GOOGLE_OAUTH_CLIENT_SECRET`
- SMTP secrets if using real email delivery:
  - `EMAIL_HOST`
  - `EMAIL_PORT`
  - `EMAIL_HOST_USER`
  - `EMAIL_HOST_PASSWORD`
  - `EMAIL_USE_TLS`

### 7) Production smoke test

1. Register a user.
2. Login and load dashboard.
3. Start session, place bet, deal cards, play a hand, submit count.
4. Verify no CORS errors in browser devtools.
5. Refresh deep route (for example `/play`) and confirm frontend still loads.

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
