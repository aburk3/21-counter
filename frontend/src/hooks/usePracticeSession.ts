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
  const [elapsedMs, setElapsedMs] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const revealNext = useCallback(() => {
    setRevealedCount((prev) => {
      const maxCards = run?.visible_cards.length ?? 0;
      if (prev >= maxCards) return prev;
      if (run?.mode === "manual" && prev === 0) {
        setStartMs(Date.now());
      }
      const next = prev + 1;
      if (next >= maxCards) {
        setStage("awaiting_submit");
        setElapsedMs((value) => (value > 0 ? value : Date.now() - (startMs ?? Date.now())));
      }
      return next;
    });
  }, [run?.visible_cards.length, run?.mode, startMs]);

  const startRun = async () => {
    setError(null);
    setResult(null);
    setElapsedMs(0);
    setRevealedCount(0);
    setStartMs(null);
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
    setElapsedMs(0);
    setError(null);
    setStage("idle");
  };

  useEffect(() => {
    if (stage !== "running") return;
    if (run?.mode !== "auto") return;
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
  }, [stage, run, revealNext]);

  useEffect(() => {
    if (stage !== "running") return;
    if (startMs === null) return;
    const id = window.setInterval(() => {
      setElapsedMs(Date.now() - startMs);
    }, 80);
    return () => {
      window.clearInterval(id);
    };
  }, [stage, startMs]);

  useEffect(() => {
    if (stage !== "running") return;
    if (run?.mode !== "manual") return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code !== "Space") return;
      event.preventDefault();
      revealNext();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [stage, run?.mode, revealNext]);

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
    submitting,
    error,
    canReveal: stage === "running" && run?.mode === "manual",
    startRun,
    revealNext,
    submitCount,
    reset,
  };
};

export { DEFAULT_SETUP, usePracticeSession };
