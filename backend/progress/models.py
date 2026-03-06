from __future__ import annotations

from django.conf import settings
from django.db import models


class ProgressEvent(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    event_type = models.CharField(max_length=32)
    xp_delta = models.IntegerField(default=0)
    meta = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)


class PracticeRun(models.Model):
    class Mode(models.TextChoices):
        AUTO = "auto", "Automatic"
        MANUAL = "manual", "Manual"

    class SpeedTier(models.TextChoices):
        BEGINNER = "beginner", "Beginner"
        INTERMEDIATE = "intermediate", "Intermediate"
        EXPERT = "expert", "Expert"

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    decks = models.PositiveSmallIntegerField()
    mode = models.CharField(max_length=16, choices=Mode.choices)
    speed_tier = models.CharField(max_length=16, choices=SpeedTier.choices)
    target_duration_ms = models.PositiveIntegerField()
    hidden_cards_count = models.PositiveSmallIntegerField()
    visible_cards_count = models.PositiveSmallIntegerField()
    hidden_cards = models.JSONField(default=list, blank=True)
    actual_running_count = models.IntegerField()
    submitted_running_count = models.IntegerField(null=True, blank=True)
    count_delta = models.IntegerField(null=True, blank=True)
    is_correct = models.BooleanField(default=False)
    started_at = models.DateTimeField()
    ended_at = models.DateTimeField(null=True, blank=True)
    duration_ms = models.PositiveIntegerField(default=0)
    xp_delta = models.PositiveSmallIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
