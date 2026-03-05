from __future__ import annotations

import time
from typing import Any

from django.conf import settings
from django.core.cache import cache

from gameplay.engine import (
    basic_strategy_action,
    build_shoe,
    computer_bet_size,
    count_value,
    hand_total,
    is_blackjack,
    legal_actions,
    settle_hand,
)

HAND_STATUS = {
    "in_play": "in_play",
    "stood": "stood",
    "bust": "bust",
    "twenty_one": "twenty_one",
    "blackjack": "blackjack",
    "win": "win",
    "loss": "loss",
    "push": "push",
}

ROUND_PHASE = {
    "user_turn": "user_turn",
    "other_turns": "other_turns",
    "dealer_turn": "dealer_turn",
    "resolved": "resolved",
}


def session_cache_key(session_id: int) -> str:
    return f"session:{session_id}:state"


def get_state(session_id: int) -> dict[str, Any] | None:
    return cache.get(session_cache_key(session_id))


def save_state(session_id: int, state: dict[str, Any]) -> None:
    cache.set(
        session_cache_key(session_id),
        state,
        timeout=settings.CACHES["default"]["TIMEOUT"],
    )


def delete_state(session_id: int) -> None:
    cache.delete(session_cache_key(session_id))


def init_state(
    session_id: int, decks: int, hands_dealt: int, shoes_per_session: int
) -> dict[str, Any]:
    seed = session_id * 97
    return {
        "seed": seed,
        "decks_per_shoe": decks,
        "hands_dealt": hands_dealt,
        "shoes_per_session": shoes_per_session,
        "current_shoe": 1,
        "shoe_cards": build_shoe(decks, seed),
        "running_count": 0,
        "round_number": 0,
        "current_bet": 0,
        "active_round": None,
        "round_ready_for_submission": False,
        "round_submitted": False,
    }


def _draw(state: dict[str, Any]) -> str:
    card = state["shoe_cards"].pop()
    state["running_count"] += count_value(card)
    return card


def shuffle_remaining_cards(decks_per_shoe: int) -> int:
    """Cards remaining at which a shuffle should occur before the next round."""
    return 52 if decks_per_shoe > 1 else 0


def _ensure_shoe(state: dict[str, Any]) -> None:
    if len(state["shoe_cards"]) > shuffle_remaining_cards(state["decks_per_shoe"]):
        return
    if state["current_shoe"] >= state["shoes_per_session"]:
        return
    state["current_shoe"] += 1
    state["shoe_cards"] = build_shoe(
        state["decks_per_shoe"], state["seed"] + state["current_shoe"]
    )
    state["running_count"] = 0


def _status_for_cards(cards: list[str], stood: bool = False) -> str:
    total = hand_total(cards)
    if total > 21:
        return HAND_STATUS["bust"]
    if is_blackjack(cards):
        return HAND_STATUS["blackjack"]
    if total == 21:
        return HAND_STATUS["twenty_one"]
    if stood:
        return HAND_STATUS["stood"]
    return HAND_STATUS["in_play"]


def _dealer_status(cards: list[str]) -> str:
    total = hand_total(cards)
    if total > 21:
        return HAND_STATUS["bust"]
    if is_blackjack(cards):
        return HAND_STATUS["blackjack"]
    if total == 21:
        return HAND_STATUS["twenty_one"]
    return HAND_STATUS["stood"]


def _result_status(outcome: str) -> str:
    if outcome == "blackjack":
        return HAND_STATUS["blackjack"]
    if outcome in {"win", "loss", "push"}:
        return HAND_STATUS[outcome]
    return HAND_STATUS["push"]


def place_bet(state: dict[str, Any], amount: int, chips_balance: int) -> dict[str, Any]:
    if state["active_round"]:
        raise ValueError("Cannot bet during active round")
    if amount < 25:
        raise ValueError("Minimum bet is $25")
    if amount > chips_balance:
        raise ValueError("Insufficient chips")
    state["current_bet"] = amount
    return state


def deal_round(state: dict[str, Any]) -> dict[str, Any]:
    _ensure_shoe(state)
    if state["active_round"]:
        raise ValueError("Round already active")
    if state["current_bet"] <= 0:
        raise ValueError("Place a bet before dealing")

    user_hand = []
    dealer_hand = []
    other_hands = [
        {
            "hands": [
                {
                    "cards": [],
                    "bet": computer_bet_size(state["running_count"], seat_index),
                    "doubled": False,
                    "stood": False,
                }
            ],
            "actions": [],
            "total_bet": computer_bet_size(state["running_count"], seat_index),
            "result": "push",
            "chips_delta": 0,
            "played": False,
        }
        for seat_index in range(max(state["hands_dealt"] - 1, 0))
    ]

    # Round-robin initial deal: user + seats + dealer, then repeat.
    user_hand.append(_draw(state))
    for seat in other_hands:
        seat["hands"][0]["cards"].append(_draw(state))
    dealer_hand.append(_draw(state))

    user_hand.append(_draw(state))
    for seat in other_hands:
        seat["hands"][0]["cards"].append(_draw(state))
    dealer_hand.append(_draw(state))

    state["round_number"] += 1
    state["round_submitted"] = False
    state["round_ready_for_submission"] = False
    state["active_round"] = {
        "started_at_ms": int(time.time() * 1000),
        "user_hands": [
            {
                "cards": user_hand,
                "bet": state["current_bet"],
                "doubled": False,
                "stood": False,
            }
        ],
        "dealer_hand": dealer_hand,
        "other_hands": other_hands,
        "active_hand_index": 0,
        "decisions": [],
        "phase": ROUND_PHASE["user_turn"],
        "resolved": False,
        "chips_settled": False,
        "result": "push",
        "chips_delta": 0,
        "dealer_total": hand_total(dealer_hand),
        "dealer_status": HAND_STATUS["in_play"],
    }

    round_state = state["active_round"]
    _advance_user_turn(round_state)

    if is_blackjack(dealer_hand):
        _complete_round(state, play_other_turns=False, play_dealer=False)
    elif round_state["active_hand_index"] >= len(round_state["user_hands"]):
        _complete_round(state, play_other_turns=True, play_dealer=True)

    return state


def _advance_user_turn(round_state: dict[str, Any]) -> None:
    idx = round_state["active_hand_index"]
    while idx < len(round_state["user_hands"]):
        hand = round_state["user_hands"][idx]
        if hand.get("stood") or hand_total(hand["cards"]) >= 21:
            hand["stood"] = True
            idx += 1
            continue
        break
    round_state["active_hand_index"] = idx


def _play_other_turns(state: dict[str, Any]) -> None:
    round_state = state["active_round"]
    round_state["phase"] = ROUND_PHASE["other_turns"]
    for seat in round_state["other_hands"]:
        if seat.get("played"):
            continue
        _play_automated_seat(state, seat, round_state["dealer_hand"][0])


def _play_dealer_turn(state: dict[str, Any]) -> None:
    round_state = state["active_round"]
    round_state["phase"] = ROUND_PHASE["dealer_turn"]
    while hand_total(round_state["dealer_hand"]) < 17:
        round_state["dealer_hand"].append(_draw(state))


def _complete_round(
    state: dict[str, Any], play_other_turns: bool = True, play_dealer: bool = True
) -> None:
    if play_other_turns:
        _play_other_turns(state)
    if play_dealer:
        _play_dealer_turn(state)
    _finish_round(state)


def _finish_round(state: dict[str, Any]) -> None:
    round_state = state["active_round"]

    chips_delta = 0
    result = "push"
    for hand in round_state["user_hands"]:
        outcome = settle_hand(hand["cards"], round_state["dealer_hand"], hand["bet"])
        chips_delta += outcome.chips_delta
        result = outcome.result if outcome.chips_delta != 0 else result
        hand["result"] = outcome.result
        hand["status"] = _result_status(outcome.result)
        hand["total"] = hand_total(hand["cards"])

    round_state["resolved"] = True
    round_state["result"] = result
    round_state["chips_delta"] = chips_delta
    round_state["dealer_total"] = hand_total(round_state["dealer_hand"])
    round_state["dealer_status"] = _dealer_status(round_state["dealer_hand"])
    for seat in round_state["other_hands"]:
        seat_delta = 0
        for hand in seat["hands"]:
            outcome = settle_hand(
                hand["cards"], round_state["dealer_hand"], hand["bet"]
            )
            seat_delta += outcome.chips_delta
            hand["result"] = outcome.result
            hand["status"] = _result_status(outcome.result)
            hand["total"] = hand_total(hand["cards"])
        seat["chips_delta"] = seat_delta
        seat["result"] = (
            "win" if seat_delta > 0 else "loss" if seat_delta < 0 else "push"
        )
        seat["played"] = True
        seat["total_bet"] = sum(hand["bet"] for hand in seat["hands"])
    round_state["phase"] = ROUND_PHASE["resolved"]
    round_state["ended_at_ms"] = int(time.time() * 1000)
    state["round_ready_for_submission"] = True


def _play_automated_seat(
    state: dict[str, Any],
    seat: dict[str, Any],
    dealer_upcard: str,
) -> dict[str, Any]:
    hands = seat["hands"]
    actions: list[str] = []
    hand_index = 0
    max_hands = 4

    while hand_index < len(hands):
        hand = hands[hand_index]
        cards = hand["cards"]
        can_split = (
            len(cards) == 2 and cards[0][0] == cards[1][0] and len(hands) < max_hands
        )
        action = basic_strategy_action(cards, dealer_upcard, can_split)

        if action == "split" and can_split:
            second = cards.pop()
            hand_a = {
                "cards": [cards[0], _draw(state)],
                "bet": hand["bet"],
                "doubled": False,
                "stood": False,
            }
            hand_b = {
                "cards": [second, _draw(state)],
                "bet": hand["bet"],
                "doubled": False,
                "stood": False,
            }
            hands[hand_index : hand_index + 1] = [hand_a, hand_b]
            actions.append("split")
            continue

        if action == "double" and len(cards) == 2:
            hand["bet"] *= 2
            hand["doubled"] = True
            cards.append(_draw(state))
            hand["stood"] = True
            actions.append("double")
            hand_index += 1
            continue

        if action == "hit":
            cards.append(_draw(state))
            actions.append("hit")
            if hand_total(cards) >= 21:
                hand["stood"] = True
                hand_index += 1
            continue

        actions.append("stand")
        hand["stood"] = True
        hand_index += 1

    seat["actions"] = actions
    seat["total_bet"] = sum(hand["bet"] for hand in hands)
    seat["played"] = True
    return seat


def apply_action(state: dict[str, Any], action: str) -> dict[str, Any]:
    round_state = state["active_round"]
    if (
        not round_state
        or round_state["resolved"]
        or round_state.get("phase") != ROUND_PHASE["user_turn"]
    ):
        raise ValueError("No active hand")

    idx = round_state["active_hand_index"]
    hand = round_state["user_hands"][idx]
    cards = hand["cards"]
    can_split = len(cards) == 2 and cards[0][0] == cards[1][0]

    recommended = basic_strategy_action(cards, round_state["dealer_hand"][0], can_split)
    round_state["decisions"].append(
        {
            "action": action,
            "recommended": recommended,
            "correct": action == recommended,
        }
    )

    if action == "hit":
        cards.append(_draw(state))
        if hand_total(cards) >= 21:
            hand["stood"] = True
            round_state["active_hand_index"] += 1
    elif action == "stand":
        hand["stood"] = True
        round_state["active_hand_index"] += 1
    elif action == "double":
        if len(cards) != 2:
            raise ValueError("Double is only allowed on first decision")
        hand["bet"] *= 2
        hand["doubled"] = True
        hand["stood"] = True
        cards.append(_draw(state))
        round_state["active_hand_index"] += 1
    elif action == "split":
        if not can_split:
            raise ValueError("Split not allowed")
        second = cards.pop()
        hand_a = {
            "cards": [cards[0], _draw(state)],
            "bet": hand["bet"],
            "doubled": False,
            "stood": False,
        }
        hand_b = {
            "cards": [second, _draw(state)],
            "bet": hand["bet"],
            "doubled": False,
            "stood": False,
        }
        round_state["user_hands"][idx : idx + 1] = [hand_a, hand_b]
    else:
        raise ValueError("Unsupported action")

    _advance_user_turn(round_state)
    if round_state["active_hand_index"] >= len(round_state["user_hands"]):
        _complete_round(state)

    return state


def view_payload(state: dict[str, Any]) -> dict[str, Any]:
    round_state = state["active_round"]
    if not round_state:
        return {
            "running_count": state["running_count"],
            "round_number": state["round_number"],
            "current_bet": state["current_bet"],
            "active_round": None,
            "round_ready_for_submission": state["round_ready_for_submission"],
        }

    active_idx = min(
        round_state["active_hand_index"], len(round_state["user_hands"]) - 1
    )
    active_hand = round_state["user_hands"][active_idx]["cards"]
    split_available = (
        len(active_hand) == 2
        and active_hand[0][0] == active_hand[1][0]
        and not round_state["resolved"]
        and round_state.get("phase") == ROUND_PHASE["user_turn"]
    )

    return {
        "running_count": state["running_count"],
        "round_number": state["round_number"],
        "current_bet": state["current_bet"],
        "round_ready_for_submission": state["round_ready_for_submission"],
        "active_round": {
            "user_hands": [
                {
                    "cards": hand["cards"],
                    "bet": hand["bet"],
                    "total": hand_total(hand["cards"]),
                    "status": (
                        hand.get("status")
                        if round_state["resolved"]
                        else _status_for_cards(
                            hand["cards"], stood=hand.get("stood", False)
                        )
                    ),
                    "result": hand.get("result", ""),
                }
                for hand in round_state["user_hands"]
            ],
            "dealer_hand": round_state["dealer_hand"],
            "dealer_total": (
                round_state.get("dealer_total", hand_total(round_state["dealer_hand"]))
            ),
            "dealer_status": (
                round_state.get("dealer_status")
                if round_state["resolved"]
                else HAND_STATUS["in_play"]
            ),
            "other_hands": [
                {
                    "actions": seat["actions"],
                    "total_bet": seat["total_bet"],
                    "result": seat["result"],
                    "chips_delta": seat["chips_delta"],
                    "hands": [
                        {
                            "cards": hand["cards"],
                            "bet": hand["bet"],
                            "total": hand_total(hand["cards"]),
                            "status": (
                                hand.get("status")
                                if round_state["resolved"]
                                else _status_for_cards(
                                    hand["cards"], stood=hand.get("stood", False)
                                )
                            ),
                            "result": hand.get("result", ""),
                        }
                        for hand in seat["hands"]
                    ],
                }
                for seat in round_state["other_hands"]
            ],
            "active_hand_index": round_state["active_hand_index"],
            "phase": round_state.get("phase", ROUND_PHASE["resolved"]),
            "resolved": round_state["resolved"],
            "result": round_state["result"],
            "chips_delta": round_state["chips_delta"],
            "started_at_ms": round_state["started_at_ms"],
            "ended_at_ms": round_state.get("ended_at_ms"),
            "legal_actions": (
                legal_actions(
                    active_hand,
                    split_available=split_available,
                    doubled=round_state["user_hands"][active_idx].get("doubled", False),
                )
                if (
                    not round_state["resolved"]
                    and round_state.get("phase") == ROUND_PHASE["user_turn"]
                )
                else []
            ),
        },
    }
