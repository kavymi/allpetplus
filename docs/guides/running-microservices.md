# Running Microservices - Developer Guide

**Last Updated:** October 8, 2025  
**Architecture:** Hybrid (Modular Monolith + Extracted Services)

---

## 🚀 Quick Start

### Option 1: Modular Monolith (Simple)
```bash
# Start infrastructure
docker-compose up postgres redis

# Start all in one process
npm run dev
```

**Use when:** Local development, debugging, small changes

### Option 2: Microservices Mode (Full Stack)
```bash
# Start everything in Docker
docker-compose -f docker-compose.microservices.yml up

# Or use Makefile
make dev-services
```

**Use when:** Testing service communication, load testing, deployment testing

### Option 3: Hybrid Local (Best for Development)
```bash
# Start infrastructure in Docker
make dev-infra

# Start services locally
make start-backend      # Terminal 1: Backend (Port 4000)
make start-builder      # Terminal 2: Builder Service (Port 4002)  
make start-web          # Terminal 3: Frontend (Port 3000)
```

**Use when:** Active development, fastest iteration

---

## 📦 Service Overview

### Current Services:

| Service | Port | Purpose | Status |
|---------|------|---------|--------|
| **web** | 3000 | Next.js frontend | ✅ Running |
| **backend** | 4000 | Main API (Order, User, Webhook modules) | ✅ Running |
| **builder-service** | 4002 | Design CRUD (extracted) | 🚧 Ready to activate |
| **postgres** | 5432 | Database | ✅ Running |
| **redis** | 6379 | Cache & Events | ✅ Running |

---

## 🛠️ Development Workflows

### Scenario 1: Working on Builder Features

```bash
# Option A: Use modular backend (simple)
npm run dev  # Builder code in backend/src/modules/builder

# Option B: Use extracted service (production-like)
make dev-infra                    # Start DB & Redis
make start-builder                # Start builder service
make start-web                    # Start frontend
# Frontend calls builder-service directly
```

### Scenario 2: Working on Order/User Features

```bash
# Use modular backend (not extracted yet)
npm run dev  # Order & User modules in backend
```

### Scenario 3: Testing Full Microservices

```bash
# Start everything
make dev-services

# Check health
make hybrid-status

# View logs
make logs-all              # All services
make logs-builder          # Builder service only
make logs-backend          # Backend only
```

---

## 🔧 Configuration

### Environment Variables

**Backend (.env):**
```bash
PORT=4000
DATABASE_URL=postgresql://harness:dev_password@localhost:5432/harness_hero
REDIS_URL=redis://localhost:6379
BUILDER_SERVICE_URL=http://localhost:4002  # When extracted
```

**Builder Service (.env):**
```bash
PORT=4002
DATABASE_URL=postgresql://harness:dev_password@localhost:5432/harness_hero
REDIS_URL=redis://localhost:6379
```

**Frontend (.env.local):**
```bash
NEXT_PUBLIC_API_URL=http://localhost:4000  # Or 4002 for builder
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 🐳 Docker Commands

### Start Services:
```bash
# All services
docker-compose -f docker-compose.microservices.yml up

# Specific service
docker-compose -f docker-compose.microservices.yml up builder-service

# In background
docker-compose -f docker-compose.microservices.yml up -d

# With rebuild
docker-compose -f docker-compose.microservices.yml up --build
```

### Stop Services:
```bash
# Stop all
docker-compose -f docker-compose.microservices.yml down

# Stop and remove volumes
docker-compose -f docker-compose.microservices.yml down -v
```

### View Logs:
```bash
# All services
docker-compose -f docker-compose.microservices.yml logs -f

# Specific service
docker-compose -f docker-compose.microservices.yml logs -f builder-service

# Last 100 lines
docker-compose -f docker-compose.microservices.yml logs --tail=100
```

### Scale Services:
```bash
# Scale builder service to 3 instances
docker-compose -f docker-compose.microservices.yml up --scale builder-service=3
```

---

## 🧪 Testing

### Test Service Communication:
```bash
# Check builder service health
curl http://localhost:4002/healthz

# Test builder endpoint
curl http://localhost:4002/api/designs

# Check backend health
curl http://localhost:4000/healthz

# Test tRPC endpoint
curl -X POST http://localhost:3000/api/trpc/designs.list
```

---

## 🐛 Troubleshooting

### Service Won't Start:

**Check logs:**
```bash
docker-compose -f docker-compose.microservices.yml logs builder-service
```

**Common issues:**
- Database not ready → Wait for healthcheck
- Port already in use → Change port in docker-compose
- Missing .env file → Copy from env.template

### Database Connection Issues:

```bash
# Check Postgres is running
docker-compose ps postgres

# Test connection
docker-compose exec postgres psql -U harness -d harness_hero

# Run migrations
make db-migrate
```

### Redis Connection Issues:

```bash
# Check Redis
docker-compose ps redis

# Test connection
docker-compose exec redis redis-cli ping
```

---

## 📊 Service Health Monitoring

### Health Check Endpoints:

```bash
# Backend
GET http://localhost:4000/healthz

# Builder Service
GET http://localhost:4002/healthz

# Response format:
{
  "status": "healthy",
  "service": "builder-service",
  "timestamp": "2025-10-08T12:00:00.000Z"
}
```

---

## 🚀 Deployment

### Deploy to Staging:
```bash
# Backend
fly deploy services/backend --config fly.backend.staging.toml

# Builder Service (extracted)
fly deploy services/builder-service --config fly.builder.staging.toml

# Frontend
vercel --prod apps/web
```

### Scale in Production:
```bash
# Scale builder service (high traffic)
fly scale count builder-service=5 --app harness-builder-staging

# Backend stays small
fly scale count backend=1 --app harness-backend-staging
```

---

## 💡 Best Practices

### Development:
- ✅ Use `make dev` for simple local development
- ✅ Use `make dev-services` to test microservices mode
- ✅ Keep infrastructure in Docker, services local for faster iteration

### Testing:
- ✅ Test module in monolith first
- ✅ Then test extracted service
- ✅ Verify service communication
- ✅ Load test before production

### Deployment:
- ✅ Deploy modular monolith first
- ✅ Extract service when traffic justifies it
- ✅ Run both in parallel initially
- ✅ Gradual traffic shifting

---

## 📚 Related Documentation

- **Architecture:** `/docs/architecture/microservices-architecture.md`
- **Hybrid Guide:** `/docs/architecture/hybrid-architecture-implementation.md`
- **tRPC Setup:** `/docs/guides/trpc-implementation-complete.md`
- **This Guide:** `/docs/guides/running-microservices.md`

---

**For questions:** Check documentation or run `make help`
