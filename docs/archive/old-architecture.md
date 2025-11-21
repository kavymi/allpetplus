# All Pet Plus Storefront – System Architecture

## 1. Product Vision & KPIs
- **Vision**: Delightful, high-converting storefront for customizable dog harnesses with enterprise-grade performance and reliability.
- **Primary KPIs**: Builder add-to-cart rate, builder completion rate, checkout conversion, AOV, return rate, repeat purchase rate, CWV score.
- **Non-negotiables**: <1s TTFB on key pages, CLS <0.1, accessible motion (prefers-reduced-motion), secure webhook handling, resilient rate limiting, zero UX dead-ends.

## 2. High-Level Architecture

```
┌────────────┐      ┌─────────────┐      ┌────────────┐
│   Client   │◄────►│   Next.js   │◄────►│  Fastify   │
│ (Web/App)  │      │ (App Router)│      │  Service   │
└────────────┘      └─────┬───────┘      └─────┬──────┘
                              │                 │
                    ┌─────────▼────────┐   ┌────▼─────┐
                    │ Shopify APIs     │   │ Postgres │
                    │ (Storefront/Adm) │   │ Redis    │
                    └─────────┬────────┘   │ Queues   │
                              │            └──────────┘
                         ┌────▼────┐
                         │ Webhooks│
                         └─────────┘
```

- **Frontend**: Next.js 15 (App Router) deployed on Vercel Edge + Node runtimes. SSG/ISR for marketing pages, SSR for product builder and PDP, edge middleware for geo and experimentation.
- **Backend**: Fastify running in containers (Fly.io/Render/AWS). Handles Shopify Admin interactions, webhooks, personalization, persistence.
- **Data**: Postgres (Prisma) for user data/saved builds/logs, Redis for caching/sessions/flags, queue (e.g. BullMQ via Redis) for async jobs.
- **Commerce**: Shopify headless for catalog, pricing, checkout, order management.
- **Media**: Cloudinary/Imgix for sprite layers & transformations. Lottie for animations.
- **Auth**: Clerk for auth/session on frontend; short-lived tokens to Fastify.

## 3. Frontend Architecture (Next.js)

### Rendering Strategy
- `app/(marketing)/` – SSG/ISR for home, guides, FAQs.
- `app/(commerce)/catalog/[slug]` – ISR with caching for category pages.
- `app/(commerce)/product/[handle]` – SSR to hydrate builder entry, fetch personalized pricing/inventory.
- `app/builder/[configId]` – SSR + client hydration for builder; caches base data server-side, defers personalized computations to client store when possible.
- `middleware.ts` – Edge runtime: geo hints, experimentation flags, bots vs humans detection.

### Data Layer
- Lightweight GraphQL client (urql/custom fetch) with request-scoped caching for Shopify Storefront API.
- React Query (TanStack Query) for client data fetching; integrates with localStorage persister for builder state.
- URL state sync via `useSearchParams()` so users can share builder configurations.

### State & UX
- `builder` store using Zustand + `zustand/middleware/persist` (localStorage) with schema validation via Zod.
- Share/save flows use dynamic routes: `/builder?options=...`.
- Stepper component orchestrates steps; ensures maximum 6 steps.

### UI System
- Tailwind CSS theme reflecting “Playful Modern” palette.
- Design tokens via CSS variables published from `app/globals.css`.
- Component library structure: `src/components/ui/*` for primitives (buttons, cards, swatches), `src/components/builder/*` for domain-specific components.
- Motion via `framer-motion` with `useReducedMotion` guards, fallback static states.
- Accessibility: Radix UI primitives for accessible building blocks when helpful.

### Performance
- Preload sprite assets using `<link rel="preload">` with priority on common combinations.
- Use `next/image` with Cloudinary loader.
- Debounce heavy preview updates; rely on Web Workers (`src/workers/previewRenderer.ts`) for composite operations.
- Implement skeleton UI for builder to keep INP <200ms.

## 4. Backend Architecture (Fastify)

### Responsibilities
- Shopify Admin API proxy (draft orders, discount rules, inventory updates).
- Webhook receiver for orders/fulfillments/returns (HMAC verification, idempotent writes).
- Personalization APIs (recommended defaults, size suggestions, saved designs).
- Queue producer/consumer for asset rendering, OG generation, emails, webhook replays.
- Feature flag + experimentation toggles served to frontend.

### Modules
- `src/server.ts` – bootstrap, routes auto-registration.
- `src/routes/shopify.ts` – Storefront proxy endpoints (if needed), rate-limited.
- `src/routes/webhooks.ts` – webhook ingestion, verification, job enqueue.
- `src/routes/orders.ts` – order metadata, status lookup (masked ID + email).
- `src/routes/designs.ts` – CRUD for saved designs, templates, shareable links.
- `src/plugins/*` – Prisma, Redis, rate limiting, Clerk token verification.
- `src/jobs/*` – BullMQ processors for previews, OG images, email notifications.

### Data Storage
- **Postgres (Prisma)**
  - `UserProfile` (Clerk id, preferences, createdAt)
  - `SavedDesign` (user, config JSON, price breakdown, preview asset refs)
  - `BuilderPreset` (starter templates, curated combos)
  - `OrderMeta` (shopifyOrderId, status, timeline events, shipment info)
  - `WebhookLog` (type, payload hash, processedAt, result)
  - `ExperimentAssignment` (user/session, experiment key, variant)
- **Redis**
  - Session cache (Clerk session data to avoid repeated lookups)
  - Storefront API response cache (stale-while-revalidate window)
  - Feature flags, builder rule snapshots, rate limit counters
  - Queue backend for BullMQ jobs

### Security & Resilience
- Clerk JWT verification middleware for auth routes.
- Rate limiting plugin (sliding window) keyed by Clerk ID/IP.
- Shopify HMAC verification + idempotency keys (payload hash) for webhooks.
- Retry logic with exponential backoff when calling Shopify; fallback caches for product data.

## 5. Builder Experience Details

### Option Model
- `OptionGroup` (Size, Colorway, Hardware, Stitching, Personalization, Add-ons)
- `Option` with metadata: price delta, availability constraints, sprite layer info.
- Constraint engine (client + server) verifying compatibility (e.g., hardware restricted by size).
- Price calculator sums base price, option deltas, promotions.

### Preview Rendering
- Layered sprites stored in Cloudinary (path pattern `harness/{part}/{variant}.png`).
- Build composite manifest: `RenderPreset` maps selections to sprite URLs and z-index.
- Client merges visible layers (Canvas/WebGL). Worker handles heavy compositing; fallback to pre-rendered image for low-power devices.
- `Compare` mode stores two selection sets, toggles layers.

### Persistence
- Unsigned users: localStorage persist + shareable URL token.
- Signed-in users: write `SavedDesign` through Fastify API, preview images generated async and stored in object storage (e.g., Cloudinary or S3/MinIO locally).

## 6. Commerce & Checkout Flow
- Builder `Add to Cart` calls Fastify API to create Shopify draft order or direct Storefront mutation with line item properties capturing selections JSON.
- Cart page uses Shopify cart API (client) or Fastify aggregator for upsells.
- Checkout hand-off ensures personalization data is mapped to `lineItem.properties` for Shopify.
- After checkout, user redirected to custom order status page `app/order/[orderId]` using masked ID.

## 7. Order Tracking & Notifications
- Fastify ingests `orders/create`, `fulfillments/create`, `returns` webhooks.
- Update `OrderMeta` timeline with statuses: Confirmed → In Production → Quality Check → Shipped → Delivered.
- If Shippo/AfterShip enabled, store carrier + tracking URL.
- Send transactional email/SMS via queue workers at each status change (simple templating via MJML/React Email).

## 8. SEO, Analytics, & Observability
- Structured data generation via Next.js server components (Product, Offer, HowTo, FAQPage).
- OG image generator route (`app/og/builder/[configId]`) using Vercel OG or Satori; background job ensures cached version.
- Analytics: integrate Segment or RudderStack forwarding to Mixpanel/GA4. Builder step analytics using `@vercel/analytics` fallback.
- Experimentation: LaunchDarkly/Custom solution with flags served from Fastify (Redis-backed).
- Observability: Sentry (front/back), Logtail/Datadog for backend logs, Pingdom/Lighthouse CI for synthetic monitoring.

## 9. Performance & Reliability
- Core Web Vitals guardrails via Lighthouse CI in CI/CD; budgets enforced.
- Use `next/font` for custom fonts with subset; preconnect to Shopify & Cloudinary.
- Cache Shopify responses with stale-while-revalidate; serve fallback data if API fails.
- Webhook retries using queue with exponential backoff + dead-letter queue for manual recovery.
- Security audits for OWASP top 10; centralized audit logging for admin actions.

## 10. Development Workflow
- Monorepo managed manually (pending Turborepo adoption). Root `package.json` to orchestrate scripts; consider future Nx/Turborepo.
- Docker Compose for local env: services (`Fastify`, `Postgres`, `Redis`, `Mailhog`, `MinIO`). Next.js runs locally with `npm run dev`.
- Prisma migrations versioned; review process includes rollback scripts.
- Testing strategy: Vitest/Jest for unit, Playwright for E2E, Cypress optional for visual regression.
- GitHub Actions pipeline: lint → typecheck → unit tests → integration (Shopify mocked) → build → Lighthouse CI → Pa11y → deploy staging → smoke tests → manual prod promotion.

## 11. Milestones & Deliverables
- **M1 – Foundations (Weeks 1-2)**
  - Auth integration (Clerk), PDP, cart, checkout hand-off, baseline CMS pages.
  - Data sync jobs for Shopify products.
- **M2 – Builder Alpha (Weeks 3-5)**
  - Core customization flow (size, colorway, hardware, personalization).
  - Live 2D preview with sprite layering, pricing rules, shareable links.
- **M3 – Tracking & Ops (Weeks 6-7)**
  - Order status page, webhook ingestion, notifications, returns management.
- **M4 – Polish & Scale (Weeks 8-9)**
  - Micro-interactions, SEO hardening, analytics instrumentation, performance budgets, accessibility audits.
- **M5 – Enhancements (Ongoing)**
  - Size finder ML assist, 3D viewer, community gallery, bundles.

## 12. Acceptance Criteria Summary
- Builder completes ≤6 steps, persists state on refresh, rehydrates ≤100ms, respects reduced motion, non-blocking preview updates.
- Shopify checkout receives accurate line item properties and pricing.
- Order tracking accessible with order number + email, shows timeline + live status.
- SEO & performance scores meet defined thresholds; structured data validates.
- Resilience: handles Shopify API failures gracefully; webhooks idempotent and logged.
- QA: automated + manual tests across browsers/devices pass.

## 13. Immediate Next Steps
1. Configure shared tooling (ESLint, TypeScript project references, root scripts).
2. Establish environment configuration via `.env.example` for frontend/back.
3. Implement foundational layout, theme tokens, and baseline pages.
4. Scaffold Fastify server with Prisma + Redis integrations.
5. Prepare Docker Compose for local infra parity.


