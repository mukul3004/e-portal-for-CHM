# =========================================================================
# DOCKERFILE - FRONTEND CONTEXT BUILD
# Project: Case Management Hearing e-Portal (Order XV-A CPC)
# =========================================================================

FROM node:20-alpine AS builder

WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install
COPY . ./
RUN npm run build

FROM nginx:1.25-alpine AS production
RUN apk add --no-cache curl
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/dist /usr/share/nginx/html
COPY ../nginx/nginx.conf /etc/nginx/conf.d/default.conf 2>/dev/null || true
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
    CMD curl -f http://localhost/ || exit 1
CMD ["nginx", "-g", "daemon off;"]
