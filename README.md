# AI Assessment Creator

Production-grade monorepo for an AI-powered assessment generation platform.

## Stack

| Layer           | Technology                         |
| --------------- | ---------------------------------- |
| Frontend        | Next.js 16 (App Router, Turbopack) |
| Styling         | Tailwind CSS v4 + shadcn/ui        |
| State           | Zustand                            |
| Backend         | Express 5 + TypeScript             |
| Database        | MongoDB 8 (Mongoose)               |
| Cache / Queue   | Redis 7 + BullMQ                   |
| Real-time       | Socket.IO                          |
| Runtime         | Node.js 20                         |
| Package Manager | pnpm 10 (workspaces)               |

## Monorepo Structure

```
ai-assessment-creator/
├── apps/
│   ├── web/                 # Next.js 16 frontend
│   └── server/              # Express 5 backend
├── packages/
│   ├── types/               # Shared TypeScript types (@repo/types)
│   ├── prompts/             # AI prompt templates (@repo/prompts)
│   └── ui/                  # Shared React components (@repo/ui)
├── docker/
│   └── mongo-init.js        # MongoDB initialization script
├── docker-compose.yml       # MongoDB + Redis services
├── pnpm-workspace.yaml
├── tsconfig.base.json       # Shared strict TypeScript base
├── eslint.config.mjs        # ESLint flat config (shared)
└── .prettierrc.json
```

## Getting Started

### 1. Prerequisites

- Node.js >= 20
- pnpm >= 10 (`npm install -g pnpm`)
- Docker Desktop (for MongoDB + Redis)

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Environment Setup

```bash
# Backend
cp apps/server/.env.example apps/server/.env

# Frontend
cp apps/web/.env.local.example apps/web/.env.local
```

Edit the `.env` files with your values (OpenAI key, etc.)

### 4. Start Infrastructure

```bash
# Start MongoDB + Redis
pnpm docker:up

# Optionally start dev UI tools (Mongo Express + Redis Commander)
docker compose --profile dev-tools up -d
```

Wait for health checks to pass (~10-20s), then:

```bash
# Check services are healthy
docker compose ps
```

### 5. Start Development

```bash
# Start all apps in parallel
pnpm dev

# Or individually
pnpm dev:web      # http://localhost:3000
pnpm dev:server   # http://localhost:4000
```

### 6. Verify

```bash
# Frontend
open http://localhost:3000

# Backend health check
curl http://localhost:4000/api/v1/health | jq
```

## Scripts

| Command            | Description                    |
| ------------------ | ------------------------------ |
| `pnpm dev`         | Start all apps in parallel     |
| `pnpm build`       | Build all packages + apps      |
| `pnpm lint`        | Lint all packages              |
| `pnpm format`      | Format all files with Prettier |
| `pnpm type-check`  | TypeScript check all packages  |
| `pnpm docker:up`   | Start MongoDB + Redis          |
| `pnpm docker:down` | Stop Docker services           |
| `pnpm docker:logs` | Tail Docker logs               |

## Adding shadcn/ui Components

Since shadcn CLI has trouble with pnpm monorepos, add components manually:

```bash
# From apps/web directory
pnpm dlx shadcn@latest add button card dialog
```

Or copy component source directly into `apps/web/src/components/ui/`.

## Environment Variables

### Backend (`apps/server/.env`)

| Variable         | Description                       |
| ---------------- | --------------------------------- |
| `PORT`           | Server port (default: 4000)       |
| `MONGODB_URI`    | MongoDB connection string         |
| `REDIS_HOST`     | Redis host                        |
| `REDIS_PORT`     | Redis port                        |
| `OPENAI_API_KEY` | OpenAI API key                    |
| `JWT_SECRET`     | JWT signing secret (min 32 chars) |

### Frontend (`apps/web/.env.local`)

| Variable              | Description          |
| --------------------- | -------------------- |
| `NEXT_PUBLIC_API_URL` | Backend API base URL |
| `NEXT_PUBLIC_WS_URL`  | WebSocket server URL |

## Architecture Notes

- **`@repo/types`** — Single source of truth for all shared TypeScript interfaces. Both frontend and backend import from here.
- **`@repo/prompts`** — AI prompt template builders. Consumed by the server's job workers.
- **`@repo/ui`** — Source-only shared components (no build step). Next.js transpiles via `transpilePackages`.
- **BullMQ queues** — Defined in `apps/server/src/jobs/queues.ts`. Workers to be added per feature.
- **Socket.IO rooms** — Job progress emitted to `job:<jobId>` rooms. Frontend subscribes via `subscribe:job` event.
