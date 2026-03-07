from __future__ import annotations

from unittest.mock import patch

from django.core import mail
from django.test import override_settings
from rest_framework.test import APITestCase

from users.models import AuthProviderIdentity, User
from users.verification import create_email_verification_token


@override_settings(EMAIL_BACKEND="django.core.mail.backends.locmem.EmailBackend")
class AuthTests(APITestCase):
    def test_register_requires_email_verification(self):
        register = self.client.post(
            "/api/auth/register",
            {"email": "test@example.com", "password": "Passw0rd!!"},
            format="json",
        )
        self.assertEqual(register.status_code, 201)
        self.assertTrue(register.data["verification_required"])
        self.assertNotIn("access", register.data)
        user = User.objects.get(email="test@example.com")
        self.assertFalse(user.is_email_verified)
        self.assertEqual(len(mail.outbox), 1)

    @patch("users.views.send_verification_email", side_effect=OSError("smtp down"))
    def test_register_rolls_back_if_verification_email_fails(self, _mock_send):
        response = self.client.post(
            "/api/auth/register",
            {"email": "smtpfail@example.com", "password": "Passw0rd!!"},
            format="json",
        )
        self.assertEqual(response.status_code, 503)
        self.assertIn("could not be sent", response.data["detail"])
        self.assertFalse(User.objects.filter(email="smtpfail@example.com").exists())

    def test_login_is_blocked_until_verified(self):
        user = User.objects.create_user(
            email="blocked@example.com",
            password="Passw0rd!!",
            is_email_verified=False,
        )
        response = self.client.post(
            "/api/auth/login",
            {"email": user.email, "password": "Passw0rd!!"},
            format="json",
        )
        self.assertEqual(response.status_code, 400)
        self.assertTrue(response.data["requires_email_verification"])

    def test_verify_confirm_enables_login(self):
        user = User.objects.create_user(
            email="verify@example.com",
            password="Passw0rd!!",
            is_email_verified=False,
        )
        raw_token, _ = create_email_verification_token(user=user)

        verify = self.client.post(
            "/api/auth/email/verify/confirm",
            {"token": raw_token},
            format="json",
        )
        self.assertEqual(verify.status_code, 200)

        login = self.client.post(
            "/api/auth/login",
            {"email": user.email, "password": "Passw0rd!!"},
            format="json",
        )
        self.assertEqual(login.status_code, 200)
        self.assertIn("access", login.data)

    def test_verify_token_cannot_be_replayed(self):
        user = User.objects.create_user(
            email="replay@example.com",
            password="Passw0rd!!",
            is_email_verified=False,
        )
        raw_token, _ = create_email_verification_token(user=user)

        first = self.client.post(
            "/api/auth/email/verify/confirm",
            {"token": raw_token},
            format="json",
        )
        second = self.client.post(
            "/api/auth/email/verify/confirm",
            {"token": raw_token},
            format="json",
        )

        self.assertEqual(first.status_code, 200)
        self.assertEqual(second.status_code, 400)

    def test_verify_request_is_generic(self):
        response = self.client.post(
            "/api/auth/email/verify/request",
            {"email": "unknown@example.com"},
            format="json",
        )
        self.assertEqual(response.status_code, 200)
        self.assertIn("If the account exists", response.data["detail"])

    @override_settings(
        GOOGLE_OAUTH_CLIENT_ID="client-id",
        GOOGLE_OAUTH_CLIENT_SECRET="client-secret",
        GOOGLE_OAUTH_REDIRECT_URI="http://localhost:8000/api/auth/google/callback",
    )
    def test_google_callback_creates_identity_and_completion_code(self):
        start = self.client.get("/api/auth/google/start")
        self.assertEqual(start.status_code, 200)
        auth_url = start.data["auth_url"]
        state = auth_url.split("state=")[1].split("&")[0]

        with patch("users.views.exchange_google_code") as exchange, patch(
            "users.views.verify_google_identity"
        ) as verify:
            exchange.return_value = {"id_token": "token"}
            verify.return_value = {
                "sub": "google-user-123",
                "email": "google@example.com",
                "email_verified": True,
                "iss": "https://accounts.google.com",
                "nonce": "abc",
            }
            callback = self.client.get(
                f"/api/auth/google/callback?code=abc123&state={state}"
            )

        self.assertEqual(callback.status_code, 302)
        self.assertIn("oauth_code=", callback["Location"])

        user = User.objects.get(email="google@example.com")
        self.assertTrue(user.is_email_verified)
        self.assertTrue(
            AuthProviderIdentity.objects.filter(
                user=user,
                provider=AuthProviderIdentity.Provider.GOOGLE,
                provider_user_id="google-user-123",
            ).exists()
        )

    def test_google_complete_returns_jwts(self):
        user = User.objects.create_user(
            email="google-complete@example.com",
            password="Passw0rd!!",
            is_email_verified=True,
        )
        from users.google_oauth import create_login_code

        raw_code = create_login_code(user=user)
        response = self.client.post(
            "/api/auth/google/complete", {"code": raw_code}, format="json"
        )
        self.assertEqual(response.status_code, 200)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)

    def test_chip_refill_reduces_xp_and_updates_rank(self):
        user = User.objects.create_user(
            email="bankroll@example.com",
            password="Passw0rd!!",
            is_email_verified=True,
        )
        login = self.client.post(
            "/api/auth/login",
            {"email": "bankroll@example.com", "password": "Passw0rd!!"},
            format="json",
        )
        user.profile.xp = 220
        user.profile.rank = "spotter"
        user.profile.save(update_fields=["xp", "rank", "updated_at"])

        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {login.data['access']}")
        response = self.client.post("/api/me/chips/refill", {}, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["chips_delta"], 500)
        self.assertEqual(response.data["xp_delta"], -75)
        self.assertEqual(response.data["new_rank"], "rookie")
        self.assertTrue(response.data["rank_changed"])

    def test_cannot_select_locked_skin(self):
        user = User.objects.create_user(
            email="skin@example.com",
            password="Passw0rd!!",
            is_email_verified=True,
        )
        login = self.client.post(
            "/api/auth/login",
            {"email": user.email, "password": "Passw0rd!!"},
            format="json",
        )
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {login.data['access']}")
        response = self.client.patch(
            "/api/me/settings",
            {"selected_deck_skin": "gold"},
            format="json",
        )
        self.assertEqual(response.status_code, 400)

    @override_settings(CORS_ALLOWED_ORIGINS=["https://21-counter.vercel.app"])
    def test_preflight_allows_configured_origin(self):
        response = self.client.options(
            "/api/auth/register",
            HTTP_ORIGIN="https://21-counter.vercel.app",
            HTTP_ACCESS_CONTROL_REQUEST_METHOD="POST",
            HTTP_ACCESS_CONTROL_REQUEST_HEADERS="content-type",
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response["Access-Control-Allow-Origin"], "https://21-counter.vercel.app"
        )
