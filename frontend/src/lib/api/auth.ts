import type { AuthResponse, AuthSuccessResponse } from "@/types/api";

import { request, setTokens } from "./client";

const register = async (email: string, password: string) => {
  const data = await request<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  return data;
};

const login = async (email: string, password: string) => {
  const data = await request<AuthSuccessResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  setTokens(data.access, data.refresh);
  return data;
};

const requestEmailVerification = async (email: string) =>
  request<{ detail: string }>("/auth/email/verify/request", {
    method: "POST",
    body: JSON.stringify({ email }),
  });

const confirmEmailVerification = async (token: string) =>
  request<{ detail: string }>("/auth/email/verify/confirm", {
    method: "POST",
    body: JSON.stringify({ token }),
  });

const getGoogleStartUrl = async () => {
  const data = await request<{ auth_url: string }>("/auth/google/start");
  return data.auth_url;
};

const completeGoogleLogin = async (code: string) => {
  const data = await request<AuthSuccessResponse>("/auth/google/complete", {
    method: "POST",
    body: JSON.stringify({ code }),
  });
  setTokens(data.access, data.refresh);
  return data;
};

export {
  register,
  login,
  requestEmailVerification,
  confirmEmailVerification,
  getGoogleStartUrl,
  completeGoogleLogin,
};
