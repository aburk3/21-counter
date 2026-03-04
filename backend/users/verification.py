from __future__ import annotations

import hashlib
import secrets
from datetime import timedelta
from urllib.parse import urlencode

from django.conf import settings
from django.core.mail import send_mail
from django.utils import timezone

from users.models import EmailVerificationToken, User


def _hash_token(raw_token: str) -> str:
    return hashlib.sha256(raw_token.encode("utf-8")).hexdigest()


def create_email_verification_token(*, user: User) -> tuple[str, EmailVerificationToken]:
    EmailVerificationToken.objects.filter(
        user=user,
        purpose=EmailVerificationToken.Purpose.VERIFY_EMAIL,
        used_at__isnull=True,
    ).update(used_at=timezone.now())
    raw_token = secrets.token_urlsafe(32)
    token = EmailVerificationToken.objects.create(
        user=user,
        purpose=EmailVerificationToken.Purpose.VERIFY_EMAIL,
        token_hash=_hash_token(raw_token),
        expires_at=timezone.now() + timedelta(hours=settings.EMAIL_VERIFICATION_TTL_HOURS),
    )
    return raw_token, token


def send_verification_email(*, user: User, raw_token: str) -> None:
    query = urlencode({"token": raw_token})
    verify_link = f"{settings.FRONTEND_EMAIL_VERIFY_URL}?{query}"
    send_mail(
        subject="Verify your 21-counter account",
        message=(
            "Click the link below to verify your email. "
            f"The link expires in {settings.EMAIL_VERIFICATION_TTL_HOURS} hours.\n\n"
            f"{verify_link}"
        ),
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email],
        fail_silently=False,
    )


def consume_verification_token(raw_token: str) -> User | None:
    hashed = _hash_token(raw_token)
    try:
        token = EmailVerificationToken.objects.select_related("user").get(token_hash=hashed)
    except EmailVerificationToken.DoesNotExist:
        return None

    if not token.is_active:
        return None

    user = token.user
    token.used_at = timezone.now()
    token.save(update_fields=["used_at"])
    user.is_email_verified = True
    user.email_verified_at = timezone.now()
    user.save(update_fields=["is_email_verified", "email_verified_at"])
    return user
