const PLAY_PAGE_TEXT = {
  TITLE: "Card Counting Training",
  EXIT_SESSION: "Exit Session",
  OPEN_SETTINGS: "Open session settings",
  SETTINGS_ICON: "⚙",
  DEAL: "Deal",
  WAGER_TITLE: "Wager",
  WAGER_HELP:
    "A wager is auto-placed each round (minimum $25). You can change it before pressing Deal.",
  ACTIONS_TITLE: "Actions",
  CONFIRM_COUNT_CONTINUE: "Confirm count to continue",
  SESSION_SUMMARY: "Game Summary",
  RETURN_DASHBOARD: "Return to Dashboard",
  summaryGainLoss: (amount: number) =>
    `Gain/Loss: ${amount >= 0 ? "+" : ""}$${amount}`,
  summaryCountAccuracy: (pct: number) => `Count accuracy: ${pct}%`,
  summaryPlayAccuracy: (pct: number) => `Play accuracy: ${pct}%`,
  summaryRoundsPlayed: (count: number) => `Rounds played: ${count}`,
} as const;

export { PLAY_PAGE_TEXT };
