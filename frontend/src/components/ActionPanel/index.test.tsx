import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/react";
import { ACTION_LABELS } from "@/components/ActionPanel/constants";
import { renderWithProviders } from "@/test/test-utils";

import { ActionPanel } from "@/components/ActionPanel";

describe("ActionPanel", () => {
  it("fires action callback", async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    renderWithProviders(<ActionPanel actions={["hit", "stand"]} onAction={onAction} />);

    await user.click(screen.getByRole("button", { name: ACTION_LABELS.hit }));
    expect(onAction).toHaveBeenCalledWith("hit");
  });
});
