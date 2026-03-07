import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Card } from "@/components/Card";
import { GlassBadge } from "@/components/ui/GlassBadge";
import { GlassButton } from "@/components/ui/GlassButton";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { usePracticeSession } from "@/hooks/usePracticeSession";
import { PRACTICE_TEXT } from "./constants";
import {
  Board,
  BoardMeta,
  DeckArea,
  ErrorText,
  Field,
  FieldLabel,
  Hero,
  HeroActions,
  HiddenCards,
  Input,
  Placeholder,
  ResultBackdrop,
  ResultCard,
  SettingsActions,
  SettingsBackdrop,
  SettingsCard,
  SettingsGrid,
  Stepper,
  StepperRow,
  SubmitRow,
  TopRow,
  Wrap,
} from "./styles";

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

const Practice = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const {
    setup,
    setSetup,
    stage,
    run,
    result,
    revealedCount,
    activeCard,
    elapsedMs,
    isPaused,
    submitting,
    error,
    canReveal,
    canPause,
    startRun,
    revealNext,
    pause,
    resume,
    submitCount,
    reset,
  } = usePracticeSession();

  const totalVisible = run?.visible_cards_count ?? 0;
  const readyForSubmit = stage === "awaiting_submit";
  const isRunning = stage === "running";
  const solved = stage === "resolved" && result;

  const resultTone = useMemo(
    () => (result?.is_correct ? PRACTICE_TEXT.CORRECT_TITLE : PRACTICE_TEXT.INCORRECT_TITLE),
    [result?.is_correct],
  );

  return (
    <Wrap>
      <Hero $elevation={2}>
        <TopRow>
          <div>
            <h1>{PRACTICE_TEXT.TITLE}</h1>
            <p>{PRACTICE_TEXT.SUBTITLE}</p>
          </div>
          <HeroActions>
            <GlassButton
              aria-label={PRACTICE_TEXT.OPEN_SETTINGS}
              $variant="secondary"
              onClick={() => setSettingsOpen(true)}
            >
              {PRACTICE_TEXT.SETTINGS_ICON}
            </GlassButton>
            <GlassButton
              $variant="secondary"
              disabled={!canPause}
              onClick={() => {
                if (isPaused) {
                  resume();
                } else {
                  pause();
                }
              }}
            >
              {isPaused ? PRACTICE_TEXT.RESUME : PRACTICE_TEXT.PAUSE}
            </GlassButton>
            <GlassButton $variant="secondary" onClick={() => navigate("/dashboard")}>
              {PRACTICE_TEXT.DASHBOARD}
            </GlassButton>
          </HeroActions>
        </TopRow>
        <p>{PRACTICE_TEXT.HIDDEN_HINT}</p>
      </Hero>

      <Board $elevation={2}>
        <BoardMeta>
          <GlassBadge>{PRACTICE_TEXT.TIMER(elapsedMs)}</GlassBadge>
          <GlassBadge>{PRACTICE_TEXT.PROGRESS(revealedCount, totalVisible)}</GlassBadge>
        </BoardMeta>

        <DeckArea
          data-testid="deck-area"
          disabled={!canReveal}
          onClick={() => {
            if (canReveal) revealNext();
          }}
        >
          {activeCard ? <Card code={activeCard} /> : <Placeholder>Deck</Placeholder>}
        </DeckArea>

        {setup.mode === "manual" ? <p>{PRACTICE_TEXT.MANUAL_HINT}</p> : null}

        {stage === "idle" ? (
          <GlassButton
            $variant="primary"
            onClick={() => {
              setInput("");
              void startRun();
            }}
          >
            {PRACTICE_TEXT.START_RUN}
          </GlassButton>
        ) : null}

        {readyForSubmit ? (
          <div>
            <Field htmlFor="practice-running-count">
              <FieldLabel>{PRACTICE_TEXT.RUNNING_COUNT_LABEL}</FieldLabel>
              <SubmitRow>
                <Input
                  id="practice-running-count"
                  type="number"
                  placeholder={PRACTICE_TEXT.RUNNING_COUNT_PLACEHOLDER}
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                />
                <GlassButton
                  $variant="primary"
                  disabled={!input.length || submitting}
                  onClick={() => {
                    void submitCount(Number(input));
                  }}
                >
                  {PRACTICE_TEXT.SUBMIT}
                </GlassButton>
              </SubmitRow>
            </Field>
          </div>
        ) : null}

        {error ? <ErrorText>{error}</ErrorText> : null}
      </Board>

      {solved ? (
        <ResultBackdrop>
          <ResultCard $elevation={3}>
            <h3>{resultTone}</h3>
            <GlassBadge>{result.is_correct ? PRACTICE_TEXT.RESULT_CORRECT : PRACTICE_TEXT.RESULT_INCORRECT}</GlassBadge>
            <GlassBadge>{PRACTICE_TEXT.PACE_BADGE(result.duration_per_deck_ms)}</GlassBadge>
            <p>{PRACTICE_TEXT.SUBMITTED(result.submitted_running_count)}</p>
            <p>{PRACTICE_TEXT.ACTUAL(result.actual_running_count)}</p>
            <p>{PRACTICE_TEXT.XP(result.xp_delta)}</p>
            <p>{PRACTICE_TEXT.HIDDEN_EXPLAIN}</p>
            <HiddenCards>
              {result.hidden_cards.map((card, idx) => (
                <Card key={`${card}-${idx}`} code={card} />
              ))}
            </HiddenCards>
            <GlassButton
              $variant="primary"
              onClick={() => {
                setInput("");
                reset();
              }}
            >
              {PRACTICE_TEXT.RESET}
            </GlassButton>
          </ResultCard>
        </ResultBackdrop>
      ) : null}

      {settingsOpen ? (
        <SettingsBackdrop
          onClick={() => {
            setSettingsOpen(false);
          }}
        >
          <SettingsCard
            $elevation={3}
            onClick={(event) => {
              event.stopPropagation();
            }}
          >
            <h3>{PRACTICE_TEXT.SETTINGS_TITLE}</h3>
            <p>{PRACTICE_TEXT.SETTINGS_HINT}</p>
            <SettingsGrid>
              <Field>
                <FieldLabel>{PRACTICE_TEXT.DECKS}</FieldLabel>
                <StepperRow>
                  <GlassButton
                    $variant="ghost"
                    onClick={() => setSetup((prev) => ({ ...prev, decks: clamp(prev.decks - 1, 1, 8) }))}
                    disabled={isRunning}
                  >
                    -
                  </GlassButton>
                  <Stepper>{setup.decks}</Stepper>
                  <GlassButton
                    $variant="ghost"
                    onClick={() => setSetup((prev) => ({ ...prev, decks: clamp(prev.decks + 1, 1, 8) }))}
                    disabled={isRunning}
                  >
                    +
                  </GlassButton>
                </StepperRow>
              </Field>

              <Field>
                <FieldLabel>{PRACTICE_TEXT.MODE}</FieldLabel>
                <SegmentedControl
                  value={setup.mode}
                  onChange={(value) =>
                    setSetup((prev) => ({ ...prev, mode: value as "auto" | "manual" }))
                  }
                  ariaLabel="Practice mode"
                  options={[
                    { value: "auto", label: "Automatic" },
                    { value: "manual", label: "Manual" },
                  ]}
                />
              </Field>

              <Field>
                <FieldLabel>{PRACTICE_TEXT.SPEED}</FieldLabel>
                <SegmentedControl
                  value={setup.speed_tier}
                  onChange={(value) =>
                    setSetup((prev) => ({
                      ...prev,
                      speed_tier: value as "beginner" | "intermediate" | "expert",
                    }))
                  }
                  ariaLabel="Practice speed"
                  options={[
                    { value: "beginner", label: "Beginner" },
                    { value: "intermediate", label: "Intermediate" },
                    { value: "expert", label: "Expert" },
                  ]}
                />
              </Field>
            </SettingsGrid>
            <SettingsActions>
              <GlassButton $variant="primary" onClick={() => setSettingsOpen(false)}>
                {PRACTICE_TEXT.SETTINGS_SAVE}
              </GlassButton>
              <GlassButton $variant="ghost" onClick={() => setSettingsOpen(false)}>
                {PRACTICE_TEXT.SETTINGS_CANCEL}
              </GlassButton>
            </SettingsActions>
          </SettingsCard>
        </SettingsBackdrop>
      ) : null}
    </Wrap>
  );
};

export default Practice;
