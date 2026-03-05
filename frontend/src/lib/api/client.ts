const DEFAULT_DEV_API_URL = "http://localhost:8000/api";

type EnvConfig = {
  DEV: boolean;
  VITE_API_URL?: string;
  VITE_API_URL_DEV?: string;
};

const resolveApiUrl = (env: EnvConfig): string => {
  const value = env.DEV
    ? (env.VITE_API_URL_DEV ?? env.VITE_API_URL ?? DEFAULT_DEV_API_URL)
    : env.VITE_API_URL;
  if (!value) {
    throw new Error("VITE_API_URL must be set for production builds.");
  }
  return value.replace(/\/+$/, "");
};

const API_URL = resolveApiUrl({
  DEV: import.meta.env.DEV,
  VITE_API_URL: import.meta.env.VITE_API_URL,
  VITE_API_URL_DEV: import.meta.env.VITE_API_URL_DEV,
});
const ACCESS_KEY = "counter.access";
const REFRESH_KEY = "counter.refresh";

const getAccessToken = () => localStorage.getItem(ACCESS_KEY);
const getRefreshToken = () => localStorage.getItem(REFRESH_KEY);

const setTokens = (access: string, refresh: string) => {
  localStorage.setItem(ACCESS_KEY, access);
  localStorage.setItem(REFRESH_KEY, refresh);
};

const clearTokens = () => {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
};

const refreshToken = async (): Promise<boolean> => {
  const refresh = getRefreshToken();
  if (!refresh) return false;

  const response = await fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  });
  if (!response.ok) {
    clearTokens();
    return false;
  }

  const data = (await response.json()) as { access: string; refresh: string };
  setTokens(data.access, data.refresh);
  return true;
};

const request = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const access = getAccessToken();
  const headers = new Headers(init?.headers ?? {});
  headers.set("Content-Type", "application/json");
  if (access) headers.set("Authorization", `Bearer ${access}`);

  let response = await fetch(`${API_URL}${path}`, { ...init, headers });
  if (response.status === 401 && getRefreshToken()) {
    const refreshed = await refreshToken();
    if (refreshed) {
      headers.set("Authorization", `Bearer ${getAccessToken()}`);
      response = await fetch(`${API_URL}${path}`, { ...init, headers });
    }
  }

  if (!response.ok) {
    const body = await response.json().catch(() => ({ detail: "Request failed" }));
    throw new Error(body.detail ?? "Request failed");
  }
  return response.json() as Promise<T>;
};

const hasToken = () => Boolean(getAccessToken());

export { request, setTokens, clearTokens, refreshToken, hasToken, resolveApiUrl };
