import { useMemo, useState } from "react";

import { api } from "@/lib/api";
import type { PlayState } from "@/types/api";

type SetupInput = {
  decks_per_shoe: number;
  hands_dealt: number;
};

const usePlaySession = () => {
  const MIN_BET = 25;
  const [preferredBet, setPreferredBet] = useState<number>(MIN_BET);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [state, setState] = useState<PlayState | null>(null);
  const [chips, setChips] = useState<number>(500);
  const [sessionGainLoss, setSessionGainLoss] = useState<number>(0);
  const [selectedSkin, setSelectedSkin] = useState<string>("classic_red");
  const [showCountDialog, setShowCountDialog] = useState(false);
  const [isDealing, setIsDealing] = useState(false);
  const [feedback, setFeedback] = useState<{
    is_correct: boolean;
    actual_running_count: number;
    round_time_ms: number;
    strategy_correct: boolean;
    played_action: string;
    correct_action: string;
  } | null>(null);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [sessionSummary, setSessionSummary] = useState<{
    gainLoss: number;
    countAccuracyPct: number;
    playAccuracyPct: number;
    totalRounds: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const applyBankroll = (chipsBalance: number, gainLoss: number) => {
    setChips(chipsBalance);
    setSessionGainLoss(gainLoss);
  };

  const createSession = async (payload: SetupInput) => {
    setError(null);
    try {
      if (sessionId) {
        try {
          await api.exitSession(sessionId);
        } catch {
          // Continue creating a fresh session even if prior session close fails.
        }
      }
      const response = await api.createSession({
        ...payload,
        shoes_per_session: 1,
      });
      const sid = response.session_id;
      let nextState = response.state;
      let nextChips = response.chips_balance;
      let nextGain = response.session_gain_loss;

      try {
        const wager = await api.bet(sid, preferredBet);
        nextState = wager.state;
        nextChips = wager.chips_balance;
        nextGain = wager.session_gain_loss;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to place minimum bet");
      }

      setSessionId(sid);
      setState(nextState);
      applyBankroll(nextChips, nextGain);
      setSessionComplete(false);
      setFeedback(null);
      setSessionSummary(null);
      setShowCountDialog(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start session");
    }
  };

  const placeBet = async (amount: number) => {
    if (!sessionId) return;
    setError(null);
    try {
      const response = await api.bet(sessionId, amount);
      setState(response.state);
      applyBankroll(response.chips_balance, response.session_gain_loss);
      setPreferredBet(amount);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to place bet");
    }
  };

  const deal = async () => {
    if (!sessionId || isDealing) return;
    setError(null);
    setIsDealing(true);
    try {
      const response = await api.deal(sessionId);
      setState(response.state);
      applyBankroll(response.chips_balance, response.session_gain_loss);
      setShowCountDialog(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Deal failed";
      if (!message.includes("Round already active")) {
        setError(message);
      }
    } finally {
      setIsDealing(false);
    }
  };

  const action = async (nextAction: "hit" | "stand" | "split" | "double") => {
    if (!sessionId) return;
    setError(null);
    try {
      const response = await api.action(sessionId, nextAction);
      setState(response.state);
      applyBankroll(response.chips_balance, response.session_gain_loss);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Action failed");
    }
  };

  const submitCount = async (running_count: number) => {
    if (!sessionId) return;
    setError(null);
    try {
      const response = await api.submitCount(sessionId, running_count);
      setFeedback(response);
      applyBankroll(response.chips_balance, response.session_gain_loss);
      setShowCountDialog(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed");
    }
  };

  const nextRound = async () => {
    if (!sessionId) return;
    setError(null);
    setFeedback(null);
    setShowCountDialog(false);
    try {
      const response = await api.nextRound(sessionId);
      setSessionComplete(response.session_complete);
      applyBankroll(response.chips_balance, response.session_gain_loss);
      if (response.state && !response.session_complete) {
        try {
          const wager = await api.bet(sessionId, preferredBet);
          setState(wager.state);
          applyBankroll(wager.chips_balance, wager.session_gain_loss);
        } catch (err) {
          setState(response.state);
          setError(err instanceof Error ? err.message : "Unable to place minimum bet");
        }
      } else if (response.state) {
        setState(response.state);
      }
      if (response.session_complete) {
        if (response.summary) {
          setSessionSummary({
            gainLoss: response.summary.gain_loss,
            countAccuracyPct: response.summary.count_accuracy_pct,
            playAccuracyPct: response.summary.play_accuracy_pct,
            totalRounds: response.summary.total_rounds,
          });
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to continue");
    }
  };

  const exitSession = async () => {
    if (!sessionId) return;
    const response = await api.exitSession(sessionId);
    setSessionComplete(true);
    applyBankroll(response.chips_balance, response.session_gain_loss);
    setSessionSummary({
      gainLoss: response.session_gain_loss,
      countAccuracyPct: 0,
      playAccuracyPct: 0,
      totalRounds: 0,
    });
    setShowCountDialog(false);
  };

  const timerMs = useMemo(() => {
    if (!state?.active_round) return 0;
    const ended = state.active_round.ended_at_ms ?? Date.now();
    return Math.max(ended - state.active_round.started_at_ms, 0);
  }, [state]);
  const showResolvedOverlay = Boolean(
    state?.round_ready_for_submission && !feedback && !showCountDialog
  );

  return {
    sessionId,
    state,
    chips,
    feedback,
    selectedSkin,
    showCountDialog,
    showResolvedOverlay,
    sessionComplete,
    sessionSummary,
    gainLoss: sessionGainLoss,
    isDealing,
    error,
    timerMs,
    createSession,
    placeBet,
    deal,
    action,
    submitCount,
    nextRound,
    exitSession,
    setSelectedSkin,
    setShowCountDialog,
  };
};

export { usePlaySession };
