const PLAY_PAGE_TEXT = {
  TITLE: "Card Counting Training",
  EXIT_SESSION: "Exit Session",
  OPEN_SETTINGS: "Open session settings",
  SETTINGS_ICON: "⚙",
  DEAL: "Deal",
  WAGER_TITLE: "Bet",
  WAGER_HELP:
    "Minimum wager is $25. Increase or decrease before dealing as long as chips are available.",
  ACTIONS_TITLE: "Actions",
  CONFIRM_COUNT_CONTINUE: "Confirm count to continue",
  SESSION_SUMMARY: "Session Summary",
  RETURN_DASHBOARD: "Return to Dashboard",
  PLAY_AGAIN: "Play Again",
  CHANGE_SETUP: "Change Session Setup",
  SESSION_PROGRESS: (round: number) => `Round ${round}`,
  ROUND_STATUS: {
    WAITING: "Waiting to deal",
    USER_TURN: "Your decision",
    TABLE_TURN: "Table resolving",
    READY_SUBMIT: "Submit running count",
  },
  HINT_STRATEGY: "Adaptive Coach: your last hand missed basic strategy. Slow down and confirm dealer up-card first.",
  HINT_COUNT: "Adaptive Coach: your running count was off. Re-anchor from the previous resolved round before acting.",
  HINT_PACE: "Adaptive Coach: you are losing pace. Keep decisions under 10 seconds when possible.",
  summaryGainLoss: (amount: number) => `Gain/Loss: ${amount >= 0 ? "+" : ""}$${amount}`,
  summaryCountAccuracy: (pct: number) => `Count accuracy: ${pct}%`,
  summaryPlayAccuracy: (pct: number) => `Play accuracy: ${pct}%`,
  summaryRoundsPlayed: (count: number) => `Rounds played: ${count}`,
} as const;

export { PLAY_PAGE_TEXT };
