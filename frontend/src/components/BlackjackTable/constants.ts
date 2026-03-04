const TABLE_TEXT = {
  DEAL: "Deal",
  DEALER: "Dealer",
  YOUR_HAND: "Your Hand",
  YOU_ACTIVE: "You (active)",
  TABLE_SEATS: "Table Seats",
  TABLE_BET: "Table Bet",
  computerSeat: (index: number) => `Computer Seat ${index + 1}`,
  timer: (ms: number) => `Time ${(ms / 1000).toFixed(2)}s`,
  chips: (chips: number) => `Chips: $${chips}`,
  yourBet: (amount: number) => `Your bet: $${amount}`,
  yourGainLoss: (amount: number) =>
    `Your gain/loss: ${amount >= 0 ? "+" : ""}$${amount}`,
} as const;

const HAND_STATUS_LABELS: Record<string, string> = {
  bust: "BUST",
  twenty_one: "21",
  blackjack: "BLACKJACK",
  win: "WIN",
  loss: "LOSS",
  push: "PUSH",
};

export { TABLE_TEXT, HAND_STATUS_LABELS };
