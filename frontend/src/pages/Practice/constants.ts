const PRACTICE_TEXT = {
  TITLE: "Count Practice Lab",
  SUBTITLE: "Flip cards, hold your Hi-Lo running count, then submit your final number.",
  DASHBOARD: "Back to Dashboard",
  OPEN_SETTINGS: "Open practice settings",
  SETTINGS_ICON: "⚙",
  PAUSE: "Pause",
  RESUME: "Resume",
  START_RUN: "Start Run",
  RESET: "New Run",
  SUBMIT: "Submit Count",
  RUNNING_COUNT_LABEL: "Your Final Running Count",
  RUNNING_COUNT_PLACEHOLDER: "Enter count",
  MANUAL_HINT: "Manual mode: click the deck or press Space to reveal the next card.",
  HIDDEN_HINT: "Each deck starts with 3 hidden cards.",
  DECKS: "Decks",
  MODE: "Mode",
  SPEED: "Speed",
  SETTINGS_TITLE: "Practice Settings",
  SETTINGS_SAVE: "Done",
  SETTINGS_CANCEL: "Close",
  SETTINGS_HINT: "Settings apply to your next run.",
  PROGRESS: (seen: number, total: number) => `Progress ${seen}/${total}`,
  TIMER: (ms: number) => `Timer ${(ms / 1000).toFixed(2)}s`,
  CORRECT_TITLE: "Perfect count discipline.",
  INCORRECT_TITLE: "Close the gap and run it again.",
  RESULT_CORRECT: "Count Correct",
  RESULT_INCORRECT: "Count Incorrect",
  XP: (xp: number) => `XP +${xp}`,
  ACTUAL: (count: number) => `Actual count: ${count}`,
  SUBMITTED: (count: number) => `Your count: ${count}`,
  HIDDEN_EXPLAIN:
    "Hidden starter cards shift the visible running count. Include them and the full-shoe count returns to zero.",
  PACE_BADGE: (ms: number) => {
    if (ms <= 30000) return "Expert Pace";
    if (ms <= 60000) return "Intermediate Pace";
    if (ms <= 90000) return "Beginner Pace";
    return "Steady Pace";
  },
} as const;

export { PRACTICE_TEXT };
