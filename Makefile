# All Pet Plus - Development Commands

.PHONY: help dev dev-services stop clean build test

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'

# ==================== Development ====================

dev: ## Start all services locally (without Docker)
	npm run dev

dev-services: ## Start all services in Docker (microservices mode)
	docker-compose -f docker-compose.microservices.yml up

dev-services-build: ## Build and start all services in Docker
	docker-compose -f docker-compose.microservices.yml up --build

dev-infra: ## Start only infrastructure (Postgres + Redis)
	docker-compose up postgres redis

# ==================== Service Management ====================

start-backend: ## Start backend monolith
	nx serve backend

start-builder: ## Start builder service
	cd services/builder-service && npm run dev

start-web: ## Start web frontend
	nx dev web

# ==================== Docker ====================

stop: ## Stop all Docker containers
	docker-compose -f docker-compose.microservices.yml down

clean: ## Stop and remove all containers, volumes
	docker-compose -f docker-compose.microservices.yml down -v
	rm -rf dist .nx/cache apps/web/.next

rebuild: clean dev-services-build ## Clean and rebuild everything

# ==================== Database ====================

db-migrate: ## Run database migrations
	cd services/backend && npx prisma migrate dev

db-studio: ## Open Prisma Studio
	cd services/backend && npx prisma studio

db-seed: ## Seed database with test data
	cd services/backend && npx prisma db seed

db-reset: ## Reset database (DANGER: deletes all data)
	cd services/backend && npx prisma migrate reset

# ==================== Testing ====================

test: ## Run all tests
	nx run-many --target=test --all

test-affected: ## Run tests for affected projects
	nx affected --target=test

lint: ## Run linting
	nx run-many --target=lint --all

typecheck: ## Run TypeScript type checking
	nx run-many --target=typecheck --all

# ==================== Building ====================

build: ## Build all projects
	nx run-many --target=build --all

build-web: ## Build web frontend
	nx build web

build-backend: ## Build backend
	nx build backend

build-builder: ## Build builder service
	cd services/builder-service && npm run build

# ==================== Deployment ====================

deploy-staging: ## Deploy to staging
	@echo "Deploying to staging..."
	npm run deploy:staging

deploy-production: ## Deploy to production
	@echo "Deploying to production..."
	npm run deploy:production

# ==================== Utilities ====================

graph: ## Show NX dependency graph
	nx graph

affected: ## Show affected projects
	nx affected:graph

logs-backend: ## Show backend logs
	docker-compose -f docker-compose.microservices.yml logs -f backend

logs-builder: ## Show builder service logs
	docker-compose -f docker-compose.microservices.yml logs -f builder-service

logs-all: ## Show all service logs
	docker-compose -f docker-compose.microservices.yml logs -f

# ==================== Hybrid Architecture ====================

hybrid-status: ## Check status of all services
	@echo "=== Service Health Checks ==="
	@curl -s http://localhost:4000/healthz | jq . || echo "Backend: Not running"
	@curl -s http://localhost:4002/healthz | jq . || echo "Builder Service: Not running"
	@curl -s http://localhost:3000 > /dev/null && echo "Web: Running ✅" || echo "Web: Not running"

hybrid-dev: dev-infra ## Start infrastructure, then services locally
	@echo "Starting infrastructure..."
	@make dev-infra -s &
	@sleep 5
	@echo "Starting services..."
	@make dev
