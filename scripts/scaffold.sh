#!/bin/bash

# All Pet Plus - Project Scaffold Script
# Creates new frontend apps or backend services with all necessary boilerplate

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Helper functions
print_header() {
    echo -e "\n${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${CYAN}  $1${NC}"
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Show help
show_help() {
    print_header "Scaffold Help - Detailed Comparison"
    
    echo -e "${CYAN}━━━ Frontend Patterns ━━━${NC}"
    echo ""
    echo -e "${GREEN}1) Landing Page Only${NC}"
    echo "   • Public marketing pages only"
    echo "   • Shared top nav with link to centralized Dashboard"
    echo "   • NO dashboard tab integration"
    echo "   • Use for: Product marketing, SEO content"
    echo ""
    echo -e "${GREEN}2) Landing + Dashboard Tab${NC}"
    echo "   • Public landing pages + dashboard content"
    echo "   • Shared top nav with link to centralized Dashboard"
    echo "   • Dashboard content embedded via iframe in main Dashboard"
    echo "   • Use for: Features with user data management"
    echo ""
    echo -e "${YELLOW}Auto-Generated for Frontend:${NC}"
    echo "  ✓ Domain types in libs/domain/src/lib/[name]/"
    echo "  ✓ tRPC router in libs/api/src/routers/[name].ts"
    echo "  ✓ Full app structure with TypeScript, Next.js, etc."
    echo ""
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    
    echo -e "${GREEN}━━━ Backend Service (Microservice) ━━━${NC}"
    echo ""
    echo -e "${CYAN}What is it?${NC}"
    echo "  A standalone Fastify application that runs as a separate process"
    echo "  with its own port, Docker container, and deployment lifecycle."
    echo ""
    echo -e "${CYAN}Key Characteristics:${NC}"
    echo -e "  ✓ ${GREEN}Separate process${NC} - Runs independently (e.g., port 4001, 4002)"
    echo -e "  ✓ ${GREEN}Independent deployment${NC} - Has own Dockerfile, deploys separately"
    echo -e "  ✓ ${GREEN}Separate scaling${NC} - Can scale up/down based on its own load"
    echo -e "  ✓ ${GREEN}Isolation${NC} - Failures don't affect other services"
    echo -e "  ✓ ${GREEN}Technology freedom${NC} - Can use different tech stack if needed"
    echo ""
    echo -e "${CYAN}When to Use:${NC}"
    echo "  ✓ High traffic expected (>1000 requests/min)"
    echo "  ✓ Resource-intensive operations (image processing, AI, 3D rendering)"
    echo "  ✓ Different scaling requirements than main backend"
    echo "  ✓ Want to isolate potential failures"
    echo "  ✓ Separate team ownership"
    echo ""
    echo -e "${CYAN}Examples:${NC}"
    echo -e "  • ${YELLOW}Builder Service${NC} - Handles 3D harness preview generation"
    echo -e "  • ${YELLOW}Email Service${NC} - Sends transactional emails at high volume"
    echo -e "  • ${YELLOW}Analytics Service${NC} - Processes heavy data aggregation"
    echo ""
    echo -e "${CYAN}Location:${NC} ${YELLOW}services/[service-name]/${NC}"
    echo ""
    echo -e "${YELLOW}Auto-Generated for Services:${NC}"
    echo "  ✓ Domain types in libs/domain/src/lib/[name]/"
    echo "  ✓ tRPC router in libs/api/src/routers/[name].ts"
    echo "  ✓ Docker Compose configuration"
    echo "  ✓ Full service structure with TypeScript, Fastify, etc."
    echo ""
    
    echo -e "${BLUE}━━━ Backend Module (Monolith Module) ━━━${NC}"
    echo ""
    echo -e "${CYAN}What is it?${NC}"
    echo "  A module/folder within the main backend service that shares"
    echo "  the same process, database connections, and deployment."
    echo ""
    echo -e "${CYAN}Key Characteristics:${NC}"
    echo -e "  ✓ ${BLUE}Shared process${NC} - Runs within main backend (port 4000)"
    echo -e "  ✓ ${BLUE}No separate deployment${NC} - Deploys with entire backend"
    echo -e "  ✓ ${BLUE}Shared resources${NC} - Same DB pool, Redis, memory limits"
    echo -e "  ✓ ${BLUE}Simpler setup${NC} - No Docker, no port management"
    echo -e "  ✓ ${BLUE}Easier debugging${NC} - Everything in one process"
    echo ""
    echo -e "${CYAN}When to Use:${NC}"
    echo "  ✓ Low to medium traffic (<500 requests/min)"
    echo "  ✓ Simple CRUD operations"
    echo "  ✓ Tightly coupled with other backend features"
    echo "  ✓ Shares database transactions with other modules"
    echo "  ✓ Want faster development (less infrastructure setup)"
    echo ""
    echo -e "${CYAN}Examples:${NC}"
    echo -e "  • ${YELLOW}Pet Module${NC} - Manages pet profiles (CRUD)"
    echo -e "  • ${YELLOW}Order Module${NC} - Handles order data (CRUD)"
    echo -e "  • ${YELLOW}User Module${NC} - User preferences and settings"
    echo ""
    echo -e "${CYAN}Location:${NC} ${YELLOW}services/backend/src/modules/[module-name]/${NC}"
    echo ""
    echo -e "${YELLOW}Auto-Generated for Modules:${NC}"
    echo "  ✓ Domain types in libs/domain/src/lib/[name]/"
    echo "  ✓ tRPC router in libs/api/src/routers/[name].ts"
    echo "  ✓ Module structure with service class"
    echo ""
    
    echo -e "${YELLOW}━━━ Quick Decision Guide ━━━${NC}"
    echo ""
    echo -e "  ${GREEN}Choose Backend Service if:${NC}"
    echo "    • You expect >1000 requests/min"
    echo "    • It needs different scaling than main backend"
    echo "    • It's computationally expensive"
    echo "    • You want isolation/fault tolerance"
    echo ""
    echo -e "  ${BLUE}Choose Backend Module if:${NC}"
    echo "    • Simple CRUD operations"
    echo "    • Low to medium traffic"
    echo "    • Shares database transactions"
    echo "    • Want faster, simpler development"
    echo ""
    echo -e "  ${CYAN}Pro Tip:${NC} When in doubt, start with a ${BLUE}Backend Module${NC}."
    echo "  You can always extract it to a microservice later if needed!"
    echo ""
    
    read -p "Press Enter to return to menu..." 
}

# Main menu
show_menu() {
    print_header "All Pet Plus - Project Scaffold"
    echo "What would you like to create?"
    echo ""
    echo -e "  ${CYAN}1) Landing Page Only${NC} (Standalone micro-frontend)"
    echo -e "     → Public landing page with marketing content"
    echo -e "     → ${GREEN}Shared top nav${NC} with link to centralized Dashboard"
    echo -e "     → No dashboard integration"
    echo -e "     → Example: Marketing site for a new product line"
    echo ""
    echo -e "  ${CYAN}2) Landing Page + Dashboard Tab${NC} (Full micro-frontend)"
    echo -e "     → Public landing page + tab in centralized Dashboard"
    echo -e "     → ${GREEN}Shared top nav${NC} with link to Dashboard"
    echo -e "     → Dashboard content appears as tab in main Dashboard (apps/web)"
    echo -e "     → Example: Pet Licensing (apps/pet-licensing)"
    echo ""
    echo -e "  ${CYAN}3) Backend Service${NC} (Fastify microservice)"
    echo -e "     → ${GREEN}Separate process${NC} - runs independently on its own port"
    echo -e "     → ${GREEN}Independent deployment${NC} - has own Docker container"
    echo -e "     → ${GREEN}Separate scaling${NC} - scales independently"
    echo -e "     → ${YELLOW}Use for:${NC} High traffic (>1000 req/min), complex logic, isolation"
    echo -e "     → Example: Builder Service (services/builder-service)"
    echo ""
    echo -e "  ${CYAN}4) Backend Module${NC} (Module in main backend)"
    echo -e "     → ${BLUE}Shared process${NC} - runs within main backend (port 4000)"
    echo -e "     → ${BLUE}No separate deployment${NC} - deploys with main backend"
    echo -e "     → ${BLUE}Shared resources${NC} - same DB pool, same memory"
    echo -e "     → ${YELLOW}Use for:${NC} Simple CRUD (<500 req/min), easier debugging"
    echo -e "     → Example: Pet Module (services/backend/src/modules/pet)"
    echo ""
    echo -e "  ${CYAN}5) Help${NC} - Show detailed comparison"
    echo -e "  ${CYAN}6) Exit${NC}"
    echo ""
    read -p "Select option (1-6): " choice
    echo ""
}

# Get next available port
get_next_frontend_port() {
    local max_port=3000
    for dir in apps/*/; do
        if [ -f "$dir/package.json" ]; then
            port=$(grep -o '"dev": "next dev -p [0-9]*"' "$dir/package.json" | grep -o '[0-9]*' | head -1)
            if [ ! -z "$port" ] && [ "$port" -gt "$max_port" ]; then
                max_port=$port
            fi
        fi
    done
    echo $((max_port + 1))
}

get_next_backend_port() {
    local max_port=4000
    for dir in services/*/; do
        if [ -f "$dir/package.json" ]; then
            port=$(grep -o 'PORT.*[0-9][0-9][0-9][0-9]' "$dir/src/main.ts" 2>/dev/null | grep -o '[0-9][0-9][0-9][0-9]' | head -1)
            if [ ! -z "$port" ] && [ "$port" -gt "$max_port" ]; then
                max_port=$port
            fi
        fi
    done
    echo $((max_port + 1))
}

# Convert kebab-case to PascalCase
to_pascal_case() {
    echo "$1" | sed -r 's/(^|-)([a-z])/\U\2/g'
}

# Auto-create domain types
create_domain_types() {
    local domain_name="$1"
    local pascal_name="$2"
    
    print_info "Creating domain types in libs/domain/src/lib/${domain_name}/..."
    
    mkdir -p "libs/domain/src/lib/${domain_name}"
    
    # Create types.ts
    cat > "libs/domain/src/lib/${domain_name}/types.ts" << EOF
/**
 * ${pascal_name} Domain Types
 * Shared across all services and frontend
 */

export interface ${pascal_name}Data {
  id: string;
  userId: string;
  name: string;
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface Create${pascal_name}Input {
  name: string;
  // Add your fields here
}

export interface Update${pascal_name}Input {
  id: string;
  name?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'PENDING';
  // Add your fields here
}
EOF

    # Create validation.ts
    cat > "libs/domain/src/lib/${domain_name}/validation.ts" << EOF
/**
 * ${pascal_name} Domain Validation Schemas
 * Zod schemas for type-safe validation
 */

import { z } from 'zod';

export const create${pascal_name}Schema = z.object({
  name: z.string().min(1).max(255),
  // Add your validations here
});

export const update${pascal_name}Schema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(255).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'PENDING']).optional(),
  // Add your validations here
});

export const ${domain_name}IdSchema = z.object({
  id: z.string().uuid(),
});

// Export inferred types (only CreateInput and UpdateInput to avoid duplicates)
export type Create${pascal_name}Input = z.infer<typeof create${pascal_name}Schema>;
export type Update${pascal_name}Input = z.infer<typeof update${pascal_name}Schema>;
EOF

    # Create utils.ts
    cat > "libs/domain/src/lib/${domain_name}/utils.ts" << EOF
/**
 * ${pascal_name} Domain Utilities
 * Shared business logic and helpers
 */

/**
 * Format ${domain_name} display name
 */
export function format${pascal_name}Name(name: string): string {
  return name.trim();
}

// Add your utility functions here
EOF

    # Create index.ts
    cat > "libs/domain/src/lib/${domain_name}/index.ts" << EOF
/**
 * ${pascal_name} Domain - Public API
 */

export * from './types';
export * from './validation';
export * from './utils';
EOF

    # Update libs/domain/src/index.ts
    if ! grep -q "export \* from './lib/${domain_name}'" libs/domain/src/index.ts; then
        echo "" >> libs/domain/src/index.ts
        echo "// ${pascal_name} domain" >> libs/domain/src/index.ts
        echo "export * from './lib/${domain_name}';" >> libs/domain/src/index.ts
        print_success "Added ${domain_name} export to libs/domain/src/index.ts"
    fi
}

# Auto-create tRPC router
create_trpc_router() {
    local router_name="$1"
    local pascal_name="$2"
    
    print_info "Creating tRPC router in libs/api/src/routers/${router_name}.ts..."
    
    cat > "libs/api/src/routers/${router_name}.ts" << EOF
/**
 * ${pascal_name} tRPC Router
 * Type-safe ${pascal_name} API
 */

import { router, protectedProcedure, publicProcedure } from '../trpc';
import {
  create${pascal_name}Schema,
  update${pascal_name}Schema,
  ${router_name}IdSchema,
} from '@pet/domain';

export const ${router_name}Router = router({
  /**
   * List all items for the current user
   */
  list: protectedProcedure.query(async ({ ctx }) => {
    // TODO: Implement list logic
    return [];
  }),

  /**
   * Get item by ID
   */
  byId: protectedProcedure
    .input(${router_name}IdSchema)
    .query(async ({ ctx, input }) => {
      // TODO: Implement get by ID logic
      return null;
    }),

  /**
   * Create new item
   */
  create: protectedProcedure
    .input(create${pascal_name}Schema)
    .mutation(async ({ ctx, input }) => {
      // TODO: Implement create logic
      return { id: 'new-id', ...input };
    }),

  /**
   * Update item
   */
  update: protectedProcedure
    .input(update${pascal_name}Schema)
    .mutation(async ({ ctx, input }) => {
      // TODO: Implement update logic
      return { id: input.id };
    }),

  /**
   * Delete item
   */
  delete: protectedProcedure
    .input(${router_name}IdSchema)
    .mutation(async ({ ctx, input }) => {
      // TODO: Implement delete logic
      return { success: true };
    }),
});
EOF

    # Update libs/api/src/root.ts
    if ! grep -q "${router_name}Router" libs/api/src/root.ts; then
        # Add import
        sed -i '' "/import { router } from '.\/trpc';/a\\
import { ${router_name}Router } from './routers/${router_name}';
" libs/api/src/root.ts
        
        # Add to router
        sed -i '' "/export const appRouter = router({/a\\
  ${router_name}: ${router_name}Router,
" libs/api/src/root.ts
        
        print_success "Added ${router_name}Router to libs/api/src/root.ts"
    fi
}

# Update docker-compose for microservice
update_docker_compose() {
    local service_name="$1"
    local port="$2"
    
    print_info "Updating docker-compose.microservices.yml..."
    
    if [ ! -f "docker-compose.microservices.yml" ]; then
        print_warning "docker-compose.microservices.yml not found, skipping..."
        return
    fi
    
    # Add service to docker-compose
    cat >> docker-compose.microservices.yml << EOF

  ${service_name}:
    build:
      context: ./services/${service_name}
      dockerfile: Dockerfile
    ports:
      - "${port}:${port}"
    environment:
      - PORT=${port}
      - NODE_ENV=development
      - DATABASE_URL=\${DATABASE_URL}
    volumes:
      - ./services/${service_name}/src:/app/src
    depends_on:
      - postgres
      - redis
    networks:
      - pet-network
EOF
    
    print_success "Added ${service_name} to docker-compose.microservices.yml"
}

# Create frontend landing page only (no dashboard integration)
create_frontend_landing_only() {
    print_header "Create Landing Page Only"
    
    print_info "This creates a standalone landing page with:"
    print_info "  ✓ Public pages"
    print_info "  ✓ Shared navigation (with link to Dashboard)"
    print_info "  ✗ NO dashboard tab integration"
    echo ""
    
    # Reuse the full frontend creation but skip dashboard integration steps
    create_frontend_app "landing-only"
}

# Create frontend with dashboard integration
create_frontend_with_dashboard() {
    print_header "Create Landing + Dashboard Integration"
    
    print_info "This creates a full micro-frontend with:"
    print_info "  ✓ Public landing pages"
    print_info "  ✓ Shared navigation (with link to Dashboard)"
    print_info "  ✓ Dashboard content page (for iframe)"
    print_info "  ✓ Dashboard tab integration needed"
    echo ""
    
    # Reuse the full frontend creation and indicate dashboard integration is needed
    create_frontend_app "with-dashboard"
}

# Create frontend app (internal - called by landing_only and with_dashboard)
create_frontend_app() {
    local integration_type="${1:-with-dashboard}"  # Default to full integration
    
    print_header "Create New Frontend App"
    
    # Get app name
    read -p "App name (kebab-case, e.g., pet-insurance): " app_name
    
    if [ -z "$app_name" ]; then
        print_error "App name cannot be empty"
        exit 1
    fi
    
    if [ -d "apps/$app_name" ]; then
        print_error "App already exists: apps/$app_name"
        exit 1
    fi
    
    # Get port
    suggested_port=$(get_next_frontend_port)
    read -p "Port number (suggested: $suggested_port): " port
    port=${port:-$suggested_port}
    
    # Get description
    read -p "Description: " description
    
    pascal_name=$(to_pascal_case "$app_name")
    
    print_info "Creating frontend app: $app_name on port $port"
    
    # Create directory structure
    print_info "Creating directory structure..."
    mkdir -p "apps/$app_name/src/app"
    mkdir -p "apps/$app_name/src/components"
    mkdir -p "apps/$app_name/src/lib"
    mkdir -p "apps/$app_name/src/styles"
    mkdir -p "apps/$app_name/public"
    
    # Create package.json
    print_info "Creating package.json..."
    cat > "apps/$app_name/package.json" << EOF
{
  "name": "@pet/$app_name",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev -p $port",
    "build": "next build",
    "start": "next start -p $port",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "15.0.3",
    "react": "19.0.0",
    "react-dom": "19.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "eslint-config-next": "15.0.3",
    "typescript": "^5.7.2"
  }
}
EOF
    
    # Create next.config.ts
    print_info "Creating next.config.ts..."
    cat > "apps/$app_name/next.config.ts" << 'EOF'
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@pet/domain', '@pet/shared', '@pet/api'],
};

export default nextConfig;
EOF
    
    # Create tsconfig.json
    print_info "Creating tsconfig.json..."
    cat > "apps/$app_name/tsconfig.json" << EOF
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "jsx": "preserve",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "noEmit": true,
    "incremental": true,
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
EOF
    
    # Create project.json
    print_info "Creating project.json..."
    cat > "apps/$app_name/project.json" << EOF
{
  "name": "$app_name",
  "\$schema": "../../node_modules/nx/schemas/project-schema.json",
  "sourceRoot": "apps/$app_name/src",
  "projectType": "application",
  "tags": [
    "type:app",
    "scope:frontend",
    "domain:$app_name"
  ],
  "targets": {
    "dev": {
      "executor": "@nx/next:server",
      "defaultConfiguration": "development",
      "options": {
        "buildTarget": "$app_name:build",
        "dev": true,
        "port": $port
      }
    },
    "build": {
      "executor": "@nx/next:build",
      "outputs": ["{options.outputPath}"],
      "defaultConfiguration": "production",
      "options": {
        "outputPath": "dist/apps/$app_name"
      }
    },
    "start": {
      "executor": "@nx/next:server",
      "defaultConfiguration": "production",
      "options": {
        "buildTarget": "$app_name:build",
        "dev": false,
        "port": $port
      }
    },
    "lint": {
      "executor": "@nx/eslint:lint",
      "outputs": ["{options.outputFile}"],
      "options": {
        "lintFilePatterns": ["apps/$app_name/**/*.{ts,tsx}"]
      }
    },
    "typecheck": {
      "executor": "nx:run-commands",
      "options": {
        "command": "tsc -p apps/$app_name/tsconfig.json --noEmit"
      }
    }
  }
}
EOF
    
    # Create layout.tsx
    print_info "Creating layout.tsx..."
    cat > "apps/$app_name/src/app/layout.tsx" << EOF
import type { Metadata } from 'next';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: '$pascal_name - All Pet Plus',
  description: '$description',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
EOF
    
    # Create page.tsx (public landing)
    print_info "Creating page.tsx..."
    cat > "apps/$app_name/src/app/page.tsx" << EOF
import Link from 'next/link';

export default function ${pascal_name}Landing(): React.ReactElement {
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-5xl font-bold mb-4">$pascal_name</h1>
      <p className="text-xl mb-8 text-[var(--color-foreground-secondary)]">
        $description
      </p>
      
      <div className="flex gap-4">
        <Link href="/dashboard">
          <button className="px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90 transition-opacity">
            Get Started
          </button>
        </Link>
        
        <Link href="/about">
          <button className="px-6 py-3 border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-surface)] transition-colors">
            Learn More
          </button>
        </Link>
      </div>
    </div>
  );
}
EOF
    
    # Create dashboard page (only if with-dashboard integration)
    if [ "$integration_type" = "with-dashboard" ]; then
        print_info "Creating dashboard page (for iframe embedding)..."
    mkdir -p "apps/$app_name/src/app/dashboard"
    cat > "apps/$app_name/src/app/dashboard/page.tsx" << EOF
'use client';

export default function ${pascal_name}Dashboard(): React.ReactElement {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">$pascal_name Dashboard</h1>
      <p className="text-[var(--color-foreground-secondary)]">
        Manage your $app_name here
      </p>
      
      {/* TODO: Add your dashboard UI */}
      {/* This page will be embedded in the main dashboard via iframe */}
    </div>
  );
}
EOF
    else
        print_info "Skipping dashboard page (landing-only pattern)"
    fi
    
    # Create globals.css
    print_info "Creating globals.css..."
    cat > "apps/$app_name/src/styles/globals.css" << 'EOF'
@import "tailwindcss";
EOF
    
    # Create eslint.config.mjs
    print_info "Creating eslint.config.mjs..."
    cat > "apps/$app_name/eslint.config.mjs" << 'EOF'
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import baseConfig from '../../eslint.config.mjs';

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
  recommendedConfig: js.configs.recommended,
});

export default [
  ...baseConfig,
  ...compat.config({
    extends: ['next/core-web-vitals', 'next/typescript'],
  }),
];
EOF
    
    # Create env.template
    print_info "Creating env.template..."
    cat > "apps/$app_name/env.template" << EOF
# $pascal_name Environment Variables

# Next.js
NEXT_PUBLIC_APP_URL=http://localhost:$port

# Add your environment variables here
EOF
    
    # Create README
    print_info "Creating README.md..."
    cat > "apps/$app_name/README.md" << EOF
# $pascal_name

$description

## Development

\`\`\`bash
# Start dev server
npx nx dev $app_name

# Or with npm
cd apps/$app_name
npm run dev
\`\`\`

## URLs

- **Standalone**: http://localhost:$port
- **Embedded in dashboard**: http://localhost:3000/dashboard/${app_name}

## Integration

This app can be:
1. Accessed standalone at http://localhost:$port
2. Embedded in the main dashboard via iframe

## Environment Setup

1. Copy \`env.template\` to \`.env.local\`
2. Fill in required environment variables
3. Run \`npm install\` from project root

## Architecture

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5.7
- **Styling**: Tailwind CSS v4
- **Port**: $port
EOF
    
    print_success "Frontend app created successfully!"
    print_info ""
    
    # Auto-create domain and tRPC router
    print_info "🤖 Auto-generating domain types and tRPC router..."
    create_domain_types "$app_name" "$pascal_name"
    create_trpc_router "$app_name" "$pascal_name"
    
    print_info ""
    print_success "✨ Scaffold complete! Domain types and tRPC router created automatically."
    print_info ""
    print_info "What was created:"
    print_info "  ✅ Frontend app in: ${GREEN}apps/${app_name}/${NC}"
    print_info "  ✅ Domain types in: ${GREEN}libs/domain/src/lib/${app_name}/${NC}"
    print_info "  ✅ tRPC router in: ${GREEN}libs/api/src/routers/${app_name}.ts${NC}"
    print_info ""
    print_info "Next steps:"
    print_info "1. Install dependencies: ${YELLOW}npm install${NC}"
    print_info "2. Customize domain types: ${YELLOW}libs/domain/src/lib/${app_name}/types.ts${NC}"
    print_info "3. Implement tRPC logic: ${YELLOW}libs/api/src/routers/${app_name}.ts${NC}"
    print_info "4. Start dev server: ${YELLOW}npx nx dev $app_name${NC}"
    print_info ""
    
    if [ "$integration_type" = "with-dashboard" ]; then
        print_info "Dashboard integration (required):"
    print_info "5. Create: ${YELLOW}apps/web/src/app/(dashboard)/${app_name}/page.tsx${NC}"
        print_info "   ${CYAN}export default function() { return <iframe src='http://localhost:$port/dashboard' /> }${NC}"
    print_info "6. Update: ${YELLOW}apps/web/src/components/dashboard/dashboard-nav.tsx${NC}"
        print_info "   ${CYAN}Add: { href: '/dashboard/${app_name}', label: '...', icon: '...' }${NC}"
    print_info ""
    else
        print_info "Note: This is a ${GREEN}landing-only${NC} micro-frontend."
        print_info "It has shared nav with link to Dashboard, but NO dashboard tab."
        print_info ""
    fi
    
    print_info "Visit: ${CYAN}http://localhost:$port${NC}"
}

# Create backend service
create_backend_service() {
    print_header "Create New Backend Service"
    
    # Get service name
    read -p "Service name (kebab-case, e.g., pet-insurance): " service_name
    
    if [ -z "$service_name" ]; then
        print_error "Service name cannot be empty"
        exit 1
    fi
    
    if [ -d "services/$service_name" ]; then
        print_error "Service already exists: services/$service_name"
        exit 1
    fi
    
    # Get port
    suggested_port=$(get_next_backend_port)
    read -p "Port number (suggested: $suggested_port): " port
    port=${port:-$suggested_port}
    
    # Get description
    read -p "Description: " description
    
    pascal_name=$(to_pascal_case "$service_name")
    
    print_info "Creating backend service: $service_name on port $port"
    
    # Create directory structure
    print_info "Creating directory structure..."
    mkdir -p "services/$service_name/src/routes"
    mkdir -p "services/$service_name/src/workers"
    mkdir -p "services/$service_name/src/plugins"
    mkdir -p "services/$service_name/src/utils"
    
    # Create package.json
    print_info "Creating package.json..."
    cat > "services/$service_name/package.json" << EOF
{
  "name": "@pet/$service_name",
  "version": "1.0.0",
  "private": true,
  "description": "$description",
  "scripts": {
    "dev": "tsx watch src/main.ts",
    "build": "tsc",
    "start": "node dist/main.js",
    "test": "jest"
  },
  "dependencies": {
    "@fastify/cors": "^9.0.1",
    "@prisma/client": "^5.7.0",
    "fastify": "^4.26.2",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "tsx": "^4.7.0",
    "typescript": "^5.7.2"
  }
}
EOF
    
    # Create main.ts
    print_info "Creating main.ts..."
    cat > "services/$service_name/src/main.ts" << EOF
import Fastify from 'fastify';
import cors from '@fastify/cors';

const PORT = parseInt(process.env.PORT || '$port', 10);
const HOST = process.env.HOST || '0.0.0.0';

const buildServer = async () => {
  const server = Fastify({
    logger: {
      level: process.env.LOG_LEVEL || 'info',
    },
  });

  // Register plugins
  await server.register(cors, {
    origin: process.env.CORS_ORIGIN || '*',
  });

  // Health check
  server.get('/healthz', async () => ({
    status: 'healthy',
    service: '$service_name',
    timestamp: new Date().toISOString(),
  }));

  // TODO: Register your routes here
  // await server.register(yourRoutes, { prefix: '/api' });

  return server;
};

const start = async () => {
  try {
    const server = await buildServer();
    await server.listen({ port: PORT, host: HOST });
    console.log(\`🚀 $pascal_name Service running on http://\${HOST}:\${PORT}\`);
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

start();
EOF
    
    # Create tsconfig.json
    print_info "Creating tsconfig.json..."
    cat > "services/$service_name/tsconfig.json" << EOF
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src",
    "module": "commonjs",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
EOF
    
    # Create project.json
    print_info "Creating project.json..."
    cat > "services/$service_name/project.json" << EOF
{
  "name": "$service_name",
  "\$schema": "../../node_modules/nx/schemas/project-schema.json",
  "sourceRoot": "services/$service_name/src",
  "projectType": "application",
  "tags": [
    "type:service",
    "scope:backend",
    "domain:$service_name"
  ],
  "targets": {
    "serve": {
      "executor": "nx:run-commands",
      "options": {
        "command": "cd services/$service_name && npm run dev"
      }
    },
    "build": {
      "executor": "@nx/js:tsc",
      "outputs": ["{options.outputPath}"],
      "options": {
        "outputPath": "dist/services/$service_name",
        "main": "services/$service_name/src/main.ts",
        "tsConfig": "services/$service_name/tsconfig.json"
      }
    },
    "test": {
      "executor": "@nx/jest:jest",
      "options": {
        "jestConfig": "services/$service_name/jest.config.ts",
        "passWithNoTests": true
      }
    }
  }
}
EOF
    
    # Create .env.template
    print_info "Creating .env.template..."
    cat > "services/$service_name/.env.template" << EOF
# $pascal_name Service Environment Variables

PORT=$port
HOST=0.0.0.0
LOG_LEVEL=info

# Database
DATABASE_URL=postgresql://harness:dev_password@localhost:5432/harness_hero

# Redis
REDIS_URL=redis://localhost:6379

# CORS
CORS_ORIGIN=http://localhost:3000

# Add your environment variables here
EOF
    
    # Create Dockerfile
    print_info "Creating Dockerfile..."
    cat > "services/$service_name/Dockerfile" << 'EOF'
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY dist ./dist

EXPOSE 4000

CMD ["node", "dist/main.js"]
EOF
    
    # Create README
    print_info "Creating README.md..."
    cat > "services/$service_name/README.md" << EOF
# $pascal_name Service

$description

## Development

\`\`\`bash
# Start dev server
npx nx serve $service_name

# Or with npm
cd services/$service_name
npm run dev
\`\`\`

## URLs

- **Service**: http://localhost:$port
- **Health Check**: http://localhost:$port/healthz

## Environment Setup

1. Copy \`.env.template\` to \`.env\`
2. Fill in required environment variables
3. Run \`npm install\` from project root

## Architecture

- **Framework**: Fastify 4
- **Language**: TypeScript 5.7
- **Database**: Prisma + PostgreSQL
- **Port**: $port

## API Endpoints

- \`GET /healthz\` - Health check
- TODO: Document your endpoints here

## Integration

### tRPC Integration

Add to \`libs/api/src/routers/${service_name}.ts\`:

\`\`\`typescript
import { router, protectedProcedure } from '../trpc';

export const ${service_name}Router = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    const response = await fetch('http://localhost:$port/api/items');
    return response.json();
  }),
});
\`\`\`

Then update \`libs/api/src/root.ts\` to include the router.
EOF
    
    print_success "Backend service created successfully!"
    print_info ""
    
    # Auto-create domain, tRPC router, and update docker-compose
    print_info "🤖 Auto-generating domain types, tRPC router, and Docker config..."
    pascal_service=$(to_pascal_case "$service_name")
    create_domain_types "$service_name" "$pascal_service"
    create_trpc_router "$service_name" "$pascal_service"
    update_docker_compose "$service_name" "$port"
    
    print_info ""
    print_success "✨ Scaffold complete! Domain, tRPC, and Docker config created automatically."
    print_info ""
    print_info "Next steps:"
    print_info "1. Install dependencies: ${YELLOW}npm install${NC}"
    print_info "2. Customize domain types: ${YELLOW}libs/domain/src/lib/${service_name}/types.ts${NC}"
    print_info "3. Implement tRPC logic: ${YELLOW}libs/api/src/routers/${service_name}.ts${NC}"
    print_info "4. Implement service logic: ${YELLOW}services/${service_name}/src/service.ts${NC}"
    print_info "5. Copy .env.template to .env and configure"
    print_info "6. Start dev server: ${YELLOW}npx nx serve $service_name${NC}"
    print_info ""
    print_info "Visit: ${CYAN}http://localhost:$port/healthz${NC}"
}

# Create backend module
create_backend_module() {
    print_header "Create New Backend Module"
    
    # Get module name
    read -p "Module name (kebab-case, e.g., pet-insurance): " module_name
    
    if [ -z "$module_name" ]; then
        print_error "Module name cannot be empty"
        exit 1
    fi
    
    if [ -d "services/backend/src/modules/$module_name" ]; then
        print_error "Module already exists: services/backend/src/modules/$module_name"
        exit 1
    fi
    
    # Get description
    read -p "Description: " description
    
    pascal_name=$(to_pascal_case "$module_name")
    
    print_info "Creating backend module: $module_name"
    
    # Create directory
    mkdir -p "services/backend/src/modules/$module_name"
    
    # Create service.ts
    print_info "Creating service.ts..."
    cat > "services/backend/src/modules/$module_name/service.ts" << EOF
import { PrismaClient } from '@prisma/client';
import { TRPCError } from '@trpc/server';

/**
 * $pascal_name Service
 * $description
 */
export class ${pascal_name}Service {
  constructor(private db: PrismaClient) {}

  /**
   * List all items
   */
  async list(userId: string) {
    // TODO: Implement list logic
    return [];
  }

  /**
   * Get item by ID
   */
  async getById(id: string, userId: string) {
    // TODO: Implement get logic
    return null;
  }

  /**
   * Create new item
   */
  async create(userId: string, data: any) {
    // TODO: Implement create logic
    return null;
  }

  /**
   * Update item
   */
  async update(id: string, userId: string, data: any) {
    // TODO: Implement update logic
    return null;
  }

  /**
   * Delete item
   */
  async delete(id: string, userId: string) {
    // TODO: Implement delete logic
    return null;
  }
}
EOF
    
    # Create index.ts
    print_info "Creating index.ts..."
    cat > "services/backend/src/modules/$module_name/index.ts" << EOF
export * from './service';
EOF
    
    print_success "Backend module created successfully!"
    print_info ""
    
    # Auto-create domain and tRPC router
    print_info "🤖 Auto-generating domain types and tRPC router..."
    create_domain_types "$module_name" "$pascal_name"
    create_trpc_router "$module_name" "$pascal_name"
    
    print_info ""
    print_success "✨ Scaffold complete! Domain types and tRPC router created automatically."
    print_info ""
    print_info "Next steps:"
    print_info "1. Install dependencies: ${YELLOW}npm install${NC}"
    print_info "2. Customize domain types: ${YELLOW}libs/domain/src/lib/${module_name}/types.ts${NC}"
    print_info "3. Implement service logic: ${YELLOW}services/backend/src/modules/${module_name}/service.ts${NC}"
    print_info "4. Update tRPC router to call service: ${YELLOW}libs/api/src/routers/${module_name}.ts${NC}"
    print_info ""
    print_info "Example tRPC integration:"
    print_info "${CYAN}// Update libs/api/src/routers/${module_name}.ts:
import { ${pascal_name}Service } from '@pet/backend/modules/${module_name}/service';

  list: protectedProcedure.query(async ({ ctx }) => {
    const service = new ${pascal_name}Service(ctx.db);
    return service.list(ctx.userId);
});${NC}"
}

# Main script
main() {
    # Check if we're in the project root
    if [ ! -f "package.json" ] || [ ! -d "apps" ] || [ ! -d "services" ]; then
        print_error "This script must be run from the project root directory"
        exit 1
    fi
    
    while true; do
        show_menu
        
        case $choice in
            1)
                create_frontend_landing_only
                exit 0
                ;;
            2)
                create_frontend_with_dashboard
                exit 0
                ;;
            3)
                create_backend_service
                exit 0
                ;;
            4)
                create_backend_module
                exit 0
                ;;
            5)
                show_help
                # Loop continues to show menu again
                ;;
            6)
                print_info "Goodbye!"
                exit 0
                ;;
            *)
                print_error "Invalid option. Please select 1-6."
                sleep 2
                # Loop continues to show menu again
                ;;
        esac
    done
}

main


