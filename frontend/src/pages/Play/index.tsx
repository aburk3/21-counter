import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { ActionPanel } from "@/components/ActionPanel";
import { BlackjackTable } from "@/components/BlackjackTable";
import { ChipTray } from "@/components/ChipTray";
import { RoundSummaryDialog } from "@/components/RoundSummaryDialog";
import { SetupDialog } from "@/components/SetupDialog";
import { GlassBadge } from "@/components/ui/GlassBadge";
import { GlassButton } from "@/components/ui/GlassButton";
import { usePlaySession } from "@/hooks/usePlaySession";
import { api } from "@/lib/api";
import { PLAY_PAGE_TEXT } from "./constants";

import {
  ActionRow,
  Caption,
  Dock,
  DockLabel,
  DockRow,
  DockSection,
  ErrorText,
  HintCard,
  Layout,
  SummaryBackdrop,
  SummaryCard,
  SummaryGrid,
  SummaryItem,
  TableRegion,
  UtilityActions,
  UtilityBar,
  UtilityMeta,
  Wrap,
} from "./styles";

const DEFAULT_SETUP = {
  decks_per_shoe: 6,
  hands_dealt: 3,
};

const Play = () => {
  const navigate = useNavigate();
  const [showSetup, setShowSetup] = useState(false);
  const [defaults, setDefaults] = useState(DEFAULT_SETUP);
  const [hintFlags, setHintFlags] = useState({ strategy: false, count: false, pace: false });
  const {
    state,
    chips,
    feedback,
    selectedSkin,
    showCountDialog,
    showResolvedOverlay,
    isDealing,
    sessionComplete,
    sessionSummary,
    gainLoss,
    error,
    timerMs,
    createSession,
    placeBet,
    deal,
    action,
    submitCount,
    nextRound,
    exitSession,
    setSelectedSkin,
    setShowCountDialog,
  } = usePlaySession();
  const createSessionRef = useRef(createSession);

  useEffect(() => {
    createSessionRef.current = createSession;
  }, [createSession]);

  useEffect(() => {
    let alive = true;
    api
      .me()
      .then((me) => {
        if (!alive) return;
        const nextDefaults = {
          decks_per_shoe: me.settings.default_decks_per_shoe,
          hands_dealt: me.settings.default_hands_dealt,
        };
        setDefaults(nextDefaults);
        void createSessionRef.current(nextDefaults);
        setSelectedSkin(me.settings.selected_deck_skin);
      })
      .catch(() => {
        if (!alive) return;
        void createSessionRef.current(DEFAULT_SETUP);
      });
    return () => {
      alive = false;
    };
  }, [setSelectedSkin]);

  useEffect(() => {
    if (!feedback) return;
    setHintFlags((prev) => ({
      strategy: prev.strategy || !feedback.strategy_correct,
      count: prev.count || !feedback.is_correct,
      pace: prev.pace || feedback.round_time_ms > 12000,
    }));
  }, [feedback]);

  const canDeal = Boolean(state) && !state?.active_round && !state?.round_ready_for_submission;

  const roundStatus = useMemo(() => {
    if (showResolvedOverlay || state?.round_ready_for_submission) {
      return PLAY_PAGE_TEXT.ROUND_STATUS.READY_SUBMIT;
    }
    if (!state?.active_round) {
      return PLAY_PAGE_TEXT.ROUND_STATUS.WAITING;
    }
    if (state.active_round.phase === "user_turn") {
      return PLAY_PAGE_TEXT.ROUND_STATUS.USER_TURN;
    }
    return PLAY_PAGE_TEXT.ROUND_STATUS.TABLE_TURN;
  }, [showResolvedOverlay, state]);

  const hint = useMemo(() => {
    if (hintFlags.strategy) return PLAY_PAGE_TEXT.HINT_STRATEGY;
    if (hintFlags.count) return PLAY_PAGE_TEXT.HINT_COUNT;
    if (hintFlags.pace) return PLAY_PAGE_TEXT.HINT_PACE;
    return null;
  }, [hintFlags]);

  return (
    <Wrap>
      <UtilityBar $elevation={2}>
        <UtilityMeta>
          <span>{PLAY_PAGE_TEXT.SESSION_PROGRESS(state?.round_number ?? 1)}</span>
          <strong>{roundStatus}</strong>
        </UtilityMeta>
        <UtilityActions>
          <GlassBadge>{`Timer ${(timerMs / 1000).toFixed(2)}s`}</GlassBadge>
          <GlassBadge>{`Table Bet $${state?.current_bet ?? 0}`}</GlassBadge>
          <GlassBadge>{`Session ${gainLoss >= 0 ? "+" : ""}$${gainLoss}`}</GlassBadge>
          <GlassButton
            aria-label={PLAY_PAGE_TEXT.OPEN_SETTINGS}
            onClick={() => setShowSetup(true)}
            $variant="secondary"
          >
            {PLAY_PAGE_TEXT.SETTINGS_ICON}
          </GlassButton>
          <GlassButton
            $variant="destructive"
            onClick={() => {
              void exitSession();
            }}
          >
            {PLAY_PAGE_TEXT.EXIT_SESSION}
          </GlassButton>
        </UtilityActions>
      </UtilityBar>

      <Layout>
        <TableRegion>
          <BlackjackTable
            state={state}
            chips={chips}
            timerMs={timerMs}
            skin={selectedSkin}
          />
        </TableRegion>

        <Dock $elevation={2}>
          {hint ? <HintCard $elevation={1}>{hint}</HintCard> : null}

          <DockSection>
            <DockRow>
              <DockLabel>{PLAY_PAGE_TEXT.WAGER_TITLE}</DockLabel>
              <GlassBadge>{`Chips $${chips}`}</GlassBadge>
            </DockRow>
            <Caption>{PLAY_PAGE_TEXT.WAGER_HELP}</Caption>
            <ChipTray
              currentBet={Math.max(state?.current_bet ?? 25, 25)}
              maxBet={chips}
              minBet={25}
              onChangeBet={(nextBet) => {
                void placeBet(nextBet);
              }}
              locked={Boolean(state?.active_round)}
            />
          </DockSection>

          <DockSection>
            <DockLabel>{PLAY_PAGE_TEXT.ACTIONS_TITLE}</DockLabel>
            {state?.active_round &&
            state.active_round.phase === "user_turn" &&
            !state.active_round.resolved ? (
              <ActionPanel actions={state.active_round.legal_actions} onAction={action} />
            ) : (
              <Caption>Actions unlock when it is your turn.</Caption>
            )}
          </DockSection>

          {showResolvedOverlay ? (
            <GlassButton $variant="primary" onClick={() => setShowCountDialog(true)}>
              {PLAY_PAGE_TEXT.CONFIRM_COUNT_CONTINUE}
            </GlassButton>
          ) : null}

          {canDeal ? (
            <GlassButton $variant="primary" disabled={isDealing} onClick={() => void deal()}>
              {PLAY_PAGE_TEXT.DEAL}
            </GlassButton>
          ) : null}

          {error ? <ErrorText>{error}</ErrorText> : null}
        </Dock>
      </Layout>

      {state?.round_ready_for_submission && showCountDialog ? (
        <RoundSummaryDialog
          feedback={feedback}
          onSubmitCount={(value) => {
            void submitCount(value);
          }}
          onNextRound={() => {
            void nextRound();
          }}
          onExit={() => {
            void exitSession();
          }}
        />
      ) : null}

      {sessionComplete && sessionSummary ? (
        <SummaryBackdrop>
          <SummaryCard $elevation={3}>
            <h3>{PLAY_PAGE_TEXT.SESSION_SUMMARY}</h3>
            <SummaryGrid>
              <SummaryItem $elevation={1}>{PLAY_PAGE_TEXT.summaryGainLoss(sessionSummary.gainLoss)}</SummaryItem>
              <SummaryItem $elevation={1}>
                {PLAY_PAGE_TEXT.summaryCountAccuracy(sessionSummary.countAccuracyPct)}
              </SummaryItem>
              <SummaryItem $elevation={1}>
                {PLAY_PAGE_TEXT.summaryPlayAccuracy(sessionSummary.playAccuracyPct)}
              </SummaryItem>
              <SummaryItem $elevation={1}>
                {PLAY_PAGE_TEXT.summaryRoundsPlayed(sessionSummary.totalRounds)}
              </SummaryItem>
            </SummaryGrid>
            <ActionRow>
              <GlassButton
                $variant="primary"
                onClick={() => {
                  setHintFlags({ strategy: false, count: false, pace: false });
                  void createSession(defaults);
                }}
              >
                {PLAY_PAGE_TEXT.PLAY_AGAIN}
              </GlassButton>
              <GlassButton $variant="secondary" onClick={() => navigate("/dashboard")}>
                {PLAY_PAGE_TEXT.RETURN_DASHBOARD}
              </GlassButton>
              <GlassButton $variant="ghost" onClick={() => setShowSetup(true)}>
                {PLAY_PAGE_TEXT.CHANGE_SETUP}
              </GlassButton>
            </ActionRow>
          </SummaryCard>
        </SummaryBackdrop>
      ) : null}

      {showSetup ? (
        <SetupDialog
          defaults={defaults}
          onContinue={(payload) => {
            setDefaults(payload);
            setHintFlags({ strategy: false, count: false, pace: false });
            void createSession(payload);
            setShowSetup(false);
          }}
          onSaveDefault={(payload) => {
            void api.updateSettings({
              default_decks_per_shoe: payload.decks_per_shoe,
              default_hands_dealt: payload.hands_dealt,
            });
          }}
          onCancel={() => setShowSetup(false)}
        />
      ) : null}
    </Wrap>
  );
};

export default Play;
