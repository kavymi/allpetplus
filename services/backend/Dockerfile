# ===========================
# Build Stage
# ===========================
FROM node:20-alpine AS builder

# Install build dependencies
RUN apk add --no-cache python3 make g++ openssl-dev

WORKDIR /app

# Copy workspace configuration files (needed for NX)
COPY package.json package-lock.json ./
COPY nx.json tsconfig.base.json ./

# Copy all workspace projects (NX needs the full workspace)
COPY apps ./apps
COPY libs ./libs
COPY services ./services
COPY tools ./tools

# Install ALL dependencies (including devDependencies needed for build)
RUN npm ci

# Generate Prisma client
RUN cd services/backend && npx prisma generate

# ===========================
# Production Stage
# ===========================
FROM node:20-alpine AS runner

# Install runtime dependencies
RUN apk add --no-cache openssl-dev

ENV NODE_ENV=production
ENV PORT=3001

WORKDIR /app

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 backend

# Copy everything from builder (source + node_modules)
COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/services/backend ./services/backend
COPY --from=builder /app/libs ./libs
COPY --from=builder /app/nx.json /app/tsconfig.base.json ./

# Set correct permissions
RUN chown -R backend:nodejs /app

# Switch to non-root user
USER backend

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/healthz', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the application with ts-node (runs TypeScript directly)
CMD ["npx", "ts-node", "-r", "tsconfig-paths/register", "services/backend/src/main.ts"]
