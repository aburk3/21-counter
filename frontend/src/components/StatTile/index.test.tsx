import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/test/test-utils";

import { StatTile } from "@/components/StatTile";

describe("StatTile", () => {
  it("renders metric value", () => {
    renderWithProviders(<StatTile label="Accuracy" value="92%" />);
    expect(screen.getByText("Accuracy")).toBeInTheDocument();
    expect(screen.getByText("92%")).toBeInTheDocument();
  });
});
