const AUTH_PAGE_TEXT = {
  APP_TITLE: "21 Counter",
  AUTH_HEADING: "Deliberate practice for serious counters.",
  AUTH_SUPPORT: "Train count speed and strategy under pressure.",
  EMAIL_LABEL: "Email",
  PASSWORD_LABEL: "Password",
  CONFIRM_PASSWORD_LABEL: "Confirm Password",
  PASSWORD_HELP:
    "Use at least 10 characters and include at least one special character.",
  PASSWORD_REQUIREMENTS: {
    LENGTH: "At least 10 characters",
    SPECIAL: "Contains a special character",
    MATCH: "Passwords match",
  },
  PLEASE_WAIT: "Please wait",
  SWITCH_TO_REGISTER: "Switch to Register",
  SWITCH_TO_LOGIN: "Switch to Login",
  SUBMIT_LOGIN: "Login",
  SUBMIT_REGISTER: "Create Account",
  GOOGLE_SIGN_IN: "Continue with Google",
  SEGMENT_LOGIN: "Login",
  SEGMENT_REGISTER: "Register",
  VERIFY_HINT: "If verification is required, we will email the next steps.",
  subtitle: (mode: "login" | "register") =>
    `${mode === "login" ? "Login" : "Register"} with email and password.`,
} as const;

export { AUTH_PAGE_TEXT };
