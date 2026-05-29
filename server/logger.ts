/* eslint-disable no-console */

// A deliberately tiny logger so the dummy service has no external logging
// dependency. The real service uses bunyan.
const logger = {
  info: (...args: unknown[]) => console.log('[info]', ...args),
  warn: (...args: unknown[]) => console.warn('[warn]', ...args),
  error: (...args: unknown[]) => console.error('[error]', ...args),
}

export default logger
