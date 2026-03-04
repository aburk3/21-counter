from __future__ import annotations

import re

from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework import serializers

SPECIAL_CHAR_PATTERN = re.compile(r"[^A-Za-z0-9]")


def validate_password_strength(password: str) -> None:
    if len(password) < 10:
        raise serializers.ValidationError(
            "Password must be at least 10 characters long"
        )
    if not SPECIAL_CHAR_PATTERN.search(password):
        raise serializers.ValidationError(
            "Password must contain at least one special character"
        )
    try:
        validate_password(password)
    except DjangoValidationError as exc:
        raise serializers.ValidationError(exc.messages) from exc
