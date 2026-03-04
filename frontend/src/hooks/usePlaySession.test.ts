import { act, renderHook } from "@testing-library/react";

import { usePlaySession } from "@/hooks/usePlaySession";
import type { PlayState } from "@/types/api";

const baseState: PlayState = {
  running_count: 0,
  round_number: 1,
  current_bet: 25,
  round_ready_for_submission: false,
  active_round: null,
};

const { mockApi } = vi.hoisted(() => ({
  mockApi: {
    createSession: vi.fn(),
    bet: vi.fn(),
    deal: vi.fn(),
    action: vi.fn(),
    submitCount: vi.fn(),
    nextRound: vi.fn(),
    exitSession: vi.fn(),
  },
}));

vi.mock("@/lib/api", () => ({
  api: mockApi,
}));

describe("usePlaySession", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("keeps chips and gain/loss server-authoritative across rounds", async () => {
    mockApi.createSession.mockResolvedValue({
      session_id: 7,
      status: "active",
      state: baseState,
      chips_balance: 500,
      session_gain_loss: 0,
    });
    mockApi.bet
      .mockResolvedValueOnce({
        state: baseState,
        chips_balance: 500,
        session_gain_loss: 0,
      })
      .mockResolvedValueOnce({
        state: { ...baseState, round_number: 2 },
        chips_balance: 550,
        session_gain_loss: 50,
      });
    mockApi.submitCount.mockResolvedValue({
      is_correct: true,
      actual_running_count: 2,
      round_time_ms: 8500,
      strategy_correct: true,
      played_action: "stand",
      correct_action: "stand",
      chips_balance: 550,
      session_gain_loss: 50,
    });
    mockApi.nextRound.mockResolvedValue({
      session_complete: false,
      state: { ...baseState, round_number: 2 },
      chips_balance: 550,
      session_gain_loss: 50,
    });

    const { result } = renderHook(() => usePlaySession());

    await act(async () => {
      await result.current.createSession({ decks_per_shoe: 6, hands_dealt: 3 });
    });
    expect(result.current.chips).toBe(500);
    expect(result.current.gainLoss).toBe(0);

    await act(async () => {
      await result.current.submitCount(2);
    });
    expect(result.current.chips).toBe(550);
    expect(result.current.gainLoss).toBe(50);

    await act(async () => {
      await result.current.nextRound();
    });
    expect(result.current.chips).toBe(550);
    expect(result.current.gainLoss).toBe(50);
    expect(mockApi.bet).toHaveBeenCalledTimes(2);
  });
});
