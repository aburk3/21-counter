from __future__ import annotations

import hashlib
import json
import secrets
from datetime import timedelta
from urllib import parse, request as urllib_request
from urllib.parse import urlencode

from django.conf import settings
from django.utils import timezone

from users.models import GoogleOAuthState, OAuthLoginCode, User

GOOGLE_ISSUERS = {"accounts.google.com", "https://accounts.google.com"}


class GoogleOAuthError(ValueError):
    pass


def _hash_value(raw: str) -> str:
    return hashlib.sha256(raw.encode("utf-8")).hexdigest()


def _require_google_config() -> None:
    if not settings.GOOGLE_OAUTH_CLIENT_ID:
        raise GoogleOAuthError("Google OAuth is not configured")
    if not settings.GOOGLE_OAUTH_CLIENT_SECRET:
        raise GoogleOAuthError("Google OAuth is not configured")
    if not settings.GOOGLE_OAUTH_REDIRECT_URI:
        raise GoogleOAuthError("Google OAuth is not configured")


def start_google_auth() -> str:
    _require_google_config()
    raw_state = secrets.token_urlsafe(24)
    raw_nonce = secrets.token_urlsafe(24)

    GoogleOAuthState.objects.create(
        state_hash=_hash_value(raw_state),
        nonce_hash=_hash_value(raw_nonce),
        expires_at=timezone.now() + timedelta(minutes=10),
    )

    params = {
        "client_id": settings.GOOGLE_OAUTH_CLIENT_ID,
        "redirect_uri": settings.GOOGLE_OAUTH_REDIRECT_URI,
        "response_type": "code",
        "scope": "openid email profile",
        "access_type": "offline",
        "include_granted_scopes": "true",
        "prompt": "select_account",
        "state": raw_state,
        "nonce": raw_nonce,
    }
    return f"https://accounts.google.com/o/oauth2/v2/auth?{urlencode(params)}"


def exchange_google_code(*, code: str) -> dict:
    _require_google_config()
    body = parse.urlencode(
        {
            "code": code,
            "client_id": settings.GOOGLE_OAUTH_CLIENT_ID,
            "client_secret": settings.GOOGLE_OAUTH_CLIENT_SECRET,
            "redirect_uri": settings.GOOGLE_OAUTH_REDIRECT_URI,
            "grant_type": "authorization_code",
        }
    ).encode("utf-8")
    req = urllib_request.Request(
        "https://oauth2.googleapis.com/token",
        data=body,
        headers={"Content-Type": "application/x-www-form-urlencoded"},
        method="POST",
    )
    try:
        with urllib_request.urlopen(req, timeout=10) as response:
            payload = json.loads(response.read().decode("utf-8"))
    except Exception as exc:  # pragma: no cover - network errors are environment-specific
        raise GoogleOAuthError("Google token exchange failed") from exc
    if "id_token" not in payload:
        raise GoogleOAuthError("Google response missing id_token")
    return payload


def verify_google_identity(*, raw_id_token: str, expected_nonce_hash: str) -> dict:
    try:
        from google.auth.transport.requests import Request as GoogleRequest
        from google.oauth2 import id_token
    except ImportError as exc:  # pragma: no cover - dependency issue
        raise GoogleOAuthError("google-auth dependency is not installed") from exc

    payload = id_token.verify_oauth2_token(
        raw_id_token, GoogleRequest(), settings.GOOGLE_OAUTH_CLIENT_ID
    )
    if payload.get("iss") not in GOOGLE_ISSUERS:
        raise GoogleOAuthError("Invalid Google issuer")
    nonce = payload.get("nonce")
    if not nonce or _hash_value(nonce) != expected_nonce_hash:
        raise GoogleOAuthError("Invalid nonce")
    if payload.get("email_verified") is not True:
        raise GoogleOAuthError("Google email is not verified")
    if not payload.get("sub"):
        raise GoogleOAuthError("Google subject is missing")
    if not payload.get("email"):
        raise GoogleOAuthError("Google email is missing")
    return payload


def consume_oauth_state(raw_state: str) -> GoogleOAuthState | None:
    try:
        state = GoogleOAuthState.objects.get(state_hash=_hash_value(raw_state))
    except GoogleOAuthState.DoesNotExist:
        return None
    if not state.is_active:
        return None
    return state


def mark_state_used(state: GoogleOAuthState) -> None:
    state.used_at = timezone.now()
    state.save(update_fields=["used_at"])


def create_login_code(*, user: User) -> str:
    raw_code = secrets.token_urlsafe(32)
    OAuthLoginCode.objects.create(
        user=user,
        code_hash=_hash_value(raw_code),
        expires_at=timezone.now() + timedelta(minutes=3),
    )
    return raw_code


def consume_login_code(raw_code: str) -> User | None:
    try:
        code = OAuthLoginCode.objects.select_related("user").get(
            code_hash=_hash_value(raw_code)
        )
    except OAuthLoginCode.DoesNotExist:
        return None
    if not code.is_active:
        return None
    code.used_at = timezone.now()
    code.save(update_fields=["used_at"])
    return code.user
