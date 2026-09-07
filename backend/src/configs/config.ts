import dotenv from 'dotenv';
dotenv.config();

function requireEnv(value: string | undefined, name: string): string {
    if (value === undefined || value === null || value === '') {
        throw new Error(`Missing required environment variable: ${name}`);
    }

    return value;
}

function optionalEnv(value: string | undefined, fallback: string): string {
    return value === undefined || value === null || value === '' ? fallback : value;
}

const config = {
    NODE_ENV: optionalEnv(process.env.NODE_ENV, 'development'),
    PORT: requireEnv(process.env.PORT, 'PORT'),
    DATABASE_URL: requireEnv(process.env.DATABASE_URL, 'DATABASE_URL'),

    JWT_ACCESS_SECRET: requireEnv(process.env.JWT_ACCESS_SECRET, 'JWT_ACCESS_SECRET'),
    JWT_REFRESH_SECRET: requireEnv(process.env.JWT_REFRESH_SECRET, 'JWT_REFRESH_SECRET'),
    JWT_ACCESS_EXPIRES_IN: optionalEnv(process.env.JWT_ACCESS_EXPIRES_IN, '15m'),
    JWT_REFRESH_EXPIRES_IN: optionalEnv(process.env.JWT_REFRESH_EXPIRES_IN, '30d'),
    // Same duration as JWT_REFRESH_EXPIRES_IN, but in milliseconds, for the cookie's maxAge.
    REFRESH_COOKIE_MAX_AGE_MS: 30 * 24 * 60 * 60 * 1000,

    COOKIE_DOMAIN: process.env.COOKIE_DOMAIN || undefined,
};

export const isProduction = config.NODE_ENV === 'production';

export default config;
