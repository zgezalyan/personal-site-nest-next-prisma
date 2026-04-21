import type { CookieOptions } from 'express';

export const AUTH_COOKIE_NAME = 'access_token';

export function buildAuthCookieOptions(
  secure: boolean,
  maxAgeMs: number,
): CookieOptions {
  return {
    httpOnly: true,
    sameSite: 'lax',
    secure,
    path: '/',
    maxAge: maxAgeMs,
  };
}

export function buildAuthClearCookieOptions(secure: boolean): CookieOptions {
  const {
    path,
    sameSite,
    secure: s,
    httpOnly,
  } = buildAuthCookieOptions(secure, 0);
  return { path, sameSite, secure: s, httpOnly };
}
