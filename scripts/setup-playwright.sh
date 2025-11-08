#!/bin/bash

# Playwright Setup Script
# Installs Playwright dependencies and browsers

set -e

echo "🎭 Setting up Playwright E2E Testing..."
echo ""

# Navigate to web app
cd "$(dirname "$0")/.."
cd apps/web

echo "📦 Installing npm dependencies..."
npm install

echo ""
echo "🌐 Installing Playwright browsers..."
echo "This will download Chrome, Firefox, Safari, and mobile browsers."
npm run playwright:install

echo ""
echo "✅ Playwright setup complete!"
echo ""
echo "Quick commands:"
echo "  npm run test:e2e:codegen  # Generate tests with AI"
echo "  npm run test:e2e:ui       # Run tests with UI"
echo "  npm run test:e2e          # Run all tests"
echo ""
echo "📖 Documentation: /docs/development/playwright-guide.md"


