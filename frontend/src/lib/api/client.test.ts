import { describe, expect, it } from "vitest";

import { resolveApiUrl } from "@/lib/api/client";

describe("resolveApiUrl", () => {
  it("uses default local api for dev when unset", () => {
    expect(resolveApiUrl({ DEV: true })).toBe("http://localhost:8000/api");
  });

  it("uses explicit dev variable when provided", () => {
    expect(
      resolveApiUrl({
        DEV: true,
        VITE_API_URL_DEV: "http://localhost:9000/api/",
      }),
    ).toBe("http://localhost:9000/api");
  });

  it("uses production api variable for prod", () => {
    expect(
      resolveApiUrl({
        DEV: false,
        VITE_API_URL: "https://backend-service-production-181c.up.railway.app/api/",
      }),
    ).toBe("https://backend-service-production-181c.up.railway.app/api");
  });

  it("falls back to VITE_API_URL in dev when VITE_API_URL_DEV is absent", () => {
    expect(
      resolveApiUrl({
        DEV: true,
        VITE_API_URL: "https://backend-service-production-181c.up.railway.app/api",
      }),
    ).toBe(
      "https://backend-service-production-181c.up.railway.app/api",
    );
  });

  it("throws when production api variable is missing", () => {
    expect(() => resolveApiUrl({ DEV: false })).toThrow(
      "VITE_API_URL must be set for production builds.",
    );
  });
});
