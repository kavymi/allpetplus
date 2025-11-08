# Quick Reference - Development Commands

## Running Development Servers

### Standard Commands

```bash
# Default - Main app + backend only
npm run dev

# ALL apps and services (auto-includes scaffolded projects!)
npm run dev:all

# All frontend apps
npm run dev:frontend

# All backend services
npm run dev:backend-all
```

### After Creating New Projects with Scaffold

**No changes needed!** ✨

Tag-based commands (`dev:all`, `dev:frontend`, `dev:backend-all`) automatically include new projects.

```bash
# Example:
./scripts/scaffold.sh  # Create pet-insurance on port 3002

# Automatically included!
npm run dev:frontend  
# ✓ Runs web (3000)
# ✓ Runs pet-licensing (3001)
# ✓ Runs pet-insurance (3002) ← NEW!
```

### Specific Projects

```bash
# Frontend apps
nx dev web
nx dev pet-licensing
nx dev pet-insurance

# Backend services
nx serve backend
nx serve builder-service
```

## Common Workflows

### Daily Development
```bash
npm run dev  # Just web + backend
```

### Full Stack Development
```bash
npm run dev:all  # Everything
```

### Working on Microfrontend
```bash
# Terminal 1: Main app (for dashboard)
nx dev web

# Terminal 2: Your feature app
nx dev pet-licensing
```

### Working on Microservice
```bash
# Terminal 1: Frontend
nx dev web

# Terminal 2: Backend
nx serve backend

# Terminal 3: Your microservice
nx serve my-service
```

## Build Commands

```bash
# Build everything
npm run build

# Build specific project
nx build web
nx build backend

# Build affected (changed projects only)
npm run build:affected
```

## Quality Commands

```bash
# Lint all
npm run lint

# Lint affected
npm run lint:affected

# Type check all
npm run typecheck

# Test all
npm run test

# Test affected
npm run test:affected
```

## Scaffold New Projects

```bash
npm run scaffold

# Creates:
# 1. Landing Page Only (frontend)
# 2. Landing + Dashboard (frontend)
# 3. Backend Service (microservice)
# 4. Backend Module (in monolith)
```

## NX Graph

```bash
npm run graph
# Opens interactive dependency visualization
```

## Port Assignments

### Frontend (3000+)
- 3000 - `web` (main app)
- 3001 - `pet-licensing`
- 3002+ - Future apps

### Backend (4000+)
- 4000 - `backend` (monolith)
- 4001 - `builder-service`
- 4002+ - Future services

## Troubleshooting

### Port in use
```bash
pkill -9 node
# Or specific port
lsof -ti:3000 | xargs kill -9
```

### Project not in dev:all
Check `project.json` has tags:
```json
{
  "tags": [
    "type:app",
    "scope:frontend",
    "domain:my-app"
  ]
}
```

## Documentation

- **Complete Guide:** [Dev Workflow](./development/dev-workflow.md)
- **Scaffold Guide:** [Scaffold Script](./guides/scaffold-script.md)
- **All Docs:** [README](./README.md)

