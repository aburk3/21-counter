from __future__ import annotations

from django.conf import settings
from django.db import models


class GameSession(models.Model):
    class Status(models.TextChoices):
        ACTIVE = "active", "Active"
        COMPLETED = "completed", "Completed"
        EXITED = "exited", "Exited"
        ABORTED = "aborted", "Aborted"

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    decks_per_shoe = models.PositiveSmallIntegerField()
    hands_dealt = models.PositiveSmallIntegerField()
    shoes_per_session = models.PositiveSmallIntegerField(default=1)
    status = models.CharField(
        max_length=16, choices=Status.choices, default=Status.ACTIVE
    )
    started_at = models.DateTimeField(auto_now_add=True)
    ended_at = models.DateTimeField(null=True, blank=True)
    starting_chips_balance = models.IntegerField(default=500)
    total_time_ms = models.PositiveIntegerField(default=0)
    rounds_played = models.PositiveIntegerField(default=0)
    rounds_with_correct_count = models.PositiveIntegerField(default=0)


class Round(models.Model):
    class Result(models.TextChoices):
        WIN = "win", "Win"
        LOSS = "loss", "Loss"
        PUSH = "push", "Push"
        BLACKJACK = "blackjack", "Blackjack"

    session = models.ForeignKey(
        GameSession, on_delete=models.CASCADE, related_name="rounds"
    )
    round_number = models.PositiveIntegerField()
    shoe_index = models.PositiveIntegerField(default=1)
    bet_amount = models.PositiveIntegerField(default=0)
    started_at = models.DateTimeField()
    ended_at = models.DateTimeField()
    duration_ms = models.PositiveIntegerField(default=0)
    result = models.CharField(
        max_length=16, choices=Result.choices, default=Result.PUSH
    )
    net_chips_delta = models.IntegerField(default=0)
    basic_strategy_correct = models.BooleanField(default=False)
    user_action_taken = models.CharField(max_length=16, blank=True)
    correct_action = models.CharField(max_length=16, blank=True)
    dealer_upcard = models.CharField(max_length=4)
    player_starting_hand = models.CharField(max_length=32)


class RoundCountSubmission(models.Model):
    round = models.OneToOneField(
        Round, on_delete=models.CASCADE, related_name="count_submission"
    )
    user_running_count_input = models.IntegerField()
    actual_running_count = models.IntegerField()
    is_correct = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
