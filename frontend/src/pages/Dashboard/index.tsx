import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { RankBadge } from "@/components/RankBadge";
import { StatCardV2 } from "@/components/StatCardV2";
import { GlassButton } from "@/components/ui/GlassButton";
import { useDashboard } from "@/hooks/useDashboard";
import { getMetricsByTier } from "@/lib/stats/metrics";
import {
  DASHBOARD_RANK_LABELS,
  DASHBOARD_SKIN_LABELS,
  DASHBOARD_TEXT,
} from "./constants";

import {
  ErrorText,
  Hero,
  HeroActions,
  HeroMeta,
  HeroTop,
  Message,
  MetricGrid,
  ModalActions,
  ModalBackdrop,
  ModalCard,
  Panel,
  PracticeList,
  PracticeMeta,
  PracticeRow,
  ProgressBar,
  ProgressBlock,
  ProgressFill,
  ProgressRow,
  SectionTitle,
  SkinItem,
  SkinItemBody,
  SkinLabel,
  SkinList,
  SkinPreviewCard,
  Wrap,
  ZoneGrid,
} from "./styles";

const Dashboard = () => {
  const navigate = useNavigate();
  const { data, loading, error, message, refillChips, selectSkin } = useDashboard();
  const [refillOpen, setRefillOpen] = useState(false);

  const projected = useMemo(() => {
    if (!data) return null;
    const nextXp = Math.max(0, data.xp - 75);
    const nextRank =
      nextXp >= 1800
        ? "shark"
        : nextXp >= 1000
          ? "ace"
          : nextXp >= 500
            ? "pro"
            : nextXp >= 200
              ? "spotter"
              : "rookie";
    return { nextXp, nextRank };
  }, [data]);

  if (loading) return <Wrap>{DASHBOARD_TEXT.LOADING_DASHBOARD}</Wrap>;
  if (error || !data) return <Wrap>{error ?? DASHBOARD_TEXT.DASHBOARD_UNAVAILABLE}</Wrap>;

  const overviewMetrics = getMetricsByTier(data, "overview");
  const recentRuns = data.practice_recent_runs.slice(0, 3);

  return (
    <Wrap>
      <Hero $elevation={2}>
        <HeroTop>
          <HeroMeta>
            <h1>{DASHBOARD_TEXT.TITLE}</h1>
            <p>{DASHBOARD_TEXT.HERO_SUBTITLE}</p>
            <RankBadge rank={data.current_rank} />
          </HeroMeta>
          <HeroActions>
            <GlassButton $variant="primary" onClick={() => navigate("/play")}>
              {DASHBOARD_TEXT.PLAY}
            </GlassButton>
            <GlassButton $variant="secondary" onClick={() => navigate("/play?resume=1")}>
              {DASHBOARD_TEXT.RESUME}
            </GlassButton>
            <GlassButton $variant="ghost" onClick={() => navigate("/practice")}>
              {DASHBOARD_TEXT.PRACTICE}
            </GlassButton>
            <GlassButton $variant="secondary" onClick={() => navigate("/stats")}>
              {DASHBOARD_TEXT.VIEW_STATS}
            </GlassButton>
          </HeroActions>
        </HeroTop>

        <ProgressBlock>
          <ProgressRow>
            <span>{`${DASHBOARD_TEXT.XP}: ${data.xp}`}</span>
            <span>
              {DASHBOARD_TEXT.progressionToNext(
                data.xp_to_next_rank,
                data.next_rank
                  ? (DASHBOARD_RANK_LABELS[data.next_rank] ?? data.next_rank)
                  : null,
              )}
            </span>
          </ProgressRow>
          <ProgressBar>
            <ProgressFill $pct={data.rank_progress_pct} />
          </ProgressBar>
        </ProgressBlock>
      </Hero>

      <section>
        <SectionTitle>{DASHBOARD_TEXT.KEY_METRICS}</SectionTitle>
        <MetricGrid>
          {overviewMetrics.map((metric) => (
            <StatCardV2
              key={metric.id}
              label={metric.label}
              value={metric.value}
              trend={metric.trend}
              helper={metric.helper}
            />
          ))}
        </MetricGrid>
      </section>

      <ZoneGrid>
        <Panel $elevation={1}>
          <h3>{DASHBOARD_TEXT.PRACTICE_TITLE}</h3>
          <p>
            {`Runs ${data.practice_total_runs} • Correct ${data.practice_correct_runs} • Accuracy ${data.practice_accuracy_pct}%`}
          </p>
          <h4>{DASHBOARD_TEXT.PRACTICE_RECENT}</h4>
          <PracticeList>
            {recentRuns.length ? (
              recentRuns.map((run) => (
                <PracticeRow key={run.id} $elevation={1}>
                  <strong>{DASHBOARD_TEXT.practiceRunLabel(run.mode, run.speed_tier, run.decks)}</strong>
                  <PracticeMeta>
                    <span>{`${(run.duration_ms / 1000).toFixed(2)}s`}</span>
                    <span>{DASHBOARD_TEXT.practiceRunResult(run.is_correct, run.xp_delta)}</span>
                  </PracticeMeta>
                </PracticeRow>
              ))
            ) : (
              <p>No practice runs yet.</p>
            )}
          </PracticeList>
        </Panel>

        <Panel $elevation={1}>
          <h3>{DASHBOARD_TEXT.UNLOCKS_TITLE}</h3>
          <SkinList>
            {Object.entries(DASHBOARD_SKIN_LABELS).map(([key, label]) => {
              const unlocked = data.available_skins.includes(key);
              const selected = data.selected_skin === key;
              return (
                <SkinItem
                  key={key}
                  $locked={!unlocked}
                  $selected={selected}
                  disabled={!unlocked}
                  onClick={() => {
                    if (unlocked) {
                      void selectSkin(key);
                    }
                  }}
                >
                  <SkinItemBody>
                    <SkinPreviewCard $skin={key}>A♥</SkinPreviewCard>
                    <SkinLabel>{`${label}${selected ? ` (${DASHBOARD_TEXT.SELECTED})` : ""}`}</SkinLabel>
                  </SkinItemBody>
                </SkinItem>
              );
            })}
          </SkinList>
          <p>
            {DASHBOARD_TEXT.nextUnlock(
              data.next_rank
                ? (DASHBOARD_RANK_LABELS[data.next_rank] ?? data.next_rank)
                : null,
            )}
          </p>
        </Panel>

        <Panel $elevation={1}>
          <h3>{DASHBOARD_TEXT.BANKROLL_TITLE}</h3>
          <p>{DASHBOARD_TEXT.BANKROLL_WARNING}</p>
          <GlassButton $variant="destructive" onClick={() => setRefillOpen(true)}>
            {DASHBOARD_TEXT.BANKROLL_BUTTON}
          </GlassButton>
          {message ? <Message>{message}</Message> : null}
        </Panel>
      </ZoneGrid>

      {error ? <ErrorText>{error}</ErrorText> : null}
      {refillOpen && projected ? (
        <ModalBackdrop>
          <ModalCard $elevation={3}>
            <h3>{DASHBOARD_TEXT.REFILL_CONFIRM_TITLE}</h3>
            <p>
              {DASHBOARD_TEXT.refillConfirmDetails(
                data.xp,
                DASHBOARD_RANK_LABELS[data.current_rank] ?? data.current_rank,
                projected.nextXp,
                DASHBOARD_RANK_LABELS[projected.nextRank] ?? projected.nextRank,
              )}
            </p>
            <ModalActions>
              <GlassButton
                $variant="destructive"
                onClick={() => {
                  void refillChips().finally(() => setRefillOpen(false));
                }}
              >
                {DASHBOARD_TEXT.REFILL_CONFIRM}
              </GlassButton>
              <GlassButton $variant="secondary" onClick={() => setRefillOpen(false)}>
                {DASHBOARD_TEXT.REFILL_CANCEL}
              </GlassButton>
            </ModalActions>
          </ModalCard>
        </ModalBackdrop>
      ) : null}
    </Wrap>
  );
};

export default Dashboard;
