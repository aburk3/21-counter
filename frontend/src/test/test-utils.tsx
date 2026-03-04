import type { PropsWithChildren, ReactElement } from "react";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { render } from "@testing-library/react";

import { theme } from "@/styles/theme";

const Providers = ({ children }: PropsWithChildren) => {
  return (
    <ThemeProvider theme={theme}>
      <MemoryRouter
        future={{ v7_relativeSplatPath: true, v7_startTransition: true }}
      >
        {children}
      </MemoryRouter>
    </ThemeProvider>
  );
};

const renderWithProviders = (ui: ReactElement) => {
  return render(ui, { wrapper: Providers });
};

export { renderWithProviders };
