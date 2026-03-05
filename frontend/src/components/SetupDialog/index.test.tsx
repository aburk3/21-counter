import userEvent from "@testing-library/user-event";
import { screen, within } from "@testing-library/react";
import { SETUP_DIALOG_TEXT } from "@/components/SetupDialog/constants";
import { renderWithProviders } from "@/test/test-utils";

import { SetupDialog } from "@/components/SetupDialog";

describe("SetupDialog", () => {
  it("submits selected values", async () => {
    const user = userEvent.setup();
    const onContinue = vi.fn();

    renderWithProviders(
      <SetupDialog
        defaults={{ decks_per_shoe: 6, hands_dealt: 3 }}
        onContinue={onContinue}
      />,
    );

    const decksLabel = screen.getByText(SETUP_DIALOG_TEXT.DECKS_PER_SHOE).closest("label");
    if (!decksLabel) {
      throw new Error("Decks field was not found");
    }

    const deckStepper = within(decksLabel);
    await user.click(deckStepper.getByRole("button", { name: "+" }));
    await user.click(deckStepper.getByRole("button", { name: "+" }));
    await user.click(screen.getByRole("button", { name: SETUP_DIALOG_TEXT.CONTINUE }));

    expect(onContinue).toHaveBeenCalledWith({
      decks_per_shoe: 8,
      hands_dealt: 3,
    });
  });
});
