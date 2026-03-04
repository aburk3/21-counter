from __future__ import annotations

from users.models import UserProfile, UserSettings

RANK_THRESHOLDS = [
    (UserProfile.Rank.ROOKIE, 0, 199),
    (UserProfile.Rank.SPOTTER, 200, 499),
    (UserProfile.Rank.PRO, 500, 999),
    (UserProfile.Rank.ACE, 1000, 1799),
    (UserProfile.Rank.SHARK, 1800, None),
]

SKIN_BY_RANK = {
    UserProfile.Rank.ROOKIE: UserSettings.DeckSkin.CLASSIC_RED,
    UserProfile.Rank.SPOTTER: UserSettings.DeckSkin.OCEAN_BLUE,
    UserProfile.Rank.PRO: UserSettings.DeckSkin.OBSIDIAN,
    UserProfile.Rank.ACE: UserSettings.DeckSkin.EMERALD,
    UserProfile.Rank.SHARK: UserSettings.DeckSkin.GOLD,
}


def rank_from_xp(xp: int) -> str:
    for rank, lower, upper in RANK_THRESHOLDS:
        if xp >= lower and (upper is None or xp <= upper):
            return rank
    return UserProfile.Rank.ROOKIE


def next_rank_progress(xp: int) -> dict[str, int | str | None]:
    rank = rank_from_xp(xp)
    for idx, (candidate, lower, upper) in enumerate(RANK_THRESHOLDS):
        if candidate != rank:
            continue
        if upper is None:
            return {"xp_to_next_rank": 0, "next_rank": None, "rank_progress_pct": 100}
        total = upper - lower + 1
        gained = max(0, min(xp - lower + 1, total))
        next_rank = RANK_THRESHOLDS[idx + 1][0]
        return {
            "xp_to_next_rank": max(upper + 1 - xp, 0),
            "next_rank": next_rank,
            "rank_progress_pct": round((gained / total) * 100),
        }
    return {"xp_to_next_rank": 0, "next_rank": None, "rank_progress_pct": 0}


def unlocked_skins_for_rank(rank: str) -> list[str]:
    ordered_ranks = [item[0] for item in RANK_THRESHOLDS]
    target_idx = ordered_ranks.index(rank)
    return [SKIN_BY_RANK[item] for item in ordered_ranks[: target_idx + 1]]
