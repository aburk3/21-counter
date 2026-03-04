from __future__ import annotations

from django.contrib.auth import authenticate, get_user_model
from rest_framework import serializers

from users.models import UserProfile, UserSettings
from users.passwords import validate_password_strength
from users.progression import unlocked_skins_for_rank

User = get_user_model()


class RegisterSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate_email(self, value: str):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email is already in use")
        return value.lower()

    def validate_password(self, value: str):
        validate_password_strength(value)
        return value

    def create(self, validated_data):
        return User.objects.create_user(
            email=validated_data["email"],
            password=validated_data["password"],
            is_email_verified=False,
        )


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate_email(self, value: str):
        return value.lower()

    def validate(self, attrs):
        user = authenticate(email=attrs["email"], password=attrs["password"])
        if not user:
            raise serializers.ValidationError("Invalid credentials")
        if not user.is_email_verified:
            raise serializers.ValidationError(
                {
                    "detail": "Please verify your email before logging in.",
                    "requires_email_verification": True,
                }
            )
        attrs["user"] = user
        return attrs


class EmailVerifyRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value: str):
        return value.lower()


class EmailVerifyConfirmSerializer(serializers.Serializer):
    token = serializers.CharField()


class GoogleCodeSerializer(serializers.Serializer):
    code = serializers.CharField()


class UserSettingsSerializer(serializers.ModelSerializer):
    def validate_selected_deck_skin(self, value: str):
        user = self.instance.user if self.instance else self.context["request"].user
        unlocked = unlocked_skins_for_rank(user.profile.rank)
        if value not in unlocked:
            raise serializers.ValidationError("Selected deck skin is not unlocked")
        return value

    class Meta:
        model = UserSettings
        fields = [
            "default_decks_per_shoe",
            "default_hands_dealt",
            "default_shoes_per_session",
            "table_speed",
            "selected_deck_skin",
        ]


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ["chips_balance", "rank", "xp", "current_streak", "best_streak"]


class MeSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    email = serializers.EmailField()
    profile = UserProfileSerializer()
    settings = UserSettingsSerializer()
