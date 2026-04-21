const DEV_JWT_SECRET = 'dev_secret_temporary_secret';
const DEFAULT_JWT_EXPIRES_IN = '7d';
const DEFAULT_COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * Normalizes and validates environment variables after they are loaded.
 * Fails fast when NODE_ENV=production if JWT_SECRET is missing or empty.
 */
export function validateEnv(config: Record<string, unknown>): Record<string, unknown> {
  const nodeEnv = String(config.NODE_ENV ?? 'development');
  const out: Record<string, unknown> = { ...config, NODE_ENV: nodeEnv };

  const rawSecret = config.JWT_SECRET;
  const hasSecret = typeof rawSecret === 'string' && rawSecret.trim().length > 0;

  if (nodeEnv === 'production' && !hasSecret) {
    throw new Error('JWT_SECRET is required when NODE_ENV is production');
  }

  if (!hasSecret) {
    out.JWT_SECRET = DEV_JWT_SECRET;
  }

  const expiresIn = config.JWT_EXPIRES_IN;
  if (expiresIn === undefined || expiresIn === '' || expiresIn === null) {
    out.JWT_EXPIRES_IN = DEFAULT_JWT_EXPIRES_IN;
  }

  const rawCookieMs = out.JWT_COOKIE_MAX_AGE_MS;
  if (rawCookieMs === undefined || rawCookieMs === '' || rawCookieMs === null) {
    out.JWT_COOKIE_MAX_AGE_MS = String(DEFAULT_COOKIE_MAX_AGE_MS);
  } else {
    const n = Number(rawCookieMs);
    if (!Number.isFinite(n) || n <= 0) {
      throw new Error('JWT_COOKIE_MAX_AGE_MS must be a positive number (milliseconds)');
    }
    out.JWT_COOKIE_MAX_AGE_MS = String(Math.floor(n));
  }

  return out;
}
