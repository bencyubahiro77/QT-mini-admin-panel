import { EnvConfig } from '../types';

function getEnv(key: string, defaultValue?: string): string {
  const value = process.env[key] || defaultValue;
  
  if (!value) {
    console.warn(`Warning: Environment variable ${key} is not set`);
    return '';
  }
  
  return value;
}

export const env: EnvConfig = {
  NODE_ENV: getEnv('NODE_ENV', 'development'),
  PORT: parseInt(getEnv('PORT', '5000'), 10),
  DATABASE_URL: getEnv('DATABASE_URL', 'file:./prisma/dev.db'),
  CORS_ORIGIN: getEnv('CORS_ORIGIN', 'http://localhost:5173'),
};

export const isDevelopment = (): boolean => {
  return env.NODE_ENV === 'development';
};

export const isProduction = (): boolean => {
  return env.NODE_ENV === 'production';
};

