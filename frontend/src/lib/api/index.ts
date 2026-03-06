import {
  completeGoogleLogin,
  confirmEmailVerification,
  getGoogleStartUrl,
  login,
  register,
  requestEmailVerification,
} from "./auth";
import { clearTokens, hasToken, refreshToken } from "./client";
import {
  action,
  bet,
  createSession,
  deal,
  exitSession,
  getSession,
  nextRound,
  submitCount,
} from "./gameplay";
import { dashboard, startPracticeRun, submitPracticeRun } from "./progress";
import { me, refillChips, updateSettings } from "./user";

const api = {
  register,
  login,
  requestEmailVerification,
  confirmEmailVerification,
  getGoogleStartUrl,
  completeGoogleLogin,
  me,
  updateSettings,
  refillChips,
  dashboard,
  startPracticeRun,
  submitPracticeRun,
  createSession,
  getSession,
  bet,
  deal,
  action,
  submitCount,
  nextRound,
  exitSession,
};

export { api, clearTokens, hasToken, refreshToken };
