from __future__ import annotations

from django.contrib.auth import get_user_model
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed

from users.tokens import TokenError, decode_token

User = get_user_model()


class BearerJWTAuthentication(BaseAuthentication):
    keyword = "Bearer"

    def authenticate(self, request):
        auth_header = request.headers.get("Authorization")
        if not auth_header:
            return None

        parts = auth_header.split(" ")
        if len(parts) != 2 or parts[0] != self.keyword:
            raise AuthenticationFailed("Invalid authorization header")

        try:
            payload = decode_token(parts[1], expected_type="access")
        except TokenError as exc:
            raise AuthenticationFailed(str(exc)) from exc

        try:
            user = User.objects.get(pk=int(payload["sub"]))
        except (User.DoesNotExist, ValueError) as exc:
            raise AuthenticationFailed("User not found") from exc

        return (user, None)
