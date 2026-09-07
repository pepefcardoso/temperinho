# Temperinho Admin
Administrative dashboard for the Temperinho inclusive-cooking platform, letting staff manage users, content, plans, and payments from a single CRUD interface.

## Problem
Managing users, companies, recipes, posts, subscriptions, and payments across a multi-tenant platform required direct database access or one-off scripts. There was no centralized, permissioned interface for non-technical staff to moderate content or handle billing operations. This panel wraps the Temperinho API in a reusable CRUD layer so every domain gets paginated tables, forms, and delete confirmations for free.

## Tech Stack
| Layer      | Technology |
|------------|------------|
| Frontend   | Next.js 15 (App Router), React 19, TypeScript (strict) |
| UI         | Radix UI primitives, Tailwind CSS 4, shadcn-style components |
| Forms      | React Hook Form 7 + Zod 3 |
| Data       | TanStack React Table 8, Axios, Zustand |
| Monitoring | - |
| Testing    | Vitest, Playwright (E2E) |
| Infra      | Docker (Next.js standalone), Vercel-compatible |

## Architecture
```
Browser → Next.js App Router (Server Components)
             ├─ dashboard/layout.tsx  → session check, Sidebar
             ├─ Server Actions (lib/actions/*) → Temperinho API (Bearer token)
             └─ CrudPage<T> (generic) → DataTable + create/edit/delete dialogs
```
Auth uses the same Bearer token system as the API, stored in an httpOnly cookie in production and read via server-side helpers.

## Key Features
- **Generic CRUD (`CrudPage<T>`)**
  - Paginated table with loading skeletons and empty states
  - Create/edit dialogs driven by a shared Zod schema
  - Delete confirmation with toast feedback
- **Domain Modules**
  - Users, Companies, Plans, Subscriptions, Payments, Payment Methods
  - Posts/Recipes and their Categories, Topics, Diets, Units
  - Comments and Ratings moderation (search by resource type + ID)
  - Customer contacts, Newsletter subscribers
- **Auth & Session**
  - Bearer-token login persisted in cookie, protected `dashboard/*` layout, `UserSessionProvider` context (no prop drilling)

## Project Structure
```
src/
├── app/
│   ├── auth/login/          # login page
│   └── dashboard/           # protected routes, one folder per domain
├── components/
│   ├── auth/ dashboard/ profile/
│   └── shared/
│       ├── crud/             # CrudPage — generic CRUD engine
│       ├── dataTable/        # DataTable, skeletons, empty state
│       └── entityPage/       # page title/description wrapper
└── lib/
    ├── actions/              # Server Actions per domain
    ├── schemas/              # Zod schemas per domain
    └── types/                # TypeScript interfaces per domain
```

## Getting Started
### Prerequisites
- Node.js >= 20
- Temperinho API running (see `temperinho-api`)

### Install
```bash
git clone <repo-url>
cd temperinho-admin
npm install
```

### Environment
```bash
cp .env.example .env.local
```

### Run
```bash
npm run dev
```
Available at `http://localhost:3000`.

## Environment Variables
| Variable       | Description            | Example                | Required |
|----------------|-------------------------|-------------------------|----------|
| `NEXT_PUBLIC_API_URL` | Base URL of the Temperinho API | `http://localhost:8000/api` | Yes |
| `NEXT_PUBLIC_URL` | This panel's own URL (internal use) | `http://localhost:3000` | Yes |

## API Reference
This app is a client of the Temperinho API — it has no routes of its own. See [`temperinho-api`](../temperinho-api) for the full endpoint reference.

## Testing
```bash
npm run test          # Vitest unit tests
npm run test:watch
npm run test:e2e       # Playwright E2E
```

## Deployment
CI (`.github/workflows/ci.yml`) runs lint, typecheck, unit tests, and build on every push/PR to `main`. Two deploy paths:

**Vercel (recommended):** push to Git, import the project, set env vars, deploy — auto-deploys on `main` pushes.

**Docker (standalone):**
```bash
docker build -t temperinho-admin .
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api \
  -e NEXT_PUBLIC_URL=https://admin.yourdomain.com \
  temperinho-admin
```
Full details in [`docs/deployment.md`](./docs/deployment.md).

## Conventions
Project rules and constraints live in [`docs/testing.md`](./docs/testing.md) — not duplicated here.

## License
MIT
