import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { ActionPanel } from "@/components/ActionPanel";
import { BlackjackTable } from "@/components/BlackjackTable";
import { ChipTray } from "@/components/ChipTray";
import { RoundSummaryDialog } from "@/components/RoundSummaryDialog";
import { SetupDialog } from "@/components/SetupDialog";
import { api } from "@/lib/api";
import { usePlaySession } from "@/hooks/usePlaySession";
import { PLAY_PAGE_TEXT } from "./constants";

import {
  ActionRow,
  Caption,
  ContinueCountButton,
  ErrorText,
  ExitButton,
  Layout,
  Section,
  SidePanel,
  SettingsButton,
  SummaryBackdrop,
  SummaryCard,
  SummaryGrid,
  SummaryItem,
  TopBar,
  TopActions,
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

  const canDeal = Boolean(state) && !state?.active_round && !state?.round_ready_for_submission;

  return (
    <Wrap>
      <TopBar>
        <h1>{PLAY_PAGE_TEXT.TITLE}</h1>
        <TopActions>
          <SettingsButton
            aria-label={PLAY_PAGE_TEXT.OPEN_SETTINGS}
            onClick={() => setShowSetup(true)}
          >
            {PLAY_PAGE_TEXT.SETTINGS_ICON}
          </SettingsButton>
          <ExitButton
            onClick={() => {
              void exitSession();
            }}
          >
            {PLAY_PAGE_TEXT.EXIT_SESSION}
          </ExitButton>
        </TopActions>
      </TopBar>
      <Layout>
        <BlackjackTable
          state={state}
          chips={chips}
          timerMs={timerMs}
          totalGainLoss={gainLoss}
          skin={selectedSkin}
        />

        <SidePanel>
          <Section>
            {showResolvedOverlay ? (
              <ContinueCountButton onClick={() => setShowCountDialog(true)}>
                {PLAY_PAGE_TEXT.CONFIRM_COUNT_CONTINUE}
              </ContinueCountButton>
            ) : null}
            {canDeal ? (
              <ContinueCountButton disabled={isDealing} onClick={() => void deal()}>
                {PLAY_PAGE_TEXT.DEAL}
              </ContinueCountButton>
            ) : null}
            <h2>{PLAY_PAGE_TEXT.WAGER_TITLE}</h2>
            <Caption>{PLAY_PAGE_TEXT.WAGER_HELP}</Caption>
            <ChipTray
              onBet={placeBet}
              chips={chips}
              locked={Boolean(state?.active_round)}
            />
          </Section>
          <Section>
            <h2>{PLAY_PAGE_TEXT.ACTIONS_TITLE}</h2>
            {state?.active_round &&
            state.active_round.phase === "user_turn" &&
            !state.active_round.resolved ? (
              <ActionPanel actions={state.active_round.legal_actions} onAction={action} />
            ) : null}
          </Section>
          {error ? <ErrorText>{error}</ErrorText> : null}
        </SidePanel>
      </Layout>

      {showSetup ? (
        <SetupDialog
          defaults={defaults}
          onContinue={(payload) => {
            setDefaults(payload);
            void createSession(payload);
            setShowSetup(false);
          }}
        />
      ) : null}

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
          <SummaryCard>
            <h3>{PLAY_PAGE_TEXT.SESSION_SUMMARY}</h3>
            <SummaryGrid>
              <SummaryItem>{PLAY_PAGE_TEXT.summaryGainLoss(sessionSummary.gainLoss)}</SummaryItem>
              <SummaryItem>
                {PLAY_PAGE_TEXT.summaryCountAccuracy(sessionSummary.countAccuracyPct)}
              </SummaryItem>
              <SummaryItem>
                {PLAY_PAGE_TEXT.summaryPlayAccuracy(sessionSummary.playAccuracyPct)}
              </SummaryItem>
              <SummaryItem>
                {PLAY_PAGE_TEXT.summaryRoundsPlayed(sessionSummary.totalRounds)}
              </SummaryItem>
            </SummaryGrid>
            <ActionRow>
              <ExitButton onClick={() => navigate("/dashboard")}>
                {PLAY_PAGE_TEXT.RETURN_DASHBOARD}
              </ExitButton>
            </ActionRow>
          </SummaryCard>
        </SummaryBackdrop>
      ) : null}
    </Wrap>
  );
};

export default Play;
