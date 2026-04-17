import type { CookieOptions } from 'express';

export const AUTH_COOKIE_NAME = 'access_token';

export function authCookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
}

export function authClearCookieOptions(): CookieOptions {
  const { path, sameSite, secure, httpOnly } = authCookieOptions();
  return { path, sameSite, secure, httpOnly };
}
