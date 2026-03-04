import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/react";

import { ROUND_RESOLVED_TEXT } from "@/components/RoundResolvedOverlay/constants";
import { RoundResolvedOverlay } from "@/components/RoundResolvedOverlay";
import { renderWithProviders } from "@/test/test-utils";

describe("RoundResolvedOverlay", () => {
  it("renders and continues to count flow", async () => {
    const user = userEvent.setup();
    const onContinue = vi.fn();
    renderWithProviders(<RoundResolvedOverlay onContinue={onContinue} />);

    expect(screen.getByText(ROUND_RESOLVED_TEXT.TITLE)).toBeInTheDocument();
    await user.click(
      screen.getByRole("button", { name: ROUND_RESOLVED_TEXT.CONTINUE_TO_COUNT }),
    );
    expect(onContinue).toHaveBeenCalled();
  });
});
