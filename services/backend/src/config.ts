import { getEnvVar, getBooleanEnv, getNumberEnv, getArrayEnv, validateEnv, type BackendEnv } from '@pet/shared';

/**
 * Backend service configuration
 */
export const config = {
  app: {
    name: getEnvVar('APP_NAME', 'pet-backend'),
    env: getEnvVar('NODE_ENV', 'development') as BackendEnv['NODE_ENV'],
    port: getNumberEnv('PORT', 3001),
    host: getEnvVar('HOST', '0.0.0.0'),
  },
  
  database: {
    url: getEnvVar('DATABASE_URL', '', true), // Required
    pool: {
      min: getNumberEnv('DATABASE_POOL_MIN', 2),
      max: getNumberEnv('DATABASE_POOL_MAX', 10),
    },
    ssl: getBooleanEnv('DATABASE_SSL', false),
  },
  
  redis: {
    url: getEnvVar('REDIS_URL', 'redis://localhost:6379', true), // Required
    ttl: getNumberEnv('REDIS_TTL', 3600),
    prefix: getEnvVar('REDIS_PREFIX', 'pet:'),
  },
  
  auth: {
    jwt: {
      secret: getEnvVar('JWT_SECRET', '', true), // Required
      expiresIn: getEnvVar('JWT_EXPIRES_IN', '7d'),
    },
    refreshToken: {
      secret: getEnvVar('REFRESH_TOKEN_SECRET', '', true), // Required
      expiresIn: getEnvVar('REFRESH_TOKEN_EXPIRES_IN', '30d'),
    },
    session: {
      secret: getEnvVar('SESSION_SECRET', '', true), // Required
      timeout: getNumberEnv('SESSION_TIMEOUT', 86400000),
    },
    bcryptRounds: getNumberEnv('BCRYPT_ROUNDS', 10),
    encryptionKey: getEnvVar('ENCRYPTION_KEY', '', true), // Required
    clerkSecretKey: getEnvVar('CLERK_SECRET_KEY', '', true), // Required
  },
  
  security: {
    cors: {
      origins: getArrayEnv('CORS_ORIGIN', ['http://localhost:3000']),
    },
    rateLimit: {
      windowMs: getNumberEnv('RATE_LIMIT_WINDOW', 900000),
      max: getNumberEnv('RATE_LIMIT_MAX', 100),
    },
  },
  
  email: {
    host: getEnvVar('EMAIL_HOST', 'smtp.example.com'),
    port: getNumberEnv('EMAIL_PORT', 587),
    user: getEnvVar('EMAIL_USER', ''),
    password: getEnvVar('EMAIL_PASSWORD', ''),
    from: getEnvVar('EMAIL_FROM', 'noreply@pet.com'),
  },
  
  upload: {
    maxSize: getNumberEnv('UPLOAD_MAX_SIZE', 10485760), // 10MB
    allowedTypes: getArrayEnv('UPLOAD_ALLOWED_TYPES', [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
    ]),
  },
  
  logging: {
    level: getEnvVar('LOG_LEVEL', 'debug'),
    format: getEnvVar('LOG_FORMAT', 'pretty'),
  },
  
  features: {
    queue: getBooleanEnv('ENABLE_QUEUE', false),
    websockets: getBooleanEnv('ENABLE_WEBSOCKETS', false),
    cache: getBooleanEnv('ENABLE_CACHE', true),
    rateLimiting: getBooleanEnv('ENABLE_RATE_LIMITING', true),
  },
  
  external: {
    shopify: {
      adminAccessToken: getEnvVar('SHOPIFY_ADMIN_ACCESS_TOKEN', ''),
      adminApiEndpoint: getEnvVar('SHOPIFY_ADMIN_API_ENDPOINT', ''),
      webhookSecret: getEnvVar('SHOPIFY_WEBHOOK_SECRET', ''),
    },
    stripe: {
      secretKey: getEnvVar('STRIPE_SECRET_KEY', ''),
      webhookSecret: getEnvVar('STRIPE_WEBHOOK_SECRET', ''),
    },
    monitoring: {
      sentryDsn: getEnvVar('SENTRY_DSN', ''),
    },
  },
  
  queue: {
    redisUrl: getEnvVar('QUEUE_REDIS_URL', 'redis://localhost:6379'),
    concurrency: getNumberEnv('QUEUE_CONCURRENCY', 5),
  },
} as const;

/**
 * Type-safe access to configuration
 */
export type BackendConfig = typeof config;

/**
 * Validate required environment variables on startup
 */
export function validateBackendConfig(): void {
  const requiredVars: (keyof BackendEnv)[] = [
    'DATABASE_URL',
    'REDIS_URL',
    'JWT_SECRET',
    'REFRESH_TOKEN_SECRET',
    'SESSION_SECRET',
    'ENCRYPTION_KEY',
    'CLERK_SECRET_KEY',
  ];

  try {
    validateEnv<BackendEnv>(process.env, requiredVars, 'backend service');
    console.log('✅ Environment configuration validated successfully');
  } catch (error) {
    console.error('❌ Environment configuration validation failed:', error);
    process.exit(1);
  }
}

// Validate on module load in production
if (config.app.env === 'production') {
  validateBackendConfig();
}

// Export helper to check if in production
export const isProduction = () => config.app.env === 'production';
export const isDevelopment = () => config.app.env === 'development';
export const isTest = () => config.app.env === 'test';
