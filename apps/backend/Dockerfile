# =========================
# Build stage (TypeScript)
# =========================
FROM node:20-bookworm-slim AS builder

# Native build deps for better-sqlite3
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
 && rm -rf /var/lib/apt/lists/*

# Work from repo root (npm workspaces)
WORKDIR /repo

# Copy root manifests
COPY package.json package-lock.json ./

# Copy backend workspace manifest
COPY apps/backend/package.json apps/backend/package.json

# Install ALL deps (dev deps needed for tsc)
RUN npm ci

# Copy full repository
COPY . .

# Build backend workspace (TypeScript → dist/)
RUN npm run build --workspace=apps/backend


# =========================
# Runtime stage (production)
# =========================
FROM node:20-bookworm-slim

WORKDIR /app

# Create non-root user
RUN groupadd -r appuser && useradd -r -g appuser appuser

# Copy backend package manifest only
COPY apps/backend/package.json ./

# IMPORTANT: do NOT use npm ci here (no lockfile in this dir)
RUN npm install --omit=dev --no-audit --no-fund

# Copy compiled output
COPY --from=builder /repo/apps/backend/dist ./dist

# SQLite data directory
RUN mkdir -p /data && chown -R appuser:appuser /data /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0
ENV DB_PATH=/data/rootnote.db

USER appuser

EXPOSE 3000

CMD ["node", "dist/index.js"]
