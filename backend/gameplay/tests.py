from __future__ import annotations

from collections import Counter

from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase

from gameplay.engine import (
    basic_strategy_action,
    build_shoe,
    computer_bet_size,
    count_value,
    hand_total,
)
from gameplay.models import Round, RoundCountSubmission
from gameplay.state import (
    _ensure_shoe,
    apply_action,
    get_state,
    init_state,
    save_state,
)
from gameplay.strategy_feedback import summarize_strategy_decisions

User = get_user_model()


class EngineTests(APITestCase):
    def test_count_value_and_shoe_determinism(self):
        self.assertEqual(count_value("2S"), 1)
        self.assertEqual(count_value("9D"), 0)
        self.assertEqual(count_value("AH"), -1)
        self.assertEqual(build_shoe(1, 42), build_shoe(1, 42))

    def test_build_shoe_has_correct_card_multiplicity(self):
        decks = 6
        shoe = build_shoe(decks, 7)
        counts = Counter(shoe)
        self.assertEqual(len(shoe), 52 * decks)
        self.assertEqual(len(counts), 52)
        self.assertTrue(all(value == decks for value in counts.values()))

    def test_full_shoe_hilo_count_sums_to_zero(self):
        self.assertEqual(sum(count_value(card) for card in build_shoe(1, 11)), 0)
        self.assertEqual(sum(count_value(card) for card in build_shoe(6, 11)), 0)

    def test_hand_total_and_strategy(self):
        self.assertEqual(hand_total(["AS", "9D"]), 20)
        self.assertEqual(basic_strategy_action(["8S", "8D"], "6H", True), "split")
        self.assertEqual(basic_strategy_action(["TS", "6D"], "TH", False), "hit")

    def test_computer_bet_size_ramps_with_count(self):
        self.assertEqual(computer_bet_size(-2, 0), 25)
        self.assertGreater(computer_bet_size(4, 0), 25)
        self.assertLessEqual(computer_bet_size(20, 3), 200)

    def test_double_action_resolution_rules(self):
        base_state = {
            "running_count": 0,
            "active_round": {
                "started_at_ms": 1,
                "user_hands": [{"cards": ["6S", "5D"], "bet": 25, "doubled": False}],
                "dealer_hand": ["6H", "9C"],
                "other_hands": [],
                "active_hand_index": 0,
                "decisions": [],
                "phase": "user_turn",
                "resolved": False,
                "result": "push",
                "chips_delta": 0,
            },
            "shoe_cards": ["2C", "3D", "4H", "5S", "6C"],
            "round_ready_for_submission": False,
        }
        apply_action(base_state, "double")
        self.assertTrue(base_state["active_round"]["resolved"])
        self.assertEqual(len(base_state["active_round"]["user_hands"][0]["cards"]), 3)

        split_state = {
            "running_count": 0,
            "active_round": {
                "started_at_ms": 1,
                "user_hands": [
                    {"cards": ["6S", "5D"], "bet": 25, "doubled": False},
                    {"cards": ["8S", "8D"], "bet": 25, "doubled": False},
                ],
                "dealer_hand": ["6H", "9C"],
                "other_hands": [],
                "active_hand_index": 0,
                "decisions": [],
                "phase": "user_turn",
                "resolved": False,
                "result": "push",
                "chips_delta": 0,
            },
            "shoe_cards": ["2C", "3D", "4H", "5S", "6C"],
            "round_ready_for_submission": False,
        }
        apply_action(split_state, "double")
        self.assertFalse(split_state["active_round"]["resolved"])
        self.assertEqual(split_state["active_round"]["active_hand_index"], 1)


class StrategyFeedbackTests(APITestCase):
    def test_empty_decisions_are_not_marked_correct(self):
        is_correct, played, expected = summarize_strategy_decisions([])
        self.assertFalse(is_correct)
        self.assertEqual(played, "")
        self.assertEqual(expected, "")

    def test_all_correct_decisions_return_first_pair(self):
        is_correct, played, expected = summarize_strategy_decisions(
            [
                {"action": "hit", "recommended": "hit", "correct": True},
                {"action": "stand", "recommended": "stand", "correct": True},
            ]
        )
        self.assertTrue(is_correct)
        self.assertEqual(played, "hit")
        self.assertEqual(expected, "hit")

    def test_mixed_decisions_return_first_incorrect_pair(self):
        is_correct, played, expected = summarize_strategy_decisions(
            [
                {"action": "hit", "recommended": "hit", "correct": True},
                {"action": "double", "recommended": "stand", "correct": False},
                {"action": "stand", "recommended": "stand", "correct": True},
            ]
        )
        self.assertFalse(is_correct)
        self.assertEqual(played, "double")
        self.assertEqual(expected, "stand")


class SessionFlowTests(APITestCase):
    def setUp(self):
        self.client.post(
            "/api/auth/register",
            {"email": "flow@example.com", "password": "Passw0rd!"},
            format="json",
        )
        login = self.client.post(
            "/api/auth/login",
            {"email": "flow@example.com", "password": "Passw0rd!"},
            format="json",
        )
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {login.data['access']}")

    def test_full_round_lifecycle(self):
        created = self.client.post(
            "/api/sessions",
            {"decks_per_shoe": 6, "hands_dealt": 3, "shoes_per_session": 1},
            format="json",
        )
        self.assertEqual(created.status_code, 201)
        sid = created.data["session_id"]
        self.assertIn("chips_balance", created.data)
        self.assertIn("session_gain_loss", created.data)

        bet = self.client.post(
            f"/api/sessions/{sid}/bet", {"amount": 25}, format="json"
        )
        self.assertEqual(bet.status_code, 200)
        self.assertIn("chips_balance", bet.data)
        self.assertIn("session_gain_loss", bet.data)

        deal = self.client.post(f"/api/sessions/{sid}/deal", {}, format="json")
        self.assertEqual(deal.status_code, 200)
        self.assertIn("chips_balance", deal.data)
        self.assertIn("session_gain_loss", deal.data)
        self.assertGreaterEqual(
            len(deal.data["state"]["active_round"]["other_hands"]), 1
        )
        self.assertEqual(deal.data["state"]["active_round"]["phase"], "user_turn")
        self.assertFalse(deal.data["state"]["active_round"]["resolved"])
        user_cards = deal.data["state"]["active_round"]["user_hands"][0]["cards"]
        self.assertEqual(len(user_cards), 2)
        self.assertEqual(len(deal.data["state"]["active_round"]["dealer_hand"]), 2)
        for seat in deal.data["state"]["active_round"]["other_hands"]:
            self.assertEqual(len(seat["hands"][0]["cards"]), 2)
        self.assertIn("dealer_total", deal.data["state"]["active_round"])
        self.assertIn("dealer_status", deal.data["state"]["active_round"])
        first_seat = deal.data["state"]["active_round"]["other_hands"][0]
        self.assertIn("total_bet", first_seat)
        self.assertGreaterEqual(first_seat["total_bet"], 25)

        for _ in range(10):
            state = self.client.get(f"/api/sessions/{sid}", format="json")
            if state.data["state"]["active_round"]["resolved"]:
                break
            legal = state.data["state"]["active_round"]["legal_actions"]
            action = "stand" if "stand" in legal else legal[0]
            acted = self.client.post(
                f"/api/sessions/{sid}/action", {"action": action}, format="json"
            )
            self.assertEqual(acted.status_code, 200)
            self.assertIn("chips_balance", acted.data)
            self.assertIn("session_gain_loss", acted.data)

        final_state = self.client.get(f"/api/sessions/{sid}", format="json")
        actual_count = final_state.data["state"]["running_count"]

        submitted = self.client.post(
            f"/api/sessions/{sid}/round/submit-count",
            {"running_count": actual_count},
            format="json",
        )
        self.assertEqual(submitted.status_code, 200)
        self.assertTrue(submitted.data["is_correct"])
        self.assertIn("rank", submitted.data)
        self.assertIn("chips_balance", submitted.data)
        self.assertIn("session_gain_loss", submitted.data)
        self.assertEqual(Round.objects.count(), 1)
        self.assertEqual(RoundCountSubmission.objects.count(), 1)

        nxt = self.client.post(f"/api/sessions/{sid}/next-round", {}, format="json")
        self.assertEqual(nxt.status_code, 200)
        self.assertIn("chips_balance", nxt.data)
        self.assertIn("session_gain_loss", nxt.data)

    def test_bet_below_minimum_is_rejected(self):
        created = self.client.post(
            "/api/sessions",
            {"decks_per_shoe": 6, "hands_dealt": 2},
            format="json",
        )
        sid = created.data["session_id"]
        bet = self.client.post(f"/api/sessions/{sid}/bet", {"amount": 5}, format="json")
        self.assertEqual(bet.status_code, 400)

    def test_chips_and_gain_loss_persist_across_rounds(self):
        created = self.client.post(
            "/api/sessions",
            {"decks_per_shoe": 6, "hands_dealt": 3},
            format="json",
        )
        sid = created.data["session_id"]

        first_bet = self.client.post(
            f"/api/sessions/{sid}/bet", {"amount": 25}, format="json"
        )
        self.assertEqual(first_bet.status_code, 200)
        self.assertEqual(first_bet.data["session_gain_loss"], 0)

        self.client.post(f"/api/sessions/{sid}/deal", {}, format="json")
        for _ in range(10):
            state = self.client.get(f"/api/sessions/{sid}", format="json")
            if state.data["state"]["active_round"]["resolved"]:
                break
            legal = state.data["state"]["active_round"]["legal_actions"]
            action = "stand" if "stand" in legal else legal[0]
            self.client.post(
                f"/api/sessions/{sid}/action", {"action": action}, format="json"
            )

        end_round_one = self.client.get(f"/api/sessions/{sid}", format="json")
        actual_count = end_round_one.data["state"]["running_count"]
        submitted = self.client.post(
            f"/api/sessions/{sid}/round/submit-count",
            {"running_count": actual_count},
            format="json",
        )
        gain_after_round_one = submitted.data["session_gain_loss"]
        chips_after_round_one = submitted.data["chips_balance"]

        nxt = self.client.post(f"/api/sessions/{sid}/next-round", {}, format="json")
        self.assertEqual(nxt.status_code, 200)
        self.assertEqual(nxt.data["session_gain_loss"], gain_after_round_one)
        self.assertEqual(nxt.data["chips_balance"], chips_after_round_one)

        second_bet = self.client.post(
            f"/api/sessions/{sid}/bet", {"amount": 100}, format="json"
        )
        self.assertEqual(second_bet.status_code, 200)
        self.assertEqual(second_bet.data["session_gain_loss"], gain_after_round_one)
        self.assertEqual(second_bet.data["chips_balance"], chips_after_round_one)

    def test_round_loss_settles_chips_before_count_submission(self):
        created = self.client.post(
            "/api/sessions",
            {"decks_per_shoe": 1, "hands_dealt": 1},
            format="json",
        )
        sid = created.data["session_id"]
        self.client.post(f"/api/sessions/{sid}/bet", {"amount": 25}, format="json")

        state = get_state(sid)
        self.assertIsNotNone(state)
        assert state is not None
        # Draw order for deal(): user1, dealer1, user2, dealer2 (pop from end).
        # User gets 9+7=16 and dealer gets T+7=17; standing loses.
        state["shoe_cards"] = ["2S", "3H", "7C", "7D", "TS", "9C"]
        save_state(sid, state)

        dealt = self.client.post(f"/api/sessions/{sid}/deal", {}, format="json")
        self.assertEqual(dealt.status_code, 200)
        self.assertFalse(dealt.data["state"]["active_round"]["resolved"])

        resolved = self.client.post(
            f"/api/sessions/{sid}/action", {"action": "stand"}, format="json"
        )
        self.assertEqual(resolved.status_code, 200)
        self.assertTrue(resolved.data["state"]["active_round"]["resolved"])
        self.assertEqual(resolved.data["state"]["active_round"]["chips_delta"], -25)
        self.assertEqual(resolved.data["chips_balance"], 475)
        self.assertEqual(resolved.data["session_gain_loss"], -25)

        after_resolve = self.client.get(f"/api/sessions/{sid}", format="json")
        self.assertEqual(after_resolve.status_code, 200)
        self.assertEqual(after_resolve.data["chips_balance"], 475)
        self.assertEqual(after_resolve.data["session_gain_loss"], -25)

    def test_computer_hands_start_with_two_cards_until_user_turn_ends(self):
        created = self.client.post(
            "/api/sessions",
            {"decks_per_shoe": 6, "hands_dealt": 3},
            format="json",
        )
        sid = created.data["session_id"]
        self.client.post(f"/api/sessions/{sid}/bet", {"amount": 25}, format="json")

        dealt = self.client.post(f"/api/sessions/{sid}/deal", {}, format="json")
        self.assertEqual(dealt.status_code, 200)
        active_round = dealt.data["state"]["active_round"]
        self.assertEqual(active_round["phase"], "user_turn")
        for seat in active_round["other_hands"]:
            self.assertEqual(len(seat["hands"][0]["cards"]), 2)

        resolved = self.client.post(
            f"/api/sessions/{sid}/action", {"action": "stand"}, format="json"
        )
        self.assertEqual(resolved.status_code, 200)
        resolved_round = resolved.data["state"]["active_round"]
        self.assertTrue(resolved_round["resolved"])
        self.assertEqual(resolved_round["phase"], "resolved")

class ShoeTransitionTests(APITestCase):
    def test_single_deck_with_multiple_shoes_does_not_skip_first_shoe(self):
        state = init_state(session_id=3, decks=1, hands_dealt=1, shoes_per_session=2)
        _ensure_shoe(state)
        self.assertEqual(state["current_shoe"], 1)

    def test_shuffle_to_next_shoe_resets_running_count(self):
        state = init_state(session_id=5, decks=2, hands_dealt=1, shoes_per_session=2)
        state["running_count"] = 9
        state["shoe_cards"] = ["2S"] * 52
        _ensure_shoe(state)
        self.assertEqual(state["current_shoe"], 2)
        self.assertEqual(state["running_count"], 0)
        self.assertEqual(len(state["shoe_cards"]), 104)
