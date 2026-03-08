import { screen } from "@testing-library/react";

import Stats from "@/pages/Stats";
import { STATS_TEXT } from "@/pages/Stats/constants";
import { renderWithProviders } from "@/test/test-utils";

vi.mock("@/hooks/useDashboard", () => ({
  useDashboard: () => ({
    loading: false,
    error: null,
    email: "trainer@example.com",
    data: {
      correct_count_games: 7,
      total_games: 12,
      accuracy_pct: 76.1,
      strategy_correct_pct: 74,
      avg_decision_ms: 4800,
      current_rank: "pro",
      xp: 560,
      chips: 920,
      current_streak: 4,
      best_streak: 8,
      strategy_correct_count: 0,
      correct_count_submissions: 0,
      total_rounds: 0,
      xp_to_next_rank: 440,
      next_rank: "ace",
      rank_progress_pct: 55,
      available_skins: ["classic_red", "ocean_blue", "obsidian"],
      selected_skin: "obsidian",
      practice_total_runs: 6,
      practice_correct_runs: 5,
      practice_accuracy_pct: 83.3,
      practice_avg_ms_per_deck: 36500,
      practice_best_streak: 4,
      practice_recent_runs: [
        {
          id: 1,
          created_at: "2026-03-05T00:00:00Z",
          decks: 2,
          mode: "manual",
          speed_tier: "intermediate",
          duration_ms: 64000,
          is_correct: true,
          count_delta: 0,
          xp_delta: 15,
        },
      ],
    },
  }),
}));

describe("Stats page", () => {
  it("renders detail sections and metrics", () => {
    renderWithProviders(<Stats />);
    expect(screen.getByText(STATS_TEXT.TITLE)).toBeInTheDocument();
    expect(screen.getByText(STATS_TEXT.PERFORMANCE)).toBeInTheDocument();
    expect(screen.getByText("Correct Count Sessions")).toBeInTheDocument();
    expect(screen.getByText("Count Accuracy")).toBeInTheDocument();
    expect(screen.getByText(STATS_TEXT.PRACTICE_SNAPSHOT)).toBeInTheDocument();
    expect(screen.getByText(STATS_TEXT.RECENT_RUNS)).toBeInTheDocument();
  });
});
