// @ts-nocheck
/**
 * Gated logger utility — only logs in development mode.
 * Drop-in replacement for console.log/warn in hot paths.
 * console.error is kept ungated for genuine errors.
 */

const isDev = import.meta.env.DEV;

export const logger = {
  log: isDev
    ? (...args: any[]) => console.log(...args)
    : () => {},
  warn: isDev
    ? (...args: any[]) => console.warn(...args)
    : () => {},
  // Errors are always logged
  error: (...args: any[]) => console.error(...args),
};
