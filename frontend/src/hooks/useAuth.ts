import { useState } from "react";

import { api } from "@/lib/api";
type AuthSubmitResult =
  | { ok: true; requiresVerification: false }
  | { ok: true; requiresVerification: true; detail: string }
  | { ok: false };

const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const submit = async (
    mode: "login" | "register",
    email: string,
    password: string
  ): Promise<AuthSubmitResult> => {
    setLoading(true);
    setError(null);
    setInfo(null);
    try {
      if (mode === "login") {
        await api.login(email, password);
        return { ok: true, requiresVerification: false };
      }
      const result = await api.register(email, password);
      if ("verification_required" in result && result.verification_required) {
        await api.requestEmailVerification(email);
        setInfo(result.detail);
        return {
          ok: true,
          requiresVerification: true,
          detail: result.detail,
        };
      }
      return { ok: true, requiresVerification: false };
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
      return { ok: false };
    } finally {
      setLoading(false);
    }
  };

  const startGoogleLogin = async () => {
    setError(null);
    try {
      const authUrl = await api.getGoogleStartUrl();
      window.location.assign(authUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Google sign-in failed");
    }
  };

  const completeGoogleLogin = async (code: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await api.completeGoogleLogin(code);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Google sign-in failed");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const verifyEmailToken = async (token: string): Promise<string> => {
    const result = await api.confirmEmailVerification(token);
    return result.detail;
  };

  return { loading, error, info, submit, startGoogleLogin, completeGoogleLogin, verifyEmailToken };
};

export { useAuth };
