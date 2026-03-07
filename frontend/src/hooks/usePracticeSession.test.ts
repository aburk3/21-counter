import { act, renderHook } from "@testing-library/react";

import { usePracticeSession } from "@/hooks/usePracticeSession";

const { mockApi } = vi.hoisted(() => ({
  mockApi: {
    startPracticeRun: vi.fn(),
    submitPracticeRun: vi.fn(),
  },
}));

vi.mock("@/lib/api", () => ({
  api: mockApi,
}));

describe("usePracticeSession", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("auto mode reveals cards and moves to submit state", async () => {
    mockApi.startPracticeRun.mockResolvedValue({
      run_id: 8,
      decks: 1,
      mode: "auto",
      speed_tier: "expert",
      target_duration_ms: 200,
      hidden_cards_count: 3,
      visible_cards_count: 2,
      visible_cards: ["AS", "2D"],
      started_at: "2026-03-05T12:00:00Z",
    });

    const { result } = renderHook(() => usePracticeSession());

    await act(async () => {
      await result.current.startRun();
    });

    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(result.current.revealedCount).toBe(2);
    expect(result.current.stage).toBe("awaiting_submit");
  });

  it("manual mode reveals on space key", async () => {
    mockApi.startPracticeRun.mockResolvedValue({
      run_id: 9,
      decks: 1,
      mode: "manual",
      speed_tier: "beginner",
      target_duration_ms: 90000,
      hidden_cards_count: 3,
      visible_cards_count: 2,
      visible_cards: ["KH", "4C"],
      started_at: "2026-03-05T12:00:00Z",
    });

    const { result } = renderHook(() => usePracticeSession());

    await act(async () => {
      await result.current.startRun();
    });
    expect(result.current.canReveal).toBe(true);

    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { code: "Space" }));
    });
    expect(result.current.revealedCount).toBe(1);
  });

  it("pauses and resumes auto reveal progression", async () => {
    mockApi.startPracticeRun.mockResolvedValue({
      run_id: 11,
      decks: 1,
      mode: "auto",
      speed_tier: "beginner",
      target_duration_ms: 2400,
      hidden_cards_count: 3,
      visible_cards_count: 4,
      visible_cards: ["AS", "2D", "3C", "4H"],
      started_at: "2026-03-05T12:00:00Z",
    });

    const { result } = renderHook(() => usePracticeSession());

    await act(async () => {
      await result.current.startRun();
    });

    act(() => {
      vi.advanceTimersByTime(100);
    });
    const beforePause = result.current.revealedCount;

    act(() => {
      result.current.pause();
    });

    act(() => {
      vi.advanceTimersByTime(800);
    });
    expect(result.current.isPaused).toBe(true);
    expect(result.current.revealedCount).toBe(beforePause);

    act(() => {
      result.current.resume();
    });
    act(() => {
      vi.advanceTimersByTime(700);
    });
    expect(result.current.revealedCount).toBeGreaterThan(beforePause);
  });

  it("submits and resolves run feedback", async () => {
    mockApi.startPracticeRun.mockResolvedValue({
      run_id: 10,
      decks: 1,
      mode: "manual",
      speed_tier: "intermediate",
      target_duration_ms: 60000,
      hidden_cards_count: 3,
      visible_cards_count: 1,
      visible_cards: ["7S"],
      started_at: "2026-03-05T12:00:00Z",
    });
    mockApi.submitPracticeRun.mockResolvedValue({
      run_id: 10,
      is_correct: true,
      actual_running_count: 1,
      submitted_running_count: 1,
      count_delta: 0,
      duration_ms: 20000,
      duration_per_deck_ms: 20000,
      xp_delta: 15,
      xp: 100,
      rank: "rookie",
      hidden_cards: ["AS", "KH", "QC"],
      hidden_total_count: -3,
    });

    const { result } = renderHook(() => usePracticeSession());

    await act(async () => {
      await result.current.startRun();
    });
    act(() => {
      result.current.revealNext();
    });
    expect(result.current.stage).toBe("awaiting_submit");

    await act(async () => {
      await result.current.submitCount(1);
    });
    expect(result.current.stage).toBe("resolved");
    expect(result.current.result?.xp_delta).toBe(15);
  });
});
