from __future__ import annotations

import base64
import hashlib
import hmac
import json
import time
from datetime import timedelta
from typing import Any

from django.conf import settings


class TokenError(ValueError):
    pass


def _b64url_encode(raw: bytes) -> str:
    return base64.urlsafe_b64encode(raw).rstrip(b"=").decode("utf-8")


def _b64url_decode(value: str) -> bytes:
    padding = "=" * (-len(value) % 4)
    return base64.urlsafe_b64decode(value + padding)


def create_token(user_id: int, token_type: str, lifetime: timedelta) -> str:
    header = {"alg": "HS256", "typ": "JWT"}
    now = int(time.time())
    payload: dict[str, Any] = {
        "sub": str(user_id),
        "type": token_type,
        "iat": now,
        "exp": now + int(lifetime.total_seconds()),
    }

    header_str = _b64url_encode(
        json.dumps(header, separators=(",", ":")).encode("utf-8")
    )
    payload_str = _b64url_encode(
        json.dumps(payload, separators=(",", ":")).encode("utf-8")
    )
    signing_input = f"{header_str}.{payload_str}".encode()
    signature = hmac.new(
        settings.SECRET_KEY.encode("utf-8"), signing_input, hashlib.sha256
    ).digest()
    return f"{header_str}.{payload_str}.{_b64url_encode(signature)}"


def decode_token(token: str, expected_type: str) -> dict[str, Any]:
    try:
        header_b64, payload_b64, signature_b64 = token.split(".")
    except ValueError as exc:
        raise TokenError("Malformed token") from exc

    signing_input = f"{header_b64}.{payload_b64}".encode()
    expected_signature = hmac.new(
        settings.SECRET_KEY.encode("utf-8"), signing_input, hashlib.sha256
    ).digest()

    if not hmac.compare_digest(expected_signature, _b64url_decode(signature_b64)):
        raise TokenError("Invalid signature")

    payload = json.loads(_b64url_decode(payload_b64).decode("utf-8"))

    now = int(time.time())
    if payload.get("exp", 0) < now:
        raise TokenError("Token expired")
    if payload.get("type") != expected_type:
        raise TokenError("Invalid token type")
    return payload


def token_pair_for_user(user_id: int) -> dict[str, str]:
    return {
        "access": create_token(user_id, "access", settings.JWT_ACCESS_LIFETIME),
        "refresh": create_token(user_id, "refresh", settings.JWT_REFRESH_LIFETIME),
    }
