#!/bin/bash

echo "🔧 Setting up environment files..."

# Create .env files from templates
echo "📝 Copying templates..."

# Frontend
if [ -f apps/web/env.template ] && [ ! -f apps/web/.env.local ]; then
    cp apps/web/env.template apps/web/.env.local
    echo "✅ Created apps/web/.env.local"
fi

# Backend
if [ -f services/backend/env.template ] && [ ! -f services/backend/.env ]; then
    cp services/backend/env.template services/backend/.env
    echo "✅ Created services/backend/.env"
fi

# Pet Licensing (if exists)
if [ -f apps/pet-licensing/env.template ] && [ ! -f apps/pet-licensing/.env.local ]; then
    cp apps/pet-licensing/env.template apps/pet-licensing/.env.local
    echo "✅ Created apps/pet-licensing/.env.local"
fi

# Builder Service (if exists)
if [ -f services/builder-service/env.template ] && [ ! -f services/builder-service/.env ]; then
    cp services/builder-service/env.template services/builder-service/.env
    echo "✅ Created services/builder-service/.env"
fi

echo ""
echo "⚠️  IMPORTANT: Edit the created .env files and fill in:"
echo "   - Clerk API keys (https://dashboard.clerk.com/)"
echo "   - Shopify credentials (https://admin.shopify.com/)"
echo "   - Database URL (if not using Docker defaults)"
echo ""
echo "📚 See /docs/guides/environment-setup.md for detailed instructions"
echo ""
echo "✨ Run 'npm run dev' when ready!"
