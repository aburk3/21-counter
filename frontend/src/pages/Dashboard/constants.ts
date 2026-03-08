const DASHBOARD_TEXT = {
  TITLE: "Training Dashboard",
  PROFILE_SUBTITLE: "Focus on simulation reps and count drills.",
  RANK: "Rank",
  CHIPS: "Chips",
  REFILL_CHIPS: "Refill",
  PLAY: "Start Training",
  PRACTICE: "Count Practice Lab",
  RESUME: "Resume Last Setup",
  VIEW_STATS: "View Detailed Stats",
  DASHBOARD_UNAVAILABLE: "Dashboard unavailable",
  LOADING_DASHBOARD: "Loading dashboard...",
  XP: "XP",
  progressionToNext: (xp: number, nextRank: string | null) =>
    nextRank ? `${xp} XP to ${nextRank}` : "Top rank reached",
  SECONDARY_ACTIONS: "More options",
  UNLOCKS_TITLE: "Deck Unlocks",
  nextUnlock: (rank: string | null) =>
    rank ? `Next unlock at ${rank}` : "All deck skins unlocked",
  REFILL_CONFIRM_TITLE: "Confirm Refill",
  REFILL_CONFIRM_MESSAGE: "Refilling chips costs 75 XP and may reduce rank progress.",
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
