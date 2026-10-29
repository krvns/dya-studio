# Stage 1: Build application
FROM node:20-alpine AS builder

WORKDIR /app

# Git is required for resolving repository dependencies
RUN apk add --no-cache git

# Install dependencies with lockfile enforcement
COPY package.json package-lock.json ./
RUN npm ci

# Copy project files and build
COPY . .

# Build SPA with root base path
ENV VITE_BASE=/
RUN npm run build

# Stage 2: Production unprivileged server
FROM nginxinc/nginx-unprivileged:alpine AS runner

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy compiled static assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]

