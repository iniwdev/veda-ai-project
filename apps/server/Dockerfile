# ─── Builder ─────────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy manifests
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/server/package.json ./apps/server/
COPY packages/types/package.json ./packages/types/

# Install deps
RUN pnpm install --frozen-lockfile --filter server --filter @repo/types

# Copy source
COPY tsconfig.base.json ./
COPY packages/types/ ./packages/types/
COPY apps/server/ ./apps/server/

# Build types then server
RUN pnpm --filter @repo/types build
RUN pnpm --filter server build

# ─── Production ───────────────────────────────────────────────────────────────
FROM node:20-alpine AS runner

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

ENV NODE_ENV=production

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/server/package.json ./apps/server/
COPY packages/types/package.json ./packages/types/

RUN pnpm install --frozen-lockfile --filter server --prod --filter @repo/types --prod

COPY --from=builder /app/packages/types/dist ./packages/types/dist
COPY --from=builder /app/apps/server/dist ./apps/server/dist

WORKDIR /app/apps/server

EXPOSE 4000

CMD ["node", "dist/index.js"]
