# Backend Service Deployment

## Overview

- Runtime: Fastify (Node.js)
- Hosting: Fly.io (Machines/Apps)
- Environments: staging (`pet-backend-staging`), production (`pet-backend-prod`)
- Docker image built from `services/backend/Dockerfile`

## Local Development

```bash
npm install
npm run dev
```

Environment variables loaded from `.env`. Ensure Postgres/Redis running (see `docker-compose.yml`).

## Deployment Pipeline

- GitHub Actions workflow `.github/workflows/deploy.yml`
- `main` → staging, `production` → production
- Workflow steps: lint → typecheck → test → build → deploy
- Fly deploy commands:
  - Staging: `fly deploy --config services/backend/fly.staging.toml --remote-only --detach`
  - Production: `fly deploy --config services/backend/fly.prod.toml --remote-only --detach`

## Fly Configuration

- `fly.staging.toml`: 1 shared-cpu-1x machine, rolling deploys, `/healthz` check
- `fly.prod.toml`: 2 shared-cpu-2x machines, HTTP/HTTPS, tighter health checks
- Set secrets per app:

```bash
fly secrets set DATABASE_URL=... CLERK_SECRET_KEY=... --app pet-backend-staging
fly secrets set DATABASE_URL=... CLERK_SECRET_KEY=... --app pet-backend-prod
```

## Database Migrations

- Prisma migrations run via `npm run db:migrate`
- CI performs migrations against staging post-deploy (future automation)
- For production, run `npm run db:migrate:prod` after taking backups

## Monitoring

- `/healthz` endpoint used by Fly health checks
- `/metrics` reserved for Prometheus exporter (todo)
- Logs accessible via `fly logs -a <app-name>`
- Errors reported to Sentry via DSN

## Rollback Procedure

1. List releases: `fly releases -a pet-backend-prod`
2. Promote previous image: `fly deploy --image <image> -a pet-backend-prod`
3. Verify health checks return green
4. Investigate issue before redeploying latest build

