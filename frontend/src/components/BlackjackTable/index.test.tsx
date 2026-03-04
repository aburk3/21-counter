import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/test/test-utils";

import { BlackjackTable } from "@/components/BlackjackTable";
import { TABLE_TEXT } from "@/components/BlackjackTable/constants";

describe("BlackjackTable", () => {
  it("renders chips and table metrics", () => {
    renderWithProviders(
      <BlackjackTable
        state={null}
        chips={500}
        timerMs={0}
        totalGainLoss={0}
        skin="classic_red"
      />,
    );

    expect(screen.getByText(TABLE_TEXT.chips(500))).toBeInTheDocument();
    expect(screen.getByText(TABLE_TEXT.yourBet(0))).toBeInTheDocument();
  });
});
