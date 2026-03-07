import { useNavigate } from "react-router-dom";

import { RankBadge } from "@/components/RankBadge";
import { StatCardV2 } from "@/components/StatCardV2";
import { GlassButton } from "@/components/ui/GlassButton";
import { useDashboard } from "@/hooks/useDashboard";
import { getDetailMetricsBySection } from "@/lib/stats/metrics";
import { DASHBOARD_RANK_LABELS } from "@/pages/Dashboard/constants";
import { STATS_TEXT } from "./constants";
import {
  ErrorText,
  FooterGrid,
  Hero,
  HeroTop,
  MetricGrid,
  Panel,
  PracticeList,
  PracticeMeta,
  PracticeRow,
  Section,
  SectionTitle,
  Wrap,
} from "./styles";

const Stats = () => {
  const navigate = useNavigate();
  const { data, loading, error } = useDashboard();

  if (loading) return <Wrap>Loading detailed stats...</Wrap>;
  if (error || !data) return <Wrap>{error ?? "Stats unavailable"}</Wrap>;

  const metrics = getDetailMetricsBySection(data);

  return (
    <Wrap>
      <Hero $elevation={2}>
        <HeroTop>
          <div>
            <h1>{STATS_TEXT.TITLE}</h1>
            <p>{STATS_TEXT.SUBTITLE}</p>
          </div>
          <GlassButton $variant="secondary" onClick={() => navigate("/dashboard")}>
            {STATS_TEXT.DASHBOARD}
          </GlassButton>
        </HeroTop>
        <RankBadge rank={data.current_rank} />
      </Hero>

      <Section>
        <SectionTitle>{STATS_TEXT.PERFORMANCE}</SectionTitle>
        <MetricGrid>
          {metrics.performance.map((metric) => (
            <StatCardV2
              key={metric.id}
              label={metric.label}
              value={metric.value}
              trend={metric.trend}
              helper={metric.helper}
            />
          ))}
        </MetricGrid>
      </Section>

      <Section>
        <SectionTitle>{STATS_TEXT.PROGRESSION}</SectionTitle>
        <MetricGrid>
          {metrics.progression.map((metric) => (
            <StatCardV2
              key={metric.id}
              label={metric.label}
              value={metric.value}
              trend={metric.trend}
              helper={metric.helper}
            />
          ))}
        </MetricGrid>
      </Section>

      <Section>
        <SectionTitle>{STATS_TEXT.PRACTICE}</SectionTitle>
        <MetricGrid>
          {metrics.practice.map((metric) => (
            <StatCardV2
              key={metric.id}
              label={metric.label}
              value={metric.value}
              trend={metric.trend}
              helper={metric.helper}
            />
          ))}
        </MetricGrid>
      </Section>

      <FooterGrid>
        <Panel $elevation={1}>
          <h3>{STATS_TEXT.CURRENT_RANK}</h3>
          <RankBadge rank={data.current_rank} />
          <p>{`${STATS_TEXT.NEXT_UNLOCK}: ${STATS_TEXT.nextUnlock(data.next_rank ? (DASHBOARD_RANK_LABELS[data.next_rank] ?? data.next_rank) : null)}`}</p>
        </Panel>

        <Panel $elevation={1}>
          <h3>{STATS_TEXT.RECENT_RUNS}</h3>
          <PracticeList>
            {data.practice_recent_runs.length ? (
              data.practice_recent_runs.map((run) => (
                <PracticeRow key={run.id} $elevation={1}>
                  <strong>{STATS_TEXT.practiceRunLabel(run.mode, run.speed_tier, run.decks)}</strong>
                  <PracticeMeta>
                    <span>{`${(run.duration_ms / 1000).toFixed(2)}s`}</span>
                    <span>{STATS_TEXT.practiceRunResult(run.is_correct, run.xp_delta)}</span>
                  </PracticeMeta>
                </PracticeRow>
              ))
            ) : (
              <p>{STATS_TEXT.EMPTY_RUNS}</p>
            )}
          </PracticeList>
        </Panel>
      </FooterGrid>

      {error ? <ErrorText>{error}</ErrorText> : null}
    </Wrap>
  );
};

export default Stats;
