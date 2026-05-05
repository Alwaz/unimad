# Architecture Context

## Stack

| Layer       | Technology                              | Role                                                                 |
| ----------- | --------------------------------------- | -------------------------------------------------------------------- |
| Monorepo    | Turborepo + pnpm workspaces             | Orchestrates builds across apps/packages with dependency-aware tasks |
| Frontend    | Next.js 15 (App Router) + TypeScript    | Renders the university program directory UI                          |
| UI          | Tailwind CSS v4 + shadcn/ui (Radix UI)  | Component primitives and styling                                     |
| Backend     | Express 5 + TypeScript                  | REST API serving program data                                        |
| Database    | MongoDB (Mongoose)                      | Persistent store for programs and related entities                   |
| Cache       | Redis (optional)                        | Optional response/data cache; degrades gracefully if unavailable     |
| Validation  | Zod                                     | Request and environment variable validation                          |
| Testing     | Vitest (backend)                        | Unit/integration tests on the backend                                |
| Shared types| `@repo/shared`                          | Single source of truth for cross-app TypeScript types                |

## System Boundaries

- `apps/frontend` — Next.js App Router UI. Owns pages, server/client components, URL-driven filter state, and the API client used to fetch programs from the backend.
- `apps/backend` — Express API. Owns route handlers, MongoDB models, services (program fetching, caching), middleware (logging, validation, error handling), and env config.
- `packages/shared` — Cross-app TypeScript contracts (`Program`, `SearchParams`, `User`, `ApiResponse`, `MODE`). Must be rebuilt before apps consume type changes.
- `packages/eslint-config` / `packages/typescript-config` — Shared lint and TS configs consumed by the apps.
- `apps/context` — Human-authored context docs (this file) describing architecture and conventions.

## Storage Model

- **MongoDB**: Authoritative store for program records as defined by `apps/backend/src/models/program.model.ts` — program metadata (name, slug, degree, mode), nested university info, and any related fields enforced by the Mongoose schema.
- **Redis (optional)**: Short-lived cache for hot reads (e.g. paginated program listings). Controlled by `REDIS_URL` and `CACHE_TTL`; the backend continues to function without it.
- **URL search params (frontend)**: Filter and pagination state (`query`, `programs`, `degree`, `mode`, `page`) is stored in the URL rather than client-side state, so server components can read it directly from `searchParams`.

## Auth and Access Model

- No authentication is currently wired up. The program directory is a public, read-mostly surface.
- The `User` type exists in `@repo/shared` as a forward-looking contract, but no sign-in flow, session middleware, or ownership checks are implemented yet.
- CORS is restricted to the configured `CORS_ORIGIN` on the backend; `helmet` applies baseline security headers.

## Invariants

1. `@repo/shared` is the single source of truth for types crossing the frontend/backend boundary — do not redefine these types locally in either app. After editing shared types, run `pnpm --filter @repo/shared build` before apps will pick up changes.
2. Frontend filter and pagination state lives in URL search params, not in client state. Server components read `searchParams`; client components update via `useSearchParams` + `router.replace()`.
3. Backend route handlers rely on Express 5's native async error propagation — do not wrap handlers in `try/catch` solely to forward to `next(err)`. Errors flow to the central `errorHandler` middleware.
4. Request input is validated through the `validate` middleware with a Zod schema; environment variables are validated through Zod in `apps/backend/src/config/env.ts`. New env vars must be added there.
5. Redis is treated as optional infrastructure — code paths that use the cache must degrade gracefully when it is unavailable.
6. shadcn/Radix primitives in `apps/frontend/src/components/ui/` are not modified directly; feature components compose them.
