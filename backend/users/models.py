from __future__ import annotations

from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone


class UserManager(BaseUserManager):
    use_in_migrations = True

    def _create_user(self, email: str, password: str | None, **extra_fields):
        if not email:
            raise ValueError("Email must be provided")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email: str, password: str | None = None, **extra_fields):
        extra_fields.setdefault("is_staff", False)
        extra_fields.setdefault("is_superuser", False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email: str, password: str, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self._create_user(email, password, **extra_fields)


class User(AbstractUser):
    username = None
    email = models.EmailField(unique=True)
    is_email_verified = models.BooleanField(default=False)
    email_verified_at = models.DateTimeField(null=True, blank=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = UserManager()


class UserProfile(models.Model):
    class Rank(models.TextChoices):
        ROOKIE = "rookie", "Rookie Counter"
        SPOTTER = "spotter", "Spotter"
        PRO = "pro", "Running Count Pro"
        ACE = "ace", "True Count Ace"
        SHARK = "shark", "Table Shark"

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    chips_balance = models.IntegerField(default=500)
    rank = models.CharField(max_length=16, choices=Rank.choices, default=Rank.ROOKIE)
    xp = models.IntegerField(default=0)
    current_streak = models.IntegerField(default=0)
    best_streak = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class EmailVerificationToken(models.Model):
    class Purpose(models.TextChoices):
        VERIFY_EMAIL = "verify_email", "Verify Email"

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="email_tokens")
    purpose = models.CharField(
        max_length=32, choices=Purpose.choices, default=Purpose.VERIFY_EMAIL
    )
    token_hash = models.CharField(max_length=64, unique=True)
    expires_at = models.DateTimeField()
    used_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def is_active(self) -> bool:
        return self.used_at is None and self.expires_at > timezone.now()


class AuthProviderIdentity(models.Model):
    class Provider(models.TextChoices):
        GOOGLE = "google", "Google"

    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="provider_identities"
    )
    provider = models.CharField(max_length=32, choices=Provider.choices)
    provider_user_id = models.CharField(max_length=255)
    email = models.EmailField(blank=True)
    metadata = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["provider", "provider_user_id"],
                name="uniq_auth_provider_identity",
            )
        ]


class GoogleOAuthState(models.Model):
    state_hash = models.CharField(max_length=64, unique=True)
    nonce_hash = models.CharField(max_length=64, unique=True)
    expires_at = models.DateTimeField()
    used_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def is_active(self) -> bool:
        return self.used_at is None and self.expires_at > timezone.now()


class OAuthLoginCode(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="oauth_codes")
    code_hash = models.CharField(max_length=64, unique=True)
    expires_at = models.DateTimeField()
    used_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def is_active(self) -> bool:
        return self.used_at is None and self.expires_at > timezone.now()


class AuthEvent(models.Model):
    user = models.ForeignKey(
        User, null=True, blank=True, on_delete=models.SET_NULL, related_name="auth_events"
    )
    email = models.EmailField(blank=True)
    event_type = models.CharField(max_length=64)
    success = models.BooleanField(default=False)
    metadata = models.JSONField(default=dict, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)


class UserSettings(models.Model):
    class DeckSkin(models.TextChoices):
        CLASSIC_RED = "classic_red", "Classic Red"
        OCEAN_BLUE = "ocean_blue", "Ocean Blue"
        OBSIDIAN = "obsidian", "Obsidian"
        EMERALD = "emerald", "Emerald"
        GOLD = "gold", "Gold"

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="settings")
    default_decks_per_shoe = models.PositiveSmallIntegerField(default=6)
    default_hands_dealt = models.PositiveSmallIntegerField(default=3)
    default_shoes_per_session = models.PositiveSmallIntegerField(default=1)
    table_speed = models.CharField(max_length=16, default="normal")
    selected_deck_skin = models.CharField(
        max_length=24, choices=DeckSkin.choices, default=DeckSkin.CLASSIC_RED
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
