const RANK_BADGE_TEXT = {
  PREFIX: "Rank:",
} as const;

const RANK_LABELS: Record<string, string> = {
  rookie: "Rookie",
  spotter: "Spotter",
  pro: "Pro",
  ace: "Ace",
  shark: "Expert",
};

export { RANK_BADGE_TEXT, RANK_LABELS };
