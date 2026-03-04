from __future__ import annotations

from rest_framework.test import APITestCase


class DashboardTests(APITestCase):
    def test_dashboard_requires_auth(self):
        response = self.client.get("/api/dashboard")
        self.assertEqual(response.status_code, 401)

    def test_dashboard_includes_progression_fields(self):
        self.client.post(
            "/api/auth/register",
            {"email": "dash@example.com", "password": "Passw0rd!"},
            format="json",
        )
        login = self.client.post(
            "/api/auth/login",
            {"email": "dash@example.com", "password": "Passw0rd!"},
            format="json",
        )
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {login.data['access']}")
        response = self.client.get("/api/dashboard")
        self.assertEqual(response.status_code, 200)
        self.assertIn("xp_to_next_rank", response.data)
        self.assertIn("rank_progress_pct", response.data)
        self.assertIn("available_skins", response.data)
        self.assertIn("selected_skin", response.data)
