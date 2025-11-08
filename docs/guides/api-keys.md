# API Keys & Services Setup Guide

This guide provides quick links and instructions for obtaining all the API keys and services used in the All Pet Plus project.

## 🔐 Authentication

### Clerk
- **Website**: https://dashboard.clerk.com/
- **Required Keys**: 
  - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (public)
  - `CLERK_SECRET_KEY` (private)
- **Steps**:
  1. Create an account or sign in
  2. Create a new application
  3. Navigate to API Keys section
  4. Copy both keys

## 📊 Analytics & Monitoring

### Google Analytics
- **Website**: https://analytics.google.com/
- **Required**: `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID`
- **Format**: G-XXXXXXXXXX
- **Steps**:
  1. Create a new property
  2. Get Measurement ID from Admin > Data Streams

### Umami Analytics
- **Website**: https://umami.is/
- **Required**: `NEXT_PUBLIC_UMAMI_SITE_ID`
- **Steps**:
  1. Sign up or self-host
  2. Add your website
  3. Get Website ID from settings

### Sentry
- **Website**: https://sentry.io/
- **Required**: `SENTRY_DSN` (same for frontend/backend)
- **Steps**:
  1. Create a new project
  2. Go to Settings > Client Keys (DSN)
  3. Copy the DSN URL

### New Relic
- **Website**: https://newrelic.com/
- **Required**: `NEW_RELIC_LICENSE_KEY`
- **Steps**:
  1. Sign up for an account
  2. Add data > Node.js
  3. Get your license key

## 🛍️ E-commerce

### Shopify Storefront API
- **Website**: https://admin.shopify.com/
- **Required**:
  - `NEXT_PUBLIC_SHOPIFY_STOREFRONT_ENDPOINT` (or `SHOPIFY_STOREFRONT_ENDPOINT` for server-side)
  - `NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN` (or `SHOPIFY_STOREFRONT_TOKEN` for server-side)
- **Steps**:
  1. Log in to your Shopify Admin dashboard
  2. Go to **Settings** > **Apps and sales channels** > **Develop apps**
  3. Click **Create an app** (or use existing)
  4. Under **Configuration**, click **Configure Storefront API scopes**
  5. Select the following scopes:
     - `unauthenticated_read_product_listings` - Read products
     - `unauthenticated_read_collection_listings` - Read collections
     - `unauthenticated_write_checkouts` - Create/update checkouts
     - `unauthenticated_read_checkouts` - Read checkouts
     - Additional scopes as needed for your use case
  6. Click **Save**
  7. Go to **API credentials** tab
  8. Under **Storefront API access token**, click **Install app**
  9. Copy the **Storefront API access token**
  10. Your endpoint format: `https://YOUR-STORE.myshopify.com/api/2024-01/graphql.json`
      - Replace `YOUR-STORE` with your actual store subdomain
      - Use the latest API version (check Shopify docs)

**Important Notes**:
- Use `NEXT_PUBLIC_*` variables only if you need client-side access
- For better security, use server-side variables without `NEXT_PUBLIC_` prefix
- The Storefront API is read-only for most operations
- For order management, use the Admin API (backend only)

### Shopify Development Store (Recommended for Development)
- **Website**: https://partners.shopify.com/
- **Purpose**: Free Shopify store for development and testing
- **Steps**:
  1. Create a Shopify Partners account (free)
  2. Go to **Stores** > **Add store** > **Create development store**
  3. Choose "Create a store to test and build"
  4. Fill in store details
  5. Once created, follow the same steps above for API credentials
- **Benefits**:
  - Unlimited test orders
  - No charges for testing
  - Full API access
  - Can be transferred to client later

## 💳 Payment Processing

### Stripe
- **Website**: https://dashboard.stripe.com/
- **Required**:
  - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (public)
  - `STRIPE_SECRET_KEY` (private)
  - `STRIPE_WEBHOOK_SECRET` (for webhooks)
- **Steps**:
  1. Create account and verify
  2. Get API keys from Dashboard
  3. For webhooks: Developers > Webhooks > Add endpoint
  4. Use test keys for development!

## 🖼️ Media & Storage

### Cloudinary
- **Website**: https://cloudinary.com/console
- **Required**: `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
- **Steps**:
  1. Sign up for free account
  2. Find cloud name in Dashboard (top-left)
  3. Configure upload presets if needed

### AWS S3
- **Website**: https://console.aws.amazon.com/
- **Required**:
  - `AWS_ACCESS_KEY_ID`
  - `AWS_SECRET_ACCESS_KEY`
  - `AWS_REGION`
  - `S3_BUCKET_NAME`
- **Steps**:
  1. Create IAM user with programmatic access
  2. Attach `AmazonS3FullAccess` policy (or custom)
  3. Create S3 bucket in desired region
  4. Note: Use IAM roles in production instead of keys

## 📧 Email Services

### SendGrid
- **Website**: https://app.sendgrid.com/
- **Required**: API Key for SMTP
- **Steps**:
  1. Sign up and verify domain
  2. Settings > API Keys > Create API Key
  3. Use SMTP relay settings

### Resend (Alternative)
- **Website**: https://resend.com/
- **Required**: API Key
- **Modern, developer-friendly alternative
- **Steps**:
  1. Sign up and add domain
  2. Generate API key from dashboard

## 🗄️ Database & Cache

### PostgreSQL (Production Options)
- **Supabase**: https://supabase.com/ (includes auth + storage)
- **Neon**: https://neon.tech/ (serverless Postgres)
- **Railway**: https://railway.app/ (simple deployment)
- **AWS RDS**: For larger scale

### Redis (Production Options)
- **Upstash**: https://upstash.com/ (serverless Redis)
- **Redis Cloud**: https://redis.com/cloud/
- **Railway**: https://railway.app/
- **AWS ElastiCache**: For larger scale

## 🚀 Infrastructure

### NX Cloud
- **Website**: https://nx.app/
- **Required**: `NX_CLOUD_ACCESS_TOKEN`
- **Purpose**: Distributed build caching for faster CI/CD
- **Steps**:
  1. Create account
  2. Connect your workspace
  3. Get access token

## 🔧 Local Development

For local development, many services can be replaced with local alternatives:

```bash
# Start local services
docker-compose -f docker-compose.dev.yml up -d

# This provides:
# - PostgreSQL (port 5432)
# - Redis (port 6379)
# - Adminer (port 8080) - Database UI
```

## 🛡️ Security Tips

1. **Never commit real API keys** to version control
2. **Use test/development keys** when available
3. **Generate secure secrets** with: `openssl rand -base64 32`
4. **Rotate keys regularly** in production
5. **Use environment-specific keys** (dev/staging/prod)
6. **Set up IP restrictions** where possible
7. **Use IAM roles** instead of keys in cloud environments

## 📝 Environment Files

After obtaining your keys:

1. Copy them to your `.env` files (not tracked by git)
2. Use the templates as reference:
   - `/env.template` - Root workspace
   - `/apps/web/env.template` - Frontend
   - `/services/backend/env.template` - Backend

## 🚨 Required for Production

Before deploying to production, ensure you have:

- [ ] Production database (not local PostgreSQL)
- [ ] Production Redis instance
- [ ] Real email service configured
- [ ] Production API keys (not test keys)
- [ ] Monitoring services set up
- [ ] Secure secret generation
- [ ] Domain verification for email services
