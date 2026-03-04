const DASHBOARD_TEXT = {
  TITLE: "Training Dashboard",
  PLAY: "Play",
  LOGOUT: "Logout",
  DASHBOARD_UNAVAILABLE: "Dashboard unavailable",
  LOADING_DASHBOARD: "Loading dashboard...",
  STATS: {
    CORRECT_COUNT_GAMES: "Correct Count Games",
    COUNT_ACCURACY: "Count Accuracy",
    STRATEGY_CORRECT: "Strategy Correct",
    AVG_TIME: "Avg Time",
    CURRENT_STREAK: "Current Streak",
    XP: "XP",
    CHIPS: "Chips",
  },
  PROGRESSION_TITLE: "Progress",
  progressionToNext: (xp: number, nextRank: string | null) =>
    nextRank ? `${xp} XP to ${nextRank}` : "Top rank reached",
  HOW_TO_RANK_UP:
    "Rank up by submitting correct counts (+20), correct strategy (+10), and speed bonus (+5 under 10s).",
  UNLOCKS_TITLE: "Deck Unlocks",
  nextUnlock: (rank: string | null) =>
    rank ? `Next unlock at ${rank}` : "All deck skins unlocked",
  BANKROLL_TITLE: "Bankroll Refill",
  BANKROLL_WARNING: "Refilling chips costs 75 XP and may lower your rank.",
  BANKROLL_BUTTON: "Add $500 Chips",
  REFILL_CONFIRM_TITLE: "Confirm Refill",
  refillConfirmDetails: (
    xp: number,
    rank: string,
    nextXp: number,
    nextRank: string,
  ) => `XP ${xp} (${rank}) -> ${nextXp} (${nextRank})`,
  REFILL_CONFIRM: "Confirm Refill",
  REFILL_CANCEL: "Cancel",
  refillSuccess: (delta: number, xpDelta: number) =>
    `Added $${delta} chips, ${Math.abs(xpDelta)} XP deducted.`,
  SELECTED: "selected",
} as const;

const DASHBOARD_RANK_LABELS: Record<string, string> = {
  rookie: "Rookie",
  spotter: "Spotter",
  pro: "Pro",
  ace: "Ace",
  shark: "Expert",
};

const DASHBOARD_SKIN_LABELS: Record<string, string> = {
  classic_red: "Classic Red",
  ocean_blue: "Ocean Blue",
  obsidian: "Obsidian",
  emerald: "Emerald",
  gold: "Gold",
};

export { DASHBOARD_TEXT, DASHBOARD_RANK_LABELS, DASHBOARD_SKIN_LABELS };
