import { useState } from "react";

import { GlassButton } from "@/components/ui/GlassButton";
import { ROUND_SUMMARY_TEXT } from "./constants";

import { Backdrop, Dialog, Field, Footer, Input, Pill, ResultGrid, ResultItem, Row } from "./styles";

type Feedback = {
  is_correct: boolean;
  actual_running_count: number;
  round_time_ms: number;
  strategy_correct: boolean;
  played_action: string;
  correct_action: string;
};

type RoundSummaryDialogProps = {
  feedback: Feedback | null;
  onSubmitCount: (value: number) => void;
  onNextRound: () => void;
  onExit: () => void;
};

const RoundSummaryDialog = ({
  feedback,
  onSubmitCount,
  onNextRound,
  onExit,
}: RoundSummaryDialogProps) => {
  const [value, setValue] = useState("");
  const hasSpecificStrategyMismatch = Boolean(
    feedback &&
      !feedback.strategy_correct &&
      feedback.played_action &&
      feedback.correct_action &&
      feedback.played_action !== feedback.correct_action,
  );

  return (
    <Backdrop>
      <Dialog $elevation={3}>
        <h3>{ROUND_SUMMARY_TEXT.TITLE}</h3>
        <Field htmlFor="count-input">
          {ROUND_SUMMARY_TEXT.RUNNING_COUNT_LABEL}
          <Input
            id="count-input"
            type="number"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder={ROUND_SUMMARY_TEXT.RUNNING_COUNT_PLACEHOLDER}
            disabled={Boolean(feedback)}
          />
        </Field>
        <GlassButton
          $variant="primary"
          onClick={() => onSubmitCount(Number(value))}
          disabled={!value.length || Boolean(feedback)}
        >
          {ROUND_SUMMARY_TEXT.SUBMIT_COUNT}
        </GlassButton>

        {feedback ? (
          <ResultGrid>
            <ResultItem $elevation={1}>
              <Row>
                <strong>{ROUND_SUMMARY_TEXT.COUNT_BLOCK}</strong>
                <Pill $tone={feedback.is_correct ? "good" : "warn"}>
                  {feedback.is_correct ? ROUND_SUMMARY_TEXT.COUNT_CORRECT : ROUND_SUMMARY_TEXT.COUNT_INCORRECT}
                </Pill>
              </Row>
              <span>{ROUND_SUMMARY_TEXT.yourCount(value.length ? value : "—")}</span>
              <span>{ROUND_SUMMARY_TEXT.actualCount(feedback.actual_running_count)}</span>
            </ResultItem>
            <ResultItem $elevation={1}>
              <Row>
                <strong>{ROUND_SUMMARY_TEXT.DECISION_BLOCK}</strong>
                <Pill $tone={feedback.strategy_correct ? "good" : "warn"}>
                  {feedback.strategy_correct
                    ? ROUND_SUMMARY_TEXT.STRATEGY_CORRECT
                    : ROUND_SUMMARY_TEXT.STRATEGY_INCORRECT}
                </Pill>
              </Row>
              <span>
                {feedback.strategy_correct
                  ? "Played the correct basic strategy move."
                  : hasSpecificStrategyMismatch
                    ? ROUND_SUMMARY_TEXT.strategyIncorrect(
                        feedback.played_action,
                        feedback.correct_action,
                      )
                    : ROUND_SUMMARY_TEXT.STRATEGY_REVIEW_HINT}
              </span>
            </ResultItem>
            <ResultItem $elevation={1}>
              <Row>
                <strong>{ROUND_SUMMARY_TEXT.PACE_BLOCK}</strong>
                <Pill $tone={feedback.round_time_ms <= 10000 ? "good" : "warn"}>
                  {ROUND_SUMMARY_TEXT.speedRating(feedback.round_time_ms)}
                </Pill>
              </Row>
              <span>{ROUND_SUMMARY_TEXT.roundTime(feedback.round_time_ms)}</span>
            </ResultItem>
          </ResultGrid>
        ) : null}

        <Footer>
          <GlassButton $variant="primary" onClick={onNextRound} disabled={!feedback}>
            {ROUND_SUMMARY_TEXT.NEXT_ROUND}
          </GlassButton>
          <GlassButton $variant="secondary" disabled>
            {ROUND_SUMMARY_TEXT.REVIEW_HAND}
          </GlassButton>
          <GlassButton $variant="destructive" onClick={onExit}>
            {ROUND_SUMMARY_TEXT.EXIT_SESSION}
          </GlassButton>
        </Footer>
      </Dialog>
    </Backdrop>
  );
};

export { RoundSummaryDialog };
