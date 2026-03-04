from __future__ import annotations

from django.conf import settings
from django.http import HttpResponse


def _normalize_origins(value: list[str] | str | None) -> set[str]:
    if not value:
        return {"http://localhost:5173"}
    if isinstance(value, list):
        return {item.strip() for item in value if item.strip()}
    return {item.strip() for item in value.split(",") if item.strip()}


class SimpleCORSMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        allowed_origins = _normalize_origins(
            getattr(settings, "CORS_ALLOWED_ORIGINS", None)
        )
        origin = request.headers.get("Origin")

        # Handle preflight early so auth/permission checks do not block it.
        if request.method == "OPTIONS" and request.path.startswith("/api/"):
            response = HttpResponse(status=204)
            self._apply_headers(response, origin, allowed_origins)
            return response

        response = self.get_response(request)
        self._apply_headers(response, origin, allowed_origins)
        return response

    @staticmethod
    def _apply_headers(response, origin: str | None, allowed_origins: set[str]):
        if origin and origin in allowed_origins:
            response["Access-Control-Allow-Origin"] = origin
            response["Vary"] = "Origin"
            response["Access-Control-Allow-Credentials"] = "true"
            response["Access-Control-Allow-Headers"] = (
                "Authorization, Content-Type, X-Requested-With"
            )
            response["Access-Control-Allow-Methods"] = (
                "GET, POST, PUT, PATCH, DELETE, OPTIONS"
            )
