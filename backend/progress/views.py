from __future__ import annotations

from django.db import models, transaction
from django.db.models import Avg
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import serializers, status
from rest_framework.response import Response
from rest_framework.views import APIView

from gameplay.engine import build_shoe, count_value
from gameplay.models import GameSession, Round
from progress.models import PracticeRun, ProgressEvent
from users.progression import next_rank_progress, rank_from_xp, unlocked_skins_for_rank

SPEED_MS_PER_DECK = {
    PracticeRun.SpeedTier.BEGINNER: 90_000,
    PracticeRun.SpeedTier.INTERMEDIATE: 60_000,
    PracticeRun.SpeedTier.EXPERT: 30_000,
}


def _practice_xp(decks: int, duration_ms: int) -> int:
    per_deck = duration_ms / max(decks, 1)
    if per_deck <= 30_000:
        return 15
    if per_deck <= 60_000:
        return 10
    if per_deck <= 90_000:
        return 6
    return 3


def _best_practice_streak(runs) -> int:
    best = 0
    current = 0
    for is_correct in runs.order_by("started_at", "id").values_list("is_correct", flat=True):
        if is_correct:
            current += 1
            best = max(best, current)
        else:
            current = 0
    return best


class PracticeStartSerializer(serializers.Serializer):
    decks = serializers.IntegerField(min_value=1, max_value=8)
    mode = serializers.ChoiceField(choices=[PracticeRun.Mode.AUTO, PracticeRun.Mode.MANUAL])
    speed_tier = serializers.ChoiceField(
        choices=[
            PracticeRun.SpeedTier.BEGINNER,
            PracticeRun.SpeedTier.INTERMEDIATE,
            PracticeRun.SpeedTier.EXPERT,
        ]
    )


class PracticeSubmitSerializer(serializers.Serializer):
    running_count = serializers.IntegerField()


class DashboardView(APIView):
    def get(self, request):
        profile = request.user.profile
        sessions = GameSession.objects.filter(user=request.user)
        rounds = Round.objects.filter(session__user=request.user)
        practice_runs = PracticeRun.objects.filter(user=request.user)

        total_games = sessions.count()
        correct_count_games = sessions.filter(rounds_with_correct_count__gt=0).count()
        strategy_correct = rounds.filter(basic_strategy_correct=True).count()
        correct_count_submissions = rounds.filter(
            count_submission__is_correct=True
        ).count()
        avg_duration = rounds.aggregate(avg=Avg("duration_ms"))["avg"] or 0
        practice_total_runs = practice_runs.count()
        practice_correct_runs = practice_runs.filter(is_correct=True).count()
        practice_avg_per_deck = (
            practice_runs.aggregate(
                avg=models.Avg(
                    models.ExpressionWrapper(
                        models.F("duration_ms") * 1.0 / models.F("decks"),
                        output_field=models.FloatField(),
                    )
                )
            )["avg"]
            or 0
        )
        recent_runs = practice_runs.order_by("-started_at", "-id")[:20]
        progress = next_rank_progress(profile.xp)

        return Response(
            {
                "correct_count_games": correct_count_games,
                "total_games": total_games,
                "accuracy_pct": (
                    round((correct_count_games / total_games) * 100, 2)
                    if total_games
                    else 0
                ),
                "strategy_correct_pct": (
                    round((strategy_correct / rounds.count()) * 100, 2)
                    if rounds.exists()
                    else 0
                ),
                "avg_decision_ms": int(avg_duration),
                "current_rank": profile.rank,
                "xp": profile.xp,
                "chips": profile.chips_balance,
                "current_streak": profile.current_streak,
                "best_streak": profile.best_streak,
                "strategy_correct_count": strategy_correct,
                "correct_count_submissions": correct_count_submissions,
                "total_rounds": rounds.count(),
                "xp_to_next_rank": progress["xp_to_next_rank"],
                "next_rank": progress["next_rank"],
                "rank_progress_pct": progress["rank_progress_pct"],
                "available_skins": unlocked_skins_for_rank(profile.rank),
                "selected_skin": request.user.settings.selected_deck_skin,
                "practice_total_runs": practice_total_runs,
                "practice_correct_runs": practice_correct_runs,
                "practice_accuracy_pct": (
                    round((practice_correct_runs / practice_total_runs) * 100, 2)
                    if practice_total_runs
                    else 0
                ),
                "practice_avg_ms_per_deck": int(practice_avg_per_deck),
                "practice_best_streak": _best_practice_streak(practice_runs),
                "practice_recent_runs": [
                    {
                        "id": run.id,
                        "created_at": run.created_at,
                        "decks": run.decks,
                        "mode": run.mode,
                        "speed_tier": run.speed_tier,
                        "duration_ms": run.duration_ms,
                        "is_correct": run.is_correct,
                        "count_delta": run.count_delta,
                        "xp_delta": run.xp_delta,
                    }
                    for run in recent_runs
                ],
            }
        )


class PracticeRunStartView(APIView):
    def post(self, request):
        serializer = PracticeStartSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        decks = data["decks"]
        hidden_cards_count = 3 * decks
        target_duration_ms = decks * SPEED_MS_PER_DECK[data["speed_tier"]]
        seed = int(timezone.now().timestamp() * 1000) + request.user.id
        cards = build_shoe(decks, seed)
        hidden_cards = cards[:hidden_cards_count]
        visible_cards = cards[hidden_cards_count:]
        actual_count = sum(count_value(card) for card in visible_cards)

        run = PracticeRun.objects.create(
            user=request.user,
            decks=decks,
            mode=data["mode"],
            speed_tier=data["speed_tier"],
            target_duration_ms=target_duration_ms,
            hidden_cards_count=hidden_cards_count,
            visible_cards_count=len(visible_cards),
            hidden_cards=hidden_cards,
            actual_running_count=actual_count,
            started_at=timezone.now(),
        )

        return Response(
            {
                "run_id": run.id,
                "decks": run.decks,
                "mode": run.mode,
                "speed_tier": run.speed_tier,
                "target_duration_ms": run.target_duration_ms,
                "hidden_cards_count": run.hidden_cards_count,
                "visible_cards_count": run.visible_cards_count,
                "visible_cards": visible_cards,
                "started_at": run.started_at,
            },
            status=status.HTTP_201_CREATED,
        )


class PracticeRunSubmitView(APIView):
    @transaction.atomic
    def post(self, request, run_id: int):
        serializer = PracticeSubmitSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        run = get_object_or_404(PracticeRun, pk=run_id, user=request.user)
        if run.submitted_running_count is not None:
            return Response(
                {"detail": "Practice run already submitted"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        ended_at = timezone.now()
        duration_ms = int(max((ended_at - run.started_at).total_seconds() * 1000, 0))
        submitted = serializer.validated_data["running_count"]
        count_delta = submitted - run.actual_running_count
        is_correct = submitted == run.actual_running_count
        xp_delta = _practice_xp(run.decks, duration_ms) if is_correct else 0

        run.submitted_running_count = submitted
        run.count_delta = count_delta
        run.is_correct = is_correct
        run.ended_at = ended_at
        run.duration_ms = duration_ms
        run.xp_delta = xp_delta
        run.save(
            update_fields=[
                "submitted_running_count",
                "count_delta",
                "is_correct",
                "ended_at",
                "duration_ms",
                "xp_delta",
            ]
        )

        profile = request.user.profile
        previous_rank = profile.rank
        profile.xp += xp_delta
        profile.rank = rank_from_xp(profile.xp)
        profile.save(update_fields=["xp", "rank", "updated_at"])

        ProgressEvent.objects.create(
            user=request.user,
            event_type="count_practice_complete",
            xp_delta=xp_delta,
            meta={
                "practice_run_id": run.id,
                "is_correct": is_correct,
                "previous_rank": previous_rank,
                "new_rank": profile.rank,
            },
        )

        hidden_total_count = sum(count_value(card) for card in run.hidden_cards)
        return Response(
            {
                "run_id": run.id,
                "is_correct": run.is_correct,
                "actual_running_count": run.actual_running_count,
                "submitted_running_count": run.submitted_running_count,
                "count_delta": run.count_delta,
                "duration_ms": run.duration_ms,
                "duration_per_deck_ms": int(run.duration_ms / max(run.decks, 1)),
                "xp_delta": run.xp_delta,
                "xp": profile.xp,
                "rank": profile.rank,
                "hidden_cards": run.hidden_cards,
                "hidden_total_count": hidden_total_count,
            }
        )
