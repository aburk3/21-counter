from __future__ import annotations

from datetime import timedelta

from django.contrib.auth import get_user_model
from django.utils import timezone
from rest_framework.test import APITestCase

from progress.models import PracticeRun, ProgressEvent

User = get_user_model()


class DashboardTests(APITestCase):
    def test_dashboard_requires_auth(self):
        response = self.client.get("/api/dashboard")
        self.assertEqual(response.status_code, 401)

    def test_dashboard_includes_progression_and_practice_fields(self):
        user = User.objects.create_user(
            email="dash@example.com",
            password="Passw0rd!",
            is_email_verified=True,
        )
        self.client.force_authenticate(user=user)
        PracticeRun.objects.create(
            user=user,
            decks=2,
            mode=PracticeRun.Mode.AUTO,
            speed_tier=PracticeRun.SpeedTier.INTERMEDIATE,
            target_duration_ms=120_000,
            hidden_cards_count=6,
            visible_cards_count=98,
            hidden_cards=["AS", "2C", "KD", "5H", "8S", "3D"],
            actual_running_count=1,
            submitted_running_count=1,
            count_delta=0,
            is_correct=True,
            started_at=timezone.now() - timedelta(seconds=40),
            ended_at=timezone.now(),
            duration_ms=40_000,
            xp_delta=10,
        )
        response = self.client.get("/api/dashboard")
        self.assertEqual(response.status_code, 200)
        self.assertIn("xp_to_next_rank", response.data)
        self.assertIn("rank_progress_pct", response.data)
        self.assertIn("available_skins", response.data)
        self.assertIn("selected_skin", response.data)
        self.assertIn("practice_total_runs", response.data)
        self.assertIn("practice_correct_runs", response.data)
        self.assertIn("practice_accuracy_pct", response.data)
        self.assertIn("practice_avg_ms_per_deck", response.data)
        self.assertIn("practice_best_streak", response.data)
        self.assertIn("practice_recent_runs", response.data)


class PracticeRunTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="practice@example.com",
            password="Passw0rd!",
            is_email_verified=True,
        )
        self.client.force_authenticate(user=self.user)

    def test_start_validates_payload(self):
        response = self.client.post(
            "/api/practice/runs/start",
            {"decks": 0, "mode": "auto", "speed_tier": "expert"},
            format="json",
        )
        self.assertEqual(response.status_code, 400)

    def test_start_hides_three_cards_per_deck(self):
        response = self.client.post(
            "/api/practice/runs/start",
            {"decks": 3, "mode": "manual", "speed_tier": "beginner"},
            format="json",
        )
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["hidden_cards_count"], 9)
        self.assertEqual(response.data["visible_cards_count"], 156 - 9)
        self.assertEqual(len(response.data["visible_cards"]), 156 - 9)

    def test_submit_correct_awards_xp_by_speed_tier(self):
        start = self.client.post(
            "/api/practice/runs/start",
            {"decks": 1, "mode": "auto", "speed_tier": "expert"},
            format="json",
        )
        run = PracticeRun.objects.get(pk=start.data["run_id"])
        run.started_at = timezone.now() - timedelta(milliseconds=25_000)
        run.save(update_fields=["started_at"])

        submit = self.client.post(
            f"/api/practice/runs/{run.id}/submit",
            {"running_count": run.actual_running_count},
            format="json",
        )
        self.assertEqual(submit.status_code, 200)
        self.assertTrue(submit.data["is_correct"])
        self.assertEqual(submit.data["xp_delta"], 15)

    def test_submit_incorrect_awards_no_xp(self):
        start = self.client.post(
            "/api/practice/runs/start",
            {"decks": 2, "mode": "manual", "speed_tier": "beginner"},
            format="json",
        )
        run = PracticeRun.objects.get(pk=start.data["run_id"])
        run.started_at = timezone.now() - timedelta(milliseconds=180_000)
        run.save(update_fields=["started_at"])

        submit = self.client.post(
            f"/api/practice/runs/{run.id}/submit",
            {"running_count": run.actual_running_count + 1},
            format="json",
        )
        self.assertEqual(submit.status_code, 200)
        self.assertFalse(submit.data["is_correct"])
        self.assertEqual(submit.data["xp_delta"], 0)

    def test_submit_sets_count_delta_and_creates_progress_event(self):
        start = self.client.post(
            "/api/practice/runs/start",
            {"decks": 1, "mode": "auto", "speed_tier": "intermediate"},
            format="json",
        )
        run = PracticeRun.objects.get(pk=start.data["run_id"])
        run.started_at = timezone.now() - timedelta(milliseconds=91_000)
        run.save(update_fields=["started_at"])

        submit = self.client.post(
            f"/api/practice/runs/{run.id}/submit",
            {"running_count": run.actual_running_count - 2},
            format="json",
        )
        self.assertEqual(submit.status_code, 200)
        self.assertEqual(submit.data["count_delta"], -2)
        self.assertTrue(
            ProgressEvent.objects.filter(
                user=self.user, event_type="count_practice_complete"
            ).exists()
        )

    def test_submit_can_only_happen_once(self):
        start = self.client.post(
            "/api/practice/runs/start",
            {"decks": 1, "mode": "auto", "speed_tier": "intermediate"},
            format="json",
        )
        run_id = start.data["run_id"]
        run = PracticeRun.objects.get(pk=run_id)

        self.client.post(
            f"/api/practice/runs/{run_id}/submit",
            {"running_count": run.actual_running_count},
            format="json",
        )
        second = self.client.post(
            f"/api/practice/runs/{run_id}/submit",
            {"running_count": run.actual_running_count},
            format="json",
        )
        self.assertEqual(second.status_code, 400)

    def test_dashboard_recent_runs_caps_at_twenty(self):
        now = timezone.now()
        for idx in range(25):
            PracticeRun.objects.create(
                user=self.user,
                decks=1,
                mode=PracticeRun.Mode.AUTO,
                speed_tier=PracticeRun.SpeedTier.BEGINNER,
                target_duration_ms=90_000,
                hidden_cards_count=3,
                visible_cards_count=49,
                hidden_cards=["AS", "KS", "2C"],
                actual_running_count=0,
                submitted_running_count=0,
                count_delta=0,
                is_correct=idx % 2 == 0,
                started_at=now - timedelta(minutes=idx + 1),
                ended_at=now - timedelta(minutes=idx + 1) + timedelta(seconds=35),
                duration_ms=35_000,
                xp_delta=6,
            )
        response = self.client.get("/api/dashboard")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data["practice_recent_runs"]), 20)
