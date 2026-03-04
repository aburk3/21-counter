import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { RankBadge } from "@/components/RankBadge";
import { StatTile } from "@/components/StatTile";
import { useDashboard } from "@/hooks/useDashboard";
import { clearTokens } from "@/lib/api";
import {
  DASHBOARD_RANK_LABELS,
  DASHBOARD_SKIN_LABELS,
  DASHBOARD_TEXT,
} from "./constants";

import {
  Actions,
  Button,
  ErrorText,
  Grid,
  Message,
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
  TopBar,
  Wrap,
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
      <TopBar>
        <h1>{DASHBOARD_TEXT.TITLE}</h1>
        <RankBadge rank={data.current_rank} />
      </TopBar>

      <Grid>
        <StatTile
          label={DASHBOARD_TEXT.STATS.CORRECT_COUNT_GAMES}
          value={data.correct_count_games}
        />
        <StatTile label={DASHBOARD_TEXT.STATS.COUNT_ACCURACY} value={`${data.accuracy_pct}%`} />
        <StatTile
          label={DASHBOARD_TEXT.STATS.STRATEGY_CORRECT}
          value={`${data.strategy_correct_pct}%`}
        />
        <StatTile
          label={DASHBOARD_TEXT.STATS.AVG_TIME}
          value={`${(data.avg_decision_ms / 1000).toFixed(2)}s`}
        />
        <StatTile label={DASHBOARD_TEXT.STATS.CURRENT_STREAK} value={data.current_streak} />
        <StatTile label={DASHBOARD_TEXT.STATS.XP} value={data.xp} />
        <StatTile label={DASHBOARD_TEXT.STATS.CHIPS} value={`$${data.chips}`} />
      </Grid>

      <Grid>
        <Panel>
          <h3>{DASHBOARD_TEXT.PROGRESSION_TITLE}</h3>
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
          <p>{DASHBOARD_TEXT.HOW_TO_RANK_UP}</p>
        </Panel>

        <Panel>
          <h3>{DASHBOARD_TEXT.UNLOCKS_TITLE}</h3>
          <SkinList>
            {Object.entries(DASHBOARD_SKIN_LABELS).map(([key, label]) => (
              <SkinItem
                key={key}
                $locked={!data.available_skins.includes(key)}
                disabled={!data.available_skins.includes(key)}
                onClick={() => {
                  if (data.available_skins.includes(key)) {
                    void selectSkin(key);
                  }
                }}
              >
                <SkinItemBody>
                  <SkinPreviewCard $skin={key}>A♥</SkinPreviewCard>
                  <SkinLabel>
                    {`${label}${data.selected_skin === key ? ` (${DASHBOARD_TEXT.SELECTED})` : ""}`}
                  </SkinLabel>
                </SkinItemBody>
              </SkinItem>
            ))}
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
          <Button onClick={() => setRefillOpen(true)}>{DASHBOARD_TEXT.BANKROLL_BUTTON}</Button>
          {message ? <Message>{message}</Message> : null}
        </Panel>
      </Grid>

      <Actions>
        <Button onClick={() => navigate("/play")}>{DASHBOARD_TEXT.PLAY}</Button>
        <Button
          onClick={() => {
            clearTokens();
            navigate("/auth");
          }}
        >
          {DASHBOARD_TEXT.LOGOUT}
        </Button>
      </Actions>

      {error ? <ErrorText>{error}</ErrorText> : null}
      {refillOpen && projected ? (
        <ModalBackdrop>
          <ModalCard>
            <h3>{DASHBOARD_TEXT.REFILL_CONFIRM_TITLE}</h3>
            <p>
              {DASHBOARD_TEXT.refillConfirmDetails(
                data.xp,
                DASHBOARD_RANK_LABELS[data.current_rank] ?? data.current_rank,
                projected.nextXp,
                DASHBOARD_RANK_LABELS[projected.nextRank] ?? projected.nextRank,
              )}
            </p>
            <Actions>
              <Button
                onClick={() => {
                  void refillChips().finally(() => setRefillOpen(false));
                }}
              >
                {DASHBOARD_TEXT.REFILL_CONFIRM}
              </Button>
              <Button onClick={() => setRefillOpen(false)}>
                {DASHBOARD_TEXT.REFILL_CANCEL}
              </Button>
            </Actions>
          </ModalCard>
        </ModalBackdrop>
      ) : null}
    </Wrap>
  );
};

export default Dashboard;
