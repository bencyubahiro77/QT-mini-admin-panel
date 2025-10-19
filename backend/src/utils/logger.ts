import { env } from '../config/env';

class Logger {
  private isDev = env.NODE_ENV === 'development';

  info(message: string, meta?: any) {
    if (this.isDev) {
      console.log(`[INFO] ${message}`, meta || '');
    }
  }

  error(message: string, error?: any) {
    console.error(`[ERROR] ${message}`, error || '');
  }

  warn(message: string, meta?: any) {
    if (this.isDev) {
      console.warn(`[WARN] ${message}`, meta || '');
    }
  }

  debug(message: string, meta?: any) {
    if (this.isDev) {
      console.log(`[DEBUG] ${message}`, meta || '');
    }
  }
}

export const logger = new Logger();
