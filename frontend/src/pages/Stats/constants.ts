const STATS_TEXT = {
  TITLE: "Detailed Stats",
  SUBTITLE: "Full performance and progression metrics.",
  DASHBOARD: "Back To Dashboard",
  PERFORMANCE: "Performance",
  PROGRESSION: "Progression",
  PRACTICE: "Practice Analytics",
  RECENT_RUNS: "Recent Practice Runs",
  EMPTY_RUNS: "No practice runs yet.",
  CURRENT_RANK: "Current Rank",
  NEXT_UNLOCK: "Next unlock",
  nextUnlock: (rank: string | null) => (rank ? rank : "All skins unlocked"),
  practiceRunLabel: (mode: string, speed: string, decks: number) =>
    `${decks}D ${mode === "auto" ? "Auto" : "Manual"} ${speed === "expert" ? "Expert" : speed === "intermediate" ? "Intermediate" : "Beginner"}`,
  practiceRunResult: (isCorrect: boolean, xpDelta: number) => `${isCorrect ? "Correct" : "Incorrect"} • XP +${xpDelta}`,
} as const;

export { STATS_TEXT };
