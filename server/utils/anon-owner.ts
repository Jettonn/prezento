import type { H3Event } from "h3";
import { createHmac, randomBytes } from "node:crypto";

import env from "~/lib/env";

const COOKIE_NAME = "prezento_anon";
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

export function hmacToken(rawToken: string): string {
  return createHmac("sha256", env.BETTER_AUTH_SECRET).update(rawToken).digest("hex");
}

export function readAnonCookie(event: H3Event): string | null {
  return getCookie(event, COOKIE_NAME) ?? null;
}

export function readAnonTokenHash(event: H3Event): string | null {
  const raw = readAnonCookie(event);
  return raw ? hmacToken(raw) : null;
}

export function getOrIssueAnonToken(event: H3Event): { raw: string; hash: string } {
  const existing = readAnonCookie(event);
  if (existing) {
    return { raw: existing, hash: hmacToken(existing) };
  }
  const raw = randomBytes(32).toString("base64url");
  setCookie(event, COOKIE_NAME, raw, {
    httpOnly: true,
    sameSite: "lax",
    secure: env.NODE_ENV !== "development",
    path: "/",
    maxAge: COOKIE_MAX_AGE_SECONDS,
  });
  return { raw, hash: hmacToken(raw) };
}

export function clearAnonCookie(event: H3Event): void {
  deleteCookie(event, COOKIE_NAME, { path: "/" });
}
