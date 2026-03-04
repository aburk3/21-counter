const ROUND_SUMMARY_TEXT = {
  TITLE: "Hand Complete",
  RUNNING_COUNT_LABEL: "Running Count",
  RUNNING_COUNT_PLACEHOLDER: "Enter your running count",
  SUBMIT_COUNT: "Submit Count",
  NEXT_ROUND: "Next Round",
  COUNT_CORRECT: "Count Correct",
  COUNT_INCORRECT: "Count Incorrect",
  STRATEGY_CORRECT: "Basic Strategy: Correct",
  EXIT_SESSION: "Exit Session",
  actualCount: (count: number) => `Actual Count: ${count}`,
  roundTime: (ms: number) => `Time: ${(ms / 1000).toFixed(2)}s`,
  strategyIncorrect: (played: string, expected: string) =>
    `Played ${played}, should ${expected}`,
} as const;

export { ROUND_SUMMARY_TEXT };
