import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { GlassButton } from "@/components/ui/GlassButton";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { useAuth } from "@/hooks/useAuth";
import { AUTH_PAGE_TEXT } from "./constants";

import {
  AuthPanel,
  BrandPanel,
  BrandTag,
  ErrorText,
  FormField,
  HelpText,
  InfoText,
  Input,
  Requirement,
  RequirementList,
  Shell,
  TertiaryAction,
  VerifyHint,
  Wrap,
} from "./styles";

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

  const checks = useMemo(
    () => ({
      length: password.length >= PASSWORD_MIN_LENGTH,
      special: SPECIAL_CHAR_REGEX.test(password),
      matches: mode === "login" || (password.length > 0 && password === confirmPassword),
    }),
    [mode, password, confirmPassword],
  );

  const registerValidationError = useMemo(() => {
    if (mode !== "register") return null;
    if (!checks.length) {
      return `Password must be at least ${PASSWORD_MIN_LENGTH} characters long.`;
    }
    if (!checks.special) {
      return "Password must contain at least one special character.";
    }
    if (!checks.matches) {
      return "Passwords do not match.";
    }
    return null;
  }, [mode, checks]);

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
      <Shell $elevation={2}>
        <BrandPanel>
          <div>
            <BrandTag>Blackjack Trainer</BrandTag>
            <h1>{AUTH_PAGE_TEXT.APP_TITLE}</h1>
            <h2>{AUTH_PAGE_TEXT.AUTH_HEADING}</h2>
          </div>
          <p>{AUTH_PAGE_TEXT.AUTH_SUPPORT}</p>
        </BrandPanel>

        <AuthPanel>
          <SegmentedControl
            value={mode}
            onChange={(value) => setMode(value as "login" | "register")}
            ariaLabel="Authentication mode"
            options={[
              { value: "login", label: AUTH_PAGE_TEXT.SEGMENT_LOGIN },
              { value: "register", label: AUTH_PAGE_TEXT.SEGMENT_REGISTER },
            ]}
          />
          <p>{AUTH_PAGE_TEXT.subtitle(mode)}</p>

          <FormField htmlFor="email">
            {AUTH_PAGE_TEXT.EMAIL_LABEL}
            <Input id="email" value={email} onChange={(event) => setEmail(event.target.value)} />
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
              <RequirementList>
                <Requirement $ok={checks.length}>{AUTH_PAGE_TEXT.PASSWORD_REQUIREMENTS.LENGTH}</Requirement>
                <Requirement $ok={checks.special}>{AUTH_PAGE_TEXT.PASSWORD_REQUIREMENTS.SPECIAL}</Requirement>
                <Requirement $ok={checks.matches}>{AUTH_PAGE_TEXT.PASSWORD_REQUIREMENTS.MATCH}</Requirement>
              </RequirementList>
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
          <VerifyHint>{AUTH_PAGE_TEXT.VERIFY_HINT}</VerifyHint>

          <GlassButton onClick={handleSubmit} disabled={loading} $variant="primary" $full>
            {loading
              ? AUTH_PAGE_TEXT.PLEASE_WAIT
              : mode === "login"
                ? AUTH_PAGE_TEXT.SUBMIT_LOGIN
                : AUTH_PAGE_TEXT.SUBMIT_REGISTER}
          </GlassButton>
          <GlassButton onClick={() => void startGoogleLogin()} disabled={loading} $full>
            {AUTH_PAGE_TEXT.GOOGLE_SIGN_IN}
          </GlassButton>
          <TertiaryAction onClick={() => setMode(mode === "login" ? "register" : "login")}> 
            {mode === "login"
              ? AUTH_PAGE_TEXT.SWITCH_TO_REGISTER
              : AUTH_PAGE_TEXT.SWITCH_TO_LOGIN}
          </TertiaryAction>
        </AuthPanel>
      </Shell>
    </Wrap>
  );
};

export default Auth;
