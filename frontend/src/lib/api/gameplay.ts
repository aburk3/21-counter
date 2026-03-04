import type { PlayState } from "@/types/api";

import { request } from "./client";

const createSession = (payload: {
  decks_per_shoe: number;
  hands_dealt: number;
  shoes_per_session?: number;
}) =>
  request<{
    session_id: number;
    status: string;
    state: PlayState;
    chips_balance: number;
    session_gain_loss: number;
  }>("/sessions", {
    method: "POST",
    body: JSON.stringify(payload),
  });

const getSession = (sessionId: number) =>
  request<{
    session_id: number;
    status: string;
    state: PlayState;
    chips_balance: number;
    session_gain_loss: number;
  }>(
    `/sessions/${sessionId}`,
  );

const bet = (sessionId: number, amount: number) =>
  request<{
    state: PlayState;
    chips_balance: number;
    session_gain_loss: number;
  }>(`/sessions/${sessionId}/bet`, {
    method: "POST",
    body: JSON.stringify({ amount }),
  });

const deal = (sessionId: number) =>
  request<{
    state: PlayState;
    chips_balance: number;
    session_gain_loss: number;
  }>(`/sessions/${sessionId}/deal`, { method: "POST" });

const action = (
  sessionId: number,
  nextAction: "hit" | "stand" | "split" | "double",
) =>
  request<{
    state: PlayState;
    chips_balance: number;
    session_gain_loss: number;
  }>(`/sessions/${sessionId}/action`, {
    method: "POST",
    body: JSON.stringify({ action: nextAction }),
  });

const submitCount = (sessionId: number, running_count: number) =>
  request<{
    is_correct: boolean;
    actual_running_count: number;
    round_time_ms: number;
    strategy_correct: boolean;
    played_action: string;
    correct_action: string;
    chips_balance: number;
    session_gain_loss: number;
    xp: number;
    rank: string;
  }>(`/sessions/${sessionId}/round/submit-count`, {
    method: "POST",
    body: JSON.stringify({ running_count }),
  });

const nextRound = (sessionId: number) =>
  request<{
    status: string;
    session_complete: boolean;
    chips_balance: number;
    session_gain_loss: number;
    state?: PlayState;
    summary?: {
      gain_loss: number;
      count_accuracy_pct: number;
      play_accuracy_pct: number;
      total_rounds: number;
    };
  }>(`/sessions/${sessionId}/next-round`, { method: "POST" });

const exitSession = (sessionId: number) =>
  request<{
    status: string;
    chips_balance: number;
    session_gain_loss: number;
  }>(`/sessions/${sessionId}/exit`, { method: "POST" });

export {
  createSession,
  getSession,
  bet,
  deal,
  action,
  submitCount,
  nextRound,
  exitSession,
};
