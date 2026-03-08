import type { DashboardResponse } from "@/types/api";

type StatTrend = "up" | "down" | "neutral";
type MetricTier = "overview" | "detail";
type MetricSection = "performance" | "progression" | "practice";

type StatMetricDefinition = {
  id: string;
  label: string;
  tier: MetricTier;
  section: MetricSection;
  value: (data: DashboardResponse) => string | number;
  trend: (data: DashboardResponse) => StatTrend;
  helper?: (data: DashboardResponse) => string;
};

type ResolvedStatMetric = {
  id: string;
  label: string;
  tier: MetricTier;
  section: MetricSection;
  value: string | number;
  trend: StatTrend;
  helper?: string;
};

const toSeconds = (ms: number) => `${(ms / 1000).toFixed(2)}s`;

const STAT_METRICS: StatMetricDefinition[] = [
  {
    id: "current_streak",
    label: "Current Streak",
    tier: "overview",
    section: "performance",
    value: (data) => data.current_streak,
    trend: (data) => (data.current_streak >= 3 ? "up" : "neutral"),
  },
  {
    id: "chips",
    label: "Chips",
    tier: "overview",
    section: "progression",
    value: (data) => `$${data.chips}`,
    trend: (data) => (data.chips >= 500 ? "up" : "down"),
  },
  {
    id: "correct_count_games",
    label: "Correct Count Sessions",
    tier: "detail",
    section: "performance",
    value: (data) => data.correct_count_games,
    trend: (data) => (data.correct_count_games >= 5 ? "up" : "neutral"),
  },
  {
    id: "count_accuracy",
    label: "Count Accuracy",
    tier: "detail",
    section: "performance",
    value: (data) => `${data.accuracy_pct}%`,
    trend: (data) => (data.accuracy_pct >= 70 ? "up" : "down"),
  },
  {
    id: "strategy_accuracy",
    label: "Strategy Accuracy",
    tier: "detail",
    section: "performance",
    value: (data) => `${data.strategy_correct_pct}%`,
    trend: (data) => (data.strategy_correct_pct >= 70 ? "up" : "down"),
  },
  {
    id: "avg_decision",
    label: "Avg Decision Time",
    tier: "detail",
    section: "performance",
    value: (data) => toSeconds(data.avg_decision_ms),
    trend: (data) => (data.avg_decision_ms <= 10000 ? "up" : "down"),
    helper: () => "Target under 10s",
  },
  {
    id: "sessions",
    label: "Sessions",
    tier: "detail",
    section: "performance",
    value: (data) => data.total_games,
    trend: () => "neutral",
  },
  {
    id: "xp",
    label: "XP",
    tier: "detail",
    section: "progression",
    value: (data) => data.xp,
    trend: () => "neutral",
  },
  {
    id: "rank_progress",
    label: "Rank Progress",
    tier: "detail",
    section: "progression",
    value: (data) => `${Math.round(data.rank_progress_pct)}%`,
    trend: (data) => (data.rank_progress_pct >= 50 ? "up" : "neutral"),
  },
  {
    id: "xp_to_next_rank",
    label: "XP To Next Rank",
    tier: "detail",
    section: "progression",
    value: (data) => data.next_rank ? data.xp_to_next_rank : 0,
    trend: () => "neutral",
    helper: (data) => (data.next_rank ? "Progressing" : "Top rank reached"),
  },
  {
    id: "practice_accuracy",
    label: "Practice Accuracy",
    tier: "detail",
    section: "practice",
    value: (data) => `${data.practice_accuracy_pct}%`,
    trend: (data) => (data.practice_accuracy_pct >= 70 ? "up" : "down"),
  },
  {
    id: "practice_avg",
    label: "Practice Avg / Deck",
    tier: "detail",
    section: "practice",
    value: (data) => toSeconds(data.practice_avg_ms_per_deck),
    trend: (data) => (data.practice_avg_ms_per_deck <= 45000 ? "up" : "neutral"),
  },
  {
    id: "practice_best_streak",
    label: "Practice Best Streak",
    tier: "detail",
    section: "practice",
    value: (data) => data.practice_best_streak,
    trend: (data) => (data.practice_best_streak >= 3 ? "up" : "neutral"),
  },
  {
    id: "practice_runs",
    label: "Practice Runs",
    tier: "detail",
    section: "practice",
    value: (data) => data.practice_total_runs,
    trend: () => "neutral",
  },
  {
    id: "practice_correct_runs",
    label: "Practice Correct Runs",
    tier: "detail",
    section: "practice",
    value: (data) => data.practice_correct_runs,
    trend: () => "neutral",
  },
];

const resolveMetric = (metric: StatMetricDefinition, data: DashboardResponse): ResolvedStatMetric => ({
  id: metric.id,
  label: metric.label,
  tier: metric.tier,
  section: metric.section,
  value: metric.value(data),
  trend: metric.trend(data),
  helper: metric.helper?.(data),
});

const getMetricsByTier = (data: DashboardResponse, tier: MetricTier): ResolvedStatMetric[] => {
  return STAT_METRICS.filter((metric) => metric.tier === tier).map((metric) => resolveMetric(metric, data));
};

const getDetailMetricsBySection = (data: DashboardResponse): Record<MetricSection, ResolvedStatMetric[]> => {
  return {
    performance: STAT_METRICS.filter((metric) => metric.tier === "detail" && metric.section === "performance").map(
      (metric) => resolveMetric(metric, data),
    ),
    progression: STAT_METRICS.filter((metric) => metric.tier === "detail" && metric.section === "progression").map(
      (metric) => resolveMetric(metric, data),
    ),
    practice: STAT_METRICS.filter((metric) => metric.tier === "detail" && metric.section === "practice").map(
      (metric) => resolveMetric(metric, data),
    ),
  };
};

export type { MetricSection, MetricTier, ResolvedStatMetric, StatTrend };
export { getMetricsByTier, getDetailMetricsBySection };
