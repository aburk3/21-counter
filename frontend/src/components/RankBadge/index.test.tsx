import { screen } from "@testing-library/react";
import {
  RANK_BADGE_TEXT,
  RANK_LABELS,
} from "@/components/RankBadge/constants";
import { renderWithProviders } from "@/test/test-utils";

import { RankBadge } from "@/components/RankBadge";

describe("RankBadge", () => {
  it("shows rank text", () => {
    renderWithProviders(<RankBadge rank="spotter" />);
    expect(
      screen.getByText(`${RANK_BADGE_TEXT.PREFIX} ${RANK_LABELS.spotter}`),
    ).toBeInTheDocument();
  });
});
