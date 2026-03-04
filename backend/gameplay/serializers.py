from __future__ import annotations

from rest_framework import serializers


class CreateSessionSerializer(serializers.Serializer):
    decks_per_shoe = serializers.IntegerField(min_value=1, max_value=8)
    hands_dealt = serializers.IntegerField(min_value=1, max_value=7)
    shoes_per_session = serializers.IntegerField(min_value=1, max_value=6, default=1)


class BetSerializer(serializers.Serializer):
    amount = serializers.IntegerField(min_value=25)


class ActionSerializer(serializers.Serializer):
    action = serializers.ChoiceField(choices=["hit", "stand", "split", "double"])


class CountSubmissionSerializer(serializers.Serializer):
    running_count = serializers.IntegerField()
