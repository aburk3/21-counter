import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/react";
import { ROUND_SUMMARY_TEXT } from "@/components/RoundSummaryDialog/constants";
import { renderWithProviders } from "@/test/test-utils";

import { RoundSummaryDialog } from "@/components/RoundSummaryDialog";

describe("RoundSummaryDialog", () => {
  it("submits typed running count before feedback is shown", async () => {
    const user = userEvent.setup();
    const onSubmitCount = vi.fn();

    renderWithProviders(
      <RoundSummaryDialog
        feedback={null}
        onSubmitCount={onSubmitCount}
        onNextRound={vi.fn()}
        onExit={vi.fn()}
      />,
    );

    await user.type(screen.getByLabelText(ROUND_SUMMARY_TEXT.RUNNING_COUNT_LABEL), "2");
    await user.click(
      screen.getByRole("button", { name: ROUND_SUMMARY_TEXT.SUBMIT_COUNT }),
    );

    expect(onSubmitCount).toHaveBeenCalledWith(2);
  });

  it("renders feedback and disables submit after submission", () => {
    renderWithProviders(
      <RoundSummaryDialog
        feedback={{
          is_correct: false,
          actual_running_count: 3,
          round_time_ms: 4000,
          strategy_correct: false,
          played_action: "hit",
          correct_action: "stand",
        }}
        onSubmitCount={vi.fn()}
        onNextRound={vi.fn()}
        onExit={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("button", { name: ROUND_SUMMARY_TEXT.SUBMIT_COUNT }),
    ).toBeDisabled();
    expect(screen.getAllByText(ROUND_SUMMARY_TEXT.COUNT_INCORRECT)).toHaveLength(2);
    expect(
      screen.getByText(ROUND_SUMMARY_TEXT.strategyIncorrect("hit", "stand")),
    ).toBeInTheDocument();
  });

  it("shows generic strategy hint for contradictory payloads", () => {
    renderWithProviders(
      <RoundSummaryDialog
        feedback={{
          is_correct: true,
          actual_running_count: 0,
          round_time_ms: 4000,
          strategy_correct: false,
          played_action: "hit",
          correct_action: "hit",
        }}
        onSubmitCount={vi.fn()}
        onNextRound={vi.fn()}
        onExit={vi.fn()}
      />,
    );

    expect(screen.getByText(ROUND_SUMMARY_TEXT.STRATEGY_REVIEW_HINT)).toBeInTheDocument();
    expect(
      screen.queryByText(ROUND_SUMMARY_TEXT.strategyIncorrect("hit", "hit")),
    ).not.toBeInTheDocument();
  });
});
