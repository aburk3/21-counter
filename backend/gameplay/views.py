from __future__ import annotations

from django.db import models, transaction
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from gameplay.bankroll import (
    bankroll_payload,
    settle_round_chips_if_needed,
)
from gameplay.models import GameSession, Round, RoundCountSubmission
from gameplay.serializers import (
    ActionSerializer,
    BetSerializer,
    CountSubmissionSerializer,
    CreateSessionSerializer,
)
from gameplay.state import (
    apply_action,
    deal_round,
    delete_state,
    get_state,
    init_state,
    place_bet,
    save_state,
    shuffle_remaining_cards,
    view_payload,
)
from gameplay.strategy_feedback import summarize_strategy_decisions
from progress.models import ProgressEvent
from users.progression import rank_from_xp


class SessionCreateView(APIView):
    def post(self, request):
        serializer = CreateSessionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        data["shoes_per_session"] = 1

        request.user.settings.default_decks_per_shoe = data["decks_per_shoe"]
        request.user.settings.default_hands_dealt = data["hands_dealt"]
        request.user.settings.default_shoes_per_session = data["shoes_per_session"]
        request.user.settings.save(
            update_fields=[
                "default_decks_per_shoe",
                "default_hands_dealt",
                "default_shoes_per_session",
                "updated_at",
            ]
        )

        session = GameSession.objects.create(
            user=request.user,
            starting_chips_balance=request.user.profile.chips_balance,
            **data,
        )
        state = init_state(
            session.id,
            decks=data["decks_per_shoe"],
            hands_dealt=data["hands_dealt"],
            shoes_per_session=data["shoes_per_session"],
        )
        save_state(session.id, state)

        return Response(
            {
                "session_id": session.id,
                "status": session.status,
                "state": view_payload(state),
                **bankroll_payload(session, request.user.id),
            },
            status=status.HTTP_201_CREATED,
        )


class SessionDetailView(APIView):
    def get(self, request, session_id: int):
        session = get_object_or_404(GameSession, pk=session_id, user=request.user)
        state = get_state(session.id)
        if not state:
            return Response(
                {"detail": "Session state expired", "status": session.status},
                status=status.HTTP_404_NOT_FOUND,
            )
        return Response(
            {
                "session_id": session.id,
                "status": session.status,
                "state": view_payload(state),
                **bankroll_payload(session, request.user.id),
            }
        )


class SessionBetView(APIView):
    def post(self, request, session_id: int):
        serializer = BetSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        session = get_object_or_404(GameSession, pk=session_id, user=request.user)
        state = get_state(session.id)
        if not state:
            return Response(
                {"detail": "Session state expired"}, status=status.HTTP_404_NOT_FOUND
            )

        try:
            place_bet(
                state,
                serializer.validated_data["amount"],
                request.user.profile.chips_balance,
            )
        except ValueError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)

        save_state(session.id, state)
        return Response(
            {"state": view_payload(state), **bankroll_payload(session, request.user.id)}
        )


class SessionDealView(APIView):
    def post(self, request, session_id: int):
        session = get_object_or_404(GameSession, pk=session_id, user=request.user)
        state = get_state(session.id)
        if not state:
            return Response(
                {"detail": "Session state expired"}, status=status.HTTP_404_NOT_FOUND
            )

        try:
            deal_round(state)
        except ValueError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)

        chips_balance = settle_round_chips_if_needed(state, request.user.id)
        save_state(session.id, state)
        return Response(
            {
                "state": view_payload(state),
                **bankroll_payload(session, request.user.id, chips_balance),
            }
        )


class SessionActionView(APIView):
    def post(self, request, session_id: int):
        serializer = ActionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        session = get_object_or_404(GameSession, pk=session_id, user=request.user)
        state = get_state(session.id)
        if not state:
            return Response(
                {"detail": "Session state expired"}, status=status.HTTP_404_NOT_FOUND
            )

        if serializer.validated_data["action"] in {"double", "split"}:
            round_state = state.get("active_round")
            if round_state and not round_state.get("resolved"):
                idx = round_state["active_hand_index"]
                hand = round_state["user_hands"][idx]
                committed = sum(item["bet"] for item in round_state["user_hands"])
                additional = hand["bet"]
                if request.user.profile.chips_balance < committed + additional:
                    return Response(
                        {"detail": "Insufficient chips to double/split"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )

        try:
            apply_action(state, serializer.validated_data["action"])
        except ValueError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)

        chips_balance = settle_round_chips_if_needed(state, request.user.id)
        save_state(session.id, state)
        return Response(
            {
                "state": view_payload(state),
                **bankroll_payload(session, request.user.id, chips_balance),
            }
        )


class SessionSubmitCountView(APIView):
    @transaction.atomic
    def post(self, request, session_id: int):
        serializer = CountSubmissionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        session = get_object_or_404(GameSession, pk=session_id, user=request.user)
        state = get_state(session.id)
        if not state:
            return Response(
                {"detail": "Session state expired"}, status=status.HTTP_404_NOT_FOUND
            )
        if not state.get("round_ready_for_submission") or state.get("round_submitted"):
            return Response(
                {"detail": "No completed round to submit"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        round_state = state["active_round"]
        started = timezone.make_aware(
            timezone.datetime.fromtimestamp(round_state["started_at_ms"] / 1000)
        )
        ended = timezone.make_aware(
            timezone.datetime.fromtimestamp(round_state["ended_at_ms"] / 1000)
        )

        decisions = round_state.get("decisions", [])
        strategy_correct, played_action, correct_action = summarize_strategy_decisions(
            decisions
        )

        round_obj = Round.objects.create(
            session=session,
            round_number=state["round_number"],
            shoe_index=state["current_shoe"],
            bet_amount=state["current_bet"],
            started_at=started,
            ended_at=ended,
            duration_ms=max(
                round_state["ended_at_ms"] - round_state["started_at_ms"], 0
            ),
            result=round_state["result"],
            net_chips_delta=round_state["chips_delta"],
            basic_strategy_correct=strategy_correct,
            user_action_taken=played_action,
            correct_action=correct_action,
            dealer_upcard=round_state["dealer_hand"][0],
            player_starting_hand=",".join(round_state["user_hands"][0]["cards"][:2]),
        )

        submitted = serializer.validated_data["running_count"]
        actual = state["running_count"]
        count_correct = submitted == actual
        RoundCountSubmission.objects.create(
            round=round_obj,
            user_running_count_input=submitted,
            actual_running_count=actual,
            is_correct=count_correct,
        )

        settle_round_chips_if_needed(state, request.user.id)
        profile = request.user.profile
        profile.refresh_from_db()

        xp_delta = 0
        if count_correct:
            xp_delta += 20
            profile.current_streak += 1
            profile.best_streak = max(profile.best_streak, profile.current_streak)
            session.rounds_with_correct_count += 1
        else:
            profile.current_streak = 0

        if round_obj.basic_strategy_correct:
            xp_delta += 10
        if (
            count_correct
            and round_obj.basic_strategy_correct
            and round_obj.duration_ms < 10000
        ):
            xp_delta += 5

        previous_rank = profile.rank
        profile.xp += xp_delta
        profile.rank = rank_from_xp(profile.xp)
        profile.save(
            update_fields=[
                "xp",
                "rank",
                "current_streak",
                "best_streak",
                "updated_at",
            ]
        )

        ProgressEvent.objects.create(
            user=request.user,
            event_type="round_complete",
            xp_delta=xp_delta,
            meta={
                "round_id": round_obj.id,
                "count_correct": count_correct,
                "previous_rank": previous_rank,
                "new_rank": profile.rank,
            },
        )

        session.rounds_played += 1
        session.total_time_ms += round_obj.duration_ms
        session.save(
            update_fields=[
                "rounds_played",
                "rounds_with_correct_count",
                "total_time_ms",
            ]
        )

        state["round_submitted"] = True
        save_state(session.id, state)

        return Response(
            {
                "is_correct": count_correct,
                "actual_running_count": actual,
                "round_time_ms": round_obj.duration_ms,
                "strategy_correct": strategy_correct,
                "played_action": played_action,
                "correct_action": correct_action,
                "chips_balance": profile.chips_balance,
                "xp": profile.xp,
                "rank": profile.rank,
                "session_gain_loss": (
                    profile.chips_balance - session.starting_chips_balance
                ),
            }
        )


class SessionNextRoundView(APIView):
    def post(self, request, session_id: int):
        session = get_object_or_404(GameSession, pk=session_id, user=request.user)
        state = get_state(session.id)
        if not state:
            return Response(
                {"detail": "Session state expired"}, status=status.HTTP_404_NOT_FOUND
            )

        if not state.get("round_submitted"):
            return Response(
                {"detail": "Submit round count first"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if (
            state["current_shoe"] >= state["shoes_per_session"]
            and len(state["shoe_cards"])
            <= shuffle_remaining_cards(state["decks_per_shoe"])
        ):
            rounds = session.rounds.all()
            total_rounds = rounds.count()
            strategy_correct = rounds.filter(basic_strategy_correct=True).count()
            count_correct = rounds.filter(count_submission__is_correct=True).count()
            gain_loss = (
                rounds.aggregate(total=models.Sum("net_chips_delta"))["total"] or 0
            )
            session.status = GameSession.Status.COMPLETED
            session.ended_at = timezone.now()
            session.save(update_fields=["status", "ended_at"])
            delete_state(session.id)
            return Response(
                {
                    "status": session.status,
                    "session_complete": True,
                    **bankroll_payload(session, request.user.id),
                    "summary": {
                        "gain_loss": gain_loss,
                        "count_accuracy_pct": (
                            round((count_correct / total_rounds) * 100, 2)
                            if total_rounds
                            else 0
                        ),
                        "play_accuracy_pct": (
                            round((strategy_correct / total_rounds) * 100, 2)
                            if total_rounds
                            else 0
                        ),
                        "total_rounds": total_rounds,
                    },
                }
            )

        state["active_round"] = None
        state["current_bet"] = 0
        state["round_ready_for_submission"] = False
        state["round_submitted"] = False
        save_state(session.id, state)
        return Response(
            {
                "status": session.status,
                "session_complete": False,
                "state": view_payload(state),
                **bankroll_payload(session, request.user.id),
            }
        )


class SessionExitView(APIView):
    def post(self, request, session_id: int):
        session = get_object_or_404(GameSession, pk=session_id, user=request.user)
        session.status = GameSession.Status.EXITED
        session.ended_at = timezone.now()
        session.save(update_fields=["status", "ended_at"])
        payload = bankroll_payload(session, request.user.id)
        delete_state(session.id)
        return Response({"status": session.status, **payload})
