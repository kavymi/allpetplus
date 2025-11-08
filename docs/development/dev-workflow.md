# Development Workflow - Running Services and Microfrontends

This guide explains how to run development servers for the monorepo, including dynamically created services and microfrontends from the scaffold script.

## Quick Reference

```bash
# Standard development (main app + backend only)
npm run dev

# Run ALL apps and services (auto-includes scaffolded projects)
npm run dev:all

# Run all frontend apps only
npm run dev:frontend

# Run all backend services only
npm run dev:backend-all

# Run specific project
nx dev pet-licensing          # Frontend app
nx serve builder-service      # Backend service
```

---

## How It Works

### Tags-Based Auto-Discovery

The scaffold script automatically tags each project:

**Frontend Apps** (in `apps/*/project.json`):
```json
{
  "tags": [
    "type:app",
    "scope:frontend",
    "domain:pet-licensing"
  ]
}
```

**Backend Services** (in `services/*/project.json`):
```json
{
  "tags": [
    "type:service",
    "scope:backend",
    "domain:builder-service"
  ]
}
```

The dev scripts use these tags to automatically find and run projects!

---

## Available Commands

### 1. `npm run dev` - Standard Development (Default)
**What it runs:** Only `web` (port 3000) + `backend` (port 4000)

**Use when:** Regular daily development on the main app

**Command:**
```bash
npm run dev
```

**Under the hood:**
```bash
nx run-many --target=dev --projects=web,backend --parallel=2
```

---

### 2. `npm run dev:all` - Everything (Recommended for Full Stack)
**What it runs:** ALL frontend apps + ALL backend services

**Use when:**
- Working across multiple apps/services
- Testing integrations between services
- After scaffolding new projects

**Command:**
```bash
npm run dev:all
```

**Under the hood:**
```bash
nx run-many --target=dev --projects=tag:scope:frontend,tag:scope:backend --parallel=5
```

**What runs:**
- ✅ `web` (port 3000)
- ✅ `pet-licensing` (port 3001)
- ✅ Any new apps created via scaffold
- ✅ `backend` (port 4000)
- ✅ `builder-service` (port 4001)
- ✅ Any new services created via scaffold

---

### 3. `npm run dev:frontend` - All Frontend Apps
**What it runs:** ALL apps in `apps/` directory

**Use when:**
- Working on multiple frontend features
- Testing microfrontend integrations
- Need all public-facing apps running

**Command:**
```bash
npm run dev:frontend
```

**Under the hood:**
```bash
nx run-many --target=dev --projects=tag:scope:frontend --parallel=3
```

**What runs:**
- ✅ `web` (port 3000)
- ✅ `pet-licensing` (port 3001)
- ✅ Any new apps from scaffold

---

### 4. `npm run dev:backend-all` - All Backend Services
**What it runs:** ALL services in `services/` directory

**Use when:**
- Testing microservice communication
- Working on backend integrations
- Need all APIs running simultaneously

**Command:**
```bash
npm run dev:backend-all
```

**Under the hood:**
```bash
nx run-many --target=serve --projects=tag:scope:backend --parallel=3
```

**What runs:**
- ✅ `backend` (port 4000)
- ✅ `builder-service` (port 4001)
- ✅ Any new services from scaffold

---

### 5. Run Specific Project(s)

**Run single frontend:**
```bash
nx dev pet-licensing
```

**Run single backend:**
```bash
nx serve builder-service
```

**Run multiple specific projects:**
```bash
nx run-many --target=dev --projects=web,pet-licensing --parallel=2
```

**Run specific projects by tag:**
```bash
# All projects tagged with domain:licensing
nx run-many --target=dev --projects=tag:domain:licensing
```

---

## After Scaffolding New Projects

### ✅ Automatic Inclusion (No Changes Needed!)

When you create a new project via `./scripts/scaffold.sh`:

1. **Frontend apps** are automatically tagged with `scope:frontend`
2. **Backend services** are automatically tagged with `scope:backend`
3. Tag-based commands (`dev:all`, `dev:frontend`, `dev:backend-all`) will **automatically include** the new project

**Example:**
```bash
# Create new app
./scripts/scaffold.sh
# Select: 2) Landing Page + Dashboard Tab
# Name: pet-insurance
# Port: 3002

# Now run all frontends (auto-includes pet-insurance!)
npm run dev:frontend

# Output:
# ✓ web (port 3000)
# ✓ pet-licensing (port 3001)  
# ✓ pet-insurance (port 3002) ← Automatically included!
```

---

### Manual Update (Optional)

If you want a new project in the **default `npm run dev`** command, update `package.json`:

```json
{
  "scripts": {
    "dev": "nx run-many --target=dev --projects=web,backend,pet-insurance --parallel=3"
  }
}
```

**When to do this:**
- You work on this project daily
- It's a core app (not optional/experimental)

**When NOT to do this:**
- For experimental/optional features
- Projects only needed occasionally
- Use `dev:all` or specific project commands instead

---

## Performance Considerations

### Parallel Execution

The `--parallel=N` flag controls how many projects run simultaneously:

```bash
# Run 2 at a time (lighter on CPU/memory)
--parallel=2

# Run 5 at a time (faster startup, more resource-intensive)
--parallel=5
```

**Recommendations:**
- **2-3 parallel:** Standard laptops, daily development
- **4-5 parallel:** Powerful machines, CI/CD
- **1 parallel:** Low-resource environments

### Resource Usage

**Minimal setup (2 processes):**
```bash
npm run dev
```
→ ~800MB RAM, 2 ports

**Full stack (5+ processes):**
```bash
npm run dev:all
```
→ ~3-4GB RAM, 5+ ports

---

## Troubleshooting

### "Address already in use" errors

**Problem:** Port conflict from previous run

**Solution:**
```bash
# Kill all node processes
pkill -9 node

# Or kill specific port
lsof -ti:3000 | xargs kill -9
lsof -ti:4000 | xargs kill -9
```

### Project not showing up in `dev:all`

**Problem:** Project missing tags

**Solution:** Check `project.json` has correct tags:

```bash
cat apps/my-app/project.json | grep tags -A 5

# Should show:
# "tags": [
#   "type:app",
#   "scope:frontend",
#   "domain:my-app"
# ]
```

If missing, add them manually or re-run scaffold.

### Too many processes overwhelming system

**Problem:** Running `dev:all` uses too much RAM/CPU

**Solutions:**

**Option 1:** Run fewer in parallel
```json
"dev:all": "nx run-many ... --parallel=2"
```

**Option 2:** Run only what you need
```bash
# Just frontend
npm run dev:frontend

# Just backend
npm run dev:backend-all

# Just specific projects
nx dev web
nx serve backend
```

---

## Advanced Usage

### Run affected projects only

After changing code, run only affected projects:

```bash
# Only run dev for projects affected by your changes
nx affected --target=dev --parallel=3
```

### Run projects matching pattern

```bash
# Run all "pet-*" apps
nx run-many --target=dev --projects="pet-*"

# Run all services ending in "-service"
nx run-many --target=serve --projects="*-service"
```

### Custom tag-based workflows

Add custom tags to `project.json`:

```json
{
  "tags": [
    "type:app",
    "scope:frontend",
    "feature:experimental"  // Custom tag
  ]
}
```

Then run by custom tag:
```bash
nx run-many --target=dev --projects=tag:feature:experimental
```

---

## Recommended Workflows

### Daily Development (Single Feature)
```bash
# Start main app + backend
npm run dev

# Then run only what you need
nx dev pet-licensing  # If working on licensing
```

### Full Stack Development
```bash
# Start everything
npm run dev:all

# Or separate terminals:
# Terminal 1: All frontends
npm run dev:frontend

# Terminal 2: All backends
npm run dev:backend-all
```

### Feature Development (Microfrontend)
```bash
# Terminal 1: Main app (for dashboard embedding)
nx dev web

# Terminal 2: Your feature app
nx dev pet-insurance

# Terminal 3: Backend
nx serve backend
```

### Microservice Development
```bash
# Terminal 1: Frontend (for testing)
nx dev web

# Terminal 2: Main backend
nx serve backend

# Terminal 3: Your microservice
nx serve my-service
```

---

## NX Graph Visualization

See which projects exist and their dependencies:

```bash
npm run graph
# Opens browser with interactive dependency graph
```

**Use this to:**
- See all available projects
- Understand project relationships
- Identify what to run together

---

## Summary

| Command | What It Runs | Use Case |
|---------|-------------|----------|
| `npm run dev` | web + backend | Daily development |
| `npm run dev:all` | All apps + services | Full stack work |
| `npm run dev:frontend` | All frontend apps | Frontend-focused work |
| `npm run dev:backend-all` | All backend services | Backend-focused work |
| `nx dev <project>` | Specific project | Targeted development |

**After scaffolding:** Tag-based commands automatically include new projects! ✨

---

## See Also

- [Scaffold Script Guide](/docs/guides/scaffold-script.md)
- [Creating New Microfrontends](/docs/guides/create-new-microfrontend.md)
- [Creating New Microservices](/docs/guides/create-new-microservice.md)
- [NX Documentation](https://nx.dev)

