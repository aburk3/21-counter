import type { MeResponse, Settings } from "@/types/api";

import { request } from "./client";

const me = () => request<MeResponse>("/me");

const updateSettings = (settings: Partial<Settings>) =>
  request<Settings>("/me/settings", {
    method: "PATCH",
    body: JSON.stringify(settings),
  });

const refillChips = () =>
  request<{
    chips_balance: number;
    xp: number;
    rank: string;
    xp_delta: number;
    chips_delta: number;
    rank_changed: boolean;
    previous_rank: string;
    new_rank: string;
  }>("/me/chips/refill", { method: "POST" });

export { me, updateSettings, refillChips };
