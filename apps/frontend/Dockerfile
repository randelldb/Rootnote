# =========================
# Build stage (workspace-aware)
# =========================
FROM node:20-bookworm AS builder

WORKDIR /repo

COPY package.json package-lock.json ./
COPY apps/frontend/package.json apps/frontend/package.json

RUN npm ci

COPY . .

RUN npm run build --workspace=apps/frontend


# =========================
# Production stage (nginx)
# =========================
FROM nginx:1.25-alpine

RUN addgroup -g 101 -S nginx || true && \
    adduser -S -D -H -u 101 \
        -h /var/cache/nginx \
        -s /sbin/nologin \
        -G nginx \
        -g nginx nginx || true

# THIS LINE REQUIRES nginx.conf AT REPO ROOT
COPY nginx.conf /etc/nginx/nginx.conf

COPY --from=builder /repo/apps/frontend/dist /usr/share/nginx/html

RUN chown -R nginx:nginx \
        /usr/share/nginx/html \
        /var/cache/nginx \
        /var/log/nginx && \
    touch /var/run/nginx.pid && \
    chown nginx:nginx /var/run/nginx.pid

USER nginx

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
