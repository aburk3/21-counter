const DASHBOARD_TEXT = {
  TITLE: "Training Dashboard",
  PLAY: "Start Training",
  RESUME: "Resume Last Setup",
  PRACTICE: "Count Practice Lab",
  DASHBOARD_UNAVAILABLE: "Dashboard unavailable",
  LOADING_DASHBOARD: "Loading dashboard...",
  HERO_SUBTITLE: "Master count discipline and decision speed.",
  STATS: {
    CORRECT_COUNT_GAMES: "Correct Count Sessions",
    COUNT_ACCURACY: "Count Accuracy",
    STRATEGY_CORRECT: "Strategy Accuracy",
    AVG_TIME: "Avg Decision Time",
    CURRENT_STREAK: "Current Streak",
    XP: "XP",
    CHIPS: "Chips",
    TOTAL_SESSIONS: "Sessions",
    PRACTICE_ACCURACY: "Practice Accuracy",
    PRACTICE_AVG: "Practice Avg / Deck",
    PRACTICE_STREAK: "Practice Best Streak",
  },
  PROGRESSION_TITLE: "Progression",
  progressionToNext: (xp: number, nextRank: string | null) =>
    nextRank ? `${xp} XP to ${nextRank}` : "Top rank reached",
  HOW_TO_RANK_UP:
    "Earn XP with correct counts (+20), strategy correctness (+10), and speed bonus (+5 under 10s).",
  UNLOCKS_TITLE: "Deck Unlocks",
  nextUnlock: (rank: string | null) =>
    rank ? `Next unlock at ${rank}` : "All deck skins unlocked",
  BANKROLL_TITLE: "Bankroll Refill",
  BANKROLL_WARNING: "Refilling chips costs 75 XP and may reduce rank progress.",
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
  PRACTICE_TITLE: "Practice Progress",
  PRACTICE_RECENT: "Recent Runs",
  practiceMode: (mode: string) => (mode === "auto" ? "Auto" : "Manual"),
  practiceSpeed: (speed: string) =>
    speed === "expert" ? "Expert" : speed === "intermediate" ? "Intermediate" : "Beginner",
  practiceRunLabel: (mode: string, speed: string, decks: number) =>
    `${decks}D ${mode === "auto" ? "Auto" : "Manual"} ${speed === "expert" ? "Expert" : speed === "intermediate" ? "Intermediate" : "Beginner"}`,
  practiceRunResult: (isCorrect: boolean, xpDelta: number) =>
    `${isCorrect ? "Correct" : "Incorrect"} • XP +${xpDelta}`,
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
