const formatAction = (action: string) => {
  const normalized = action.trim().toLowerCase();
  if (normalized === "hit") return "hit";
  if (normalized === "stand") return "stand";
  if (normalized === "split") return "split";
  if (normalized === "double") return "double";
  return action.trim() || "unknown";
};

const ROUND_SUMMARY_TEXT = {
  TITLE: "Hand Complete",
  RUNNING_COUNT_LABEL: "Running Count",
  RUNNING_COUNT_PLACEHOLDER: "Enter your running count",
  SUBMIT_COUNT: "Submit Count",
  NEXT_ROUND: "Next Round",
  REVIEW_HAND: "Review Hand",
  COUNT_CORRECT: "Correct",
  COUNT_INCORRECT: "Needs Work",
  STRATEGY_CORRECT: "Correct",
  STRATEGY_INCORRECT: "Needs Work",
  EXIT_SESSION: "Exit Session",
  COUNT_BLOCK: "Your Count",
  DECISION_BLOCK: "Decision Quality",
  PACE_BLOCK: "Pace",
  STRATEGY_REVIEW_HINT: "One or more decisions deviated from basic strategy.",
  yourCount: (count: string) => `Your Count: ${count}`,
  actualCount: (count: number) => `Actual Count: ${count}`,
  roundTime: (ms: number) => `Time: ${(ms / 1000).toFixed(2)}s`,
  speedRating: (ms: number) => (ms <= 10000 ? "Pace: Strong" : "Pace: Slow"),
  formatAction,
  strategyIncorrect: (played: string, expected: string) =>
    `Played ${formatAction(played)}, should ${formatAction(expected)}`,
} as const;

export { ROUND_SUMMARY_TEXT };
