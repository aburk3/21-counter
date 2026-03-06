import type {
  DashboardResponse,
  PracticeMode,
  PracticeRunStartResponse,
  PracticeRunSubmitResponse,
  PracticeSpeedTier,
} from "@/types/api";

import { request } from "./client";

const dashboard = () => request<DashboardResponse>("/dashboard");

const startPracticeRun = (payload: {
  decks: number;
  mode: PracticeMode;
  speed_tier: PracticeSpeedTier;
}) =>
  request<PracticeRunStartResponse>("/practice/runs/start", {
    method: "POST",
    body: JSON.stringify(payload),
  });

const submitPracticeRun = (runId: number, running_count: number) =>
  request<PracticeRunSubmitResponse>(`/practice/runs/${runId}/submit`, {
    method: "POST",
    body: JSON.stringify({ running_count }),
  });

export { dashboard, startPracticeRun, submitPracticeRun };
