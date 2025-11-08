# API Reference

## Frontend API Routes

### Cart Management

#### POST /api/cart/add
Add items to Shopify cart with customization attributes.

**Request Body:**
```json
{
  "merchandiseId": "gid://shopify/ProductVariant/123",
  "quantity": 1,
  "attributes": [
    { "key": "size", "value": "M" },
    { "key": "colorway", "value": "ocean-blue" },
    { "key": "hardware", "value": "rose-gold" }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "cartId": "gid://shopify/Cart/abc123"
}
```

**Errors:**
- 400: Validation error
- 500: Cart creation/update failed

---

## Backend API Routes

### Order Tracking

#### GET /api/orders/:orderNumber
Retrieve order status with email verification.

**Query Parameters:**
- `email` (required): Customer email address

**Response:**
```json
{
  "id": "gid://shopify/Order/123",
  "orderNumber": "HH-2024-001",
  "email": "customer@example.com",
  "createdAt": "2024-09-30T12:00:00Z",
  "timeline": [
    {
      "status": "confirmed",
      "timestamp": "2024-09-30T12:00:00Z",
      "description": "Order confirmed and payment processed",
      "isComplete": true
    }
  ],
  "shipment": {
    "carrier": "FedEx",
    "trackingNumber": "1234567890",
    "trackingUrl": "https://fedex.com/track?id=1234567890",
    "estimatedDelivery": "2024-10-05T00:00:00Z"
  }
}
```

**Errors:**
- 400: Invalid parameters
- 404: Order not found
- 500: Server error

---

### Webhooks

#### POST /webhooks/shopify/orders/create
Shopify webhook for order creation events.

**Headers:**
- `x-shopify-hmac-sha256`: HMAC signature for verification

**Payload:** Shopify Order object

**Response:**
```json
{
  "received": true
}
```

**Security:**
- HMAC verification required
- Idempotent processing via payload hash
- Automatic retry on failure

---

#### POST /webhooks/shopify/orders/fulfilled
Shopify webhook for order fulfillment events.

**Headers:**
- `x-shopify-hmac-sha256`: HMAC signature for verification

**Payload:** Shopify Fulfillment object

**Response:**
```json
{
  "received": true
}
```

---

### Health & Monitoring

#### GET /healthz
Basic health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "uptime": 12345,
  "timestamp": 1234567890,
  "services": {
    "postgres": true,
    "redis": true
  }
}
```

---

#### GET /healthz/detailed
Detailed health status with metrics.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-09-30T12:00:00Z",
  "version": "1.0.0",
  "environment": "production",
  "checks": [
    {
      "service": "database",
      "status": "healthy",
      "responseTime": 15,
      "lastChecked": "2024-09-30T12:00:00Z"
    }
  ],
  "metrics": {
    "uptime": 12345,
    "memory": {
      "used": 50000000,
      "total": 100000000,
      "percentage": 50
    },
    "requests": {
      "total": 1000,
      "errors": 5,
      "averageResponseTime": 120
    }
  }
}
```

---

#### GET /metrics
Prometheus-compatible metrics endpoint.

**Response:**
```json
{
  "uptime": 12345,
  "memory": { ... },
  "cpu": { ... },
  "requests": { ... }
}
```

---

## Shopify Integration

### Storefront API

All catalog and cart operations use Shopify Storefront GraphQL API:

**Endpoint:** `https://your-store.myshopify.com/api/2024-01/graphql.json`

**Authentication:** Storefront Access Token (Header: `X-Shopify-Storefront-Access-Token`)

**Key Queries:**
- Product catalog with filters
- Product details with metafields
- Cart operations (create, add, update, remove)
- Checkout URL generation

### Admin API

Backend uses Shopify Admin API for:
- Draft order creation
- Discount rule management
- Inventory updates
- Order fulfillment tracking

**Authentication:** Private app token or OAuth

---

## Queue Jobs

### Email Notifications

**Queue:** `trigger-email`

**Job Types:**
- `order-confirmation`: Send order confirmation email
- `order-shipped`: Send shipping notification with tracking

**Payload:**
```json
{
  "orderId": "123",
  "email": "customer@example.com",
  "orderNumber": 1001,
  "trackingNumber": "1234567890"
}
```

---

### Preview Rendering

**Queue:** `preview-render`

**Payload:**
```json
{
  "designId": "uuid",
  "configJson": { "size": "M", "colorway": "ocean" },
  "outputFormat": "webp",
  "dimensions": { "width": 800, "height": 800 }
}
```

**Output:** Preview and thumbnail URLs uploaded to CDN

---

### Webhook Replay

**Queue:** `webhook-replay`

**Payload:**
```json
{
  "webhookId": "uuid",
  "topic": "orders/create",
  "payload": { ... },
  "attempt": 2
}
```

**Purpose:** Retry failed webhook processing with exponential backoff

---

## Authentication

### Clerk Integration

Frontend uses Clerk for authentication with SSR support.

**Environment Variables:**
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`

**Protected Routes:**
- Backend API routes verify JWT tokens
- Frontend uses `<ClerkProvider>` wrapper
- Middleware checks authentication status

---

## Error Handling

All API endpoints return consistent error format:

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": { ... },
  "requestId": "uuid"
}
```

**Error Codes:**
- `VALIDATION_ERROR` (400)
- `NOT_FOUND` (404)
- `RATE_LIMIT_EXCEEDED` (429)
- `SHOPIFY_ERROR` (502)
- `INTERNAL_ERROR` (500)

---

## Rate Limiting

**Default Limits:**
- 100 requests per minute per IP
- Whitelisted: localhost, internal services

**Headers:**
- `X-RateLimit-Limit`: Maximum requests
- `X-RateLimit-Remaining`: Remaining requests
- `X-RateLimit-Reset`: Reset timestamp

---

## Caching Strategy

**Frontend (Next.js):**
- ISR with 5-minute revalidation for catalog/products
- Client-side caching for builder state (localStorage)
- Cart ID persisted for 7 days

**Backend (Redis):**
- Shopify API responses: 5-minute TTL
- Session data: 1-hour TTL
- Feature flags: 10-minute TTL
- Rate limit counters: 1-minute sliding window