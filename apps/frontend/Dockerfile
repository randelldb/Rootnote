# =========================
# Build stage (workspace-aware)
# =========================
FROM node:20-bookworm AS builder

# Work from repository root (required for npm workspaces)
WORKDIR /repo

# Copy root dependency manifests (npm workspaces context)
COPY package.json package-lock.json ./

# Copy frontend workspace manifest only
COPY apps/frontend/package.json apps/frontend/package.json

# Install dependencies using the root lockfile
RUN npm ci

# Copy full repository (source code)
COPY . .

# Build only the frontend workspace
RUN npm run build --workspace=apps/frontend


# =========================
# Production stage (nginx)
# =========================
FROM nginx:1.25-alpine

# Create non-root user for nginx
RUN addgroup -g 101 -S nginx || true && \
    adduser -S -D -H -u 101 \
        -h /var/cache/nginx \
        -s /sbin/nologin \
        -G nginx \
        -g nginx nginx || true

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built frontend from builder stage
# (adjust 'dist' to 'build' if your frontend outputs there)
COPY --from=builder /repo/apps/frontend/dist /usr/share/nginx/html

# Set correct permissions
RUN chown -R nginx:nginx \
        /usr/share/nginx/html \
        /var/cache/nginx \
        /var/log/nginx && \
    touch /var/run/nginx.pid && \
    chown nginx:nginx /var/run/nginx.pid

# Switch to non-root user
USER nginx

# Expose nginx port
EXPOSE 8080

# Start nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
