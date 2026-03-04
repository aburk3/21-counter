const AUTH_PAGE_TEXT = {
  APP_TITLE: "21 Counter",
  EMAIL_LABEL: "Email",
  PASSWORD_LABEL: "Password",
  CONFIRM_PASSWORD_LABEL: "Confirm Password",
  PASSWORD_HELP:
    "Use at least 10 characters and include at least one special character.",
  PLEASE_WAIT: "Please wait",
  SWITCH_TO_REGISTER: "Switch to Register",
  SWITCH_TO_LOGIN: "Switch to Login",
  SUBMIT_LOGIN: "Login",
  SUBMIT_REGISTER: "Register",
  GOOGLE_SIGN_IN: "Continue with Google",
  subtitle: (mode: "login" | "register") =>
    `${mode === "login" ? "Login" : "Register"} with email and password.`,
} as const;

export { AUTH_PAGE_TEXT };
