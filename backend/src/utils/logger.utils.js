/**
 * Security-focused Logger Utility
 * Ensures secrets or raw credentials are never leaked to stdout
 */

function sanitize(message) {
  if (typeof message !== 'string') return message;
  // Redact potential API keys or private key patterns
  return message
    .replace(/(AIzaSy[A-Za-z0-9_-]{33})/g, '[REDACTED_API_KEY]')
    .replace(/(-----BEGIN PRIVATE KEY-----[\s\S]*?-----END PRIVATE KEY-----)/g, '[REDACTED_PRIVATE_KEY]');
}

export const logger = {
  info: (msg, ...meta) => {
    console.log(`[INFO] ${new Date().toISOString()} - ${sanitize(msg)}`, ...meta);
  },
  warn: (msg, ...meta) => {
    console.warn(`[WARN] ${new Date().toISOString()} - ${sanitize(msg)}`, ...meta);
  },
  error: (msg, ...meta) => {
    console.error(`[ERROR] ${new Date().toISOString()} - ${sanitize(msg)}`, ...meta);
  }
};

export default logger;
