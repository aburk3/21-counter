import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DASHBOARD_TEXT } from "@/pages/Dashboard/constants";

import { renderWithProviders } from "@/test/test-utils";
import Dashboard from "@/pages/Dashboard";

vi.mock("@/hooks/useDashboard", () => ({
  useDashboard: () => ({
    loading: false,
    error: null,
    data: {
      correct_count_games: 3,
      total_games: 5,
      accuracy_pct: 60,
      strategy_correct_pct: 70,
      avg_decision_ms: 2200,
      current_rank: "spotter",
      xp: 210,
      chips: 640,
      current_streak: 2,
      best_streak: 5,
      xp_to_next_rank: 290,
      next_rank: "pro",
      rank_progress_pct: 12,
      available_skins: ["classic_red", "ocean_blue"],
      selected_skin: "ocean_blue",
    },
    message: null,
    refillChips: vi.fn(),
    selectSkin: vi.fn(),
  }),
}));

describe("Dashboard page", () => {
  it("renders dashboard metrics", () => {
    renderWithProviders(<Dashboard />);
    expect(screen.getByText(DASHBOARD_TEXT.TITLE)).toBeInTheDocument();
    expect(screen.getByText(DASHBOARD_TEXT.STATS.CORRECT_COUNT_GAMES)).toBeInTheDocument();
    expect(screen.getByText("$640")).toBeInTheDocument();
  });

  it("opens refill confirmation modal", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Dashboard />);
    await user.click(screen.getByRole("button", { name: DASHBOARD_TEXT.BANKROLL_BUTTON }));
    expect(
      screen.getByRole("heading", { name: DASHBOARD_TEXT.REFILL_CONFIRM_TITLE }),
    ).toBeInTheDocument();
  });
});
