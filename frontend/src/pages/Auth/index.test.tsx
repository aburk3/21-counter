import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/react";
import { AUTH_PAGE_TEXT } from "@/pages/Auth/constants";

import { renderWithProviders } from "@/test/test-utils";
import Auth from "@/pages/Auth";

vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({
    loading: false,
    error: null,
    info: null,
    submit: vi.fn().mockResolvedValue({ ok: false }),
    startGoogleLogin: vi.fn(),
    completeGoogleLogin: vi.fn().mockResolvedValue(false),
    verifyEmailToken: vi.fn().mockResolvedValue("ok"),
  }),
}));

describe("Auth page", () => {
  it("renders form fields and allows toggling mode", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Auth />);

    expect(screen.getByLabelText(AUTH_PAGE_TEXT.EMAIL_LABEL)).toBeInTheDocument();
    await user.click(
      screen.getByRole("button", { name: AUTH_PAGE_TEXT.SWITCH_TO_REGISTER }),
    );
    expect(screen.getByText(AUTH_PAGE_TEXT.subtitle("register"))).toBeInTheDocument();
    expect(screen.getByLabelText(AUTH_PAGE_TEXT.CONFIRM_PASSWORD_LABEL)).toBeInTheDocument();
  });

  it("validates password confirmation in register mode", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Auth />);

    await user.click(screen.getByRole("button", { name: AUTH_PAGE_TEXT.SWITCH_TO_REGISTER }));
    await user.type(screen.getByLabelText(AUTH_PAGE_TEXT.PASSWORD_LABEL), "Password!1");
    await user.type(screen.getByLabelText(AUTH_PAGE_TEXT.CONFIRM_PASSWORD_LABEL), "Mismatch!1");
    await user.click(screen.getByRole("button", { name: AUTH_PAGE_TEXT.SUBMIT_REGISTER }));

    expect(screen.getByRole("alert")).toHaveTextContent("Passwords do not match.");
  });
});
