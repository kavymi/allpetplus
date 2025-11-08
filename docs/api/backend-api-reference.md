# Backend API Reference

Complete API documentation for the All Pet Plus backend service.

## Base URL

- **Production**: `https://api.harnesshe.ro`
- **Staging**: `https://api-staging.harnesshe.ro`
- **Local**: `http://localhost:3001`

## Authentication

Most endpoints require authentication via Clerk. Include the session token in requests:

```http
Authorization: Bearer <clerk_session_token>
```

---

## Endpoints

### Health & Status

#### GET /healthz
Basic health check.

**Response**:
```json
{
  "status": "ok",
  "uptime": 12345.67,
  "timestamp": 1704067200000,
  "services": {
    "postgres": true,
    "redis": true
  }
}
```

#### GET /healthz/detailed
Detailed health check with service metrics.

**Response**:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00Z",
  "version": "1.0.0",
  "environment": "production",
  "checks": [
    {
      "service": "database",
      "status": "healthy",
      "responseTime": 5,
      "lastChecked": "2024-01-01T00:00:00Z"
    },
    {
      "service": "redis",
      "status": "healthy",
      "responseTime": 2,
      "lastChecked": "2024-01-01T00:00:00Z"
    }
  ],
  "metrics": {
    "uptime": 86400,
    "memory": {
      "used": 134217728,
      "total": 268435456,
      "percentage": 50
    },
    "requests": {
      "total": 10000,
      "errors": 5,
      "averageResponseTime": 45
    }
  }
}
```

#### GET /metrics
Application metrics for monitoring.

---

### Orders

#### GET /api/orders/:orderNumber
Lookup order by order number and email.

**Auth**: Not required (email verification via hash)

**Parameters**:
- `orderNumber` (path): Order number from Shopify
- `email` (query): Customer email address

**Example**:
```http
GET /api/orders/1001?email=customer@example.com
```

**Response**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "orderNumber": "1001",
  "email": "customer@example.com",
  "createdAt": "2024-01-01T00:00:00Z",
  "timeline": [
    {
      "status": "confirmed",
      "timestamp": "2024-01-01T00:00:00Z",
      "description": "Order confirmed and payment processed",
      "isComplete": true
    },
    {
      "status": "shipped",
      "timestamp": "2024-01-02T10:30:00Z",
      "description": "Package shipped via USPS",
      "isComplete": true
    }
  ],
  "shipment": {
    "carrier": "USPS",
    "trackingNumber": "9400111899223344556677",
    "trackingUrl": "https://tools.usps.com/go/TrackConfirmAction?tLabels=9400111899223344556677"
  },
  "summary": {
    "subtotal": 88,
    "discounts": 0,
    "shipping": 0,
    "tax": 6.5,
    "total": 94.5,
    "currencyCode": "USD"
  }
}
```

**Error Responses**:
- `400`: Invalid email or order number
- `404`: Order not found

---

### Designs (Protected)

#### POST /api/designs
Create a new saved design.

**Auth**: Required

**Request**:
```json
{
  "name": "My Custom Harness",
  "configJson": {
    "size": "M",
    "colorway": "ocean-blue",
    "hardware": "silver",
    "stitching": "contrast",
    "personalization": {
      "text": "MAX",
      "position": "chest"
    }
  },
  "priceBreakdown": {
    "base": 88,
    "personalization": 10,
    "total": 98
  }
}
```

**Response**: `201 Created`
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "My Custom Harness",
  "configJson": { ... },
  "priceBreakdown": { ... },
  "status": "DRAFT",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

#### GET /api/designs
Get user's saved designs.

**Auth**: Required

**Query Parameters**:
- `status` (optional): Filter by status (`DRAFT`, `ACTIVE`, `ARCHIVED`)
- `limit` (optional): Number of results (default: 20)
- `cursor` (optional): Pagination cursor

**Response**:
```json
{
  "designs": [
    {
      "id": "...",
      "name": "My Design",
      "configJson": { ... },
      "previewUrl": "https://res.cloudinary.com/.../preview.webp",
      "thumbnailUrl": "https://res.cloudinary.com/.../thumb.webp",
      "status": "ACTIVE",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "pageInfo": {
    "hasNextPage": true,
    "endCursor": "design_xyz"
  }
}
```

#### GET /api/designs/:id
Get single design by ID.

**Auth**: Required (must own design)

**Response**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "My Design",
  "configJson": { ... },
  "priceBreakdown": { ... },
  "previewUrl": "...",
  "thumbnailUrl": "...",
  "shareToken": "abc123",
  "status": "ACTIVE",
  "isTemplate": false,
  "viewCount": 42,
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

#### PATCH /api/designs/:id
Update design.

**Auth**: Required (must own design)

**Request**:
```json
{
  "name": "Updated Name",
  "status": "ACTIVE",
  "configJson": { ... }
}
```

**Response**:
```json
{
  "id": "...",
  "name": "Updated Name",
  "status": "ACTIVE",
  "updatedAt": "2024-01-01T12:00:00Z"
}
```

#### DELETE /api/designs/:id
Soft delete design.

**Auth**: Required (must own design)

**Response**: `204 No Content`

#### GET /api/designs/shared/:token
Get publicly shared design by share token.

**Auth**: Not required

**Response**:
```json
{
  "id": "...",
  "name": "Shared Design",
  "configJson": { ... },
  "previewUrl": "...",
  "thumbnailUrl": "...",
  "isTemplate": false,
  "createdAt": "2024-01-01T00:00:00Z"
}
```

---

### Webhooks (Shopify)

#### POST /webhooks/shopify/orders/create
Shopify order creation webhook.

**Auth**: HMAC signature verification

**Headers**:
- `X-Shopify-Hmac-SHA256`: Webhook signature
- `X-Shopify-Shop-Domain`: Shop domain
- `X-Shopify-Topic`: `orders/create`

**Payload**: Shopify order object

**Response**:
```json
{
  "received": true
}
```

#### POST /webhooks/shopify/orders/fulfilled
Shopify order fulfillment webhook.

**Auth**: HMAC signature verification

**Headers**:
- `X-Shopify-Hmac-SHA256`: Webhook signature

**Payload**: Shopify fulfillment object

**Response**:
```json
{
  "received": true
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": { ... },
  "requestId": "req_123abc"
}
```

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `UNAUTHORIZED` | 401 | Missing or invalid authentication |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 400 | Request validation failed |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |
| `SHOPIFY_ERROR` | 502 | Shopify API error |

### Example Error Response

```json
{
  "error": "Validation failed",
  "code": "VALIDATION_ERROR",
  "details": [
    {
      "path": "configJson",
      "message": "Required",
      "code": "invalid_type"
    }
  ],
  "requestId": "req_abc123xyz"
}
```

---

## Rate Limits

- **Default**: 100 requests per minute per IP
- **Authenticated**: 1000 requests per minute per user
- **Webhooks**: No limit (verified by HMAC)

Rate limit headers:
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1704067260
```

---

## Pagination

Cursor-based pagination is used for list endpoints:

```json
{
  "data": [...],
  "pageInfo": {
    "hasNextPage": true,
    "endCursor": "cursor_value"
  }
}
```

To get next page:
```http
GET /api/designs?cursor=cursor_value&limit=20
```

---

## Webhooks & Events

### Background Jobs

Certain operations trigger background jobs:

1. **Preview Rendering** (`preview-render`)
   - Triggered: After design save
   - Duration: ~1-2 seconds
   - Updates: `previewUrl` and `thumbnailUrl`

2. **Email Notifications** (`trigger-email`)
   - Triggered: Order confirmation, shipping updates
   - Duration: < 500ms

3. **Webhook Replay** (`webhook-replay`)
   - Triggered: Failed webhook processing
   - Retries: 3 attempts with exponential backoff

### Job Status

Check job status (admin only):
```http
GET /api/admin/jobs/:jobId
```

---

## SDK Examples

### JavaScript/TypeScript

```typescript
import { AllPetPlusClient } from '@harnesshe/api-client';

const client = new AllPetPlusClient({
  apiKey: process.env.API_KEY,
  baseUrl: 'https://api.harnesshe.ro',
});

// Create design
const design = await client.designs.create({
  name: 'My Harness',
  configJson: {
    size: 'M',
    colorway: 'ocean-blue',
  },
});

// Lookup order
const order = await client.orders.lookup({
  orderNumber: '1001',
  email: 'customer@example.com',
});
```

### cURL

```bash
# Health check
curl https://api.harnesshe.ro/healthz

# Create design (authenticated)
curl -X POST https://api.harnesshe.ro/api/designs \
  -H "Authorization: Bearer $CLERK_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Design",
    "configJson": {"size": "M"}
  }'

# Lookup order
curl "https://api.harnesshe.ro/api/orders/1001?email=customer@example.com"
```

---

## Changelog

### v1.0.0 (2024-01-01)
- Initial release
- Order tracking API
- Design management API
- Webhook processing
- Authentication with Clerk

---

*For questions or support, contact: [api-support@harnesshe.ro](mailto:api-support@harnesshe.ro)*
