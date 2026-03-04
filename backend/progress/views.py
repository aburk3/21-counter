from __future__ import annotations

from django.db.models import Avg
from rest_framework.response import Response
from rest_framework.views import APIView

from gameplay.models import GameSession, Round
from users.progression import next_rank_progress, unlocked_skins_for_rank


class DashboardView(APIView):
    def get(self, request):
        profile = request.user.profile
        sessions = GameSession.objects.filter(user=request.user)
        rounds = Round.objects.filter(session__user=request.user)

        total_games = sessions.count()
        correct_count_games = sessions.filter(rounds_with_correct_count__gt=0).count()
        strategy_correct = rounds.filter(basic_strategy_correct=True).count()
        correct_count_submissions = rounds.filter(
            count_submission__is_correct=True
        ).count()
        avg_duration = rounds.aggregate(avg=Avg("duration_ms"))["avg"] or 0
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
            }
        )
