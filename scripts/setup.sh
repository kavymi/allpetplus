#!/usr/bin/env bash
set -euo pipefail

# Setup script for Pet monorepo

echo "🚀 Setting up Pet monorepo..."

# Setup environment files
./scripts/setup-env.sh

# Check Node version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
    echo "❌ Node.js 20 or higher is required. Current version: $(node -v)"
    echo "Please install Node.js 20+ or use nvm to switch versions."
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Setup git hooks
echo "🪝 Setting up git hooks..."
npx husky install
npx husky add .husky/pre-commit "npx lint-staged"
npx husky add .husky/commit-msg "npx commitlint --edit $1"


# Build shared libraries
echo "🏗️  Building shared libraries..."
npx nx run shared:build

# Optional: Start development databases
read -p "Do you want to start development databases? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🐳 Starting development databases..."
    docker-compose -f docker-compose.dev.yml up -d
fi

# Optional: Connect to NX Cloud
read -p "Do you want to connect to NX Cloud for distributed caching? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "☁️  Connecting to NX Cloud..."
    npx nx connect-to-nx-cloud
fi

echo ""
echo "✅ Setup complete! You can now run:"
echo "  npm run dev         - Start all applications"
echo "  npm run dev:web     - Start web app only"
echo "  npm run dev:backend - Start backend only"
echo "  npm run graph       - View dependency graph"
echo ""
echo "📚 Check out IMPROVEMENTS.md for all available commands and features!"
