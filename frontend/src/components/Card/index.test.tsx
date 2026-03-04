import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/test/test-utils";

import { Card } from "@/components/Card";

describe("Card", () => {
  it("renders rank and suit", () => {
    renderWithProviders(<Card code="AH" />);
    expect(screen.getByTestId("card-face")).toBeInTheDocument();
    expect(screen.getAllByText("A♥").length).toBeGreaterThan(0);
  });
});
