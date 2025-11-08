# Environment Variables Guide

This guide documents all environment variables used in the Pet monorepo.

> 📚 **Looking for API keys?** See [API Keys Guide](./api-keys-guide.md) for detailed instructions on where to obtain each service credential.

## 🚀 Quick Setup

```bash
# Run the environment setup script
./scripts/setup-env.sh

# This will create:
# - .env (root)
# - apps/web/.env.local
# - services/backend/.env
```

## 📁 Environment File Structure

```
pet/
├── .env                    # Root workspace variables
├── env.template           # Root template
├── apps/
│   └── web/
│       ├── .env.local     # Next.js local variables (gitignored)
│       └── env.template   # Web app template
└── services/
    └── backend/
        ├── .env           # Backend local variables (gitignored)
        └── env.template   # Backend template
```

## 🌐 Web Application Variables

Located in `apps/web/.env.local`:

### Public Variables (Exposed to Browser)

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NEXT_PUBLIC_APP_NAME` | Application name | Harness Hero | ✅ |
| `NEXT_PUBLIC_APP_VERSION` | Application version | 0.1.0 | ✅ |
| `NEXT_PUBLIC_APP_URL` | Frontend URL | http://localhost:3000 | ✅ |
| `NEXT_PUBLIC_API_URL` | Backend API URL | http://localhost:3001 | ✅ |
| `NEXT_PUBLIC_API_TIMEOUT` | API request timeout (ms) | 30000 | ❌ |
| `NEXT_PUBLIC_ENABLE_ANALYTICS` | Enable analytics | false | ❌ |
| `NEXT_PUBLIC_ENABLE_DEBUG_MODE` | Debug mode | false | ❌ |
| `NEXT_PUBLIC_ENABLE_EXPERIMENTS` | Enable experimental features | true | ❌ |
| `NEXT_PUBLIC_MAINTENANCE_MODE` | Maintenance mode | false | ❌ |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk public key | - | ❌ |
| `NEXT_PUBLIC_SESSION_TIMEOUT` | Session timeout (ms) | 3600000 | ❌ |
| `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID` | Google Analytics ID | - | ❌ |
| `NEXT_PUBLIC_SENTRY_DSN` | Sentry DSN | - | ❌ |
| `NEXT_PUBLIC_UMAMI_SITE_ID` | Umami Analytics Site ID | - | ❌ |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe public key | - | ❌ |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | - | ❌ |
| `NEXT_PUBLIC_SHOPIFY_STOREFRONT_ENDPOINT` | Shopify GraphQL endpoint | - | ❌ |
| `NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN` | Shopify Storefront access token | - | ❌ |
| `NEXT_PUBLIC_DEFAULT_THEME` | Default theme | light | ❌ |
| `NEXT_PUBLIC_ENABLE_DARK_MODE` | Enable dark mode | true | ❌ |
| `NEXT_PUBLIC_CONFETTI_ENABLED` | Enable confetti effects | true | ❌ |
| `NEXT_PUBLIC_CDN_URL` | CDN base URL | - | ❌ |
| `NEXT_PUBLIC_IMAGE_DOMAINS` | Allowed image domains | localhost,res.cloudinary.com | ❌ |
| `NEXT_PUBLIC_IMAGE_BASE_PATH` | Image assets base path | /sprites/harness | ❌ |
| `NEXT_PUBLIC_ENABLE_DEVTOOLS` | Enable dev tools | true | ❌ |

### Server-side Variables (Private)

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `CLERK_SECRET_KEY` | Clerk secret key for API | - | ❌ |
| `SHOPIFY_STOREFRONT_ENDPOINT` | Shopify endpoint (server-side) | - | ❌ |
| `SHOPIFY_STOREFRONT_TOKEN` | Shopify token (server-side) | - | ❌ |

### Build-time Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `ANALYZE` | Enable bundle analysis | false | ❌ |

## 🔧 Backend Service Variables

Located in `services/backend/.env`:

### Application Config

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NODE_ENV` | Environment | development | ✅ |
| `PORT` | Server port | 3001 | ✅ |
| `HOST` | Server host | 0.0.0.0 | ✅ |

### Database

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `DATABASE_URL` | PostgreSQL connection string | postgresql://... | ✅ |
| `DATABASE_POOL_MIN` | Min pool connections | 2 | ❌ |
| `DATABASE_POOL_MAX` | Max pool connections | 10 | ❌ |
| `DATABASE_SSL` | Enable SSL | false | ❌ |

### Redis Cache

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `REDIS_URL` | Redis connection string | redis://localhost:6379 | ✅ |
| `REDIS_TTL` | Default TTL (seconds) | 3600 | ❌ |
| `REDIS_PREFIX` | Key prefix | pet: | ❌ |

### Authentication

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `JWT_SECRET` | JWT signing secret | - | ✅ |
| `JWT_EXPIRES_IN` | JWT expiration | 7d | ❌ |
| `REFRESH_TOKEN_SECRET` | Refresh token secret | - | ✅ |
| `SESSION_SECRET` | Session secret | - | ✅ |

### Security

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `CORS_ORIGIN` | Allowed origins | http://localhost:4200 | ✅ |
| `RATE_LIMIT_WINDOW` | Rate limit window (ms) | 900000 | ❌ |
| `RATE_LIMIT_MAX` | Max requests per window | 100 | ❌ |
| `BCRYPT_ROUNDS` | Bcrypt salt rounds | 10 | ❌ |

### External Services

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `SHOPIFY_ADMIN_ACCESS_TOKEN` | Shopify Admin API token | - | ❌ |
| `SHOPIFY_ADMIN_API_ENDPOINT` | Shopify Admin API endpoint | - | ❌ |
| `SHOPIFY_WEBHOOK_SECRET` | Shopify webhook HMAC secret | - | ❌ |
| `STRIPE_SECRET_KEY` | Stripe secret key | - | ❌ |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret | - | ❌ |
| `AWS_ACCESS_KEY_ID` | AWS access key | - | ❌ |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key | - | ❌ |
| `AWS_REGION` | AWS region | us-east-1 | ❌ |
| `S3_BUCKET_NAME` | S3 bucket name | - | ❌ |

## 🚀 Deployment Environments

### Staging

- Use `.env.staging` files
- Set `NODE_ENV=staging`
- Update URLs to staging domains

### Production

- Use `.env.production` files
- Set `NODE_ENV=production`
- Update all secrets and keys
- Enable security features

## 🔒 Security Best Practices

1. **Never commit `.env` files** - They're gitignored for a reason
2. **Use strong secrets** - Generate random strings for secrets:
   ```bash
   openssl rand -base64 32
   ```
3. **Rotate secrets regularly** - Especially in production
4. **Use environment-specific values** - Don't reuse dev secrets in prod
5. **Validate required variables** - Check at startup

## 🧪 Environment Validation

Add this to your application startup:

```typescript
// libs/shared/src/lib/env-validator.ts
export function validateEnv() {
  const required = [
    'DATABASE_URL',
    'JWT_SECRET',
    'SESSION_SECRET',
    // Add other required vars
  ];

  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}
```

## 📝 Adding New Variables

1. Add to appropriate `env.template` file
2. Document in this guide
3. Update validation if required
4. Add to CI/CD secrets if needed

## 🔄 Environment Precedence

1. System environment variables
2. `.env.local` (highest priority for local dev)
3. `.env.[environment]` (e.g., `.env.production`)
4. `.env` (lowest priority)

## 🐳 Docker Environment

When using Docker, pass environment variables via:

1. `docker-compose.yml` files
2. `--env-file` flag
3. `-e` flag for individual vars
4. Kubernetes ConfigMaps/Secrets
