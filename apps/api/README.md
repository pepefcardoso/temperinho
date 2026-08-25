# Temperinho API
REST API powering the Temperinho inclusive-cooking platform — recipes, articles, and the business logic behind them, for the public site and admin panel.

## Problem
An inclusive cooking community needed a backend that could serve recipes and articles with dietary filtering, support companies advertising through paid plans, and moderate user-generated comments/ratings — all while staying testable and maintainable as the domain grew. A plain CRUD scaffold wasn't enough once plan limits, polymorphic comments/ratings, and async notifications entered the picture.

## Tech Stack
| Layer      | Technology |
|------------|------------|
| Backend    | PHP 8.2, Laravel 11 |
| Auth       | Laravel Sanctum (Bearer tokens), Socialite (Google OAuth) |
| Database   | PostgreSQL 15 (prod), SQLite (dev) |
| Cache      | Redis (cache, sessions, queues) |
| Search     | Meilisearch via Laravel Scout |
| Storage    | AWS S3 (Flysystem), AWS SES (mail) |
| Monitoring | Sentry |
| Infra      | Docker Compose, Nginx, Certbot |

## Architecture
```
Client → Nginx → Laravel (app/Http/Controllers)
                       │
              Form Requests (validation + authorization)
                       │
              Service Layer (app/Services, by domain)
                       │
              Policies (authorization) ── Eloquent + local scopes
                       │
              API Resources (JSON contracts)
                       │
        ┌──────────────┼──────────────┐
   PostgreSQL      Redis (cache/queue)   Meilisearch (search)
                       │
              S3 (images) + SES (transactional email)
```
Controllers stay thin — they delegate to the Service Layer and return via API Resources. Polymorphic `Image`, `Comment`, and `Rating` models attach to any model (`Post`, `Recipe`, `User`).

## Key Features
- **Auth** — register/login/logout via Sanctum, password reset by email, Google OAuth via Socialite
- **Recipes** — full CRUD with ingredients, steps, diets; image upload with automatic S3 rollback on DB transaction failure; ratings and favorites
- **Posts/Blog** — CRUD with categories and topics, scoped to the owning company
- **Companies, Plans, Subscriptions, Payments** — configurable plan limits (`max_posts`, `max_recipes`, etc.) enforced by `CheckPlanLimit` middleware; email notifications on subscribe/expire/pay
- **Comments & Ratings** — polymorphic across `posts`/`recipes`, one rating per user per resource, cache flushed by tag on write
- **Marketing** — contact form and newsletter subscribe/unsubscribe, both with email notifications
- **Full-text search** — Meilisearch when a search term is present, falls back to Eloquent queries otherwise

## Project Structure
```
app/
├── Http/
│   ├── Controllers/    # thin, delegate to Services
│   ├── Requests/        # Form Requests — validation + authorization
│   └── Resources/       # JSON response contracts
├── Services/            # business logic, by domain
├── Policies/             # authorization rules
├── Models/               # Eloquent models, local scopes
└── Notifications/        # queued email notifications
database/
├── migrations/ seeders/ factories/
docker/nginx/             # production Nginx config
```

## Getting Started
### Prerequisites
- PHP 8.2+
- Composer 2+
- SQLite (dev) or PostgreSQL 15 (prod)
- Redis (required in production)
- Docker & Docker Compose

### Install
```bash
git clone <repo-url>
cd temperinho-api
composer install
```

### Environment
```bash
cp .env.example .env
php artisan key:generate
touch database/database.sqlite   # dev only; set DB_CONNECTION=sqlite
```

### Run
```bash
php artisan migrate --seed
php artisan serve
php artisan queue:work redis --tries=3   # in a separate terminal
```
API available at `http://localhost:8000/api`.

## Environment Variables
| Variable       | Description            | Example                | Required |
|----------------|-------------------------|-------------------------|----------|
| `APP_KEY` | Generated via `artisan key:generate` | — | Yes |
| `APP_FRONTEND_URL` | Frontend URL (CORS, email links) | `https://temperinho.com.br` | Yes |
| `DB_CONNECTION` | `pgsql` (prod) or `sqlite` (dev) | `pgsql` | Yes |
| `REDIS_HOST` | Redis host | `redis` | Yes (prod) |
| `AWS_BUCKET` | S3 bucket for uploads | `temperinho-uploads` | Yes |
| `MEILISEARCH_HOST` | Meilisearch endpoint | `http://meilisearch:7700` | Yes |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google OAuth credentials | — | Only for Google login |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Seeded admin account | — | Only for `--seed` |

## API Reference
All routes are prefixed with `/api`.

| Method | Route          | Auth | Description        |
|--------|----------------|------|---------------------|
| POST | `/auth/login` | No | Login with email/password |
| POST | `/auth/logout` | Yes | Revoke current token |
| GET | `/auth/{provider}/redirect` | No | Start OAuth flow (Google) |
| GET | `/users/me` | Yes | Current authenticated user |
| GET/POST | `/recipes` | No / Yes | List / create recipes |
| GET/PUT/DELETE | `/recipes/{id}` | No / Yes / Yes | Detail / update / delete |
| GET | `/recipes/favorites` | Yes | User's favorited recipes |
| GET/POST | `/posts` | No / Yes | List / create posts |
| GET/POST | `/{type}/{id}/comments` | No / Yes | List / create comments on a post or recipe |
| GET/POST | `/{type}/{id}/ratings` | No / Yes | List / create-or-update rating |
| GET/POST | `/companies`, `/plans`, `/subscriptions`, `/payments` | varies | Business/billing CRUD |
| POST | `/contact` | No | Contact form submission |
| POST | `/newsletter` | No | Newsletter subscribe |

Full endpoint list, including categories/topics/diets/units CRUD, is in the original project README.

## Testing
```bash
php artisan test
php artisan test --coverage
php artisan test tests/Feature/Auth/LoginTest.php
```
Naming convention: `Validate_Action_ExpectedResult` (e.g. `Validate_LoginWithCorrectCredentials_Success`).

## Deployment
`docker-compose.yml` defines the production stack: `app` (PHP-FPM), `nginx` (reverse proxy + SSL), `db` (PostgreSQL), `meilisearch`, `redis`, `backup` (automated `pg_dump`), `certbot` (Let's Encrypt).
```bash
docker compose up -d --build
docker compose exec app php artisan migrate --force
docker compose logs -f app
```

## Conventions
Project rules and constraints live in [`docs/`](./docs) (architecture, security, conventions) — not duplicated here.

## License
MIT
