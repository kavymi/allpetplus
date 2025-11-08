# Shopify Integration Setup Complete ✅

I've added comprehensive Shopify Storefront API configuration to your project. Here's everything you need to know:

## 📍 Where to Add Shopify Credentials

### Frontend (Storefront API)
Located in `apps/web/.env.local`:

```bash
# For client-side access (less secure but needed for some operations)
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ENDPOINT=https://your-store.myshopify.com/api/2024-01/graphql.json
NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN=your-storefront-access-token

# For server-side only (more secure, recommended)
SHOPIFY_STOREFRONT_ENDPOINT=https://your-store.myshopify.com/api/2024-01/graphql.json
SHOPIFY_STOREFRONT_TOKEN=your-storefront-access-token
```

### Backend (Admin API)
Located in `services/backend/.env`:

```bash
SHOPIFY_ADMIN_ACCESS_TOKEN=your-admin-access-token
SHOPIFY_ADMIN_API_ENDPOINT=https://your-store.myshopify.com/admin/api/2024-01/graphql.json
SHOPIFY_WEBHOOK_SECRET=your-webhook-hmac-secret
```

## 🛍️ How to Obtain Shopify API Keys

### Step 1: Create a Development Store (Recommended)
1. Go to [Shopify Partners](https://partners.shopify.com/)
2. Create a free Partners account
3. Click **Stores** > **Add store** > **Create development store**
4. Choose "Create a store to test and build"
5. Fill in store details (name, password, etc.)

### Step 2: Create a Custom App
1. In your Shopify Admin, go to **Settings** > **Apps and sales channels**
2. Click **Develop apps**
3. Click **Allow custom app development** if prompted
4. Click **Create an app**
5. Give your app a name (e.g., "Harness Hero Storefront")

### Step 3: Configure Storefront API Access
1. In your app, click **Configure Storefront API scopes**
2. Select these scopes:
   - ✅ `unauthenticated_read_product_listings`
   - ✅ `unauthenticated_read_collection_listings`
   - ✅ `unauthenticated_write_checkouts`
   - ✅ `unauthenticated_read_checkouts`
   - ✅ `unauthenticated_read_customers` (if needed)
3. Click **Save**

### Step 4: Configure Admin API Access (Backend)
1. Click **Configure Admin API scopes**
2. Select these scopes:
   - ✅ `read_products`
   - ✅ `write_products`
   - ✅ `read_orders`
   - ✅ `write_orders`
   - ✅ `read_customers`
   - ✅ `read_inventory`
   - ✅ `write_inventory`
3. Click **Save**

### Step 5: Install App & Get Credentials
1. Go to **API credentials** tab
2. Click **Install app**
3. Copy the credentials:
   - **Storefront API access token**: Use for `SHOPIFY_STOREFRONT_TOKEN`
   - **Admin API access token**: Use for `SHOPIFY_ADMIN_ACCESS_TOKEN`
   - **API key and secret**: Save for OAuth flows (if needed)

### Step 6: Set Up Webhooks (Optional)
1. Go to **Settings** > **Notifications** > **Webhooks**
2. Your HMAC key is shown at the top
3. Use this for `SHOPIFY_WEBHOOK_SECRET`

## 🔧 Configuration in Your Code

### Using Storefront API (Frontend)
```typescript
// Already configured in apps/web/src/lib/shopify/client.ts
import { shopifyFetch } from '@/lib/shopify/client';

const products = await shopifyFetch(PRODUCTS_QUERY);
```

### Using the Config
```typescript
// Access via your config
import { config } from '@/lib/config';

console.log(config.thirdParty.shopify.storefrontEndpoint);
console.log(config.thirdParty.shopify.storefrontToken);
```

### Backend Admin API
```typescript
// In your backend service
import { config } from './config';

const shopifyAdmin = {
  endpoint: config.external.shopify.adminApiEndpoint,
  token: config.external.shopify.adminAccessToken,
};
```

## 📝 Important Notes

1. **API Versions**: Always use the latest stable API version (currently 2024-01)
2. **Rate Limits**: Storefront API has generous limits, Admin API is more restrictive
3. **Security**: Never expose Admin API tokens to the frontend
4. **Testing**: Use development stores for unlimited test orders
5. **Webhooks**: Required for order status updates and inventory sync

## 🚀 Next Steps

1. Create your Shopify development store
2. Set up the custom app with proper scopes
3. Add the credentials to your `.env` files
4. Test the connection with a simple product query

Your Shopify integration is now fully configured and ready to use! 🎉
