# Development Scripts

**Location:** `/scripts/`  
**Purpose:** Automation scripts for development workflow  
**Last Updated:** October 23, 2025

---

## Available Scripts

### `scaffold.sh` 🚀 **NEW!**

**Purpose:** Automated project creation (frontend apps, backend services, modules)

**Usage:**
```bash
npm run scaffold
# or
./scripts/scaffold.sh
```

**What it does:**
1. Interactive menu to choose project type
2. Prompts for name and configuration
3. Auto-assigns port numbers
4. Creates complete boilerplate
5. Sets up NX configuration
6. Adds TypeScript setup
7. Creates Docker files
8. Includes health checks

**Time saved:** ~18 minutes per project!

**Documentation:** `/docs/guides/scaffold-script.md`

---

### `setup-env.sh`

**Purpose:** Copy environment template files to active config files

**Usage:**
```bash
./scripts/setup-env.sh
```

**What it does:**
1. Copies `apps/web/env.template` → `apps/web/.env.local`
2. Copies `services/backend/env.template` → `services/backend/.env`
3. Copies root `env.template` → `.env`
4. Reminds you to fill in values

**When to use:**
- First time setup
- After pulling latest code (if templates changed)
- When starting fresh environment

**Related:** `/docs/guides/environment-setup.md`

---

### `setup.sh`

**Purpose:** Complete first-time project setup

**Usage:**
```bash
./scripts/setup.sh
```

**What it does:**
1. Checks Node.js version (requires v24)
2. Checks npm version (requires v10+)
3. Runs `npm install`
4. Sets up environment files
5. Starts Docker infrastructure
6. Runs database migrations
7. Seeds initial data

**When to use:**
- First time cloning the repository
- After major dependency changes
- When setting up new development machine

**Time:** ~10-15 minutes

**Related:** `/docs/how-to-setup.md`

---

### `setup-playwright.sh`

**Purpose:** Install Playwright browsers for E2E testing

**Usage:**
```bash
./scripts/setup-playwright.sh
```

**What it does:**
1. Installs Playwright CLI
2. Downloads Chromium, Firefox, WebKit browsers
3. Sets up Playwright dependencies
4. Verifies installation

**When to use:**
- Before running E2E tests
- After updating Playwright version
- On CI/CD systems

**Related:** `/docs/development/playwright-guide.md`

---

### `dev-tabs.sh`

**Purpose:** Start all services in separate terminal tabs

**Usage:**
```bash
./scripts/dev-tabs.sh
```

**What it does:**
1. Opens new terminal tabs (macOS Terminal or iTerm2)
2. Starts services in each tab:
   - Tab 1: Infrastructure (Docker)
   - Tab 2: Backend (port 4000)
   - Tab 3: Web (port 3000)
   - Tab 4: Pet Licensing (port 3001)

**Requirements:**
- macOS
- Terminal.app or iTerm2

**When to use:**
- When you want visual separation of logs
- Easier to restart individual services
- Better for development workflow

---

### `dev-tmux.sh`

**Purpose:** Start all services in tmux panes

**Usage:**
```bash
./scripts/dev-tmux.sh
```

**What it does:**
1. Creates tmux session named "all-pet-plus"
2. Splits window into panes
3. Starts services in each pane:
   - Pane 1: Infrastructure
   - Pane 2: Backend
   - Pane 3: Web
   - Pane 4: Pet Licensing

**Requirements:**
- tmux installed (`brew install tmux`)

**When to use:**
- Remote development (SSH)
- Want to detach/reattach session
- Prefer terminal multiplexer workflow

**Tmux commands:**
```bash
# Detach: Ctrl+b, then d
# Reattach: tmux attach -t all-pet-plus
# Kill: tmux kill-session -t all-pet-plus
```

---

## Script Patterns

### Error Handling

All scripts follow this pattern:
```bash
#!/bin/bash
set -e  # Exit on error
set -u  # Exit on undefined variable
set -o pipefail  # Exit on pipe failure

# Color output
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

echo -e "${GREEN}✓${NC} Success message"
echo -e "${RED}✗${NC} Error message"
```

---

### Logging

Scripts log to console with:
- ✓ Success messages (green)
- ✗ Error messages (red)
- ℹ Info messages (default)

---

## Creating New Scripts

### Template

```bash
#!/bin/bash
#
# Script Name: your-script.sh
# Purpose: Brief description
# Usage: ./scripts/your-script.sh [args]
#

set -e
set -u
set -o pipefail

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Functions
function log_info() {
  echo -e "ℹ  $1"
}

function log_success() {
  echo -e "${GREEN}✓${NC} $1"
}

function log_error() {
  echo -e "${RED}✗${NC} $1"
}

function log_warning() {
  echo -e "${YELLOW}⚠${NC} $1"
}

# Main script
log_info "Starting your script..."

# Your logic here

log_success "Complete!"
```

---

### Best Practices

1. **Add comments** explaining what each section does
2. **Check prerequisites** (Node version, Docker running, etc.)
3. **Provide feedback** (log each step)
4. **Handle errors gracefully** (set -e and trap)
5. **Make it idempotent** (safe to run multiple times)
6. **Add usage help** (show usage on --help)
7. **Test on clean system** (don't assume anything)

---

## Common Tasks

### Start Development

**Quick (without Docker):**
```bash
npm run dev
```

**Full stack (with Docker):**
```bash
./scripts/dev-tabs.sh
# or
./scripts/dev-tmux.sh
```

---

### Database Tasks

**Migrate:**
```bash
cd services/backend
npm run db:migrate
```

**Studio:**
```bash
cd services/backend
npm run db:studio
```

**Seed:**
```bash
cd services/backend
npm run db:seed
```

---

### Clean Start

**Full reset:**
```bash
# Stop everything
docker compose -f docker-compose.dev.yml down -v

# Clean builds
nx reset
rm -rf dist .nx/cache

# Reinstall
npm install

# Setup again
./scripts/setup.sh
```

---

## Troubleshooting Scripts

### Script won't run

**Error:** `Permission denied`

**Solution:**
```bash
chmod +x scripts/your-script.sh
```

---

### Node version mismatch

**Error:** `Node version must be >= 24`

**Solution:**
```bash
nvm install 24
nvm use 24
```

---

### Docker not running

**Error:** `Cannot connect to Docker daemon`

**Solution:**
1. Start Docker Desktop
2. Wait for it to fully start
3. Run script again

---

## Script Maintenance

### When to update scripts

- Package dependencies change
- New services added
- Ports change
- Setup process changes

### How to test changes

1. Test on clean branch
2. Test with fresh `.env` files
3. Test without Docker running
4. Test without node_modules
5. Document any new requirements

---

## Related Documentation

- [How To Setup](/docs/how-to-setup.md)
- [Environment Setup](/docs/guides/environment-setup.md)
- [Scaffold Script Guide](/docs/guides/scaffold-script.md)
- [Development Guide](/docs/development/development-guide.md)

---

## Contributing

When adding new scripts:

1. Follow the template above
2. Add entry to this README
3. Test thoroughly
4. Add error handling
5. Update related documentation
6. Make it executable (`chmod +x`)

---

**Questions about scripts?** Check the main documentation or create a discussion.

**Last Updated:** October 23, 2025

