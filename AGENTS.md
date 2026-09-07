<!-- AGENTS.md -->

# AGENTS.md — Temperinho

Monorepo for Temperinho, an inclusive-cooking platform (recipes, articles, companies/plans). Three apps, independently deployed, sharing one API contract.

## Repo layout

```
apps/
├── front/   # Next.js 15 — public site (SSR, SEO-critical)
├── admin/   # Next.js 15 — internal CRUD dashboard
└── api/     # Laravel 11 (PHP 8.2) — REST API, source of truth for domain logic
```

`front` and `admin` are a pnpm workspace orchestrated by Turborepo (`pnpm-workspace.yaml`, `turbo.json`). `api` is a standalone Composer project, not part of the pnpm workspace — treat it as a separate root when touching PHP.

## Commands

Run from repo root unless noted.

```bash
pnpm install
pnpm dev              # turbo run dev, both node apps
pnpm dev:front
pnpm dev:admin
pnpm build
pnpm lint
pnpm test
```

```bash
cd apps/api
composer install
php artisan serve
php artisan test
php artisan test tests/Feature/Auth/LoginTest.php
```

```bash
docker compose up -d          # postgres, redis, meilisearch, api, front, admin
```

## Stack per app

|                  | front                                | admin                              | api                          |
| ---------------- | ------------------------------------ | ---------------------------------- | ---------------------------- |
| Framework        | Next.js 15 App Router, React 19      | Next.js 15 App Router, React 19    | Laravel 11, PHP 8.2          |
| Language         | TypeScript strict                    | TypeScript strict                  | —                            |
| UI               | Radix UI, Tailwind 4, Framer Motion  | Radix UI, Tailwind 4, shadcn-style | —                            |
| Forms/validation | React Hook Form + Zod                | React Hook Form + Zod              | Form Requests                |
| Data/state       | Axios, js-cookie, AuthContext        | Axios, Zustand, TanStack Table     | Eloquent, Redis cache/queue  |
| Auth             | Bearer token (cookie) + Google OAuth | Bearer token (httpOnly cookie)     | Sanctum + Socialite          |
| Search           | —                                    | —                                  | Meilisearch via Scout        |
| Storage/mail     | —                                    | —                                  | S3 (Flysystem), SES          |
| Tests            | none configured yet — lint only      | Vitest (unit), Playwright (E2E)    | PHPUnit (`php artisan test`) |
| Monitoring       | —                                    | —                                  | —                            |

## Conventions that matter

**front / admin (shared Next.js patterns)**

- Default to Server Components; `"use client"` only at leaves that need hooks/state/listeners.
- All mutations go through Server Actions, never client-side fetch for writes.
- Zod is the single source of truth for validation — same schema drives the form (React Hook Form) and the Server Action.
- Types live in `src/lib/types/` (or `src/types/` in front), grouped by domain. Prefer `interface` for entity shapes, `type` for unions/intersections.
- API access is split `lib/api/*.ts` (client) vs `lib/api/*.server.ts` (SSR, reads Bearer token from cookie) — don't mix the two.
- No `any`. Use `unknown` + narrowing.

**admin specific**

- New entity management pages must reuse `CrudPage<T>` (`src/components/shared/crud/crudPage.tsx`) — don't hand-roll table/dialog/toast plumbing. Full pattern in `apps/admin/conventions.md`.
- Filter/sort/pagination state lives in the URL query string, not component state.
- Zustand only for true cross-tree global state; scoped global state (session) uses React Context.
- shadcn/ui primitives from `src/components/ui/` for buttons/inputs/dialogs/selects — don't rebuild these.

**front specific**

- Rendering is mixed on purpose: SSR for public/SEO pages (home, blog, receitas, about), client-only for `/usuario/*`. Don't flip a public page to client-only without checking SEO impact (Open Graph via `generateMetadata`).
- Route protection via `AuthGuard` / `GuestGuard`, session via `AuthContext` — reuse, don't reimplement.
- LGPD/consent (CookieYes) and AdSense are live on production pages — don't strip related script tags casually.
- No test suite here yet; `pnpm lint` is the CI gate for this app.

**api**

- Controllers stay thin: validate via Form Requests, delegate to `app/Services/<Domain>`, authorize via Policies, respond via API Resources. Don't put business logic in controllers or models.
- Services and their tests are organized by domain folder (`Services/Recipe`, `tests/Feature/Recipe`, …) — follow existing folder names for new domains.
- `Image`, `Comment`, `Rating` are polymorphic across `Post`/`Recipe`/`User` — reuse them, don't add per-model duplicates.
- Plan limits (`max_posts`, `max_recipes`, …) are enforced by `CheckPlanLimit` middleware, not ad hoc checks in controllers.
- Test method names and comments are in Portuguese, pattern `Validar_Ação_ResultadoEsperado` (e.g. `Validar_LoginComCredenciaisCorretas_Sucesso`), AAA style with `// --- ARRANGE/ACT/ASSERT ---` comments. Match this pattern for new tests even though the rest of the codebase (READMEs, PHPDoc) is English.
- Image uploads to S3 must roll back on DB transaction failure — preserve that behavior when touching upload flows.

## Environment

Each app has its own `.env` — never share one across apps.

| App     | Key vars                                                                                                                                                  |
| ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `api`   | `APP_KEY`, `APP_FRONTEND_URL`, `DB_CONNECTION` (`sqlite` dev / `pgsql` prod), `REDIS_HOST`, `AWS_BUCKET`, `MEILISEARCH_HOST`, `GOOGLE_CLIENT_ID`/`SECRET` |
| `front` | `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_GOOGLE_AD_CLIENT`                                                               |
| `admin` | `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_URL`                                                                                                                  |

`api` dev DB is SQLite (`database/database.sqlite`); prod is Postgres — don't assume Postgres-only SQL in local changes.

## CI gates (must pass before merge)

- Root `ci.yml`: path-filtered — touching `apps/front/**` or `apps/admin/**` runs `pnpm turbo run lint build test`; touching `apps/api/**` runs `php artisan test`.
- `admin` also has its own workflow: lint, typecheck, unit tests (Vitest), build.
- `front` has a separate `ci-cd.yml`: lint on every push/PR, build+push Docker image on `main`.

## Formatting

`front`/`admin`: Prettier (single quotes, semicolons, trailing comma `es5`, printWidth 80) + ESLint (`next/core-web-vitals`, `next/typescript`). Don't hand-format against these rules — run `pnpm lint` before proposing changes as done.

## Don't

- Don't add a test framework to `front` — it currently has none by design; raise it as a separate decision rather than introducing one inline with a feature change.
- Don't duplicate Zod validation logic between the form and the Server Action in `front`/`admin` — one schema, imported both places.
- Don't put PHP business logic in Controllers or Models — Services only.
- Don't hardcode plan limits — read from the `Plan` model / `CheckPlanLimit` middleware.
