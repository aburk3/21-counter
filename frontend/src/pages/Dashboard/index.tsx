import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { RankBadge } from "@/components/RankBadge";
import { StatCardV2 } from "@/components/StatCardV2";
import { GlassButton } from "@/components/ui/GlassButton";
import { useDashboard } from "@/hooks/useDashboard";
import {
  DASHBOARD_RANK_LABELS,
  DASHBOARD_SKIN_LABELS,
  DASHBOARD_TEXT,
} from "./constants";

import {
  ErrorText,
  Grid,
  Hero,
  HeroActions,
  HeroMeta,
  HeroStats,
  HeroTop,
  Message,
  ModalActions,
  ModalBackdrop,
  ModalCard,
  Panel,
  ProgressBar,
  ProgressFill,
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
          </HeroActions>
        </HeroTop>

        <div>
          <div>{`${DASHBOARD_TEXT.STATS.XP}: ${data.xp}`}</div>
          <ProgressBar>
            <ProgressFill $pct={data.rank_progress_pct} />
          </ProgressBar>
          <div>
            {DASHBOARD_TEXT.progressionToNext(
              data.xp_to_next_rank,
              data.next_rank
                ? (DASHBOARD_RANK_LABELS[data.next_rank] ?? data.next_rank)
                : null,
            )}
          </div>
        </div>

        <HeroStats>
          <StatCardV2
            label={DASHBOARD_TEXT.STATS.CURRENT_STREAK}
            value={data.current_streak}
            trend={data.current_streak >= 3 ? "up" : "neutral"}
          />
          <StatCardV2
            label={DASHBOARD_TEXT.STATS.CHIPS}
            value={`$${data.chips}`}
            trend={data.chips >= 500 ? "up" : "down"}
          />
          <StatCardV2
            label={DASHBOARD_TEXT.STATS.COUNT_ACCURACY}
            value={`${data.accuracy_pct}%`}
            trend={data.accuracy_pct >= 70 ? "up" : "down"}
          />
        </HeroStats>
      </Hero>

      <Grid>
        <StatCardV2
          label={DASHBOARD_TEXT.STATS.CORRECT_COUNT_GAMES}
          value={data.correct_count_games}
          trend={data.correct_count_games >= 5 ? "up" : "neutral"}
        />
        <StatCardV2
          label={DASHBOARD_TEXT.STATS.STRATEGY_CORRECT}
          value={`${data.strategy_correct_pct}%`}
          trend={data.strategy_correct_pct >= 70 ? "up" : "down"}
        />
        <StatCardV2
          label={DASHBOARD_TEXT.STATS.AVG_TIME}
          value={`${(data.avg_decision_ms / 1000).toFixed(2)}s`}
          trend={data.avg_decision_ms <= 10000 ? "up" : "down"}
        />
        <StatCardV2
          label={DASHBOARD_TEXT.STATS.TOTAL_SESSIONS}
          value={data.total_games}
          trend="neutral"
        />
      </Grid>

      <ZoneGrid>
        <Panel>
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
                    <SkinLabel>
                      {`${label}${selected ? ` (${DASHBOARD_TEXT.SELECTED})` : ""}`}
                    </SkinLabel>
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

        <Panel>
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
