from django.urls import path

from users.views import (
    ChipRefillView,
    EmailVerifyConfirmView,
    EmailVerifyRequestView,
    GoogleCallbackView,
    GoogleCompleteView,
    GoogleStartView,
    LoginView,
    MeView,
    RefreshView,
    RegisterView,
    SettingsView,
)

urlpatterns = [
    path("auth/register", RegisterView.as_view(), name="register"),
    path("auth/login", LoginView.as_view(), name="login"),
    path("auth/refresh", RefreshView.as_view(), name="refresh"),
    path("auth/email/verify/request", EmailVerifyRequestView.as_view(), name="verify-request"),
    path("auth/email/verify/confirm", EmailVerifyConfirmView.as_view(), name="verify-confirm"),
    path("auth/google/start", GoogleStartView.as_view(), name="google-start"),
    path("auth/google/callback", GoogleCallbackView.as_view(), name="google-callback"),
    path("auth/google/complete", GoogleCompleteView.as_view(), name="google-complete"),
    path("me", MeView.as_view(), name="me"),
    path("me/settings", SettingsView.as_view(), name="settings"),
    path("me/chips/refill", ChipRefillView.as_view(), name="chips-refill"),
]
