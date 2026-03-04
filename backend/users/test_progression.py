from __future__ import annotations

from django.test import SimpleTestCase

from users.models import UserProfile
from users.progression import next_rank_progress, rank_from_xp, unlocked_skins_for_rank


class ProgressionUtilTests(SimpleTestCase):
    def test_rank_threshold_boundaries(self):
        self.assertEqual(rank_from_xp(0), UserProfile.Rank.ROOKIE)
        self.assertEqual(rank_from_xp(199), UserProfile.Rank.ROOKIE)
        self.assertEqual(rank_from_xp(200), UserProfile.Rank.SPOTTER)
        self.assertEqual(rank_from_xp(500), UserProfile.Rank.PRO)
        self.assertEqual(rank_from_xp(1000), UserProfile.Rank.ACE)
        self.assertEqual(rank_from_xp(1800), UserProfile.Rank.SHARK)

    def test_next_rank_progress(self):
        progress = next_rank_progress(210)
        self.assertEqual(progress["next_rank"], UserProfile.Rank.PRO)
        self.assertEqual(progress["xp_to_next_rank"], 290)
        self.assertGreater(progress["rank_progress_pct"], 0)

    def test_unlocked_skins_include_lower_ranks(self):
        skins = unlocked_skins_for_rank(UserProfile.Rank.PRO)
        self.assertEqual(len(skins), 3)
        self.assertIn("classic_red", skins)
        self.assertIn("obsidian", skins)
