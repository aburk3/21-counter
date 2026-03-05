import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/test/test-utils";

import { ChipTray } from "@/components/ChipTray";

describe("ChipTray", () => {
  it("calls onChangeBet with increased amount", async () => {
    const user = userEvent.setup();
    const onChangeBet = vi.fn();
    renderWithProviders(
      <ChipTray onChangeBet={onChangeBet} currentBet={25} maxBet={500} />,
    );

    await user.click(screen.getByRole("button", { name: "Increase bet by $25" }));
    expect(onChangeBet).toHaveBeenCalledWith(50);
  });

  it("disables invalid increases and decreases", () => {
    renderWithProviders(
      <ChipTray onChangeBet={vi.fn()} currentBet={25} maxBet={475} />,
    );

    expect(screen.getByRole("button", { name: "Increase bet by $500" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Increase bet by $100" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "Decrease bet by $25" })).toBeDisabled();
  });
});
