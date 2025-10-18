# Multi-stage Dockerfile für Hovawart-Züchterdatenbank
# Unterstützt sowohl Development als auch Production

# Stage 1: Base Image mit Node.js
FROM node:18-alpine AS base

# Installiere notwendige System-Dependencies
RUN apk add --no-cache \
    libc6-compat \
    openssl \
    postgresql-client \
    curl

# Setze Working Directory
WORKDIR /app

# Kopiere Package Files
COPY package*.json ./
COPY turbo.json ./
COPY .npmrc ./

# Stage 2: Dependencies installieren
FROM base AS deps

# Installiere Dependencies für alle Workspaces
RUN npm ci --only=production --ignore-scripts

# Stage 3: Build Stage
FROM base AS builder

# Kopiere alle Source Files
COPY . .

# Installiere alle Dependencies (inkl. devDependencies)
RUN npm ci

# Generiere Prisma Client
WORKDIR /app/apps/database
RUN npx prisma generate

# Build alle Workspaces
WORKDIR /app
RUN npm run build

# Stage 4: Database Setup
FROM base AS database

# Kopiere Database Files
COPY apps/database/package*.json ./apps/database/
COPY apps/database/prisma ./apps/database/prisma/

# Installiere Database Dependencies
WORKDIR /app/apps/database
RUN npm ci --only=production

# Generiere Prisma Client
RUN npx prisma generate

# Stage 5: API Production
FROM base AS api

# Kopiere API Files
COPY apps/api/package*.json ./apps/api/
COPY apps/api/src ./apps/api/src/
COPY apps/api/tsconfig.json ./apps/api/

# Kopiere Shared Package
COPY packages/shared/package*.json ./packages/shared/
COPY packages/shared/src ./packages/shared/src/
COPY packages/shared/tsconfig.json ./packages/shared/

# Installiere Production Dependencies
WORKDIR /app/apps/api
RUN npm ci --only=production

# Expose API Port
EXPOSE 3001

# Health Check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

# Start API
CMD ["npm", "start"]

# Stage 6: Web Production
FROM base AS web

# Kopiere Web Files
COPY apps/web/package*.json ./apps/web/
COPY apps/web/src ./apps/web/src/
COPY apps/web/public ./apps/web/public/
COPY apps/web/next.config.js ./apps/web/
COPY apps/web/tsconfig.json ./apps/web/
COPY apps/web/tailwind.config.js ./apps/web/
COPY apps/web/postcss.config.js ./apps/web/

# Kopiere Shared und UI Packages
COPY packages/shared/package*.json ./packages/shared/
COPY packages/shared/src ./packages/shared/src/
COPY packages/shared/tsconfig.json ./packages/shared/
COPY packages/ui/package*.json ./packages/ui/
COPY packages/ui/src ./packages/ui/src/
COPY packages/ui/tsconfig.json ./packages/ui/

# Installiere Production Dependencies
WORKDIR /app/apps/web
RUN npm ci --only=production

# Expose Web Port
EXPOSE 3000

# Health Check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

# Start Web App
CMD ["npm", "start"]

# Stage 7: Development
FROM base AS development

# Installiere alle Dependencies
COPY . .
RUN npm ci

# Generiere Prisma Client
WORKDIR /app/apps/database
RUN npx prisma generate

# Expose Ports
EXPOSE 3000 3001

# Start Development Server
WORKDIR /app
CMD ["npm", "run", "dev"]

# Stage 8: Database Migration
FROM base AS migrate

# Kopiere Database Files
COPY apps/database/package*.json ./apps/database/
COPY apps/database/prisma ./apps/database/prisma/

# Installiere Dependencies
WORKDIR /app/apps/database
RUN npm ci --only=production

# Generiere Prisma Client
RUN npx prisma generate

# Migration Script
COPY scripts/migrate.sh ./migrate.sh
RUN chmod +x ./migrate.sh

CMD ["./migrate.sh"]
