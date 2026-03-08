import { useEffect, useState } from "react";

import { api } from "@/lib/api";
import type { DashboardResponse } from "@/types/api";
import { DASHBOARD_TEXT } from "@/pages/Dashboard/constants";

const useDashboard = () => {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [email, setEmail] = useState<string>("trainer@21-counter");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const load = async () => {
    const [dashboardPayload, mePayload] = await Promise.all([api.dashboard(), api.me()]);
    setData(dashboardPayload);
    setEmail(mePayload.email);
    setError(null);
    setLoading(false);
  };

  useEffect(() => {
    let mounted = true;
    load().catch((err) => {
      if (mounted) {
        setError(err instanceof Error ? err.message : DASHBOARD_TEXT.DASHBOARD_UNAVAILABLE);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  const refillChips = async () => {
    setError(null);
    setMessage(null);
    const result = await api.refillChips();
    await load();
    setMessage(DASHBOARD_TEXT.refillSuccess(result.chips_delta, result.xp_delta));
    return result;
  };

  const selectSkin = async (skin: string) => {
    setError(null);
    await api.updateSettings({ selected_deck_skin: skin });
    await load();
  };

  return { data, email, loading, error, message, refillChips, selectSkin };
};

export { useDashboard };
