# Documentation Index

**Last Updated:** November 8, 2025  
**Documentation Grade:** 🎉 **A (95/100)** - Grade A Achieved!

Welcome to the All Pet Plus documentation. This guide will help you navigate our comprehensive docs.

---

## 🚀 Quick Start

**New to the project?** Start here:

1. **[How To Setup](./how-to-setup.md)** ⭐ **START HERE** - Complete setup guide (30-45 min)
2. **[Master Architecture](./ARCHITECTURE.md)** 🆕 **ONE PAGE** - Complete system overview
3. [Code Patterns](./development/code-patterns.md) - Learn our coding conventions
4. [Development Guide](./development/development-guide.md) - Daily development workflow

### Quick Build Commands

**Verify everything builds:**
```bash
# Build all libraries (should take ~5 seconds)
npx nx run-many --target=build --projects=domain,shared,messaging

# Build web app (should take ~12-15 seconds)
cd apps/web && NODE_ENV=production npx next build
```

**Development workflow:**
```bash
# Type check during development
npx nx typecheck web

# Lint before committing
npx nx lint web

# See full build process in Development Guide →
```

---

## 📂 Documentation Structure

### Codebase Analysis 🆕
**Complete analysis of folder structure, micro-frontends, and microservices:**
- **[Analysis Index](./analysis/README.md)** - Quick reference and overview
- [Codebase Structure Analysis](./analysis/codebase-structure-analysis.md) - Deep dive into organization
- [Architecture Visual Diagrams](./analysis/architecture-visual-diagrams.md) - Visual representations
- [Audit: Issues and Gaps](./analysis/audit-issues-and-gaps.md) - 28 issues identified with fixes
- [Grade A Achievement Report](./analysis/GRADE_A_ACHIEVEMENT.md) 🎉 - How we reached Grade A (95/100)

### Design & UX
- [Design System Implementation](./design/design-system-implementation.md) - Complete component library
- [Motion Guidelines](./design/motion-guidelines.md) - Animation patterns and accessibility
- [Typography Guide](./design/typography-guide.md) - Font system and usage

### Architecture
- **[Master Architecture](./ARCHITECTURE.md)** 🆕⭐ **ONE COMPREHENSIVE GUIDE** - Complete system architecture
- [Flow Diagrams](./architecture/flow-diagrams.md) - Mermaid visual diagrams
- [Component Architecture](./architecture/component-architecture.md) - React patterns
- [Database Scaling Plan](./architecture/database-scaling-plan.md) - Scaling strategies
- [3D Preview System](./architecture/3d-preview-system.md) - 3D rendering architecture
- [3D Harness Redesign](./architecture/3d-harness-redesign.md) - Realistic harness model
- [Pet Alliance Database Schema](./architecture/pet-alliance-database-schema.md) - Database design
- [Architecture Decision Records (ADRs)](./architecture/adr/) - Formal decision documentation (4 ADRs)

### Development
- [Development Guide](./development/development-guide.md) - Daily workflow and best practices
- [Dev Workflow](./development/dev-workflow.md) - Running services and microfrontends
- [**Scaffold System Analysis**](./development/scaffold-analysis.md) 🚀 - Complete automation system guide
- [**Scaffold Quick Reference**](./development/scaffold-quick-reference.md) ⚡ - Daily quick reference card
- **[shadcn/ui Guide](./development/shadcn-ui.md)** 🆕⭐ **CONSOLIDATED** - Complete UI component guide
- [Code Patterns](./development/code-patterns.md) - TypeScript patterns and examples
- [Testing Guide](./development/testing-guide.md) - Jest unit tests
- [Test Coverage](./development/test-coverage.md) - Coverage targets and standards
- [Playwright Guide](./development/playwright-guide.md) - E2E tests with AI CodeGen
- [Performance Guide](./development/performance-guide.md) - Optimization strategies
- [Performance Benchmarks](./development/performance-benchmarks.md) - Targets and metrics

### Guides
- [**How To Setup**](./how-to-setup.md) ⭐ **Complete setup guide for new developers**
- [**Scaffold Script**](./guides/scaffold-script.md) 🚀 **Automated project creation (NEW!)**
- [Environment Setup](./guides/environment-setup.md) - Environment variables reference
- [Database Setup](./guides/database-setup.md) - Database management
- [API Keys Guide](./guides/api-keys.md) - External service setup
- [tRPC Usage Examples](./guides/trpc-usage-examples.md) - tRPC usage patterns
- [Create Microfrontend](./guides/create-new-microfrontend.md) - Creating micro-frontends (manual)
- [Create Microservice](./guides/create-new-microservice.md) - Creating microservices (manual)
- [Microfrontend Integration Patterns](./guides/microfrontend-integration-patterns.md) 🆕 - Communication & auth
- [Running Microservices](./guides/running-microservices.md) - Running services locally

### Operations
- [Deployment Guide](./ops/deploy.md) - Production deployment procedures
- [Backend Deployment](./ops/backend-deployment.md) - Backend-specific deployment
- [Database Migration Setup](./ops/database-migration-setup.md) - Database migration procedures

### API Reference
- [tRPC API Reference](./api/trpc-api-reference.md) 🆕 - Complete tRPC procedure documentation
- [Frontend API](./api/api-reference.md) - Frontend API documentation
- [Backend API](./api/backend-api-reference.md) - Backend API endpoints

### Features
- **[Products CO](./features/products-co.md)** 🆕⭐ **COMPREHENSIVE** - Complete e-commerce guide
- [Pet Solutions Alliance Master Plan](./features/pet-solutions-alliance-master.md) - All 12 divisions
- [SEO Implementation](./features/seo-implementation-guide.md) - SEO best practices
- [SEO Quick Reference](./features/seo-quick-reference.md) - SEO checklist
- [3D Collar Customizer](./features/3d-collar-customizer.md) - 3D collar feature
- [Global Navigation](./features/global-navigation.md) - Navigation system
- [Saved Designs Page](./features/saved-designs-page.md) - Saved designs feature

### Troubleshooting
- [Troubleshooting FAQ](./troubleshooting-faq.md) - Common issues and solutions
- [React 19 Compatibility](./troubleshooting/react-19-compatibility.md) - React 19 issues

### Reference
- [Glossary](./glossary.md) 🆕 - Technical terms and definitions
- [Security Guidelines](./security.md) 🆕 - Security best practices
- [Contributing Guide](./CONTRIBUTING.md) 🆕 - How to contribute to docs
- [Scripts Documentation](/scripts/README.md) 🆕 - Development scripts reference

### Project Meta
- [Changelog](/CHANGELOG.md) 🆕 - Version history and changes
- [Archive Index](./archive/README.md) 🆕 - Historical documentation

---

## 🎯 By Task

### Setting Up Development

**Complete Guide:** [How To Setup](./how-to-setup.md) ⭐

**Quick version:**
1. Install Node.js v24
2. Start Docker: `docker compose -f docker-compose.dev.yml up -d`
3. Copy env files: `cp apps/web/env.template apps/web/.env.local`
4. Setup database: `cd services/backend && npm run db:migrate`
5. Start services: `npm run dev`

### Writing Code

1. **Learn Patterns:**
   - [Code Patterns](./development/code-patterns.md)
   - [Component Architecture](./architecture/component-architecture.md)
   - [tRPC Usage Examples](./guides/trpc-usage-examples.md)

2. **Test Your Code:**
   - [Testing Guide](./development/testing-guide.md) - Jest unit tests
   - [Playwright Guide](./development/playwright-guide.md) - E2E tests

3. **Optimize Performance:**
   - [Performance Guide](./development/performance-guide.md)

### Deploying

1. **Deployment Process:**
   - [Deployment Guide](./ops/deploy.md)
   - [Backend Deployment](./ops/backend-deployment.md)

2. **Monitoring:**
   - [Backend API Reference](./api/backend-api-reference.md)

### Troubleshooting

- [Troubleshooting FAQ](./troubleshooting-faq.md)
- Check relevant guide for specific issues

---

## 📖 Additional Resources

### External Links
- [NX Documentation](https://nx.dev) - Monorepo tooling
- [Next.js 15 Documentation](https://nextjs.org/docs) - Frontend framework
- [Fastify Documentation](https://fastify.dev) - Backend framework
- [Prisma Documentation](https://www.prisma.io/docs) - Database ORM
- [tRPC Documentation](https://trpc.io/) - Type-safe APIs
- [Playwright Documentation](https://playwright.dev) - E2E testing

### In Codebase
- `/CLAUDE.md` - AI assistant guidelines
- `/README.md` - Project overview
- `/CHANGELOG.md` - Version history
- `/.cursor/rules/` - AI development rules (10 files)
- `/docs/archive/` - Historical documentation
- `/scripts/` - Development automation scripts

---

## 📋 Essential Commands

```bash
# Setup (first time)
npm install
docker compose -f docker-compose.dev.yml up -d
cd services/backend && npm run db:migrate

# Scaffolding (NEW!)
npm run scaffold               # Create new app/service interactively

# Development
npm run dev                    # Start all services
npm run dev:web                # Frontend only
npm run dev:backend            # Backend only

# Database
cd services/backend
npm run db:migrate             # Run migrations
npm run db:studio              # Database GUI
npm run db:seed                # Add sample data

# Testing
npm test                       # All tests
npm run test:watch             # Watch mode
npx nx e2e web                 # E2E tests

# Building
npm run build                  # Build all
npm run lint                   # Lint all
npm run typecheck              # Type check
```

---

