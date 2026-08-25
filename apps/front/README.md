# Temperinho Frontend
Public-facing site for the Temperinho inclusive-cooking platform — recipes, articles, and a user dashboard for home cooks and food-focused businesses.

## Problem
An inclusive cooking community needed a public site that could rank well in search (SEO for recipes and articles), let visitors filter by dietary restriction, and give registered users and advertising companies their own dashboards — while staying performant and legally compliant (LGPD) for a Brazilian audience. A pure SPA wouldn't satisfy the SEO and Open Graph requirements this content needed.

## Tech Stack
| Layer      | Technology |
|------------|------------|
| Frontend   | Next.js 15 (App Router), React 19, TypeScript (strict) |
| UI         | Radix UI, Tailwind CSS 4 (custom warm/sage theme), Framer Motion |
| Forms      | React Hook Form 7 + Zod 3 |
| Data       | Axios, js-cookie |
| Monitoring | Sentry |
| Monetization | Google AdSense, CookieYes (LGPD consent) |
| Infra      | Docker, CI/CD pipeline |

## Architecture
```
Client (browser)
     │
     ▼
Next.js App Router
  ├─ Server Components (SSR)  → lib/api/*.server.ts (Bearer token from cookie)
  ├─ Client Components         → lib/api/* (client-side fetch)
  └─ AuthContext                → login/register/logout, guards (AuthGuard/GuestGuard)
     │
     ▼
Temperinho API (external)
```
Rendering strategy is mixed: SSR for SEO-critical public pages (home, blog, recipes, about), client-only for the authenticated `/usuario/*` area.

## Key Features
- **Public Content**
  - Recipe and blog listings with server-rendered filters (category, diet, search) persisted in the URL
  - Dynamic Open Graph metadata per recipe/post (`generateMetadata`)
  - Comments and star ratings on recipes and posts
- **User Area (`/usuario/*`, auth-protected)**
  - Dashboard, profile, company management, recipe/article authoring with image upload
  - Favorites for recipes and articles
- **Auth**
  - Bearer-token auth via `AuthContext`, Google OAuth flow, `AuthGuard`/`GuestGuard` route protection
- **SEO & Compliance**
  - Dynamic `sitemap.xml` and `robots.txt`
  - LGPD-compliant privacy policy and terms of use, cookie consent via CookieYes

## Project Structure
```
src/
├── app/
│   ├── auth/                # login, register, password reset, OAuth callback
│   ├── blog/ receitas/       # public listings + detail pages
│   ├── usuario/               # protected user area (AuthGuard)
│   ├── contato/ marketing/ sobre-nos/ privacidade/ termos/
│   ├── sitemap.ts robots.ts
├── components/                # by domain
├── context/AuthContext.tsx     # global auth provider
└── lib/
    ├── api/                   # client + server (*.server.ts) fetchers
    ├── schemas/                # Zod schemas
    └── data/                   # static content (team, contact info)
```

## Getting Started
### Prerequisites
- Node.js >= 20
- Temperinho API running (see `temperinho-api`)

### Install
```bash
git clone <repo-url>
cd temperinho-front
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
| `NEXT_PUBLIC_SITE_URL` | Public site URL (sitemap/robots) | `https://temperinho.com.br` | Yes |
| `NEXT_PUBLIC_GOOGLE_AD_CLIENT` | Google AdSense client ID | `ca-pub-...` | No |
| `SENTRY_DSN` | Sentry error monitoring | `https://...@sentry.io/...` | No |

## API Reference
This app is a client of the Temperinho API — it has no routes of its own. See [`temperinho-api`](../temperinho-api) for the full endpoint reference and [`docs/api-documentation.md`](./docs/api-documentation.md) for how this frontend consumes it.

## Testing
No automated test suite in this repo yet.
```bash
npm run lint
```

## Deployment
CI/CD (`.github/workflows/ci-cd.yml`) lints on every push/PR to `main`, then builds and pushes a Docker image on `main`.
```bash
docker build -t temperinho-front .
docker run -p 3000:3000 --env-file .env.local temperinho-front
```

## Conventions
Project rules and constraints live in [`docs/conventions.md`](./docs/conventions.md), [`docs/architecture-skills.md`](./docs/architecture-skills.md), and [`docs/security-skills.md`](./docs/security-skills.md) — not duplicated here.

## License
MIT
