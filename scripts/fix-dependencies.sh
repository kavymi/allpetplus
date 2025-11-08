#!/bin/bash

# Dependency Fix Script
# Automatically fixes version conflicts found in audit

set -e

echo "🔧 AllPetPlus Dependency Fix Script"
echo "===================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}Step 1: Backing up current state...${NC}"
cp package.json package.json.backup
echo "✅ Backup created: package.json.backup"
echo ""

echo -e "${BLUE}Step 2: Updating root package.json...${NC}"

# Update root dependencies
npm pkg set dependencies.react="19.0.0"
npm pkg set dependencies.react-dom="19.0.0"
npm pkg set dependencies.next="15.5.4"

# Update root devDependencies
npm pkg set devDependencies.@types/node="^20.0.0"
npm pkg set devDependencies.@types/react="^19.0.0"
npm pkg set devDependencies.@types/react-dom="^19.0.0"
npm pkg set devDependencies.jest="^30.0.0"
npm pkg set devDependencies.ts-node="^10.9.2"
npm pkg set devDependencies.typescript="^5.7.2"

# Update overrides
npm pkg set overrides.react="19.0.0"
npm pkg set overrides.react-dom="19.0.0"
npm pkg set overrides.next="15.5.4"

echo "✅ Root package.json updated"
echo ""

echo -e "${BLUE}Step 3: Updating apps/web/package.json...${NC}"
cd apps/web

npm pkg set dependencies.next="15.5.4"
npm pkg set dependencies.react="19.0.0"
npm pkg set dependencies.react-dom="19.0.0"
npm pkg set dependencies.zod="^3.25.76"
npm pkg set dependencies.@clerk/nextjs="^6.33.0"

npm pkg set devDependencies.@types/node="^20.0.0"
npm pkg set devDependencies.typescript="^5.7.2"
npm pkg set devDependencies.eslint-config-next="15.5.4"

cd ../..
echo "✅ apps/web updated"
echo ""

echo -e "${BLUE}Step 4: Updating apps/pet-licensing/package.json...${NC}"
cd apps/pet-licensing

npm pkg set dependencies.next="15.5.4"
npm pkg set dependencies.react="19.0.0"
npm pkg set dependencies.react-dom="19.0.0"

cd ../..
echo "✅ apps/pet-licensing updated"
echo ""

echo -e "${BLUE}Step 5: Updating services/builder-service/package.json...${NC}"
cd services/builder-service

npm pkg set dependencies.@trpc/server="^11.6.0"
npm pkg set dependencies.zod="^3.25.76"
npm pkg set dependencies.tsx="^4.20.6"

cd ../..
echo "✅ services/builder-service updated"
echo ""

echo -e "${BLUE}Step 6: Updating services/backend/package.json...${NC}"
cd services/backend

npm pkg set dependencies.tsx="^4.20.6"
npm pkg set devDependencies.@types/jest="^30.0.0"
npm pkg set devDependencies.@types/node="^20.0.0"
npm pkg set devDependencies.jest="^30.0.0"
npm pkg set devDependencies.ts-node="^10.9.2"

cd ../..
echo "✅ services/backend updated"
echo ""

echo -e "${BLUE}Step 7: Updating services/test/package.json...${NC}"
cd services/test

npm pkg set dependencies.@fastify/cors="^9.0.1"
npm pkg set dependencies.zod="^3.25.76"
npm pkg set dependencies.tsx="^4.20.6"

npm pkg set devDependencies.@types/node="^20.0.0"
npm pkg set devDependencies.typescript="^5.7.2"

cd ../..
echo "✅ services/test updated"
echo ""

echo -e "${YELLOW}Step 8: Cleaning old dependencies...${NC}"
rm -rf node_modules package-lock.json
rm -rf apps/*/node_modules apps/*/package-lock.json apps/*/.next
rm -rf services/*/node_modules services/*/package-lock.json
rm -rf libs/*/node_modules libs/*/package-lock.json
rm -rf .nx/cache

echo "✅ Cleaned all node_modules and caches"
echo ""

echo -e "${BLUE}Step 9: Fresh install...${NC}"
npm install

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✅ Dependencies fixed successfully!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

echo -e "${BLUE}Verification:${NC}"
npm ls react react-dom next 2>&1 | head -20 || true

echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "  1. Review changes: git diff package.json"
echo "  2. Test: npm run dev"
echo "  3. If issues occur, restore: mv package.json.backup package.json && npm install"
echo ""




