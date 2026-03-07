import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { AppShell } from "@/components/AppShell";
import { renderWithProviders } from "@/test/test-utils";

const mocks = vi.hoisted(() => ({
  me: vi.fn(),
  clearTokens: vi.fn(),
  navigate: vi.fn(),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mocks.navigate,
  };
});

vi.mock("@/lib/api", () => ({
  api: {
    me: mocks.me,
  },
  clearTokens: mocks.clearTokens,
}));

describe("AppShell", () => {
  beforeEach(() => {
    mocks.me.mockResolvedValue({
      email: "very.long.email.address+alias@example-super-long-domain.com",
      profile: { rank: "spotter" },
    });
    mocks.clearTokens.mockReset();
    mocks.navigate.mockReset();
  });

  it("renders long title, context, and email without breaking menu actions", async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <AppShell
        title="Very Long Dashboard Title For Stress Testing Header Layout"
        context="Very Long Context Label For Overflow Validation"
      >
        <div>Body</div>
      </AppShell>,
    );

    expect(screen.getByText("21 Counter")).toBeInTheDocument();
    expect(screen.getByText("Very Long Context Label For Overflow Validation")).toBeInTheDocument();

    expect(
      await screen.findByText("very.long.email.address+alias@example-super-long-domain.com"),
    ).toBeInTheDocument();

    const menuButton = await screen.findByRole("button", {
      name: "Open profile menu",
    });
    expect(menuButton).toBeInTheDocument();

    await user.click(menuButton);
    const logoutButton = await screen.findByRole("button", { name: "Logout" });
    await user.click(logoutButton);

    expect(mocks.clearTokens).toHaveBeenCalledTimes(1);
    expect(mocks.navigate).toHaveBeenCalledWith("/auth");
  });
});
