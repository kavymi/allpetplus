// Environment variable type definitions and validation

/**
 * Web app public environment variables
 */
export interface WebPublicEnv {
  NEXT_PUBLIC_APP_NAME: string;
  NEXT_PUBLIC_APP_VERSION: string;
  NEXT_PUBLIC_APP_URL: string;
  NEXT_PUBLIC_API_URL: string;
  NEXT_PUBLIC_API_TIMEOUT: string;
  NEXT_PUBLIC_ENABLE_ANALYTICS: string;
  NEXT_PUBLIC_ENABLE_DEBUG_MODE: string;
  NEXT_PUBLIC_MAINTENANCE_MODE: string;
  NEXT_PUBLIC_AUTH_PROVIDER?: string;
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?: string;
  NEXT_PUBLIC_SESSION_TIMEOUT: string;
  NEXT_PUBLIC_GOOGLE_ANALYTICS_ID?: string;
  NEXT_PUBLIC_SENTRY_DSN?: string;
  NEXT_PUBLIC_UMAMI_SITE_ID?: string;
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?: string;
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME?: string;
  NEXT_PUBLIC_SHOPIFY_STOREFRONT_ENDPOINT?: string;
  NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN?: string;
  SHOPIFY_STOREFRONT_ENDPOINT?: string;
  SHOPIFY_STOREFRONT_TOKEN?: string;
  NEXT_PUBLIC_DEFAULT_THEME: string;
  NEXT_PUBLIC_ENABLE_DARK_MODE: string;
  NEXT_PUBLIC_CONFETTI_ENABLED?: string;
  NEXT_PUBLIC_CDN_URL?: string;
  NEXT_PUBLIC_IMAGE_DOMAINS?: string;
  NEXT_PUBLIC_IMAGE_BASE_PATH?: string;
  NEXT_PUBLIC_ENABLE_DEVTOOLS: string;
}

/**
 * Backend environment variables
 */
export interface BackendEnv {
  NODE_ENV: 'development' | 'production' | 'test' | 'staging';
  APP_NAME: string;
  PORT: string;
  HOST: string;
  DATABASE_URL: string;
  DATABASE_POOL_MIN?: string;
  DATABASE_POOL_MAX?: string;
  DATABASE_SSL?: string;
  REDIS_URL: string;
  REDIS_TTL?: string;
  REDIS_PREFIX?: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN?: string;
  REFRESH_TOKEN_SECRET: string;
  REFRESH_TOKEN_EXPIRES_IN?: string;
  SESSION_SECRET: string;
  SESSION_TIMEOUT?: string;
  CORS_ORIGIN: string;
  RATE_LIMIT_WINDOW?: string;
  RATE_LIMIT_MAX?: string;
  BCRYPT_ROUNDS?: string;
  EMAIL_HOST?: string;
  EMAIL_PORT?: string;
  EMAIL_USER?: string;
  EMAIL_PASSWORD?: string;
  EMAIL_FROM?: string;
  UPLOAD_MAX_SIZE?: string;
  UPLOAD_ALLOWED_TYPES?: string;
  LOG_LEVEL?: string;
  LOG_FORMAT?: string;
  SHOPIFY_ADMIN_ACCESS_TOKEN?: string;
  SHOPIFY_ADMIN_API_ENDPOINT?: string;
  SHOPIFY_WEBHOOK_SECRET?: string;
  STRIPE_SECRET_KEY?: string;
  STRIPE_WEBHOOK_SECRET?: string;
  AWS_ACCESS_KEY_ID?: string;
  AWS_SECRET_ACCESS_KEY?: string;
  AWS_REGION?: string;
  S3_BUCKET_NAME?: string;
  SENTRY_DSN?: string;
  NEW_RELIC_LICENSE_KEY?: string;
  QUEUE_REDIS_URL?: string;
  QUEUE_CONCURRENCY?: string;
  ENABLE_QUEUE?: string;
  ENABLE_WEBSOCKETS?: string;
  ENABLE_CACHE?: string;
  ENABLE_RATE_LIMITING?: string;
  ENCRYPTION_KEY: string;
  CLERK_SECRET_KEY: string;
}

/**
 * Validates required environment variables
 */
export function validateEnv<T extends Record<string, string | undefined>>(
  env: NodeJS.ProcessEnv,
  required: (keyof T)[],
  context: string = 'application'
): void {
  const missing = required.filter(key => !env[key as string]);
  
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables for ${context}: ${missing.join(', ')}`
    );
  }
}

/**
 * Gets a typed environment variable with optional default
 */
export function getEnvVar(
  key: string,
  defaultValue?: string,
  required = false
): string {
  const value = process.env[key];
  
  if (!value && required) {
    throw new Error(`Required environment variable ${key} is not set`);
  }
  
  return value || defaultValue || '';
}

/**
 * Gets a boolean environment variable
 */
export function getBooleanEnv(
  key: string,
  defaultValue = false
): boolean {
  const value = process.env[key];
  
  if (!value) {
    return defaultValue;
  }
  
  return value.toLowerCase() === 'true';
}

/**
 * Gets a numeric environment variable
 */
export function getNumberEnv(
  key: string,
  defaultValue: number
): number {
  const value = process.env[key];
  
  if (!value) {
    return defaultValue;
  }
  
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
}

/**
 * Gets an array from comma-separated environment variable
 */
export function getArrayEnv(
  key: string,
  defaultValue: string[] = []
): string[] {
  const value = process.env[key];
  
  if (!value) {
    return defaultValue;
  }
  
  return value.split(',').map(item => item.trim()).filter(Boolean);
}
