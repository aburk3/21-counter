const DASHBOARD_TEXT = {
  TITLE: "Training Dashboard",
  PLAY: "Start Training",
  RESUME: "Resume Last Setup",
  PRACTICE: "Count Practice Lab",
  VIEW_STATS: "View Detailed Stats",
  DASHBOARD_UNAVAILABLE: "Dashboard unavailable",
  LOADING_DASHBOARD: "Loading dashboard...",
  HERO_SUBTITLE: "Master count discipline and decision speed.",
  KEY_METRICS: "Key Metrics",
  PROGRESSION: "Progression",
  XP: "XP",
  progressionToNext: (xp: number, nextRank: string | null) =>
    nextRank ? `${xp} XP to ${nextRank}` : "Top rank reached",
  UNLOCKS_TITLE: "Deck Unlocks",
  nextUnlock: (rank: string | null) =>
    rank ? `Next unlock at ${rank}` : "All deck skins unlocked",
  BANKROLL_TITLE: "Bankroll",
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
  PRACTICE_TITLE: "Practice Snapshot",
  PRACTICE_RECENT: "Recent Runs",
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
