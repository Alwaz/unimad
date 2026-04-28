# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
pnpm dev                              # Start all apps concurrently (frontend :3000, backend :4000)
pnpm --filter @repo/frontend dev      # Frontend only
pnpm --filter @repo/backend dev       # Backend only

# Build
pnpm build                            # Build all packages (respects Turborepo dependency order)
pnpm --filter @repo/shared build      # Must rebuild shared after type changes

# Lint & typecheck
pnpm lint
pnpm typecheck

# Format
pnpm format                           # Write
pnpm format:check                     # Check only

# Tests (backend only, using Vitest)
pnpm --filter @repo/backend test
pnpm --filter @repo/backend test:watch

# Docker (dev databases only)
docker compose -f docker-compose.dev.yml up -d   # Start MongoDB + Redis locally
```

## Architecture

This is a **Turborepo + pnpm workspace** monorepo. Task execution order is dependency-aware: `build` depends on `^build`, so `@repo/shared` always builds before the apps.

### Packages

- **`@repo/shared`** — The single source of truth for types shared between frontend and backend. After changing types here, run `pnpm --filter @repo/shared build` before the apps will pick up changes. Key exports: `Program`, `SearchParams`, `User`, `ApiResponse`, `MODE`.
- **`@repo/eslint-config`** / **`@repo/typescript-config`** — Shared tooling configs consumed by apps.

### Frontend (`apps/frontend`)

Next.js 15 App Router. The primary page is a **university program directory** for Pakistani universities.

**URL-driven state**: All filter and search state lives in URL search params (`query`, `programs`, `degree`, `mode`, `page`). Server components read `searchParams`; client components use `useSearchParams` + `router.replace()` to update them.

**Data flow** (current state — API not yet wired):
- `PROGRAMS` array in `src/lib/constants.ts` is the data source (hardcoded static data).
- `Directory` (server component) filters this array based on `searchParams` and renders `ProgramCard` grid.
- `FilterGroup` (client component) manages Discipline / Degree type / Study mode selects, each updating URL params on change.
- `SearchBar` applies debounced `query` param to URL.

**Filter param → data field mapping**:
| URL param  | `Program` field              | Values |
|------------|------------------------------|--------|
| `query`    | name, university.*           | free text |
| `programs` | `program_slug`               | e.g. `software-engineering` |
| `degree`   | `program_meta.degree`        | `bachelor` / `master` / `phd` |
| `mode`     | `program_meta.mode`          | `ON_CAMPUS` / `ONLINE` / `HYBRID` |

**Component organization**:
- `src/components/features/directory/` — domain components (Directory, FilterGroup, DisciplineDialog, ProgramCard)
- `src/components/shared/` — cross-feature components (Header, SearchBar)
- `src/components/ui/` — shadcn/Radix primitives (do not modify directly)
- `src/components/skeletons/` — loading states

UI uses **shadcn** components built on **Radix UI** with **Tailwind CSS v4**.

### Backend (`apps/backend`)

Express 5 with native async error propagation (no `try/catch` wrapper needed in route handlers).

**Request lifecycle**: `helmet` → `cors` → `express.json` → `requestLogger` → route handlers → `errorHandler`

**Database schema**: `src/models/program.model.ts` is the authoritative definition of what's stored in MongoDB. Reference it whenever you need to understand data structure, field types, or constraints.

**Adding a new route**: create file in `src/routes/`, export a Router, register it in `src/app.ts` under `/api/${API_VERSION}/`.

**Validation**: use the `validate` middleware with a Zod schema. Environment variables are validated with Zod in `src/config/env.ts` — add new env vars there.

**Redis is optional**: `src/services/cache.ts` gracefully degrades when Redis is unavailable.

**Backend env vars** (in `apps/backend/.env`):
```
NODE_ENV, PORT, CORS_ORIGIN, LOG_LEVEL
MONGODB_URI, REDIS_URL, CACHE_TTL
```

**Frontend env vars** (in `apps/frontend/.env`):
```
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
```
