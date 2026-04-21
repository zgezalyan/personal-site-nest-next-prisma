import { validateEnv } from './env.validation';

describe('validateEnv', () => {
  it('applies development defaults when values are missing', () => {
    const result = validateEnv({});

    expect(result.NODE_ENV).toBe('development');
    expect(result.JWT_SECRET).toBe('dev_secret_temporary_secret');
    expect(result.JWT_EXPIRES_IN).toBe('7d');
    expect(result.JWT_COOKIE_MAX_AGE_MS).toBe(String(7 * 24 * 60 * 60 * 1000));
  });

  it('throws in production when JWT_SECRET is missing', () => {
    expect(() => validateEnv({ NODE_ENV: 'production' })).toThrow(
      'JWT_SECRET is required when NODE_ENV is production',
    );
  });

  it('accepts production config with explicit secret', () => {
    const result = validateEnv({
      NODE_ENV: 'production',
      JWT_SECRET: 'super-secret',
      JWT_COOKIE_MAX_AGE_MS: '3600000',
    });

    expect(result.NODE_ENV).toBe('production');
    expect(result.JWT_SECRET).toBe('super-secret');
    expect(result.JWT_COOKIE_MAX_AGE_MS).toBe('3600000');
  });

  it('rejects invalid cookie max age', () => {
    expect(() =>
      validateEnv({
        JWT_COOKIE_MAX_AGE_MS: '0',
      }),
    ).toThrow('JWT_COOKIE_MAX_AGE_MS must be a positive number (milliseconds)');
  });
});
