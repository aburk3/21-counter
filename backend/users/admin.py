from django.contrib import admin

from users.models import (
    AuthEvent,
    AuthProviderIdentity,
    EmailVerificationToken,
    GoogleOAuthState,
    OAuthLoginCode,
    User,
    UserProfile,
    UserSettings,
)


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ("id", "email", "is_email_verified", "is_staff", "is_active")
    search_fields = ("email",)
    list_filter = ("is_email_verified", "is_staff", "is_active")


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "rank", "xp", "chips_balance")


@admin.register(UserSettings)
class UserSettingsAdmin(admin.ModelAdmin):
    list_display = ("user", "default_decks_per_shoe", "table_speed", "selected_deck_skin")


@admin.register(EmailVerificationToken)
class EmailVerificationTokenAdmin(admin.ModelAdmin):
    list_display = ("user", "purpose", "expires_at", "used_at", "created_at")
    search_fields = ("user__email", "token_hash")


@admin.register(AuthProviderIdentity)
class AuthProviderIdentityAdmin(admin.ModelAdmin):
    list_display = ("user", "provider", "provider_user_id", "email")
    search_fields = ("user__email", "provider_user_id", "email")
    list_filter = ("provider",)


@admin.register(GoogleOAuthState)
class GoogleOAuthStateAdmin(admin.ModelAdmin):
    list_display = ("id", "expires_at", "used_at", "created_at")


@admin.register(OAuthLoginCode)
class OAuthLoginCodeAdmin(admin.ModelAdmin):
    list_display = ("user", "expires_at", "used_at", "created_at")
    search_fields = ("user__email", "code_hash")


@admin.register(AuthEvent)
class AuthEventAdmin(admin.ModelAdmin):
    list_display = ("event_type", "email", "success", "ip_address", "created_at")
    search_fields = ("email", "event_type")
    list_filter = ("success", "event_type")
