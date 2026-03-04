import { useState } from "react";

import { ROUND_SUMMARY_TEXT } from "./constants";

import { Backdrop, Button, Dialog, Field, Footer, Input, Result } from "./styles";

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

  return (
    <Backdrop>
      <Dialog>
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
        <Button
          onClick={() => onSubmitCount(Number(value))}
          disabled={!value.length || Boolean(feedback)}
        >
          {ROUND_SUMMARY_TEXT.SUBMIT_COUNT}
        </Button>

        {feedback ? (
          <Result>
            <p>
              {feedback.is_correct
                ? ROUND_SUMMARY_TEXT.COUNT_CORRECT
                : ROUND_SUMMARY_TEXT.COUNT_INCORRECT}
            </p>
            <p>{ROUND_SUMMARY_TEXT.actualCount(feedback.actual_running_count)}</p>
            <p>{ROUND_SUMMARY_TEXT.roundTime(feedback.round_time_ms)}</p>
            <p>
              {feedback.strategy_correct
                ? ROUND_SUMMARY_TEXT.STRATEGY_CORRECT
                : ROUND_SUMMARY_TEXT.strategyIncorrect(
                    feedback.played_action,
                    feedback.correct_action,
                  )}
            </p>
          </Result>
        ) : null}

        <Footer>
          <Button onClick={onNextRound} disabled={!feedback}>
            {ROUND_SUMMARY_TEXT.NEXT_ROUND}
          </Button>
          <Button onClick={onExit}>{ROUND_SUMMARY_TEXT.EXIT_SESSION}</Button>
        </Footer>
      </Dialog>
    </Backdrop>
  );
};

export { RoundSummaryDialog };
