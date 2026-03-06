import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/react";

import Practice from "@/pages/Practice";
import { PRACTICE_TEXT } from "@/pages/Practice/constants";
import { renderWithProviders } from "@/test/test-utils";

const mockHook = {
  setup: { decks: 2, mode: "manual" as const, speed_tier: "intermediate" as const },
  setSetup: vi.fn(),
  stage: "running" as const,
  run: {
    run_id: 1,
    decks: 2,
    mode: "manual" as const,
    speed_tier: "intermediate" as const,
    target_duration_ms: 120000,
    hidden_cards_count: 6,
    visible_cards_count: 98,
    visible_cards: ["AS", "2D"],
    started_at: "2026-03-05T00:00:00Z",
  },
  result: null,
  revealedCount: 0,
  activeCard: null,
  elapsedMs: 1200,
  submitting: false,
  error: null,
  canReveal: true,
  startRun: vi.fn(),
  revealNext: vi.fn(),
  submitCount: vi.fn(),
  reset: vi.fn(),
};

vi.mock("@/hooks/usePracticeSession", () => ({
  usePracticeSession: () => mockHook,
}));

describe("Practice page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders practice controls and hint", () => {
    renderWithProviders(<Practice />);
    expect(screen.getByText(PRACTICE_TEXT.TITLE)).toBeInTheDocument();
    expect(screen.getByText(PRACTICE_TEXT.HIDDEN_HINT)).toBeInTheDocument();
    expect(screen.getByText(PRACTICE_TEXT.MANUAL_HINT)).toBeInTheDocument();
  });

  it("reveals next card on deck click in manual mode", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Practice />);
    await user.click(screen.getByTestId("deck-area"));
    expect(mockHook.revealNext).toHaveBeenCalled();
  });
});
