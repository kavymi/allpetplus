import { getEnvVar, getBooleanEnv, getNumberEnv, getArrayEnv, type WebPublicEnv } from '@pet/shared';

/**
 * Application configuration with type-safe environment variables
 */
export const config = {
  app: {
    name: getEnvVar('NEXT_PUBLIC_APP_NAME', 'CustomPaws'),
    version: getEnvVar('NEXT_PUBLIC_APP_VERSION', '0.1.0'),
    url: getEnvVar('NEXT_PUBLIC_APP_URL', 'http://localhost:3000'),
  },
  
  api: {
    url: getEnvVar('NEXT_PUBLIC_API_URL', 'http://localhost:3001'),
    timeout: getNumberEnv('NEXT_PUBLIC_API_TIMEOUT', 30000),
  },
  
  features: {
    darkMode: getBooleanEnv('NEXT_PUBLIC_ENABLE_DARK_MODE', true),
    confetti: getBooleanEnv('NEXT_PUBLIC_CONFETTI_ENABLED', true),
    devtools: getBooleanEnv('NEXT_PUBLIC_ENABLE_DEVTOOLS', true),
  },
  
  auth: {
    provider: getEnvVar('NEXT_PUBLIC_AUTH_PROVIDER', 'clerk'),
    clerk: {
      publishableKey: getEnvVar('NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY', ''),
    },
    sessionTimeout: getNumberEnv('NEXT_PUBLIC_SESSION_TIMEOUT', 3600000),
  },
  
  ui: {
    defaultTheme: getEnvVar('NEXT_PUBLIC_DEFAULT_THEME', 'light') as 'light' | 'dark',
  },
  
  cdn: {
    url: getEnvVar('NEXT_PUBLIC_CDN_URL', ''),
    imageDomains: getArrayEnv('NEXT_PUBLIC_IMAGE_DOMAINS', ['localhost']),
    imageBasePath: getEnvVar('NEXT_PUBLIC_IMAGE_BASE_PATH', '/sprites/harness'),
  },
  
  integrations: {
    sentry: {
      dsn: getEnvVar('NEXT_PUBLIC_SENTRY_DSN', ''),
    },
    stripe: {
      publishableKey: getEnvVar('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY', ''),
    },
    cloudinary: {
      cloudName: getEnvVar('NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME', ''),
    },
    shopify: {
      storefrontEndpoint: getEnvVar('SHOPIFY_STOREFRONT_ENDPOINT', '') || getEnvVar('NEXT_PUBLIC_SHOPIFY_STOREFRONT_ENDPOINT', ''),
      storefrontToken: getEnvVar('SHOPIFY_STOREFRONT_TOKEN', '') || getEnvVar('NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN', ''),
    },
  },
} as const;

/**
 * Type-safe access to environment variables
 */
export type AppConfig = typeof config;

/**
 * Validate configuration at runtime
 */
export function validateConfig(): void {
  const requiredVars: (keyof WebPublicEnv)[] = [
    'NEXT_PUBLIC_APP_NAME',
    'NEXT_PUBLIC_APP_URL',
    'NEXT_PUBLIC_API_URL',
  ];

  requiredVars.forEach(varName => {
    if (!process.env[varName]) {
      console.warn(`Missing required environment variable: ${varName}`);
    }
  });
}

// Development helpers
if (config.features.devtools) {
  console.log('App Configuration:', config);
}
