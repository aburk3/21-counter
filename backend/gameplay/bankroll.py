from __future__ import annotations

from django.db.models import F
from django.utils import timezone

from gameplay.models import GameSession
from users.models import UserProfile


def get_chips_balance(user_id: int) -> int:
    return UserProfile.objects.only("chips_balance").get(user_id=user_id).chips_balance


def bankroll_payload(
    session: GameSession, user_id: int, chips_balance: int | None = None
) -> dict[str, int]:
    balance = chips_balance if chips_balance is not None else get_chips_balance(user_id)
    return {
        "chips_balance": balance,
        "session_gain_loss": balance - session.starting_chips_balance,
    }


def settle_round_chips_if_needed(state: dict, user_id: int) -> int:
    round_state = state.get("active_round")
    if not round_state or not round_state.get("resolved"):
        return get_chips_balance(user_id)
    if round_state.get("chips_settled"):
        return get_chips_balance(user_id)

    chips_delta = int(round_state.get("chips_delta", 0))
    if chips_delta != 0:
        UserProfile.objects.filter(user_id=user_id).update(
            chips_balance=F("chips_balance") + chips_delta,
            updated_at=timezone.now(),
        )
    round_state["chips_settled"] = True
    return get_chips_balance(user_id)


__all__ = ["bankroll_payload", "settle_round_chips_if_needed", "get_chips_balance"]
