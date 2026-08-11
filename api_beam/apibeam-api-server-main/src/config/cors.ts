const extensionId = process.env.EXTENSION_ID?.trim();
const allowAnyChromeExtensionOrigin =
  process.env.ALLOW_ANY_CHROME_EXTENSION_ORIGIN?.trim().toLowerCase() === 'true';
const configuredOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const extensionOrigin = extensionId
  ? `chrome-extension://${extensionId}`
  : undefined;

export const allowedOrigins = Array.from(
  new Set([...configuredOrigins, extensionOrigin].filter(Boolean)),
);

export const isDevelopment = process.env.NODE_ENV !== 'production';
export { allowAnyChromeExtensionOrigin };

const isChromeExtensionOrigin = (origin: string) =>
  /^chrome-extension:\/\/[a-p]{32}$/.test(origin);

export const isAllowedOrigin = (origin?: string) => {
  // Requests without an Origin header are used by the local health check and
  // should not be treated as browser CORS requests.
  if (!origin) return true;
  return (
    isDevelopment ||
    allowedOrigins.includes(origin) ||
    (allowAnyChromeExtensionOrigin && isChromeExtensionOrigin(origin))
  );
};

export const socketCorsOrigin = (
  origin: string | undefined,
  callback: (error: Error | null, allowed?: boolean) => void,
) => {
  if (isAllowedOrigin(origin)) {
    callback(null, true);
    return;
  }
  callback(new Error('Origin is not allowed'));
};
