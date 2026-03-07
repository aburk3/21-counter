import { useCallback, useEffect, useMemo, useState } from "react";

import { api } from "@/lib/api";
import type {
  PracticeMode,
  PracticeRunStartResponse,
  PracticeRunSubmitResponse,
  PracticeSpeedTier,
} from "@/types/api";

type PracticeStage = "idle" | "running" | "awaiting_submit" | "resolved";

type PracticeSetup = {
  decks: number;
  mode: PracticeMode;
  speed_tier: PracticeSpeedTier;
};

const DEFAULT_SETUP: PracticeSetup = {
  decks: 1,
  mode: "auto",
  speed_tier: "beginner",
};

const usePracticeSession = () => {
  const [setup, setSetup] = useState<PracticeSetup>(DEFAULT_SETUP);
  const [stage, setStage] = useState<PracticeStage>("idle");
  const [run, setRun] = useState<PracticeRunStartResponse | null>(null);
  const [result, setResult] = useState<PracticeRunSubmitResponse | null>(null);
  const [revealedCount, setRevealedCount] = useState(0);
  const [startMs, setStartMs] = useState<number | null>(null);
  const [elapsedOffsetMs, setElapsedOffsetMs] = useState(0);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const revealNext = useCallback(() => {
    if (isPaused) return;
    setRevealedCount((prev) => {
      const maxCards = run?.visible_cards.length ?? 0;
      if (prev >= maxCards) return prev;
      if (run?.mode === "manual" && prev === 0) {
        setStartMs(Date.now());
      }
      const next = prev + 1;
      if (next >= maxCards) {
        const finalElapsed = elapsedOffsetMs + (startMs !== null ? Date.now() - startMs : 0);
        setStage("awaiting_submit");
        setElapsedMs(finalElapsed);
      }
      return next;
    });
  }, [elapsedOffsetMs, isPaused, run?.visible_cards.length, run?.mode, startMs]);

  const startRun = async () => {
    setError(null);
    setResult(null);
    setElapsedMs(0);
    setElapsedOffsetMs(0);
    setRevealedCount(0);
    setStartMs(null);
    setIsPaused(false);
    try {
      const response = await api.startPracticeRun(setup);
      setRun(response);
      setStage("running");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to start practice run");
    }
  };

  const submitCount = async (running_count: number) => {
    if (!run) return;
    setSubmitting(true);
    setError(null);
    try {
      const response = await api.submitPracticeRun(run.run_id, running_count);
      setResult(response);
      setStage("resolved");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to submit count");
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setRun(null);
    setResult(null);
    setRevealedCount(0);
    setStartMs(null);
    setElapsedOffsetMs(0);
    setElapsedMs(0);
    setIsPaused(false);
    setError(null);
    setStage("idle");
  };

  const pause = () => {
    if (stage !== "running" || isPaused) return;
    if (startMs !== null) {
      const accrued = elapsedOffsetMs + (Date.now() - startMs);
      setElapsedOffsetMs(accrued);
      setElapsedMs(accrued);
      setStartMs(null);
    }
    setIsPaused(true);
  };

  const resume = () => {
    if (stage !== "running" || !isPaused) return;
    if (run?.mode === "auto" || revealedCount > 0) {
      setStartMs(Date.now());
    }
    setIsPaused(false);
  };

  useEffect(() => {
    if (stage !== "running") return;
    if (run?.mode !== "auto") return;
    if (isPaused) return;
    const totalCards = run.visible_cards.length;
    if (!totalCards) {
      setStage("awaiting_submit");
      return;
    }
    const perCardMs = Math.max(Math.floor(run.target_duration_ms / totalCards), 50);
    setStartMs(Date.now());
    revealNext();
    const id = window.setInterval(() => {
      revealNext();
    }, perCardMs);
    return () => {
      window.clearInterval(id);
    };
  }, [isPaused, stage, run, revealNext]);

  useEffect(() => {
    if (stage !== "running") return;
    if (startMs === null) return;
    if (isPaused) return;
    const id = window.setInterval(() => {
      setElapsedMs(elapsedOffsetMs + (Date.now() - startMs));
    }, 80);
    return () => {
      window.clearInterval(id);
    };
  }, [elapsedOffsetMs, isPaused, stage, startMs]);

  useEffect(() => {
    if (stage !== "running") return;
    if (run?.mode !== "manual") return;
    if (isPaused) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code !== "Space") return;
      event.preventDefault();
      revealNext();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isPaused, stage, run?.mode, revealNext]);

  const activeCard = useMemo(() => {
    if (!run || revealedCount <= 0) return null;
    return run.visible_cards[Math.min(revealedCount - 1, run.visible_cards.length - 1)] ?? null;
  }, [run, revealedCount]);

  return {
    setup,
    setSetup,
    stage,
    run,
    result,
    revealedCount,
    activeCard,
    elapsedMs,
    isPaused,
    submitting,
    error,
    canReveal: stage === "running" && !isPaused && run?.mode === "manual",
    canPause: stage === "running",
    startRun,
    revealNext,
    pause,
    resume,
    submitCount,
    reset,
  };
};

export { DEFAULT_SETUP, usePracticeSession };
