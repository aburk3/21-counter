from __future__ import annotations

import random
from dataclasses import dataclass

RANKS = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K"]
SUITS = ["S", "H", "D", "C"]


@dataclass
class DealerOutcome:
    result: str
    chips_delta: int


def computer_bet_size(running_count: int, seat_index: int) -> int:
    """Conservative spread that increases with positive count."""
    ramp = max(running_count, 0) * 25
    seat_bias = seat_index * 5
    return max(25, min(200, 25 + ramp + seat_bias))


def count_value(card: str) -> int:
    rank = card[0]
    if rank in {"2", "3", "4", "5", "6"}:
        return 1
    if rank in {"T", "J", "Q", "K", "A"}:
        return -1
    return 0


def build_shoe(decks: int, seed: int) -> list[str]:
    cards = [f"{rank}{suit}" for rank in RANKS for suit in SUITS] * decks
    rng = random.Random(seed)
    rng.shuffle(cards)
    return cards


def hand_total(cards: list[str]) -> int:
    total = 0
    aces = 0
    for card in cards:
        rank = card[0]
        if rank in {"T", "J", "Q", "K"}:
            total += 10
        elif rank == "A":
            total += 11
            aces += 1
        else:
            total += int(rank)

    while total > 21 and aces:
        total -= 10
        aces -= 1
    return total


def is_blackjack(cards: list[str]) -> bool:
    return len(cards) == 2 and hand_total(cards) == 21


def basic_strategy_action(
    player_cards: list[str], dealer_upcard: str, can_split: bool
) -> str:
    up = dealer_upcard[0]
    total = hand_total(player_cards)

    if (
        can_split
        and len(player_cards) == 2
        and player_cards[0][0] == player_cards[1][0]
    ):
        pair = player_cards[0][0]
        if pair in {"A", "8"}:
            return "split"
        if pair in {"T", "J", "Q", "K", "5"}:
            return "stand" if pair != "5" else "double"

    if total <= 8:
        return "hit"
    if total == 9:
        return "double" if up in {"3", "4", "5", "6"} else "hit"
    if total == 10:
        return "double" if up not in {"T", "A"} else "hit"
    if total == 11:
        return "double"
    if total == 12:
        return "stand" if up in {"4", "5", "6"} else "hit"
    if 13 <= total <= 16:
        return "stand" if up in {"2", "3", "4", "5", "6"} else "hit"
    return "stand"


def legal_actions(hand: list[str], split_available: bool, doubled: bool) -> list[str]:
    if hand_total(hand) >= 21 or doubled:
        return ["stand"]
    actions = ["hit", "stand"]
    if len(hand) == 2:
        actions.append("double")
        if split_available:
            actions.append("split")
    return actions


def settle_hand(player: list[str], dealer: list[str], bet: int) -> DealerOutcome:
    p_total = hand_total(player)
    d_total = hand_total(dealer)

    if p_total > 21:
        return DealerOutcome("loss", -bet)
    if d_total > 21:
        return DealerOutcome("win", bet)
    if is_blackjack(player) and not is_blackjack(dealer):
        return DealerOutcome("blackjack", int(1.5 * bet))
    if p_total > d_total:
        return DealerOutcome("win", bet)
    if p_total < d_total:
        return DealerOutcome("loss", -bet)
    return DealerOutcome("push", 0)
