from __future__ import annotations

from urllib.parse import urlencode

from django.contrib.auth import get_user_model
from django.db import transaction
from django.shortcuts import redirect
from django.utils import timezone
from django.conf import settings
from smtplib import SMTPException
from rest_framework import permissions, status
from rest_framework.exceptions import ValidationError
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.serializers import TokenRefreshSerializer
from rest_framework_simplejwt.tokens import RefreshToken

from progress.models import ProgressEvent
from users.audit import log_auth_event
from users.google_oauth import (
    GoogleOAuthError,
    consume_login_code,
    consume_oauth_state,
    create_login_code,
    exchange_google_code,
    mark_state_used,
    start_google_auth,
    verify_google_identity,
)
from users.models import AuthProviderIdentity
from users.progression import rank_from_xp
from users.serializers import (
    EmailVerifyConfirmSerializer,
    EmailVerifyRequestSerializer,
    GoogleCodeSerializer,
    LoginSerializer,
    MeSerializer,
    RegisterSerializer,
    UserSettingsSerializer,
)
from users.verification import (
    consume_verification_token,
    create_email_verification_token,
    send_verification_email,
)

User = get_user_model()


def _auth_response(user: User) -> dict:
    refresh = RefreshToken.for_user(user)
    return {
        "user": {"id": user.id, "email": user.email},
        "access": str(refresh.access_token),
        "refresh": str(refresh),
    }


def _client_ip(request) -> str | None:
    return request.META.get("HTTP_X_FORWARDED_FOR", "").split(",")[0].strip() or request.META.get(
        "REMOTE_ADDR"
    )


class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "auth_register"

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            with transaction.atomic():
                user = serializer.save()
                raw_token, _ = create_email_verification_token(user=user)
                send_verification_email(user=user, raw_token=raw_token)
        except (SMTPException, OSError):
            log_auth_event(
                "register",
                success=False,
                email=serializer.validated_data["email"],
                ip_address=_client_ip(request),
                metadata={"reason": "email_delivery_failed"},
            )
            return Response(
                {
                    "detail": (
                        "Account verification email could not be sent. "
                        "Please try again shortly."
                    )
                },
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )
        log_auth_event(
            "register",
            success=True,
            user=user,
            email=user.email,
            ip_address=_client_ip(request),
        )
        log_auth_event(
            "verify_email_sent",
            success=True,
            user=user,
            email=user.email,
            ip_address=_client_ip(request),
        )
        return Response(
            {
                "user": {"id": user.id, "email": user.email},
                "verification_required": True,
                "detail": "Please verify your email to continue.",
            },
            status=status.HTTP_201_CREATED,
        )


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "auth_login"

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
        except ValidationError:
            email = request.data.get("email", "")
            log_auth_event(
                "login_failed",
                success=False,
                email=email,
                ip_address=_client_ip(request),
            )
            raise
        user = serializer.validated_data["user"]
        log_auth_event(
            "login_success",
            success=True,
            user=user,
            email=user.email,
            ip_address=_client_ip(request),
        )
        return Response(_auth_response(user))


class RefreshView(APIView):
    permission_classes = [permissions.AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "auth_refresh"

    def post(self, request):
        serializer = TokenRefreshSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.validated_data, status=status.HTTP_200_OK)


class EmailVerifyRequestView(APIView):
    permission_classes = [permissions.AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "auth_verify_request"

    def post(self, request):
        serializer = EmailVerifyRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"]
        user = User.objects.filter(email=email).first()
        if user and not user.is_email_verified:
            raw_token, _ = create_email_verification_token(user=user)
            send_verification_email(user=user, raw_token=raw_token)
            log_auth_event(
                "verify_email_sent",
                success=True,
                user=user,
                email=user.email,
                ip_address=_client_ip(request),
            )

        return Response(
            {"detail": "If the account exists, a verification email has been sent."}
        )


class EmailVerifyConfirmView(APIView):
    permission_classes = [permissions.AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "auth_verify_confirm"

    def post(self, request):
        serializer = EmailVerifyConfirmSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = consume_verification_token(serializer.validated_data["token"])
        if not user:
            log_auth_event(
                "verify_email_failed",
                success=False,
                ip_address=_client_ip(request),
            )
            return Response(
                {"detail": "Verification token is invalid or expired."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        log_auth_event(
            "verify_email_success",
            success=True,
            user=user,
            email=user.email,
            ip_address=_client_ip(request),
        )
        return Response({"detail": "Email verification completed successfully."})


class GoogleStartView(APIView):
    permission_classes = [permissions.AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "auth_google"

    def get(self, request):
        try:
            auth_url = start_google_auth()
        except GoogleOAuthError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        return Response({"auth_url": auth_url})


class GoogleCallbackView(APIView):
    permission_classes = [permissions.AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "auth_google"

    def get(self, request):
        code = request.query_params.get("code")
        state_value = request.query_params.get("state")
        if not code or not state_value:
            return redirect(
                f"{settings.FRONTEND_GOOGLE_COMPLETE_URL}?oauth_error=invalid_request"
            )
        state = consume_oauth_state(state_value)
        if not state:
            return redirect(
                f"{settings.FRONTEND_GOOGLE_COMPLETE_URL}?oauth_error=invalid_state"
            )

        mark_state_used(state)
        try:
            token_payload = exchange_google_code(code=code)
            profile = verify_google_identity(
                raw_id_token=token_payload["id_token"],
                expected_nonce_hash=state.nonce_hash,
            )
        except GoogleOAuthError:
            return redirect(
                f"{settings.FRONTEND_GOOGLE_COMPLETE_URL}?oauth_error=oauth_failed"
            )

        provider_user_id = profile["sub"]
        email = profile["email"].lower()
        identity = AuthProviderIdentity.objects.filter(
            provider=AuthProviderIdentity.Provider.GOOGLE,
            provider_user_id=provider_user_id,
        ).select_related("user").first()

        if identity:
            user = identity.user
        else:
            existing_user = User.objects.filter(email=email).first()
            if existing_user and not existing_user.is_email_verified:
                return redirect(
                    f"{settings.FRONTEND_GOOGLE_COMPLETE_URL}?oauth_error=unverified_local_account"
                )
            user = existing_user
            if user is None:
                user = User.objects.create_user(
                    email=email,
                    password=None,
                    is_email_verified=True,
                    email_verified_at=timezone.now(),
                )
                user.set_unusable_password()
                user.save(update_fields=["password"])
            AuthProviderIdentity.objects.create(
                user=user,
                provider=AuthProviderIdentity.Provider.GOOGLE,
                provider_user_id=provider_user_id,
                email=email,
                metadata={
                    "name": profile.get("name", ""),
                    "picture": profile.get("picture", ""),
                },
            )

        login_code = create_login_code(user=user)
        query = urlencode({"oauth_code": login_code})
        return redirect(f"{settings.FRONTEND_GOOGLE_COMPLETE_URL}?{query}")


class GoogleCompleteView(APIView):
    permission_classes = [permissions.AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "auth_google"

    def post(self, request):
        serializer = GoogleCodeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = consume_login_code(serializer.validated_data["code"])
        if not user:
            return Response(
                {"detail": "OAuth login code is invalid or expired."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        log_auth_event(
            "google_login_success",
            success=True,
            user=user,
            email=user.email,
            ip_address=_client_ip(request),
        )
        return Response(_auth_response(user))


class MeView(APIView):
    def get(self, request):
        me = {
            "id": request.user.id,
            "email": request.user.email,
            "profile": request.user.profile,
            "settings": request.user.settings,
        }
        return Response(MeSerializer(me).data)


class SettingsView(APIView):
    def patch(self, request):
        serializer = UserSettingsSerializer(
            request.user.settings,
            data=request.data,
            partial=True,
            context={"request": request},
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class ChipRefillView(APIView):
    @transaction.atomic
    def post(self, request):
        xp_delta = -75
        chips_delta = 500
        profile = request.user.profile
        previous_rank = profile.rank
        profile.chips_balance += chips_delta
        profile.xp = max(0, profile.xp + xp_delta)
        profile.rank = rank_from_xp(profile.xp)
        profile.save(update_fields=["chips_balance", "xp", "rank", "updated_at"])

        ProgressEvent.objects.create(
            user=request.user,
            event_type="chip_refill",
            xp_delta=xp_delta,
            meta={
                "chips_delta": chips_delta,
                "previous_rank": previous_rank,
                "new_rank": profile.rank,
            },
        )

        return Response(
            {
                "chips_balance": profile.chips_balance,
                "xp": profile.xp,
                "rank": profile.rank,
                "xp_delta": xp_delta,
                "chips_delta": chips_delta,
                "rank_changed": previous_rank != profile.rank,
                "previous_rank": previous_rank,
                "new_rank": profile.rank,
            }
        )
