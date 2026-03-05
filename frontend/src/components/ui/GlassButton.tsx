import styled, { css } from "styled-components";

type Variant = "primary" | "secondary" | "destructive" | "ghost";

const variantStyles: Record<Variant, ReturnType<typeof css>> = {
  primary: css`
    background: linear-gradient(160deg, rgba(159, 249, 237, 0.78), rgba(96, 214, 222, 0.62));
    color: #082f2c;
    border-color: rgba(190, 255, 245, 0.82);
  `,
  secondary: css`
    background: rgba(245, 254, 250, 0.17);
    color: ${({ theme }) => theme.colors.text};
    border-color: rgba(255, 255, 255, 0.44);
  `,
  destructive: css`
    background: linear-gradient(160deg, rgba(255, 170, 170, 0.35), rgba(255, 117, 117, 0.25));
    color: #ffe9e9;
    border-color: rgba(255, 167, 167, 0.66);
  `,
  ghost: css`
    background: transparent;
    color: ${({ theme }) => theme.colors.textSecondary};
    border-color: rgba(255, 255, 255, 0.2);
  `,
};

const GlassButton = styled.button<{ $variant?: Variant; $full?: boolean }>`
  ${({ theme, $variant = "secondary", $full = false }) => css`
    width: ${$full ? "100%" : "auto"};
    min-height: 44px;
    padding: 11px 16px;
    border-radius: ${theme.radius.md};
    border: 1px solid transparent;
    font-weight: 650;
    letter-spacing: 0.01em;
    cursor: pointer;
    transition: background 180ms ease, border-color 180ms ease;
    ${variantStyles[$variant]}

    &:not(:disabled):hover {
      border-color: rgba(255, 255, 255, 0.62);
    }

    &:disabled {
      opacity: 0.45;
      cursor: not-allowed;
    }
  `}
`;

export { GlassButton };
