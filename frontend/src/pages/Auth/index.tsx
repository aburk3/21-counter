import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { AUTH_PAGE_TEXT } from "./constants";
import { useAuth } from "@/hooks/useAuth";

import { Card, ErrorText, FormField, HelpText, InfoText, Input, Submit, Wrap } from "./styles";

const PASSWORD_MIN_LENGTH = 10;
const SPECIAL_CHAR_REGEX = /[^A-Za-z0-9]/;

const Auth = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.toString();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);
  const [localInfo, setLocalInfo] = useState<string | null>(null);
  const { loading, error, info, submit, startGoogleLogin, completeGoogleLogin, verifyEmailToken } =
    useAuth();

  const registerValidationError = useMemo(() => {
    if (mode !== "register") return null;
    if (password.length < PASSWORD_MIN_LENGTH) {
      return `Password must be at least ${PASSWORD_MIN_LENGTH} characters long.`;
    }
    if (!SPECIAL_CHAR_REGEX.test(password)) {
      return "Password must contain at least one special character.";
    }
    if (password !== confirmPassword) {
      return "Passwords do not match.";
    }
    return null;
  }, [mode, password, confirmPassword]);

  useEffect(() => {
    const params = new URLSearchParams(search);
    const verifyToken = params.get("token");
    const oauthCode = params.get("oauth_code");
    const oauthError = params.get("oauth_error");
    const run = async () => {
      if (verifyToken) {
        try {
          const message = await verifyEmailToken(verifyToken);
          setLocalInfo(message);
        } catch (err) {
          setLocalError(err instanceof Error ? err.message : "Email verification failed");
        } finally {
          const updated = new URLSearchParams(params);
          updated.delete("token");
          setSearchParams(updated, { replace: true });
        }
      }

      if (oauthCode) {
        const ok = await completeGoogleLogin(oauthCode);
        if (ok) {
          navigate("/dashboard");
          return;
        }
        const updated = new URLSearchParams(params);
        updated.delete("oauth_code");
        setSearchParams(updated, { replace: true });
      }

      if (oauthError) {
        setLocalError("Google sign-in failed. Please try again.");
        const updated = new URLSearchParams(params);
        updated.delete("oauth_error");
        setSearchParams(updated, { replace: true });
      }
    };
    void run();
  }, [search, setSearchParams, verifyEmailToken, completeGoogleLogin, navigate]);

  const handleSubmit = async () => {
    setLocalError(null);
    setLocalInfo(null);
    if (registerValidationError) {
      setLocalError(registerValidationError);
      return;
    }
    const result = await submit(mode, email, password);
    if (result.ok && !result.requiresVerification) {
      navigate("/dashboard");
      return;
    }
    if (result.ok && result.requiresVerification) {
      setLocalInfo(result.detail);
    }
  };

  return (
    <Wrap>
      <Card>
        <h1>{AUTH_PAGE_TEXT.APP_TITLE}</h1>
        <p>{AUTH_PAGE_TEXT.subtitle(mode)}</p>

        <FormField htmlFor="email">
          {AUTH_PAGE_TEXT.EMAIL_LABEL}
          <Input
            id="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </FormField>

        <FormField htmlFor="password">
          {AUTH_PAGE_TEXT.PASSWORD_LABEL}
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </FormField>
        {mode === "register" ? (
          <>
            <HelpText>{AUTH_PAGE_TEXT.PASSWORD_HELP}</HelpText>
            <FormField htmlFor="confirm-password">
              {AUTH_PAGE_TEXT.CONFIRM_PASSWORD_LABEL}
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
              />
            </FormField>
          </>
        ) : null}

        {localError || error ? <ErrorText role="alert">{localError ?? error}</ErrorText> : null}
        {localInfo || info ? <InfoText role="status">{localInfo ?? info}</InfoText> : null}
        <Submit onClick={handleSubmit} disabled={loading}>
          {loading
            ? AUTH_PAGE_TEXT.PLEASE_WAIT
            : mode === "login"
              ? AUTH_PAGE_TEXT.SUBMIT_LOGIN
              : AUTH_PAGE_TEXT.SUBMIT_REGISTER}
        </Submit>
        <Submit onClick={() => void startGoogleLogin()} disabled={loading}>
          {AUTH_PAGE_TEXT.GOOGLE_SIGN_IN}
        </Submit>
        <Submit onClick={() => setMode(mode === "login" ? "register" : "login")}>
          {mode === "login"
            ? AUTH_PAGE_TEXT.SWITCH_TO_REGISTER
            : AUTH_PAGE_TEXT.SWITCH_TO_LOGIN}
        </Submit>
      </Card>
    </Wrap>
  );
};

export default Auth;
