import userEvent from "@testing-library/user-event";
import { screen, waitFor } from "@testing-library/react";
import { ACTION_LABELS } from "@/components/ActionPanel/constants";
import { SETUP_DIALOG_TEXT } from "@/components/SetupDialog/constants";

import Play from "@/pages/Play";
import { PLAY_PAGE_TEXT } from "@/pages/Play/constants";
import { renderWithProviders } from "@/test/test-utils";
import type { PlayState } from "@/types/api";

type MockSessionState = {
  state: PlayState | null;
  chips: number;
  feedback: {
    is_correct: boolean;
    actual_running_count: number;
    round_time_ms: number;
    strategy_correct: boolean;
    played_action: string;
    correct_action: string;
  } | null;
  selectedSkin: string;
  showCountDialog: boolean;
  showResolvedOverlay: boolean;
  isDealing: boolean;
  sessionComplete: boolean;
  sessionSummary: {
    gainLoss: number;
    countAccuracyPct: number;
    playAccuracyPct: number;
    totalRounds: number;
  } | null;
  gainLoss: number;
  error: string | null;
  timerMs: number;
  totalUserBet: number;
  createSession: ReturnType<typeof vi.fn>;
  placeBet: ReturnType<typeof vi.fn>;
  deal: ReturnType<typeof vi.fn>;
  action: ReturnType<typeof vi.fn>;
  submitCount: ReturnType<typeof vi.fn>;
  nextRound: ReturnType<typeof vi.fn>;
  exitSession: ReturnType<typeof vi.fn>;
  setSelectedSkin: ReturnType<typeof vi.fn>;
  setShowCountDialog: ReturnType<typeof vi.fn>;
};

const mockSession: MockSessionState = {
  state: null,
  chips: 500,
  feedback: null,
  selectedSkin: "classic_red",
  showCountDialog: false,
  showResolvedOverlay: false,
  isDealing: false,
  sessionComplete: false,
  sessionSummary: null,
  gainLoss: 0,
  error: null,
  timerMs: 0,
  totalUserBet: 0,
  createSession: vi.fn(),
  placeBet: vi.fn(),
  deal: vi.fn(),
  action: vi.fn(),
  submitCount: vi.fn(),
  nextRound: vi.fn(),
  exitSession: vi.fn(),
  setSelectedSkin: vi.fn(),
  setShowCountDialog: vi.fn(),
};

vi.mock("@/lib/api", async () => {
  const original = await vi.importActual<typeof import("@/lib/api")>("@/lib/api");
  return {
    ...original,
    api: {
      me: vi.fn().mockResolvedValue({
        settings: {
          default_decks_per_shoe: 6,
          default_hands_dealt: 3,
          selected_deck_skin: "classic_red",
        },
      }),
    },
  };
});

vi.mock("@/hooks/usePlaySession", () => ({
  usePlaySession: () => mockSession,
}));

describe("Play page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSession.showResolvedOverlay = false;
  });

  it("starts using saved defaults without opening setup dialog", async () => {
    renderWithProviders(<Play />);

    expect(screen.queryByText(SETUP_DIALOG_TEXT.TITLE)).not.toBeInTheDocument();
    await waitFor(() => {
      expect(mockSession.createSession).toHaveBeenCalledWith({
        decks_per_shoe: 6,
        hands_dealt: 3,
      });
    });
  });

  it("shows round-end confirm button before count dialog", async () => {
    mockSession.showResolvedOverlay = true;
    renderWithProviders(<Play />);
    expect(
      screen.getByRole("button", { name: PLAY_PAGE_TEXT.CONFIRM_COUNT_CONTINUE }),
    ).toBeInTheDocument();
    await waitFor(() => {
      expect(mockSession.setSelectedSkin).toHaveBeenCalled();
    });
    mockSession.showResolvedOverlay = false;
  });

  it("opens setup dialog from settings icon", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Play />);

    await user.click(
      screen.getByRole("button", { name: PLAY_PAGE_TEXT.OPEN_SETTINGS }),
    );
    expect(screen.getByText(SETUP_DIALOG_TEXT.TITLE)).toBeInTheDocument();
  });

  it("shows actions only during user_turn phase", async () => {
    mockSession.state = {
      running_count: 0,
      round_number: 1,
      current_bet: 25,
      round_ready_for_submission: false,
      active_round: {
        user_hands: [
          { cards: ["9H", "7C"], bet: 25, total: 16, status: "in_play", result: "" },
        ],
        dealer_hand: ["6S", "8D"],
        dealer_total: 14,
        dealer_status: "in_play",
        other_hands: [],
        active_hand_index: 0,
        phase: "other_turns",
        resolved: false,
        result: "push",
        chips_delta: 0,
        started_at_ms: 1,
        legal_actions: ["hit", "stand"],
      },
    };
    renderWithProviders(<Play />);
    await waitFor(() => {
      expect(mockSession.setSelectedSkin).toHaveBeenCalled();
    });
    expect(
      screen.queryByRole("button", { name: ACTION_LABELS.hit }),
    ).not.toBeInTheDocument();
    if (mockSession.state?.active_round) {
      mockSession.state.active_round.phase = "user_turn";
    }
  });
});
