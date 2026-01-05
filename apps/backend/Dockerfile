# Build stage
FROM node:20-bookworm AS builder

# Install build dependencies for better-sqlite3
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy root package files for workspace setup
COPY package*.json ./
COPY apps/backend/package*.json ./apps/backend/

# Install all dependencies (including dev dependencies for build)
RUN npm ci

# Copy source code from apps/backend
COPY apps/backend/. ./apps/backend/

# Build TypeScript
RUN npm run build --workspace=apps/backend

# Production stage
FROM node:20-bookworm-slim

# Install runtime dependencies for better-sqlite3
RUN apt-get update && apt-get install -y \
    python3 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Create non-root user
RUN groupadd -r appuser && useradd -r -g appuser appuser

# Copy root package files for workspace setup
COPY package*.json ./
COPY apps/backend/package*.json ./apps/backend/

# Install production dependencies only
RUN npm ci --omit=dev

# Copy built application from builder
COPY --from=builder /app/apps/backend/dist ./apps/backend/dist

# Create data directory and set permissions
RUN mkdir -p apps/backend/data && chown -R appuser:appuser /app

# Switch to non-root user
USER appuser

# Expose port
EXPOSE 3000

# Set working directory to backend app
WORKDIR /app/apps/backend

# Run migrations then start application
CMD ["sh", "-c", "node dist/db/migrate.js && npm start"]
