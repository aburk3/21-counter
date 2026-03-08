import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { GlassButton } from "@/components/ui/GlassButton";
import { useDashboard } from "@/hooks/useDashboard";
import {
  DASHBOARD_RANK_LABELS,
  DASHBOARD_SKIN_LABELS,
  DASHBOARD_TEXT,
} from "./constants";

import {
  ErrorText,
  Hero,
  HeroActions,
  HeroContent,
  HeroMeta,
  HeroTop,
  HeroUtility,
  IdentityLabel,
  Message,
  MetaRow,
  ModalActions,
  ModalBackdrop,
  ModalCard,
  Panel,
  ProgressBar,
  ProgressBlock,
  ProgressFill,
  ProgressMeta,
  ProgressRow,
  SecondaryActions,
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
  const { data, email, loading, error, message, refillChips, selectSkin } = useDashboard();
  const [refillOpen, setRefillOpen] = useState(false);

  const projected = useMemo(() => {
    if (!data) return null;
    return { nextXp: Math.max(0, data.xp - 75) };
  }, [data]);

  if (loading) return <Wrap>{DASHBOARD_TEXT.LOADING_DASHBOARD}</Wrap>;
  if (error || !data) return <Wrap>{error ?? DASHBOARD_TEXT.DASHBOARD_UNAVAILABLE}</Wrap>;

  return (
    <Wrap>
      <Hero $elevation={2}>
        <HeroTop>
          <HeroContent>
            <HeroMeta>
              <h1>{DASHBOARD_TEXT.TITLE}</h1>
              <p>{DASHBOARD_TEXT.PROFILE_SUBTITLE}</p>
              <IdentityLabel>{email}</IdentityLabel>
              <MetaRow>{`${DASHBOARD_TEXT.RANK}: ${DASHBOARD_RANK_LABELS[data.current_rank] ?? data.current_rank}`}</MetaRow>
            </HeroMeta>
            <HeroUtility>
              <span>{`${DASHBOARD_TEXT.CHIPS}: $${data.chips}`}</span>
              <GlassButton $variant="secondary" onClick={() => setRefillOpen(true)}>
                {DASHBOARD_TEXT.REFILL_CHIPS}
              </GlassButton>
            </HeroUtility>
          </HeroContent>
        </HeroTop>

        <ProgressBlock>
          <ProgressRow>
            <span>{`${DASHBOARD_TEXT.XP}: ${data.xp}`}</span>
            <ProgressMeta>
              {DASHBOARD_TEXT.progressionToNext(
                data.xp_to_next_rank,
                data.next_rank ? (DASHBOARD_RANK_LABELS[data.next_rank] ?? data.next_rank) : null,
              )}
            </ProgressMeta>
          </ProgressRow>
          <ProgressBar>
            <ProgressFill $pct={data.rank_progress_pct} />
          </ProgressBar>
        </ProgressBlock>
      </Hero>

      <HeroActions>
        <GlassButton $variant="primary" onClick={() => navigate("/play")}>
          {DASHBOARD_TEXT.PLAY}
        </GlassButton>
        <GlassButton $variant="ghost" onClick={() => navigate("/practice")}>
          {DASHBOARD_TEXT.PRACTICE}
        </GlassButton>
      </HeroActions>

      <SecondaryActions>
        <span>{DASHBOARD_TEXT.SECONDARY_ACTIONS}</span>
        <GlassButton $variant="secondary" onClick={() => navigate("/play?resume=1")}>
          {DASHBOARD_TEXT.RESUME}
        </GlassButton>
        <GlassButton $variant="secondary" onClick={() => navigate("/stats")}>
          {DASHBOARD_TEXT.VIEW_STATS}
        </GlassButton>
      </SecondaryActions>

      {message ? <Message>{message}</Message> : null}

      <ZoneGrid>
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
              data.next_rank ? (DASHBOARD_RANK_LABELS[data.next_rank] ?? data.next_rank) : null,
            )}
          </p>
        </Panel>
      </ZoneGrid>

      {error ? <ErrorText>{error}</ErrorText> : null}
      {refillOpen && projected ? (
        <ModalBackdrop>
          <ModalCard $elevation={3}>
            <h3>{DASHBOARD_TEXT.REFILL_CONFIRM_TITLE}</h3>
            <p>{DASHBOARD_TEXT.REFILL_CONFIRM_MESSAGE}</p>
            <ProgressBlock>
              <ProgressRow>
                <span>{`${DASHBOARD_TEXT.XP}: ${data.xp}`}</span>
                <ProgressMeta>{`${DASHBOARD_TEXT.XP}: ${projected.nextXp} after refill`}</ProgressMeta>
              </ProgressRow>
            </ProgressBlock>
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
