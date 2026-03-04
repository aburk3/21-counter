import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/test/test-utils";

import { ChipTray } from "@/components/ChipTray";

describe("ChipTray", () => {
  it("calls onBet with selected chip amount", async () => {
    const user = userEvent.setup();
    const onBet = vi.fn();
    renderWithProviders(<ChipTray onBet={onBet} chips={500} />);

    await user.click(screen.getByRole("button", { name: "$25" }));
    expect(onBet).toHaveBeenCalledWith(25);
  });

  it("disables chips above available balance", () => {
    renderWithProviders(<ChipTray onBet={vi.fn()} chips={475} />);

    expect(screen.getByRole("button", { name: "$500" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "$100" })).toBeEnabled();
  });
});
