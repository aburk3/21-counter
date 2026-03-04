from __future__ import annotations

import logging
from typing import Any

from users.models import AuthEvent, User

logger = logging.getLogger("users.auth")


def log_auth_event(
    event_type: str,
    *,
    success: bool,
    email: str = "",
    user: User | None = None,
    ip_address: str | None = None,
    metadata: dict[str, Any] | None = None,
) -> None:
    payload = metadata or {}
    AuthEvent.objects.create(
        user=user,
        email=email,
        event_type=event_type,
        success=success,
        ip_address=ip_address,
        metadata=payload,
    )
    logger.info(
        "auth_event",
        extra={
            "event_type": event_type,
            "success": success,
            "email": email,
            "user_id": user.id if user else None,
            "ip_address": ip_address,
            "metadata": payload,
        },
    )
