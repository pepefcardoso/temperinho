# Temperinho — Pre-Launch Refactor: Complete Project Record

_Compiled from the full planning + implementation conversation. Covers the approved PRD, every locked decision, and all code delivered across Phases 1–5._

---

## PART 1 — PRODUCT REQUIREMENTS DOCUMENT (approved, final state)

### 1. Overview

Temperinho is an inclusive-cooking platform for the Brazilian market: a public site where home cooks publish and discover recipes filterable by dietary restriction (gluten-free, vegan, kosher, low-sodium, etc.), read editorial articles, and interact via comments and ratings. The business model is B2B sponsorship — food and wellness brands pay a monthly fee to publish labeled sponsored articles, place banners, and run newsletter campaigns.

The codebase (Next.js 15 front + Next.js 15 admin + Laravel 11 API, pnpm/Turborepo monorepo) is feature-complete but has never been launched publicly. This PRD scopes the pre-launch refactor: fixing confirmed defects, closing authorization gaps, and adding the minimum new functionality (sponsorship approval, reporting, LGPD deletion) needed for a safe, legally compliant first release.

### 2. Goals & Success Metrics

**Launch goal:** ship a stable, secure MVP within 30–45 days, solo developer, on existing Contabo VPS/Docker infrastructure.

**90-day targets (post-launch):**

| Metric                   | Target |
| ------------------------ | ------ |
| Active users             | 100    |
| Published recipes        | 50     |
| Active sponsor companies | 2      |

No analytics or error-tracking was configured in any of the three apps at project start. These targets can't be measured without at least pageview/session tracking, and production bugs can't be caught without error tracking — this became Phase 5 (Sentry + Plausible), locked into scope.

### 3. Users, in priority order

1. **Home cooks (consumers)** — read and filter recipes/articles, comment, rate, favorite, publish their own recipes. Free, unlimited.
2. **Recipe authors** — any registered user; same tier as consumers, no plan gating.
3. **Sponsors** — companies with a paid plan; publish labeled articles (pending admin approval) and recipes; subject to `max_posts`/`max_recipes` limits.
4. **Admins** — provision sponsor plans/subscriptions manually, approve/reject sponsored articles, moderate reports, handle manual data-export requests.

Internal editorial team (`RolesEnum::INTERNAL`) sits alongside admins: can publish articles without approval, can moderate.

### 4. Scope

| In scope (v1)                                               | Out of scope (v2+)                          |
| ----------------------------------------------------------- | ------------------------------------------- |
| Fix client-side auth (401s on comments/ratings/favorites)   | Automated checkout / payment gateway        |
| Fix plan-limit null bug                                     | Sponsor analytics dashboard                 |
| Restrict article creation to internal + sponsors            | WCAG accessibility                          |
| Sponsored-article approval workflow + "Patrocinado" label   | Trial days                                  |
| Report button (recipes, comments, ratings)                  | Multi-user company accounts (`max_users`)   |
| LGPD self-service account deletion                          | Schema.org / JSON-LD recipe structured data |
| Sitewide health/diet disclaimer                             | Auto-hide on report threshold               |
| Backend test coverage for the above                         | Frontend/admin test frameworks              |
| Monitoring: Sentry (error tracking) + Plausible (analytics) | —                                           |
| Existing SEO (sitemap, robots, OG) — kept as-is             | New SEO work                                |

### 5. Functional Requirements

#### 5.1 Authentication & Session Reliability — P0

**Problem found during audit:** `AuthContext` (`fetchUser`, `login`, `register`, `logout`) and several client-side API modules (`interactions.server.ts` for comments/ratings, `user.ts` for favorite toggles, plus — discovered during implementation — `blog.ts`, `recipe.ts`, `company.ts` mutations) called the shared client `axiosClient`, which had no mechanism to attach the bearer token. The `AUTH_TOKEN` cookie is `httpOnly` (unreadable by JS) and `supports_credentials` was `false` in `cors.php`, so these requests ran unauthenticated. Only `*.server.ts` functions that built a fresh axios instance from `cookies()` worked correctly.

**Resolution:** every authenticated mutation from the public site now runs as a real Next.js Server Action (`'use server'`), reading the token from the `httpOnly` cookie server-side, per the project's own `AGENTS.md` convention. This ended up touching far more files than originally scoped (recipe/post/company create-update-delete, not just comments/ratings/favorites), because they shared the identical root cause.

**Acceptance criteria:** a logged-in user can comment, rate, favorite, publish a recipe, and (if a sponsor) publish an article, from the public site without a spurious redirect to `/auth/login`.

#### 5.2 Plan & Subscription Enforcement — P0

**Problem:** `CheckPlanLimit` compared `$currentCount >= $limit` where `$limit` could be `null` (unlimited plan tiers). PHP's loose comparison made this block creation instead of allowing it.

**Resolution:** treat `null` as unlimited explicitly — skip the count query/comparison entirely when `max_posts`/`max_recipes` is `null`. No change to the 30-day rolling window or to the "no active subscription → 403" behavior.

#### 5.3 Content Authorship & Publishing Rules — P0

**Problem:** `PostPolicy::create` returned `true` unconditionally — any authenticated user could create a post, contradicting "articles restricted to internal team + sponsors."

**Resolution:** `PostPolicy::create` allows only `RolesEnum::INTERNAL`/`ADMIN` users, or users whose `company` has an active subscription. Everyone else gets a 403. Recipe creation remains open to all registered users.

#### 5.4 Sponsorship: Article Approval Workflow — P0 (locked, final)

`posts.status` enum, **3 states** (locked 2026-10-07, draft dropped): `pending` → `published` / `rejected`, default `published`. `posts.rejection_reason` nullable text.

- **Trigger:** any post created by a user with `company_id != null` enters `pending` on submission (not visible publicly) and is labeled "Patrocinado" wherever displayed.
- Posts by internal team (`company_id == null`) publish immediately, no label, no approval step.
- Only `ADMIN` can transition `pending → published` or `pending → rejected` (reject requires a reason).
- Sponsor's own article list (`/usuario/artigos`) shows status and, when rejected, the reason.
- **Notifications (locked in scope):** on approve/reject, a queued email goes to the sponsor, including `rejection_reason` when rejected.

#### 5.5 Trust & Safety: Reporting — P0

`reports` table, polymorphic (`reportable_type`, `reportable_id`), covering **comments, ratings, and recipes** — posts deliberately excluded, since sponsored articles are already admin-gated pre-publish and internal-team articles are trusted-author content.

- Reporter: authenticated users only.
- Fields: `reason` (enum: spam, inappropriate, misinformation, other), `comment` (optional), `status` (pending/reviewed).
- No auto-hide. A report only creates a record; admin reviews and acts manually (deleting the offending content via existing CRUD).
- Admin dashboard page listing reports with a "mark reviewed" action.

#### 5.6 LGPD: Account Deletion — P0

**Problem:** `posts.user_id` / `recipes.user_id` are `onDelete('cascade')`. Self-service deletion would have instantly destroyed a user's published content.

**Resolution:** self-service deletion anonymizes the `User` row in place (scrub name, email, phone, birthday, avatar; invalidate password/tokens/OAuth links; set `deleted_at`) rather than deleting the row. Content keeps its existing `user_id` FK untouched. Scrubbing `name` to "Usuário Removido" makes every `AuthorResource` consumer (posts, comments, recipes) display correctly with zero extra frontend logic.

If the deleting user owns a company, the company's PII (`email`, `phone`, `cnpj`, `address`) is scrubbed the same way; subscriptions/payments stay intact for accounting; any still-`pending` sponsored posts are auto-rejected.

Data export requests stay manual (admin pulls data on request) — no self-service export in v1.

**Implementation note:** `DELETE /api/users/{user}` already existed and was already self-service-authorized by `UserPolicy::delete()` — it just hard-deleted. No new endpoint was needed; `DeleteUser`'s internals were rewritten instead.

#### 5.7 Health/Diet Disclaimer — P1

Sitewide footer disclaimer plus a shorter inline note on recipe pages that carry diet tags. No verification workflow.

#### 5.8 SEO — unchanged

Existing `sitemap.ts`, `robots.ts`, and `generateMetadata`-driven Open Graph tags are sufficient for launch. JSON-LD deferred to v2.

### 6. Data Model Changes (final)

| Table           | Change                                                                                                                                                         |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `posts`         | add `status` enum(`pending`,`published`,`rejected`) default `published`; add `rejection_reason` text nullable                                                  |
| `reports` (new) | `id`, `reportable_type`, `reportable_id`, `user_id`, `reason` enum, `comment` text nullable, `status` enum(`pending`,`reviewed`) default `pending`, timestamps |
| `users`         | add `deleted_at` timestamp nullable (plain marker column, not Laravel `SoftDeletes` — see Part 2)                                                              |
| `companies`     | no schema change — PII scrubbed in place on parent user deletion                                                                                               |

### 7. API Changes (final)

| Endpoint                                                    | Change                                                                |
| ----------------------------------------------------------- | --------------------------------------------------------------------- |
| `POST /posts`                                               | `PostPolicy::create` restricted; response includes `status`           |
| `PATCH /posts/{post}/approve`, `PATCH /posts/{post}/reject` | new, `ADMIN` only, reject requires `reason`                           |
| `POST /{type}/{id}/reports`                                 | new, polymorphic (`comments`/`ratings`/`recipes`), auth required      |
| `GET /reports`, `PATCH /reports/{report}/review`            | new, admin-only                                                       |
| `DELETE /users/{user}`                                      | existing endpoint, behavior changed from hard-delete to anonymization |
| `POST /companies`                                           | unblocked for regular customers (Phase 5 fix)                         |
| `CheckPlanLimit`                                            | null-limit fix, no route change                                       |

### 8. Non-Functional Requirements

- **Testing:** PHPUnit coverage for every P0 item above, following the existing `Services/<Domain>` + `tests/Feature/<Domain>` pattern. Frontend/admin test frameworks explicitly deferred (none existed at project start).
- **Security:** anonymization invalidates all active Sanctum tokens for the deleted user; Sentry configured with `send_default_pii = false` on every app.
- **Monitoring:** Sentry (error tracking, all 3 apps) + Plausible (front only) — in scope, delivered Phase 5.

### 9. Release Plan (as executed)

| Phase | Scope                                                                                                                                         |
| ----- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| 1     | Auth fix (Server Actions across recipe/post/company/comment/rating/favorite/profile mutations), plan-limit null fix, `PostPolicy` restriction |
| 2     | Sponsorship approval workflow (schema, endpoints, admin approve/reject UI, front status display)                                              |
| 3     | Reporting (schema, endpoint, admin page, report buttons on recipe/comment UI)                                                                 |
| 4     | LGPD deletion (anonymization + self-service UI) + health disclaimer                                                                           |
| 5     | Monitoring (Sentry + Plausible) + `CompanyPolicy::create()` investigation/fix + 2 low-risk UI follow-ups                                      |

### 10. Status

Approved 2026-10-07. All launch-blocking open items resolved as documented above. Implementation complete through Phase 5; staging verification and deployment are the developer's own responsibility (not performed by the assistant — see Part 4).

### Appendix A — All defects found during the audit

- Client-side writes (comments, ratings, favorites, recipe/post/company CRUD, auth state) were unauthenticated due to an httpOnly-cookie/client-axios mismatch.
- `CheckPlanLimit` null-comparison bug blocked unlimited-tier companies from publishing at all.
- `PostPolicy::create` allowed any authenticated user to publish articles, bypassing the sponsor/internal-only rule.
- `companies.user_id` is `unique()` — ruled out a shared "deleted user" placeholder approach for LGPD deletion; anonymize-in-place used instead.
- `CompanyPolicy::create()` required `isInternal()`, silently blocking the already-built sponsor self-registration form at `/usuario/empresa`.
- No analytics or error tracking existed anywhere in the stack prior to Phase 5.
- Admin nav config (`config/dashboard.ts`) already had a "Posts" entry pointing at a page that didn't exist yet (filled by Phase 2); it also still has a dead "Receitas" nav entry pointing at a recipes admin page that was never built — noted, not fixed (out of scope).

---

## PART 2 — ARCHITECTURE & NON-TRIVIAL DECISIONS

**Monorepo:** pnpm/Turborepo, three apps — `apps/api` (Laravel 11, PHP 8.2+), `apps/front` (Next.js 15.4.4, React 19.1.1, public site), `apps/admin` (Next.js 15.4.6, React 19.1.0, internal dashboard).

**Auth architecture decision (Phase 1):** fixed via Next.js Server Actions reading an `httpOnly` cookie server-side, rather than (a) switching to Sanctum cookie-session auth with CORS credentials across subdomains, or (b) exposing the token to client JS. Chosen because it matches the project's own pre-existing `AGENTS.md` convention and keeps the token server-only.

**Shared server-auth helper (`serverApi.ts`):** centralizes `Authorization: Bearer <token>` attachment so every `*.server.ts` file uses one implementation instead of N duplicated inline copies.

**Multipart FormData handling:** the original code manually set `'Content-Type': 'multipart/form-data'` with no boundary parameter on every file-upload call — malformed even before the auth bug. Fixed by letting axios 1.10 on Node 20 auto-detect native `FormData` and set the correct boundary itself; the manual header was removed everywhere it appeared (recipe, post, company, user-profile uploads).

**Post status field:** implemented as plain string constants on the `Post` model (`STATUS_PENDING`, `STATUS_PUBLISHED`, `STATUS_REJECTED`) rather than a new PHP backed enum class, to match how `Subscription`/`Plan` status fields already work in this codebase (plain strings), instead of introducing a third status-handling convention alongside `RolesEnum`/`RecipeDifficultyEnum`.

**Visibility filtering architecture:** added a new `applyBaseScope()` no-op hook to the shared `BaseListService` trait (used by every `ListX` service), overridden only in `ListPost` to hide non-published posts from non-internal users — in both the plain-query path and the Meilisearch search path. Every other `ListX` service (recipes, companies, etc.) is unaffected since they don't override the hook.

**Reports model:** built via direct `Report::create([...])` rather than adding inverse `reports()` MorphMany relations to `Comment`/`Rating`/`Recipe` — nothing needed to query "reports for this item" from the content side, so the extra relation on three models wasn't worth the surface area.

**Admin UI pattern:** the project's existing `CrudPage<T>` component only supports create/edit/delete forms, not custom row actions. Both new admin pages (Posts approval queue, Reports queue) were built directly on the lower-level `useDataTable` + `DataTable` primitives instead, with bespoke action buttons/dialogs. This also corrected an assumption in the original PRD draft, which had assumed `CrudPage` reuse was possible.

**LGPD anonymization, not Laravel `SoftDeletes`:** deliberately did **not** use Laravel's `SoftDeletes` trait on `User`, because its global scope would exclude anonymized users from every query by default — breaking every `post.user`/`comment.user`/`recipe.user` relation exactly where the PRD wanted them to keep resolving (to show "Usuário Removido"). Instead, `deleted_at` is a plain nullable timestamp column with no query-scoping behavior attached, set manually by the `DeleteUser` service.

**Unique-constraint-safe PII scrubbing:** `users.email` and `companies.email`/`phone` are `unique()` and non-nullable, so scrubbing to a shared constant (e.g. `"deleted@example.com"`) would collide on the second deletion ever. Used deterministic per-row placeholders instead: `deleted-user-{id}@temperinho.invalid` / `empresa-removida-{id}@temperinho.invalid` / `removido-{id}`. The `.invalid` TLD is IANA-reserved specifically for guaranteed-non-deliverable addresses.

**Existing endpoint reuse for LGPD deletion:** `DELETE /api/users/{user}` and its policy (`UserPolicy::delete()`, already allowing `$authUser->id === $targetUser->id`) already existed and were already wired for self-service — only the underlying `DeleteUser` service did the wrong thing (hard delete). No new route was needed; this also means admin-initiated user deletion gets the same safer anonymization behavior automatically, for free.

**Monitoring privacy posture:** Sentry configured with `send_default_pii: false` / `sendDefaultPii: false` explicitly on every app (API, front, admin), no session replay integration enabled, and an `ignore_exceptions` list filtering out expected 401/403/422/404 responses so normal user errors don't consume Sentry quota or transmit validation payloads. Plausible chosen specifically because it's cookieless and collects no personal data, so it does not need to go through the existing CookieYes consent flow the way Google AdSense does.

**`CompanyPolicy::create()` investigation (Phase 5):** confirmed as a real, launch-relevant bug, not a deliberate manual-sales restriction — traced the full path (`CompanyForm` → `createCompany()` → `StoreCompanyRequest::authorize()` → `CompanyPolicy::create()`) and confirmed `CreateCompany` already derives `user_id` from the authenticated request, not client input, so the only blocker was the policy's `isInternal()` check. Fixed by removing that one condition, leaving the "can't own two companies" guard intact.

**Verification boundary (Phase 5):** PHP 8.3 CLI was installed in the assistant's sandbox specifically to run `php -l` (syntax lint) against the Phase 5 PHP files. This is real but limited — it validates syntax only, not autoloading (no `composer install`, Packagist isn't network-reachable from the sandbox) or runtime behavior (no DB). No PHPUnit test, in any phase, was ever executed by the assistant; no TypeScript file, in any phase, was ever compiled or type-checked by the assistant. All of that remains the developer's responsibility — see the verification steps in Part 4.

---

## PART 3 — COMPLETE CODE, ALL PHASES

### PHASE 1 — Core defect fixes (auth, plan limits, post authorship)

#### Backend — Laravel

**`apps/api/app/Http/Middleware/CheckPlanLimit.php`** — replace the body from `$limit = 0;` through the final count check:

```php
        $limitFields = [
            'post' => ['limit' => $plan->max_posts, 'model' => Post::class],
            'recipe' => ['limit' => $plan->max_recipes, 'model' => Recipe::class],
        ];

        if (!isset($limitFields[$contentType])) {
            return response()->json(['message' => 'Tipo de conteúdo inválido para verificação de limite.'], 500);
        }

        ['limit' => $limit, 'model' => $model] = $limitFields[$contentType];

        if ($limit === null) {
            return $next($request); // null = plano sem limite
        }

        $currentCount = $model::where('company_id', $company->id)
            ->where('created_at', '>=', now()->subMonth())
            ->count();

        if ($currentCount >= $limit) {
            return response()->json([
                'message' => "Você atingiu o limite mensal de {$contentType}s do seu plano."
            ], 403);
        }

        return $next($request);
```

**`apps/api/app/Policies/PostPolicy.php`** — replace `create()`:

```php
    public function create(User $user): bool
    {
        if ($user->isInternal()) {
            return true;
        }

        return $user->company?->subscriptions()->whereIsActive()->exists() ?? false;
    }
```

**`apps/api/app/Http/Requests/Post/StorePostRequest.php`** — add import and method:

```php
use Illuminate\Auth\Access\AuthorizationException;

// ...inside the class, after authorize()

    protected function failedAuthorization(): void
    {
        throw new AuthorizationException('Apenas a equipe interna e empresas com um plano ativo podem publicar artigos.');
    }
```

#### Frontend — new shared auth helper

**`apps/front/src/lib/api/serverApi.ts`** (new):

```typescript
import axios, { AxiosInstance } from "axios";
import { cookies } from "next/headers";

export async function createAuthenticatedServerApi(): Promise<AxiosInstance> {
  const cookieStore = await cookies();
  const token = cookieStore.get("AUTH_TOKEN")?.value;

  return axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
      "X-Requested-With": "XMLHttpRequest",
      Accept: "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
}
```

#### Frontend — server action files (full rewrites)

**`apps/front/src/lib/api/interactions.server.ts`** (full rewrite):

```typescript
"use server";

import { createAuthenticatedServerApi } from "./serverApi";
import { Comment, Rating } from "@/types/actions";
import { InteractableType } from "./interactions";
import axios from "axios";

export async function createComment(
  type: InteractableType,
  id: number,
  content: string,
): Promise<Comment> {
  const api = await createAuthenticatedServerApi();
  const response = await api.post<{ data: Comment }>(
    `/${type}/${id}/comments`,
    { content },
  );
  return response.data.data;
}

export async function updateComment(
  commentId: number,
  content: string,
): Promise<Comment> {
  const api = await createAuthenticatedServerApi();
  const response = await api.put<{ data: Comment }>(`/comments/${commentId}`, {
    content,
  });
  return response.data.data;
}

export async function deleteComment(commentId: number): Promise<void> {
  const api = await createAuthenticatedServerApi();
  await api.delete(`/comments/${commentId}`);
}

export async function createOrUpdateRating(
  type: InteractableType,
  id: number,
  rating: number,
): Promise<Rating> {
  const api = await createAuthenticatedServerApi();
  const response = await api.post<{ data: Rating }>(`/${type}/${id}/ratings`, {
    rating,
  });
  return response.data.data;
}

export async function getUserRating(
  type: InteractableType,
  id: number,
): Promise<Rating | null> {
  const api = await createAuthenticatedServerApi();
  try {
    const response = await api.get<{ data: Rating }>(`/${type}/${id}/rating`);
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404)
      return null;
    throw error;
  }
}

export async function updateRating(
  ratingId: number,
  rating: number,
): Promise<Rating> {
  const api = await createAuthenticatedServerApi();
  const response = await api.put<{ data: Rating }>(`/ratings/${ratingId}`, {
    rating,
  });
  return response.data.data;
}

export async function deleteRating(ratingId: number): Promise<void> {
  const api = await createAuthenticatedServerApi();
  await api.delete(`/ratings/${ratingId}`);
}
```

**`apps/front/src/lib/api/user.server.ts`** (full rewrite — absorbs `toggleFavoriteRecipe`/`toggleFavoritePost`/`updateUserProfile` from the deleted `user.ts`; `deleteAccount` added later in Phase 4):

```typescript
"use server";

import { createAuthenticatedServerApi } from "./serverApi";
import type { User } from "@/types/user";

interface ToggleFavoriteResponse {
  attached: number[];
  detached: number[];
}

export async function getAuthenticatedUserProfile(): Promise<User> {
  const api = await createAuthenticatedServerApi();
  const response = await api.get("/users/me");
  return response.data.data;
}

export async function toggleFavoriteRecipe(
  recipeId: number,
): Promise<ToggleFavoriteResponse> {
  const api = await createAuthenticatedServerApi();
  const response = await api.post<ToggleFavoriteResponse>(
    "/users/favorites/recipes",
    { recipe_id: recipeId },
  );
  return response.data;
}

export async function toggleFavoritePost(
  postId: number,
): Promise<ToggleFavoriteResponse> {
  const api = await createAuthenticatedServerApi();
  const response = await api.post<ToggleFavoriteResponse>(
    "/users/favorites/posts",
    { post_id: postId },
  );
  return response.data;
}

export async function updateUserProfile(
  userId: number,
  data: FormData,
): Promise<User> {
  data.append("_method", "PUT");
  const api = await createAuthenticatedServerApi();
  const response = await api.post<{ data: User }>(`/users/${userId}`, data);
  return response.data.data;
}

export async function deleteAccount(userId: number): Promise<void> {
  const api = await createAuthenticatedServerApi();
  await api.delete(`/users/${userId}`);
}
```

**`apps/front/src/lib/api/blog.server.ts`** — replace the top block (old `axios`/`cookies` imports + inline helper) with:

```typescript
"use server";

import { createAuthenticatedServerApi } from "./serverApi";
import type { PaginatedResponse } from "@/types/api";
import type { Post } from "@/types/blog";
```

...append at end of file:

```typescript
export async function createPost(data: FormData): Promise<Post> {
  const api = await createAuthenticatedServerApi();
  const response = await api.post<{ data: Post }>("/posts", data);
  return response.data.data;
}

export async function updatePost(id: number, data: FormData): Promise<Post> {
  data.append("_method", "PUT");
  const api = await createAuthenticatedServerApi();
  const response = await api.post<{ data: Post }>(`/posts/${id}`, data);
  return response.data.data;
}

export async function deletePost(id: number): Promise<void> {
  const api = await createAuthenticatedServerApi();
  await api.delete(`/posts/${id}`);
}
```

**`apps/front/src/lib/api/recipe.server.ts`** — replace the top block with:

```typescript
"use server";

import { createAuthenticatedServerApi } from "./serverApi";
import type { PaginatedResponse } from "@/types/api";
import type { Recipe } from "@/types/recipe";
```

...append at end of file:

```typescript
export async function createRecipe(data: FormData): Promise<Recipe> {
  const api = await createAuthenticatedServerApi();
  const response = await api.post<{ data: Recipe }>("/recipes", data);
  return response.data.data;
}

export async function updateRecipe(
  id: number,
  data: FormData,
): Promise<Recipe> {
  data.append("_method", "PUT");
  const api = await createAuthenticatedServerApi();
  const response = await api.post<{ data: Recipe }>(`/recipes/${id}`, data);
  return response.data.data;
}

export async function deleteRecipe(id: number): Promise<void> {
  const api = await createAuthenticatedServerApi();
  await api.delete(`/recipes/${id}`);
}
```

**`apps/front/src/lib/api/company.server.ts`** — replace the top block with (keep `axios` import, still used by `isAxiosError` below):

```typescript
"use server";

import axios from "axios";
import { createAuthenticatedServerApi } from "./serverApi";
import type { Company } from "@/types/company";
```

...append at end of file:

```typescript
export async function getCompany(id: number): Promise<Company> {
  const api = await createAuthenticatedServerApi();
  const response = await api.get<{ data: Company }>(`/companies/${id}`);
  return response.data.data;
}

export async function createCompany(data: FormData): Promise<Company> {
  const api = await createAuthenticatedServerApi();
  const response = await api.post<{ data: Company }>("/companies", data);
  return response.data.data;
}

export async function updateCompany(
  id: number,
  data: FormData,
): Promise<Company> {
  data.append("_method", "PUT");
  const api = await createAuthenticatedServerApi();
  const response = await api.post<{ data: Company }>(`/companies/${id}`, data);
  return response.data.data;
}

export async function deleteCompany(id: number): Promise<void> {
  const api = await createAuthenticatedServerApi();
  await api.delete(`/companies/${id}`);
}
```

#### Frontend — client files, mutations removed

**`apps/front/src/lib/api/blog.ts`** — delete this block (moved to `blog.server.ts`):

```typescript
export async function createPost(data: FormData): Promise<Post> {
  const response = await axiosClient.post<{ data: Post }>("/posts", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data.data;
}

export async function updatePost(id: number, data: FormData): Promise<Post> {
  data.append("_method", "PUT");

  const response = await axiosClient.post<{ data: Post }>(
    `/posts/${id}`,
    data,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );
  return response.data.data;
}

export async function deletePost(id: number): Promise<void> {
  await axiosClient.delete(`/posts/${id}`);
}
```

**`apps/front/src/lib/api/recipe.ts`** — delete this block (moved to `recipe.server.ts`):

```typescript
export async function createRecipe(data: FormData): Promise<Recipe> {
  const response = await axiosClient.post<{ data: Recipe }>("/recipes", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data.data;
}

export async function updateRecipe(
  id: number,
  data: FormData,
): Promise<Recipe> {
  data.append("_method", "PUT");
  const response = await axiosClient.post<{ data: Recipe }>(
    `/recipes/${id}`,
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return response.data.data;
}

export async function deleteRecipe(id: number): Promise<void> {
  await axiosClient.delete(`/recipes/${id}`);
}
```

**`apps/front/src/lib/api/user.ts`** — delete entire file (all 3 original exports moved to `user.server.ts`).
**`apps/front/src/lib/api/company.ts`** — delete entire file (all 4 exports moved to `company.server.ts`).

#### Frontend — auth lifecycle

**`apps/front/src/app/actions/auth.ts`** — add import and append new export:

```typescript
import axios from "axios";
```

...append at end of file:

```typescript
export async function logoutUser(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (token) {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
    } catch (error) {
      console.error("Falha ao invalidar token no servidor.", error);
    }
  }

  cookieStore.delete(COOKIE_NAME);
}
```

**`apps/front/src/context/AuthContext.tsx`**:

```typescript
// replace
import { setAuthToken, removeAuthToken } from "@/app/actions/auth";
// with
import { setAuthToken, logoutUser } from "@/app/actions/auth";
import { getAuthenticatedUserProfile } from "@/lib/api/user.server";

// remove entirely (no longer used in this file)
import axiosClient from "@/lib/axios";

// replace fetchUser body
const fetchUser = useCallback(async () => {
  try {
    const authenticatedUser = await getAuthenticatedUserProfile();
    setUser(authenticatedUser);
  } catch (error) {
    console.error("Falha ao buscar usuário autenticado.", error);
    setUser(null);
  } finally {
    setLoading(false);
  }
}, []);

// replace logout body
const logout = useCallback(async () => {
  await logoutUser();
  setUser(null);
}, []);
```

`login`/`register` needed no conversion — `/auth/login` and `/users` (register) are public endpoints, so the original client-side `axiosClient` calls to them already worked. Only the post-login `fetchUser()` call and `logout()` were broken.

#### Frontend — import path updates only (functions unchanged, just relocated)

| File                                          | Old import                                                    | New import                                                                                                                        |
| --------------------------------------------- | ------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `components/company/CompanyForm.tsx`          | `{ createCompany, updateCompany } from '@/lib/api/company'`   | `from '@/lib/api/company.server'`                                                                                                 |
| `components/company/CompanyView.tsx`          | `{ deleteCompany } from '@/lib/api/company'`                  | `from '@/lib/api/company.server'`                                                                                                 |
| `components/blog/ArticleForm.tsx`             | `createPost, updatePost` in the `@/lib/api/blog` import block | move those two names to a new `from '@/lib/api/blog.server'` import; leave `getPostCategories, getPostTopics` on `@/lib/api/blog` |
| `components/blog/UserArticleCard.tsx`         | `{ deletePost } from '@/lib/api/blog'`                        | `from '@/lib/api/blog.server'`                                                                                                    |
| `components/recipe/forms/RecipeForm.tsx`      | `{ createRecipe, updateRecipe } from '@/lib/api/recipe'`      | `from '@/lib/api/recipe.server'`                                                                                                  |
| `components/recipe/UserRecipeCard.tsx`        | `{ deleteRecipe } from '@/lib/api/recipe'`                    | `from '@/lib/api/recipe.server'`                                                                                                  |
| `components/user-profile/UserProfileForm.tsx` | `{ updateUserProfile } from '@/lib/api/user'`                 | `from '@/lib/api/user.server'`                                                                                                    |
| `components/blog/PostActions.tsx`             | `{ toggleFavoritePost } from '@/lib/api/user'`                | `from '@/lib/api/user.server'`                                                                                                    |
| `components/blog/FavoriteArticleCard.tsx`     | `{ toggleFavoritePost } from '@/lib/api/user'`                | `from '@/lib/api/user.server'`                                                                                                    |
| `components/recipe/FavoriteRecipeCard.tsx`    | `{ toggleFavoriteRecipe } from '@/lib/api/user'`              | `from '@/lib/api/user.server'`                                                                                                    |
| `components/recipe/RecipeHeader.tsx`          | `{ toggleFavoriteRecipe } from '@/lib/api/user'`              | `from '@/lib/api/user.server'`                                                                                                    |
| `components/recipe/RecipeCard.tsx`            | `{ toggleFavoriteRecipe } from '@/lib/api/user'`              | `from '@/lib/api/user.server'`                                                                                                    |

`CommentForm.tsx`, `CommentList.tsx`, `BlogPostHeader.tsx`, and the rating logic in `RecipeHeader.tsx` already imported from `interactions.server` — no path change needed there.

---

### PHASE 2 — Sponsorship approval workflow

#### Backend — migration, model, policy

**`apps/api/database/migrations/2026_10_08_000001_add_status_to_posts_table.php`** (new):

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->string('status')->default('published')->after('company_id');
            $table->text('rejection_reason')->nullable()->after('status');
        });
    }

    public function down(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->dropColumn(['status', 'rejection_reason']);
        });
    }
};
```

**`apps/api/app/Models/Post.php`** — add constants, fillable, searchable/filterable fields:

```php
class Post extends Model
{
    use HasFactory, Searchable, HasStandardSearch;

    public const VALID_SORT_COLUMNS = ['title', 'created_at'];

    public const STATUS_PENDING = 'pending';
    public const STATUS_PUBLISHED = 'published';
    public const STATUS_REJECTED = 'rejected';

    protected $fillable = [
        'title',
        'summary',
        'content',
        'category_id',
        'user_id',
        'company_id',
        'status',
        'rejection_reason',
    ];

    // in toSearchableArray(), add alongside the other fields:
            'status' => $this->status,

    // filterableAttributes():
    public function filterableAttributes(): array
    {
        return ['category_id', 'user_id', 'status'];
    }
```

**`apps/api/app/Services/Post/CreatePost.php`** — inside the `DB::transaction` closure, replace the two data-assignment lines:

```php
                $data['user_id'] = $user->id;
                $data['company_id'] = $user->company ? $user->company->id : null;
                $data['status'] = $data['company_id'] ? Post::STATUS_PENDING : Post::STATUS_PUBLISHED;
```

**`apps/api/app/Services/Concerns/BaseListService.php`** — add overridable hook:

```php
    protected function applyBaseScope($query)
    {
        return $query;
    }

// call it in traditionalQuery(), right after $query->filter($filters);

        $query->filter($filters);
        $query = $this->applyBaseScope($query);
```

**`apps/api/app/Services/Post/ListPost.php`** — add these two overrides (replacing the existing no-op `getCustomSearchFilters`):

```php
    protected function applyBaseScope($query)
    {
        $user = auth('sanctum')->user();

        if ($user && $user->isInternal()) {
            return $query;
        }

        return $query->where('status', Post::STATUS_PUBLISHED);
    }

    protected function getCustomSearchFilters(array $filters): array
    {
        $user = auth('sanctum')->user();

        if ($user && $user->isInternal()) {
            return [];
        }

        return ['status = "' . Post::STATUS_PUBLISHED . '"'];
    }
```

`ListUserPosts` (the sponsor's own `/posts/my` list) is a separate service — untouched, so sponsors still see their own pending/rejected posts.

**`apps/api/app/Policies/PostPolicy.php`** — replace `view()`, add `approve()`/`reject()`:

```php
use App\Enum\RolesEnum;

    public function view(?User $user, Post $post): bool
    {
        if ($post->status === Post::STATUS_PUBLISHED) {
            return true;
        }

        if (!$user) {
            return false;
        }

        return $user->isInternal() || $user->id === $post->user_id;
    }

    public function approve(User $user, Post $post): bool
    {
        return $user->role === RolesEnum::ADMIN;
    }

    public function reject(User $user, Post $post): bool
    {
        return $user->role === RolesEnum::ADMIN;
    }
```

**`apps/api/app/Http/Resources/Post/PostResource.php`** — add inside `toArray()`:

```php
            'status' => $this->status,
            'rejection_reason' => $this->rejection_reason,
```

**`apps/api/app/Http/Resources/Post/PostCollectionResource.php`** — add inside `toArray()`:

```php
            'status' => $this->status,
            'rejection_reason' => $this->rejection_reason,
```

#### Backend — approve/reject endpoints

**`apps/api/app/Http/Requests/Post/RejectPostRequest.php`** (new):

```php
<?php

namespace App\Http\Requests\Post;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Route;

class RejectPostRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Gate::allows('reject', Route::current()->parameter('post'));
    }

    public function rules(): array
    {
        return [
            'reason' => 'required|string|max:1000',
        ];
    }
}
```

**`apps/api/app/Services/Post/ApprovePost.php`** (new):

```php
<?php

namespace App\Services\Post;

use App\Models\Post;
use App\Notifications\PostApproved;

class ApprovePost
{
    public function approve(Post $post): Post
    {
        $post->update([
            'status' => Post::STATUS_PUBLISHED,
            'rejection_reason' => null,
        ]);

        $post->user->notify(new PostApproved($post));

        return $post;
    }
}
```

**`apps/api/app/Services/Post/RejectPost.php`** (new):

```php
<?php

namespace App\Services\Post;

use App\Models\Post;
use App\Notifications\PostRejected;

class RejectPost
{
    public function reject(Post $post, string $reason): Post
    {
        $post->update([
            'status' => Post::STATUS_REJECTED,
            'rejection_reason' => $reason,
        ]);

        $post->user->notify(new PostRejected($post));

        return $post;
    }
}
```

**`apps/api/app/Http/Controllers/PostController.php`** — add imports and methods:

```php
use App\Http\Requests\Post\RejectPostRequest;
use App\Services\Post\ApprovePost;
use App\Services\Post\RejectPost;

    public function approve(Post $post, ApprovePost $service): PostResource
    {
        $this->authorize('approve', $post);

        $approvedPost = $service->approve($post);
        $approvedPost->load(['user.image', 'category', 'topics', 'image']);

        return new PostResource($approvedPost);
    }

    public function reject(RejectPostRequest $request, Post $post, RejectPost $service): PostResource
    {
        $rejectedPost = $service->reject($post, $request->validated('reason'));
        $rejectedPost->load(['user.image', 'category', 'topics', 'image']);

        return new PostResource($rejectedPost);
    }
```

**`apps/api/routes/api.php`** — add right before `Route::apiResource('posts', PostController::class)->except(['index', 'show', 'store']);`:

```php
    Route::patch('/posts/{post}/approve', [PostController::class, 'approve']);
    Route::patch('/posts/{post}/reject', [PostController::class, 'reject']);
```

**`apps/api/app/Notifications/PostApproved.php`** (new):

```php
<?php

namespace App\Notifications;

use App\Models\Post;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PostApproved extends Notification implements ShouldQueue
{
    use Queueable;

    protected $post;

    public function __construct(Post $post)
    {
        $this->post = $post;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Seu artigo foi aprovado!')
            ->view('emails.post_approved', ['post' => $this->post]);
    }
}
```

**`apps/api/app/Notifications/PostRejected.php`** (new):

```php
<?php

namespace App\Notifications;

use App\Models\Post;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PostRejected extends Notification implements ShouldQueue
{
    use Queueable;

    protected $post;

    public function __construct(Post $post)
    {
        $this->post = $post;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Seu artigo precisa de ajustes')
            ->view('emails.post_rejected', ['post' => $this->post]);
    }
}
```

**`apps/api/resources/views/emails/post_approved.blade.php`** (new):

```blade
@component('mail::message')
# Boas notícias, {{ $post->user->name }}!

Seu artigo **"{{ $post->title }}"** foi aprovado e já está publicado no {{ config('app.name') }}.

@component('mail::button', ['url' => url('/usuario/artigos')])
Ver meus artigos
@endcomponent

Atenciosamente,<br>
{{ config('app.name') }}
@endcomponent
```

**`apps/api/resources/views/emails/post_rejected.blade.php`** (new):

```blade
@component('mail::message')
# Olá, {{ $post->user->name }}!

Seu artigo **"{{ $post->title }}"** não foi aprovado para publicação.

**Motivo:**
{{ $post->rejection_reason }}

Você pode ajustar o conteúdo e enviar novamente para revisão.

@component('mail::button', ['url' => url('/usuario/artigos')])
Ver meus artigos
@endcomponent

Atenciosamente,<br>
{{ config('app.name') }}
@endcomponent
```

#### Backend — tests

**`apps/api/tests/Feature/Post/PostTestSetup.php`** (full rewrite — adds `$internal` + a sponsor-with-active-plan helper):

```php
<?php

namespace Tests\Feature\Post;

use App\Enum\RolesEnum;
use App\Models\Company;
use App\Models\Plan;
use App\Models\PostCategory;
use App\Models\PostTopic;
use App\Models\Subscription;
use App\Models\User;
use Illuminate\Support\Facades\Storage;

trait PostTestSetup
{
    protected User $user;
    protected User $admin;
    protected User $internal;
    protected PostCategory $category;
    protected PostTopic $topic;

    public function setUp(): void
    {
        parent::setUp();
        Storage::fake('s3');

        $this->user = User::factory()->create(['role' => RolesEnum::CUSTOMER]);
        $this->admin = User::factory()->create(['role' => RolesEnum::ADMIN]);
        $this->internal = User::factory()->create(['role' => RolesEnum::INTERNAL]);
        $this->category = PostCategory::factory()->create();
        $this->topic = PostTopic::factory()->create();
    }

    protected function createSponsorWithActivePlan(): User
    {
        $user = User::factory()->create(['role' => RolesEnum::CUSTOMER]);
        $company = Company::factory()->create(['user_id' => $user->id]);
        $plan = Plan::factory()->create(['max_posts' => null]);

        Subscription::factory()->create([
            'company_id' => $company->id,
            'plan_id' => $plan->id,
            'status' => 'active',
            'ends_at' => now()->addMonth(),
        ]);

        return $user;
    }
}
```

**`apps/api/tests/Feature/Post/PostStoreTest.php`** (full rewrite):

```php
<?php

namespace Tests\Feature\Post;

use App\Models\Post;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;
use PHPUnit\Framework\Attributes\Test;

class PostStoreTest extends TestCase
{
    use RefreshDatabase, PostTestSetup;

    protected function validPostData(): array
    {
        return [
            'title' => 'Meu Primeiro Post',
            'summary' => 'Este é o resumo.',
            'content' => 'Conteúdo completo e detalhado do post.',
            'category_id' => $this->category->id,
            'topics' => [$this->topic->id],
            'image' => UploadedFile::fake()->create('post-image.jpg', 100),
        ];
    }

    #[Test]
    public function internal_team_member_can_create_a_post_and_it_is_published_immediately()
    {
        Sanctum::actingAs($this->internal);

        $this->postJson('/api/posts', $this->validPostData())
            ->assertStatus(201)
            ->assertJsonPath('data.status', Post::STATUS_PUBLISHED);

        $this->assertDatabaseHas('posts', [
            'title' => 'Meu Primeiro Post',
            'status' => Post::STATUS_PUBLISHED,
            'company_id' => null,
        ]);
    }

    #[Test]
    public function sponsor_with_active_subscription_can_create_a_post_and_it_is_pending_review()
    {
        Sanctum::actingAs($this->createSponsorWithActivePlan());

        $this->postJson('/api/posts', $this->validPostData())
            ->assertStatus(201)
            ->assertJsonPath('data.status', Post::STATUS_PENDING);

        $this->assertDatabaseHas('posts', [
            'title' => 'Meu Primeiro Post',
            'status' => Post::STATUS_PENDING,
        ]);
    }

    #[Test]
    public function regular_customer_without_a_company_cannot_create_a_post()
    {
        Sanctum::actingAs($this->user);

        $this->postJson('/api/posts', $this->validPostData())->assertForbidden();

        $this->assertDatabaseMissing('posts', ['title' => 'Meu Primeiro Post']);
    }

    #[Test]
    public function unauthenticated_user_cannot_create_a_post()
    {
        $this->postJson('/api/posts', [
            'title' => 'Post Fantasma',
            'summary' => 's',
            'content' => 'c',
            'category_id' => $this->category->id,
            'topics' => [$this->topic->id],
            'image' => UploadedFile::fake()->create('i.jpg'),
        ])->assertUnauthorized();
    }

    #[Test]
    public function store_post_request_is_validated()
    {
        Sanctum::actingAs($this->internal);

        $this->postJson('/api/posts', [])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['title', 'summary', 'content', 'category_id', 'topics', 'image']);
    }
}
```

**`apps/api/tests/Feature/Post/PostApprovalTest.php`** (new):

```php
<?php

namespace Tests\Feature\Post;

use App\Models\Post;
use App\Notifications\PostApproved;
use App\Notifications\PostRejected;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;
use PHPUnit\Framework\Attributes\Test;

class PostApprovalTest extends TestCase
{
    use RefreshDatabase, PostTestSetup;

    protected function pendingPostFor($sponsor): Post
    {
        return Post::factory()->for($this->category, 'category')->create([
            'user_id' => $sponsor->id,
            'company_id' => $sponsor->company->id,
            'status' => Post::STATUS_PENDING,
        ]);
    }

    #[Test]
    public function admin_can_approve_a_pending_post()
    {
        Notification::fake();
        $sponsor = $this->createSponsorWithActivePlan();
        $post = $this->pendingPostFor($sponsor);

        Sanctum::actingAs($this->admin);

        $this->patchJson("/api/posts/{$post->id}/approve")
            ->assertOk()
            ->assertJsonPath('data.status', Post::STATUS_PUBLISHED);

        $this->assertDatabaseHas('posts', ['id' => $post->id, 'status' => Post::STATUS_PUBLISHED]);
        Notification::assertSentTo($sponsor, PostApproved::class);
    }

    #[Test]
    public function admin_can_reject_a_pending_post_with_a_reason()
    {
        Notification::fake();
        $sponsor = $this->createSponsorWithActivePlan();
        $post = $this->pendingPostFor($sponsor);

        Sanctum::actingAs($this->admin);

        $this->patchJson("/api/posts/{$post->id}/reject", ['reason' => 'Imagem em baixa resolução.'])
            ->assertOk()
            ->assertJsonPath('data.status', Post::STATUS_REJECTED);

        $this->assertDatabaseHas('posts', [
            'id' => $post->id,
            'status' => Post::STATUS_REJECTED,
            'rejection_reason' => 'Imagem em baixa resolução.',
        ]);
        Notification::assertSentTo($sponsor, PostRejected::class);
    }

    #[Test]
    public function reject_requires_a_reason()
    {
        $sponsor = $this->createSponsorWithActivePlan();
        $post = $this->pendingPostFor($sponsor);

        Sanctum::actingAs($this->admin);

        $this->patchJson("/api/posts/{$post->id}/reject", [])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['reason']);
    }

    #[Test]
    public function non_admin_cannot_approve_a_post()
    {
        $sponsor = $this->createSponsorWithActivePlan();
        $post = $this->pendingPostFor($sponsor);

        Sanctum::actingAs($this->internal);

        $this->patchJson("/api/posts/{$post->id}/approve")->assertForbidden();
    }

    #[Test]
    public function pending_posts_are_excluded_from_the_public_listing_and_show()
    {
        $sponsor = $this->createSponsorWithActivePlan();
        $post = $this->pendingPostFor($sponsor);

        $this->getJson('/api/posts')->assertJsonMissing(['id' => $post->id]);
        $this->getJson("/api/posts/{$post->id}")->assertForbidden();
    }

    #[Test]
    public function sponsor_can_still_view_their_own_pending_post()
    {
        $sponsor = $this->createSponsorWithActivePlan();
        $post = $this->pendingPostFor($sponsor);

        Sanctum::actingAs($sponsor);

        $this->getJson("/api/posts/{$post->id}")->assertOk();
    }
}
```

#### Admin — approval queue

**`apps/admin/src/lib/types/post.ts`** — add to `PostBase`:

```typescript
  status: 'pending' | 'published' | 'rejected';
  rejection_reason?: string | null;
```

**`apps/admin/src/lib/api/posts.ts`** (new):

```typescript
import { FetchParams, PaginatedResponse } from "../types/api";
import { apiClient } from "./client";
import { Post } from "@/lib/types/post";

export async function getPosts(
  token: string,
  params: FetchParams,
): Promise<PaginatedResponse<Post>> {
  const response = await apiClient.get("/posts", {
    headers: { Authorization: `Bearer ${token}` },
    params: {
      page: params.pageIndex + 1,
      per_page: params.pageSize,
      order_by: params.sorting[0]
        ? `${params.sorting[0].id},${params.sorting[0].desc ? "desc" : "asc"}`
        : "created_at,desc",
      search: params.searchTerm,
    },
  });
  return response.data;
}

export async function approvePost(id: number, token: string): Promise<Post> {
  const response = await apiClient.patch(`/posts/${id}/approve`, null, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.data;
}

export async function rejectPost(
  id: number,
  reason: string,
  token: string,
): Promise<Post> {
  const response = await apiClient.patch(
    `/posts/${id}/reject`,
    { reason },
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  return response.data.data;
}
```

**`apps/admin/src/lib/actions/posts.ts`** (new):

```typescript
"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { getPosts, approvePost, rejectPost } from "@/lib/api/posts";
import { ActionState, FetchParams, PaginatedResponse } from "../types/api";
import { Post } from "../types/post";

async function getToken() {
  const cookieStore = await cookies();
  return cookieStore.get("session_token")?.value;
}

export async function getPostsAction(
  params: FetchParams,
): Promise<PaginatedResponse<Post>> {
  const token = await getToken();
  if (!token) throw new Error("Não autorizado");
  return getPosts(token, params);
}

export async function approvePostAction(id: number): Promise<ActionState> {
  const token = await getToken();
  if (!token) return { message: "Não autorizado", success: false };

  try {
    await approvePost(id, token);
    revalidatePath("/dashboard/posts");
    return { message: "Artigo aprovado e publicado.", success: true };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Falha ao aprovar artigo.";
    return { message, success: false };
  }
}

export async function rejectPostAction(
  id: number,
  reason: string,
): Promise<ActionState> {
  const token = await getToken();
  if (!token) return { message: "Não autorizado", success: false };

  try {
    await rejectPost(id, reason, token);
    revalidatePath("/dashboard/posts");
    return { message: "Artigo rejeitado.", success: true };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Falha ao rejeitar artigo.";
    return { message, success: false };
  }
}
```

**`apps/admin/src/app/dashboard/posts/page.tsx`** (new):

```typescript
"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Toaster, toast } from "sonner";
import { CheckCircle, XCircle } from "lucide-react";
import { EntityPage } from "@/components/shared/entityPage";
import { DataTable, DataTableColumnHeader } from "@/components/shared/dataTable/dataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDataTable } from "@/hooks/useDataTable";
import { getPostsAction, approvePostAction, rejectPostAction } from "@/lib/actions/posts";
import { Post } from "@/lib/types/post";

const statusVariant: Record<Post["status"], "secondary" | "default" | "destructive"> = {
  pending: "secondary",
  published: "default",
  rejected: "destructive",
};

const statusLabel: Record<Post["status"], string> = {
  pending: "Pendente",
  published: "Publicado",
  rejected: "Rejeitado",
};

export default function PostsPage() {
  const { data, pageCount, isLoading, tableState, tableHandlers, refetch } =
    useDataTable<Post>({ fetchData: getPostsAction, pageSize: 10 });

  const [rejectTarget, setRejectTarget] = useState<Post | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleApprove = async (post: Post) => {
    const result = await approvePostAction(post.id);
    if (result.success) {
      toast.success(result.message);
      refetch();
    } else {
      toast.error(result.message);
    }
  };

  const handleReject = async () => {
    if (!rejectTarget || !rejectReason.trim()) return;
    setIsSubmitting(true);
    const result = await rejectPostAction(rejectTarget.id, rejectReason);
    setIsSubmitting(false);
    if (result.success) {
      toast.success(result.message);
      setRejectTarget(null);
      setRejectReason("");
      refetch();
    } else {
      toast.error(result.message);
    }
  };

  const columns: ColumnDef<Post>[] = [
    {
      accessorKey: "title",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Título" />,
      cell: ({ row }) => <div className="font-medium">{row.getValue("title")}</div>,
    },
    {
      accessorKey: "company_id",
      header: "Tipo",
      cell: ({ row }) => (row.original.company_id ? <Badge variant="outline">Patrocinado</Badge> : "Equipe interna"),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as Post["status"];
        return <Badge variant={statusVariant[status]}>{statusLabel[status]}</Badge>;
      },
    },
    {
      accessorKey: "created_at",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Criado em" />,
      cell: ({ row }) => new Date(row.getValue("created_at")).toLocaleDateString("pt-BR", { timeZone: "UTC" }),
    },
    {
      id: "actions",
      header: "Ações",
      cell: ({ row }) => {
        const post = row.original;
        if (post.status !== "pending") return null;
        return (
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => handleApprove(post)}>
              <CheckCircle className="mr-1 h-4 w-4" /> Aprovar
            </Button>
            <Button size="sm" variant="destructive-outline" onClick={() => setRejectTarget(post)}>
              <XCircle className="mr-1 h-4 w-4" /> Rejeitar
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <Toaster richColors position="top-right" />
      <EntityPage
        title="Artigos"
        description="Revise e aprove artigos enviados por patrocinadores."
        isLoading={isLoading}
      >
        <DataTable
          columns={columns}
          data={data}
          pageCount={pageCount}
          state={{
            pagination: tableState.pagination,
            sorting: tableState.sorting,
            globalFilter: tableState.globalFilter,
          }}
          onPaginationChange={tableHandlers.onPaginationChange}
          onSortingChange={tableHandlers.onSortingChange}
          onGlobalFilterChange={tableHandlers.onGlobalFilterChange}
          manualPagination
          manualSorting
          manualFiltering
        />
      </EntityPage>

      <Dialog open={!!rejectTarget} onOpenChange={(open) => !open && setRejectTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rejeitar artigo</DialogTitle>
            <DialogDescription>
              Explique o motivo — o patrocinador receberá isso por e-mail.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Ex: imagem em baixa resolução, conteúdo precisa de mais detalhes..."
            rows={4}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectTarget(null)}>Cancelar</Button>
            <Button variant="destructive" disabled={!rejectReason.trim() || isSubmitting} onClick={handleReject}>
              Confirmar rejeição
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
```

#### Front — sponsor label + status display

**`apps/front/src/types/blog.ts`** — add to `Post` interface:

```typescript
  status?: 'pending' | 'published' | 'rejected';
  rejection_reason?: string | null;
  company_id?: number | null;
```

**`apps/front/src/components/blog/BlogPostCard.tsx`** — replace the default-variant badge line:

```typescript
                        <Badge variant="secondary" className="w-fit mb-2">{post.category?.name ?? 'Sem Categoria'}</Badge>
// with
                        <div className="flex items-center gap-2 mb-2">
                            <Badge variant="secondary" className="w-fit">{post.category?.name ?? 'Sem Categoria'}</Badge>
                            {post.company_id && <Badge variant="outline" className="w-fit">Patrocinado</Badge>}
                        </div>
```

**`apps/front/src/components/blog/UserArticleCard.tsx`** — replace the title/category badge row:

```typescript
                        <div className="flex items-center flex-wrap gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-foreground">{article.title}</h3>
                            {article.category && (
                                <Badge variant="secondary">{article.category.name}</Badge>
                            )}
                        </div>
// with
                        <div className="flex items-center flex-wrap gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-foreground">{article.title}</h3>
                            {article.category && (
                                <Badge variant="secondary">{article.category.name}</Badge>
                            )}
                            {article.status === 'pending' && <Badge variant="secondary">Em análise</Badge>}
                            {article.status === 'rejected' && <Badge variant="destructive">Rejeitado</Badge>}
                        </div>
// add right after that block, before the stats row
                        {article.status === 'rejected' && article.rejection_reason && (
                            <p className="text-sm text-destructive mb-3">
                                <strong>Motivo:</strong> {article.rejection_reason}
                            </p>
                        )}
```

(Later, in Phase 5, `BlogPostHeader.tsx` — the single-article view — also got a "Patrocinado" badge; see Phase 5 below.)

---

### PHASE 3 — Trust & safety: reporting

#### Backend — reports table, model, policy

**`apps/api/database/migrations/2026_10_08_000002_create_reports_table.php`** (new):

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->morphs('reportable');
            $table->string('reason');
            $table->text('comment')->nullable();
            $table->string('status')->default('pending');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reports');
    }
};
```

**`apps/api/app/Models/Report.php`** (new):

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Report extends Model
{
    use HasFactory;

    public const STATUS_PENDING = 'pending';
    public const STATUS_REVIEWED = 'reviewed';

    public const REASONS = ['spam', 'inappropriate', 'misinformation', 'other'];

    public const VALID_SORT_COLUMNS = ['created_at', 'status'];

    protected $fillable = [
        'user_id',
        'reportable_id',
        'reportable_type',
        'reason',
        'comment',
        'status',
    ];

    public function scopeFilter($query, array $filters)
    {
        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }
        return $query;
    }

    public function reportable()
    {
        return $this->morphTo();
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
```

**`apps/api/database/factories/ReportFactory.php`** (new):

```php
<?php

namespace Database\Factories;

use App\Models\Comment;
use App\Models\Report;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ReportFactory extends Factory
{
    protected $model = Report::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'reportable_id' => Comment::factory(),
            'reportable_type' => Comment::class,
            'reason' => $this->faker->randomElement(Report::REASONS),
            'comment' => $this->faker->optional()->sentence(),
            'status' => Report::STATUS_PENDING,
        ];
    }
}
```

**`apps/api/app/Policies/ReportPolicy.php`** (new):

```php
<?php

namespace App\Policies;

use App\Models\Report;
use App\Models\User;

class ReportPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isInternal();
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, Report $report): bool
    {
        return $user->isInternal();
    }
}
```

**`apps/api/app/Providers/AuthServiceProvider.php`** — add to the `$policies` array:

```php
        Report::class => ReportPolicy::class,
```

#### Backend — endpoints

**`apps/api/app/Http/Requests/Report/StoreReportRequest.php`** (new):

```php
<?php

namespace App\Http\Requests\Report;

use App\Models\Report;
use Illuminate\Foundation\Http\FormRequest;

class StoreReportRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // route already requires auth:sanctum
    }

    public function rules(): array
    {
        return [
            'reason' => 'required|string|in:' . implode(',', Report::REASONS),
            'comment' => 'nullable|string|max:1000',
        ];
    }
}
```

**`apps/api/app/Http/Requests/Report/FilterReportRequest.php`** (new):

```php
<?php

namespace App\Http\Requests\Report;

use App\Http\Requests\Concerns\HasStandardFiltering;
use App\Models\Report;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;

class FilterReportRequest extends FormRequest
{
    use HasStandardFiltering;

    public function authorize(): bool
    {
        return Gate::allows('viewAny', Report::class);
    }

    public function rules(): array
    {
        return $this->getStandardFilterRules([
            'status' => 'nullable|string|in:pending,reviewed',
        ], Report::VALID_SORT_COLUMNS);
    }
}
```

**`apps/api/app/Services/Report/CreateReport.php`** (new):

```php
<?php

namespace App\Services\Report;

use App\Models\Report;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class CreateReport
{
    public function create(Model $reportable, User $user, array $data): Report
    {
        return Report::create([
            'reportable_id' => $reportable->id,
            'reportable_type' => get_class($reportable),
            'user_id' => $user->id,
            'reason' => $data['reason'],
            'comment' => $data['comment'] ?? null,
            'status' => Report::STATUS_PENDING,
        ]);
    }
}
```

**`apps/api/app/Services/Report/MarkReportReviewed.php`** (new):

```php
<?php

namespace App\Services\Report;

use App\Models\Report;

class MarkReportReviewed
{
    public function review(Report $report): Report
    {
        $report->update(['status' => Report::STATUS_REVIEWED]);

        return $report;
    }
}
```

**`apps/api/app/Services/Report/ListReports.php`** (new):

```php
<?php

namespace App\Services\Report;

use App\Models\Report;
use App\Services\Concerns\BaseListService;

class ListReports
{
    use BaseListService;

    protected function getModelClass(): string
    {
        return Report::class;
    }

    protected function getValidSortColumns(): array
    {
        return Report::VALID_SORT_COLUMNS;
    }

    protected function applySearchFilters($query, string $searchTerm, array $filters)
    {
        // Não pesquisável via scout
    }

    protected function getDefaultRelations(): array
    {
        return ['user:id,name', 'reportable'];
    }
}
```

**`apps/api/app/Http/Resources/Report/ReportResource.php`** (new):

```php
<?php

namespace App\Http\Resources\Report;

use App\Http\Resources\User\AuthorResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReportResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'reportable_type' => class_basename($this->reportable_type),
            'reportable_id' => $this->reportable_id,
            'reason' => $this->reason,
            'comment' => $this->comment,
            'status' => $this->status,
            'reporter' => new AuthorResource($this->whenLoaded('user')),
            'created_at' => $this->created_at->toIso8601String(),
        ];
    }
}
```

**`apps/api/app/Http/Resources/Report/ReportCollectionResource.php`** (new):

```php
<?php

namespace App\Http\Resources\Report;

use App\Http\Resources\User\AuthorResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReportCollectionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'reportable_type' => class_basename($this->reportable_type),
            'reportable_id' => $this->reportable_id,
            'reason' => $this->reason,
            'status' => $this->status,
            'reporter' => new AuthorResource($this->whenLoaded('user')),
            'created_at' => $this->created_at->toIso8601String(),
        ];
    }
}
```

**`apps/api/app/Http/Controllers/ReportController.php`** (new):

```php
<?php

namespace App\Http\Controllers;

use App\Http\Requests\Report\FilterReportRequest;
use App\Http\Requests\Report\StoreReportRequest;
use App\Http\Resources\Report\ReportCollectionResource;
use App\Http\Resources\Report\ReportResource;
use App\Models\Report;
use App\Services\Report\CreateReport;
use App\Services\Report\ListReports;
use App\Services\Report\MarkReportReviewed;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Str;

class ReportController extends BaseResourceController
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    protected function getFilterRequestClass(): string
    {
        return FilterReportRequest::class;
    }

    protected function getListServiceClass(): string
    {
        return ListReports::class;
    }

    protected function getCollectionResourceClass(): string
    {
        return ReportCollectionResource::class;
    }

    public function index(FilterReportRequest $request): AnonymousResourceCollection
    {
        return $this->standardIndex($request);
    }

    public function store(StoreReportRequest $request, string $type, int $reportableId, CreateReport $service): JsonResponse
    {
        $reportable = $this->resolveReportable($type, $reportableId);

        $report = $service->create($reportable, $request->user(), $request->validated());

        return (new ReportResource($report))->response()->setStatusCode(201);
    }

    public function review(Report $report, MarkReportReviewed $service): ReportResource
    {
        $this->authorize('update', $report);

        return new ReportResource($service->review($report));
    }

    protected function resolveReportable(string $type, $id)
    {
        $class = 'App\\Models\\' . Str::studly(Str::singular($type));
        abort_unless(class_exists($class), 404, "Tipo inválido: {$type}");
        return $class::findOrFail($id);
    }
}
```

**`apps/api/routes/api.php`** — add right after `Route::put('/ratings/{rating}', [RatingController::class, 'update']);`:

```php
    Route::post('/{type}/{reportableId}/reports', [ReportController::class, 'store'])
        ->whereIn('type', ['comments', 'ratings', 'recipes'])
        ->whereNumber('reportableId');
    Route::get('/reports', [ReportController::class, 'index']);
    Route::patch('/reports/{report}/review', [ReportController::class, 'review']);
```

#### Backend — tests

**`apps/api/tests/Feature/Report/ReportTest.php`** (new):

```php
<?php

namespace Tests\Feature\Report;

use App\Enum\RolesEnum;
use App\Models\Comment;
use App\Models\Rating;
use App\Models\Recipe;
use App\Models\Report;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;
use PHPUnit\Framework\Attributes\Test;

class ReportTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function authenticated_user_can_report_a_comment()
    {
        $reporter = User::factory()->create();
        $comment = Comment::factory()->create();

        Sanctum::actingAs($reporter);

        $this->postJson("/api/comments/{$comment->id}/reports", [
            'reason' => 'spam',
            'comment' => 'Isso é propaganda.',
        ])->assertStatus(201)
            ->assertJsonPath('data.status', 'pending');

        $this->assertDatabaseHas('reports', [
            'reportable_type' => Comment::class,
            'reportable_id' => $comment->id,
            'user_id' => $reporter->id,
            'reason' => 'spam',
        ]);
    }

    #[Test]
    public function authenticated_user_can_report_a_rating_and_a_recipe()
    {
        Sanctum::actingAs(User::factory()->create());

        $this->postJson('/api/ratings/' . Rating::factory()->create()->id . '/reports', ['reason' => 'other'])
            ->assertStatus(201);

        $this->postJson('/api/recipes/' . Recipe::factory()->create()->id . '/reports', ['reason' => 'misinformation'])
            ->assertStatus(201);

        $this->assertDatabaseCount('reports', 2);
    }

    #[Test]
    public function reason_must_be_a_valid_option()
    {
        $comment = Comment::factory()->create();
        Sanctum::actingAs(User::factory()->create());

        $this->postJson("/api/comments/{$comment->id}/reports", ['reason' => 'nao_existe'])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['reason']);
    }

    #[Test]
    public function unauthenticated_user_cannot_report_content()
    {
        $comment = Comment::factory()->create();

        $this->postJson("/api/comments/{$comment->id}/reports", ['reason' => 'spam'])
            ->assertUnauthorized();
    }

    #[Test]
    public function only_internal_users_can_list_reports()
    {
        Report::factory()->count(3)->create();

        Sanctum::actingAs(User::factory()->create(['role' => RolesEnum::CUSTOMER]));
        $this->getJson('/api/reports')->assertForbidden();

        Sanctum::actingAs(User::factory()->create(['role' => RolesEnum::ADMIN]));
        $this->getJson('/api/reports')->assertOk()->assertJsonCount(3, 'data');
    }

    #[Test]
    public function only_internal_users_can_mark_a_report_as_reviewed()
    {
        $report = Report::factory()->create(['status' => Report::STATUS_PENDING]);

        Sanctum::actingAs(User::factory()->create(['role' => RolesEnum::CUSTOMER]));
        $this->patchJson("/api/reports/{$report->id}/review")->assertForbidden();

        Sanctum::actingAs(User::factory()->create(['role' => RolesEnum::ADMIN]));
        $this->patchJson("/api/reports/{$report->id}/review")
            ->assertOk()
            ->assertJsonPath('data.status', Report::STATUS_REVIEWED);

        $this->assertDatabaseHas('reports', ['id' => $report->id, 'status' => Report::STATUS_REVIEWED]);
    }
}
```

#### Admin — reports queue

**`apps/admin/src/lib/types/report.ts`** (new):

```typescript
import { Author } from "./user";

export type Report = {
  id: number;
  reportable_type: string;
  reportable_id: number;
  reason: "spam" | "inappropriate" | "misinformation" | "other";
  comment?: string | null;
  status: "pending" | "reviewed";
  reporter?: Author | null;
  created_at: string;
};
```

**`apps/admin/src/lib/api/reports.ts`** (new):

```typescript
import { FetchParams, PaginatedResponse } from "../types/api";
import { apiClient } from "./client";
import { Report } from "@/lib/types/report";

export async function getReports(
  token: string,
  params: FetchParams,
): Promise<PaginatedResponse<Report>> {
  const response = await apiClient.get("/reports", {
    headers: { Authorization: `Bearer ${token}` },
    params: {
      page: params.pageIndex + 1,
      per_page: params.pageSize,
      order_by: params.sorting[0]
        ? `${params.sorting[0].id},${params.sorting[0].desc ? "desc" : "asc"}`
        : "created_at,desc",
      search: params.searchTerm,
    },
  });
  return response.data;
}

export async function reviewReport(id: number, token: string): Promise<Report> {
  const response = await apiClient.patch(`/reports/${id}/review`, null, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.data;
}
```

**`apps/admin/src/lib/actions/reports.ts`** (new):

```typescript
"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { getReports, reviewReport } from "@/lib/api/reports";
import { ActionState, FetchParams, PaginatedResponse } from "../types/api";
import { Report } from "../types/report";

async function getToken() {
  const cookieStore = await cookies();
  return cookieStore.get("session_token")?.value;
}

export async function getReportsAction(
  params: FetchParams,
): Promise<PaginatedResponse<Report>> {
  const token = await getToken();
  if (!token) throw new Error("Não autorizado");
  return getReports(token, params);
}

export async function reviewReportAction(id: number): Promise<ActionState> {
  const token = await getToken();
  if (!token) return { message: "Não autorizado", success: false };

  try {
    await reviewReport(id, token);
    revalidatePath("/dashboard/reports");
    return { message: "Denúncia marcada como revisada.", success: true };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Falha ao atualizar denúncia.";
    return { message, success: false };
  }
}
```

**`apps/admin/src/app/dashboard/reports/page.tsx`** (new):

```typescript
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Toaster, toast } from "sonner";
import { CheckCircle } from "lucide-react";
import { EntityPage } from "@/components/shared/entityPage";
import { DataTable, DataTableColumnHeader } from "@/components/shared/dataTable/dataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDataTable } from "@/hooks/useDataTable";
import { getReportsAction, reviewReportAction } from "@/lib/actions/reports";
import { Report } from "@/lib/types/report";

const reasonLabel: Record<Report["reason"], string> = {
  spam: "Spam",
  inappropriate: "Conteúdo impróprio",
  misinformation: "Informação incorreta",
  other: "Outro",
};

export default function ReportsPage() {
  const { data, pageCount, isLoading, tableState, tableHandlers, refetch } =
    useDataTable<Report>({ fetchData: getReportsAction, pageSize: 10 });

  const handleReview = async (report: Report) => {
    const result = await reviewReportAction(report.id);
    if (result.success) {
      toast.success(result.message);
      refetch();
    } else {
      toast.error(result.message);
    }
  };

  const columns: ColumnDef<Report>[] = [
    {
      accessorKey: "reportable_type",
      header: "Tipo",
      cell: ({ row }) => <Badge variant="outline">{row.original.reportable_type}</Badge>,
    },
    { accessorKey: "reportable_id", header: "ID do conteúdo" },
    {
      accessorKey: "reason",
      header: "Motivo",
      cell: ({ row }) => reasonLabel[row.original.reason],
    },
    {
      accessorKey: "comment",
      header: "Comentário",
      cell: ({ row }) => row.original.comment || "-",
    },
    {
      id: "reporter",
      header: "Denunciado por",
      cell: ({ row }) => row.original.reporter?.name ?? "-",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={row.original.status === "pending" ? "secondary" : "default"}>
          {row.original.status === "pending" ? "Pendente" : "Revisado"}
        </Badge>
      ),
    },
    {
      accessorKey: "created_at",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Data" />,
      cell: ({ row }) => new Date(row.getValue("created_at")).toLocaleDateString("pt-BR", { timeZone: "UTC" }),
    },
    {
      id: "actions",
      header: "Ações",
      cell: ({ row }) =>
        row.original.status === "pending" ? (
          <Button size="sm" variant="outline" onClick={() => handleReview(row.original)}>
            <CheckCircle className="mr-1 h-4 w-4" /> Marcar como revisado
          </Button>
        ) : null,
    },
  ];

  return (
    <>
      <Toaster richColors position="top-right" />
      <EntityPage
        title="Denúncias"
        description="Revise denúncias de comentários, avaliações e receitas. Para excluir o conteúdo denunciado, use as páginas de Comentários, Avaliações ou Receitas."
        isLoading={isLoading}
      >
        <DataTable
          columns={columns}
          data={data}
          pageCount={pageCount}
          state={{
            pagination: tableState.pagination,
            sorting: tableState.sorting,
            globalFilter: tableState.globalFilter,
          }}
          onPaginationChange={tableHandlers.onPaginationChange}
          onSortingChange={tableHandlers.onSortingChange}
          onGlobalFilterChange={tableHandlers.onGlobalFilterChange}
          manualPagination
          manualSorting
          manualFiltering
        />
      </EntityPage>
    </>
  );
}
```

#### Front — report button

**`apps/front/src/lib/api/report.server.ts`** (new):

```typescript
"use server";

import { createAuthenticatedServerApi } from "./serverApi";

export type ReportableType = "comments" | "ratings" | "recipes";
export type ReportReason =
  | "spam"
  | "inappropriate"
  | "misinformation"
  | "other";

interface Report {
  id: number;
  reportable_type: string;
  reportable_id: number;
  reason: ReportReason;
  comment: string | null;
  status: "pending" | "reviewed";
  created_at: string;
}

export async function createReport(
  type: ReportableType,
  id: number,
  reason: ReportReason,
  comment?: string,
): Promise<Report> {
  const api = await createAuthenticatedServerApi();
  const response = await api.post<{ data: Report }>(`/${type}/${id}/reports`, {
    reason,
    comment,
  });
  return response.data.data;
}
```

**`apps/front/src/components/shared/ReportDialog.tsx`** (new):

```typescript
'use client';

import { useState } from 'react';
import { Flag, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { createReport, ReportableType, ReportReason } from '@/lib/api/report.server';

const reasonOptions: { value: ReportReason; label: string }[] = [
    { value: 'spam', label: 'Spam' },
    { value: 'inappropriate', label: 'Conteúdo impróprio' },
    { value: 'misinformation', label: 'Informação incorreta' },
    { value: 'other', label: 'Outro' },
];

interface ReportDialogProps {
    type: ReportableType;
    id: number;
    triggerLabel?: string;
    triggerVariant?: 'ghost' | 'outline';
    iconOnly?: boolean;
}

export function ReportDialog({ type, id, triggerLabel, triggerVariant = 'ghost', iconOnly = false }: ReportDialogProps) {
    const { user } = useAuth();
    const [open, setOpen] = useState(false);
    const [reason, setReason] = useState<ReportReason | ''>('');
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleTriggerClick = () => {
        if (!user) {
            toast.error('Você precisa estar logado para denunciar.');
            return;
        }
        setOpen(true);
    };

    const handleSubmit = async () => {
        if (!reason) {
            toast.error('Selecione um motivo.');
            return;
        }
        setIsSubmitting(true);
        try {
            await createReport(type, id, reason, comment || undefined);
            toast.success('Denúncia enviada. Nossa equipe vai analisar.');
            setOpen(false);
            setReason('');
            setComment('');
        } catch (error) {
            console.error('Erro ao enviar denúncia:', error);
            toast.error('Não foi possível enviar a denúncia. Tente novamente.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Button variant={triggerVariant} size={iconOnly ? 'icon' : 'sm'} onClick={handleTriggerClick}>
                <Flag className="h-4 w-4" />
                {!iconOnly && <span className="ml-1">{triggerLabel ?? 'Denunciar'}</span>}
            </Button>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Denunciar conteúdo</DialogTitle>
                        <DialogDescription>
                            Conte o que há de errado. Nossa equipe vai revisar antes de tomar qualquer ação.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <Select value={reason} onValueChange={(v) => setReason(v as ReportReason)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione o motivo" />
                            </SelectTrigger>
                            <SelectContent>
                                {reasonOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Detalhes adicionais (opcional)"
                            rows={3}
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                        <Button onClick={handleSubmit} disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                            Enviar denúncia
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
```

**`apps/front/src/components/comments/CommentList.tsx`**:

```typescript
// add import
import { ReportDialog } from '@/components/shared/ReportDialog';

// replace the owner-only conditional block
                            {isAuthenticated && user?.id === comment.author.id && (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" disabled={isPending}>
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem onClick={() => handleEditClick(comment)}>
                                            <Edit className="mr-2 h-4 w-4" />
                                            <span>Editar</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleDelete(comment.id)} className="text-red-500">
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            <span>Deletar</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}
// with
                            {isAuthenticated && user?.id === comment.author.id ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" disabled={isPending}>
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem onClick={() => handleEditClick(comment)}>
                                            <Edit className="mr-2 h-4 w-4" />
                                            <span>Editar</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleDelete(comment.id)} className="text-red-500">
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            <span>Deletar</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : isAuthenticated ? (
                                <ReportDialog type="comments" id={comment.id} iconOnly triggerVariant="ghost" />
                            ) : null}
```

**`apps/front/src/components/recipe/RecipeHeader.tsx`** (report button addition; the health-disclaimer addition to this same file is in Phase 4 below):

```typescript
// add import
import { ReportDialog } from '@/components/shared/ReportDialog';

// add after the "Imprimir" button, still inside the same flex row
                            <Button variant="outline" onClick={handlePrint}><Printer className="h-4 w-4 mr-2" />Imprimir</Button>
// becomes
                            <Button variant="outline" onClick={handlePrint}><Printer className="h-4 w-4 mr-2" />Imprimir</Button>
                            {user && <ReportDialog type="recipes" id={recipe.id} triggerLabel="Denunciar" triggerVariant="outline" />}
```

_(Note: a report trigger for individual ratings was deliberately not built — there is no UI anywhere on the site that lists other users' individual ratings to attach a button to; only the aggregate average and the current user's own star-input are shown. The backend endpoint and admin queue both already support rating reports whenever such a UI exists.)_

---

### PHASE 4 — LGPD account deletion + health disclaimer

#### Backend — migration, model

**`apps/api/database/migrations/2026_10_08_000003_add_deleted_at_to_users_table.php`** (new):

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->timestamp('deleted_at')->nullable()->after('remember_token');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('deleted_at');
        });
    }
};
```

**`apps/api/app/Models/User.php`** — add to `$casts`:

```php
    protected $casts = [
        'email_verified_at' => 'datetime',
        'deleted_at' => 'datetime',
        'password' => 'hashed',
        'role' => RolesEnum::class,
    ];
```

#### Backend — anonymization

`DELETE /api/users/{user}` already existed, and `UserPolicy::delete()` already allowed `$authUser->id === $targetUser->id` — self-service deletion was already wired up, just doing the wrong thing underneath: `DeleteUser` hard-deleted the row, cascading and destroying content.

**`apps/api/app/Services/User/DeleteUser.php`** — full rewrite:

```php
<?php

namespace App\Services\User;

use App\Models\Post;
use App\Models\User;
use App\Notifications\DeletedUser;
use App\Services\Image\DeleteImage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Str;
use Throwable;

class DeleteUser
{
    public function __construct(
        protected DeleteImage $deleteImageService
    ) {
    }

    /**
     * Anonimiza um usuário (LGPD): remove dados pessoais mas preserva o
     * conteúdo que ele publicou (receitas, artigos, comentários, avaliações).
     *
     * @param User $user
     * @return void
     * @throws Throwable
     */
    public function delete(User $user): void
    {
        $imageToDelete = $user->image;
        $originalEmail = $user->email;
        $originalName = $user->name;
        $userId = $user->id;

        DB::transaction(function () use ($user, $imageToDelete) {
            $user->tokens()->delete();

            $user->forceFill([
                'name' => 'Usuário Removido',
                'email' => "deleted-user-{$user->id}@temperinho.invalid",
                'phone' => null,
                'birthday' => null,
                'password' => Hash::make(Str::random(40)),
                'remember_token' => null,
                'provider' => null,
                'provider_id' => null,
                'deleted_at' => now(),
            ])->save();

            if ($imageToDelete) {
                $this->deleteImageService->deleteDbRecord($imageToDelete);
            }

            if ($company = $user->company) {
                $company->forceFill([
                    'email' => "empresa-removida-{$company->id}@temperinho.invalid",
                    'phone' => "removido-{$company->id}",
                    'cnpj' => null,
                    'address' => 'Não informado',
                ])->save();

                Post::where('company_id', $company->id)
                    ->where('status', Post::STATUS_PENDING)
                    ->update([
                        'status' => Post::STATUS_REJECTED,
                        'rejection_reason' => 'A conta do autor foi removida antes da revisão.',
                    ]);
            }
        });

        try {
            if ($imageToDelete) {
                $this->deleteImageService->deleteFile($imageToDelete->path);
            }

            $deletedUserInfo = (new User)->forceFill(['name' => $originalName, 'email' => $originalEmail]);
            Notification::route('mail', $originalEmail)
                ->notify(new DeletedUser($deletedUserInfo));

        } catch (Throwable $e) {
            Log::warning('User Cleanup Failed: Could not delete file or send notification.', [
                'user_id' => $userId,
                'error' => $e->getMessage(),
            ]);

            throw $e;
        }
    }
}
```

**`apps/api/app/Http/Resources/User/UserResource.php`** — add alongside the other `$auth->can('view', ...)` gated fields:

```php
            'deleted_at' => $this->when(
                $auth && $auth->can('view', $this->resource),
                $this->deleted_at?->toIso8601String()
            ),
```

#### Backend — test

**`apps/api/tests/Feature/User/DeleteUserTest.php`** (new):

```php
<?php

namespace Tests\Feature\User;

use App\Models\Company;
use App\Models\Post;
use App\Models\User;
use App\Notifications\DeletedUser;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;
use PHPUnit\Framework\Attributes\Test;

class DeleteUserTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function user_can_delete_their_own_account_and_it_is_anonymized_not_removed()
    {
        Notification::fake();

        $user = User::factory()->create(['name' => 'Maria Silva', 'email' => 'maria@example.com']);
        $user->createToken('test-token');
        $post = Post::factory()->create(['user_id' => $user->id, 'status' => Post::STATUS_PUBLISHED]);

        Sanctum::actingAs($user);

        $this->deleteJson("/api/users/{$user->id}")->assertStatus(204);

        $this->assertDatabaseHas('users', ['id' => $user->id]);
        $user->refresh();

        $this->assertEquals('Usuário Removido', $user->name);
        $this->assertNotEquals('maria@example.com', $user->email);
        $this->assertNull($user->phone);
        $this->assertNotNull($user->deleted_at);
        $this->assertCount(0, $user->tokens);

        $this->assertDatabaseHas('posts', ['id' => $post->id, 'user_id' => $user->id]);

        Notification::assertSentOnDemand(DeletedUser::class);
    }

    #[Test]
    public function deleting_an_account_scrubs_the_owned_company_and_rejects_pending_posts()
    {
        Notification::fake();

        $user = User::factory()->create();
        $company = Company::factory()->create(['user_id' => $user->id]);
        $pendingPost = Post::factory()->create([
            'user_id' => $user->id,
            'company_id' => $company->id,
            'status' => Post::STATUS_PENDING,
        ]);

        Sanctum::actingAs($user);

        $this->deleteJson("/api/users/{$user->id}")->assertStatus(204);

        $company->refresh();
        $pendingPost->refresh();

        $this->assertNull($company->cnpj);
        $this->assertStringContainsString('@temperinho.invalid', $company->email);
        $this->assertEquals(Post::STATUS_REJECTED, $pendingPost->status);
        $this->assertNotNull($pendingPost->rejection_reason);
    }

    #[Test]
    public function a_user_cannot_delete_someone_elses_account()
    {
        Sanctum::actingAs(User::factory()->create());

        $this->deleteJson('/api/users/' . User::factory()->create()->id)->assertForbidden();
    }
}
```

#### Front — delete account UI

**`apps/front/src/lib/api/user.server.ts`** — `deleteAccount` export (already shown in full file in Phase 1's final version above):

```typescript
export async function deleteAccount(userId: number): Promise<void> {
  const api = await createAuthenticatedServerApi();
  await api.delete(`/users/${userId}`);
}
```

**`apps/front/src/components/user-profile/UserProfileForm.tsx`**:

```tsx
// add imports
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteAccount } from "@/lib/api/user.server";
import { useAuth } from "@/context/AuthContext";

// inside the component, alongside the other hooks
const [isDeleting, setIsDeleting] = React.useState(false);
const router = useRouter();
const { logout } = useAuth();

const handleDeleteAccount = async () => {
  setIsDeleting(true);
  try {
    await deleteAccount(user.id);
    toast.success("Sua conta foi removida.");
    await logout();
    router.push("/");
  } catch (error) {
    console.error("Erro ao excluir conta:", error);
    toast.error("Não foi possível excluir sua conta. Tente novamente.");
    setIsDeleting(false);
  }
};

// add as the last Card, right after the "Alterar Senha" Card's closing `)}`, still inside the lg:col-span-2 div
<Card className="border-destructive">
  <CardHeader>
    <CardTitle className="text-destructive">Excluir Conta</CardTitle>
  </CardHeader>
  <CardContent>
    <p className="text-sm text-muted-foreground mb-4">
      Isso remove permanentemente seus dados pessoais (nome, email, telefone,
      foto). Suas receitas, artigos e comentários publicados continuam no site,
      atribuídos a &quot;Usuário Removido&quot;. Essa ação não pode ser
      desfeita.
    </p>
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button type="button" variant="destructive">
          <Trash2 className="h-4 w-4 mr-2" />
          Excluir minha conta
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
          <AlertDialogDescription>
            Seus dados pessoais serão removidos permanentemente e você será
            desconectado. Essa ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteAccount}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Sim, excluir minha conta
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </CardContent>
</Card>;
```

#### Front — health disclaimer

**`apps/front/src/components/recipe/RecipeHeader.tsx`** — add right after the diets badges block:

```tsx
                        <div className="flex flex-wrap gap-2">
                            {recipe.diets?.map((diet) => <Badge key={diet.id} variant="secondary">{diet.name}</Badge>)}
                        </div>
// becomes
                        <div className="flex flex-wrap gap-2">
                            {recipe.diets?.map((diet) => <Badge key={diet.id} variant="secondary">{diet.name}</Badge>)}
                        </div>
                        {recipe.diets && recipe.diets.length > 0 && (
                            <p className="text-xs text-muted-foreground">
                                As informações de dieta são fornecidas pelo autor da receita e não substituem orientação médica profissional.
                            </p>
                        )}
```

**`apps/front/src/components/navigation/Footer.tsx`** — replace the file's closing lines:

```tsx
                </div>
            </div>
        </footer>
    );
};
// with
                </div>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-8">
                    <p className="text-muted-foreground/70 text-xs max-w-3xl mx-auto md:mx-0">
                        As informações sobre dietas e restrições alimentares são fornecidas pelos próprios usuários e não substituem orientação médica ou nutricional profissional. Consulte um especialista antes de fazer mudanças na sua alimentação.
                    </p>
                </div>
            </div>
        </footer>
    );
};
```

---

### PHASE 5 — Monitoring (Sentry + Plausible) + `CompanyPolicy` fix + follow-ups

#### `CompanyPolicy::create()` — investigated and fixed

Confirmed to be a real bug: it blocked the already-built self-service sponsor registration form at `/usuario/empresa`, since `CreateCompany` already derives `user_id` from the authenticated request rather than client input — the policy's `isInternal()` requirement was the only blocker.

**`apps/api/app/Policies/CompanyPolicy.php`**:

```php
    public function create(User $user): bool
    {
        return $user->isInternal() && $user->company()->doesntExist();
    }
// becomes
    public function create(User $user): bool
    {
        return $user->company()->doesntExist();
    }
```

**`apps/api/tests/Feature/Company/CompanyCreateTest.php`** (new):

```php
<?php

namespace Tests\Feature\Company;

use App\Enum\RolesEnum;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;
use PHPUnit\Framework\Attributes\Test;

class CompanyCreateTest extends TestCase
{
    use RefreshDatabase;

    protected function validCompanyData(): array
    {
        return [
            'name' => 'Marca Exemplo',
            'cnpj' => '12345678000199',
            'email' => 'contato@marcaexemplo.com.br',
            'phone' => '48999990000',
            'address' => 'Rua Exemplo, 123',
            'website' => 'https://marcaexemplo.com.br',
        ];
    }

    #[Test]
    public function a_regular_customer_without_a_company_can_self_register_one()
    {
        Storage::fake('s3');

        Sanctum::actingAs(User::factory()->create(['role' => RolesEnum::CUSTOMER]));

        $this->postJson('/api/companies', $this->validCompanyData())
            ->assertStatus(201)
            ->assertJsonPath('data.name', 'Marca Exemplo');

        $this->assertDatabaseHas('companies', ['email' => 'contato@marcaexemplo.com.br']);
    }

    #[Test]
    public function a_user_who_already_owns_a_company_cannot_create_a_second_one()
    {
        Storage::fake('s3');

        $user = User::factory()->create(['role' => RolesEnum::CUSTOMER]);
        \App\Models\Company::factory()->create(['user_id' => $user->id]);

        Sanctum::actingAs($user);

        $this->postJson('/api/companies', $this->validCompanyData())
            ->assertForbidden();
    }

    #[Test]
    public function internal_users_can_still_create_a_company()
    {
        Storage::fake('s3');

        Sanctum::actingAs(User::factory()->create(['role' => RolesEnum::INTERNAL]));

        $this->postJson('/api/companies', $this->validCompanyData())
            ->assertStatus(201);
    }
}
```

#### Monitoring — Sentry, Laravel API

```bash
composer require sentry/sentry-laravel
```

**`apps/api/bootstrap/app.php`**:

```php
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use App\Http\Middleware\SecureHeaders;
use Sentry\Laravel\Integration;
// ...
    ->withExceptions(function (Exceptions $exceptions) {
        Integration::handles($exceptions);
    })
```

**`apps/api/config/sentry.php`** (new):

```php
<?php

return [
    'dsn' => env('SENTRY_LARAVEL_DSN'),

    'release' => env('SENTRY_RELEASE'),

    // LGPD: não envie dados pessoais (IP, cookies, headers de auth) por padrão.
    'send_default_pii' => env('SENTRY_SEND_DEFAULT_PII', false),

    'traces_sample_rate' => (float) env('SENTRY_TRACES_SAMPLE_RATE', 0.0),
    'profiles_sample_rate' => (float) env('SENTRY_PROFILES_SAMPLE_RATE', 0.0),

    'environment' => env('SENTRY_ENVIRONMENT', env('APP_ENV', 'production')),

    'ignore_exceptions' => [
        \Illuminate\Auth\AuthenticationException::class,
        \Illuminate\Auth\Access\AuthorizationException::class,
        \Illuminate\Validation\ValidationException::class,
        \Illuminate\Database\Eloquent\ModelNotFoundException::class,
        \Symfony\Component\HttpKernel\Exception\NotFoundHttpException::class,
    ],

    'breadcrumbs' => [
        'logs' => true,
        'sql_queries' => true,
        'sql_bindings' => false,
    ],
];
```

**`apps/api/.env.example`** — append:

```
#--------------------------------------------------------------------------
# MONITORAMENTO (Sentry)
#--------------------------------------------------------------------------
SENTRY_LARAVEL_DSN=
SENTRY_ENVIRONMENT=production
SENTRY_TRACES_SAMPLE_RATE=0.2
SENTRY_PROFILES_SAMPLE_RATE=0.0
SENTRY_SEND_DEFAULT_PII=false
```

**`apps/api/tests/Unit/SentryConfigTest.php`** (new):

```php
<?php

namespace Tests\Unit;

use Tests\TestCase;
use PHPUnit\Framework\Attributes\Test;

class SentryConfigTest extends TestCase
{
    #[Test]
    public function sentry_does_not_send_personal_data_by_default()
    {
        $this->assertFalse(
            config('sentry.send_default_pii'),
            'SENTRY_SEND_DEFAULT_PII must default to false to avoid sending user PII to a third party (LGPD).'
        );
    }

    #[Test]
    public function expected_user_facing_exceptions_are_ignored()
    {
        $ignored = config('sentry.ignore_exceptions');

        $this->assertContains(\Illuminate\Validation\ValidationException::class, $ignored);
        $this->assertContains(\Illuminate\Auth\AuthenticationException::class, $ignored);
    }
}
```

#### Monitoring — Sentry, Next.js (front and admin — identical files in both apps)

```bash
npm install @sentry/nextjs   # run in apps/front AND apps/admin
```

**`apps/front/src/instrumentation-client.ts`** (new) — identical file at `apps/admin/src/instrumentation-client.ts`:

```typescript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment:
    process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT ?? process.env.NODE_ENV,
  tracesSampleRate: 0.2,
  sendDefaultPii: false,
  enabled: !!process.env.NEXT_PUBLIC_SENTRY_DSN,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
```

**`apps/front/src/sentry.server.config.ts`** (new) — identical file at `apps/admin/src/sentry.server.config.ts`:

```typescript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN ?? process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment:
    process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT ?? process.env.NODE_ENV,
  tracesSampleRate: 0.2,
  sendDefaultPii: false,
  enabled: !!(process.env.SENTRY_DSN ?? process.env.NEXT_PUBLIC_SENTRY_DSN),
});
```

**`apps/front/src/sentry.edge.config.ts`** (new) — identical file at `apps/admin/src/sentry.edge.config.ts`:

```typescript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN ?? process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment:
    process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT ?? process.env.NODE_ENV,
  tracesSampleRate: 0.2,
  sendDefaultPii: false,
  enabled: !!(process.env.SENTRY_DSN ?? process.env.NEXT_PUBLIC_SENTRY_DSN),
});
```

**`apps/front/src/instrumentation.ts`** (new) — identical file at `apps/admin/src/instrumentation.ts`:

```typescript
import * as Sentry from "@sentry/nextjs";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}

export const onRequestError = Sentry.captureRequestError;
```

**`apps/front/src/app/global-error.tsx`** (new) — identical file at `apps/admin/src/app/global-error.tsx`:

```tsx
"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";
import NextError from "next/error";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="pt-BR">
      <body>
        <NextError statusCode={0} />
      </body>
    </html>
  );
}
```

**`apps/front/next.config.js`**:

```javascript
// add import at top
import { withSentryConfig } from '@sentry/nextjs';

// wrap the export at the bottom
export default nextConfig;
// becomes
export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT_FRONT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  silent: true,
  widenClientFileUpload: true,
  tunnelRoute: '/monitoring',
  disableLogger: true,
  automaticVercelMonitors: false,
});
```

**`apps/admin/next.config.ts`**:

```typescript
import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_LARAVEL_BASE_URL}/api/:path*`,
      },
    ];
  },
};

export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT_ADMIN,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  silent: true,
  widenClientFileUpload: true,
  tunnelRoute: "/monitoring",
  disableLogger: true,
  automaticVercelMonitors: false,
});
```

#### Monitoring — Plausible (front only)

**`apps/front/src/app/layout.tsx`** — inside `<head>`, alongside the CookieYes script:

```tsx
<Script
  id="cookieyes"
  type="text/javascript"
  src="https://cdn-cookieyes.com/client_data/482e3ab6588d9ec52fc08147/script.js"
  strategy="beforeInteractive"
/>;
// add right after
{
  process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN && (
    <Script
      defer
      data-domain={process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN}
      src="https://plausible.io/js/script.js"
      strategy="afterInteractive"
    />
  );
}
```

**`apps/front/src/lib/env.ts`**:

```typescript
const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z
    .string()
    .url()
    .optional()
    .default("http://localhost:8000/api"),
  NEXT_PUBLIC_URL: z.string().url().optional().default("http://localhost:3000"),
  NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional(),
  NEXT_PUBLIC_PLAUSIBLE_DOMAIN: z.string().optional(),
});
```

#### Low-risk follow-ups completed this phase

**`apps/front/src/components/blog/BlogPostHeader.tsx`** — "Patrocinado" badge on the single-article view:

```tsx
// add import
import { Badge } from '@/components/ui/badge';

// replace
                <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4 leading-tight">
                    {article.title}
                </h1>
// with
                <div className="flex items-center gap-3 mb-4">
                    <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground leading-tight">
                        {article.title}
                    </h1>
                    {article.company_id && <Badge variant="outline">Patrocinado</Badge>}
                </div>
```

**`apps/admin/src/config/dashboard.ts`** — "Posts" nav entry already existed (pointed at `/dashboard/posts` before that page existed); only "Reports" needed adding:

```typescript
// in the "Engajamento" group, after the "Avaliações" item
      {
        title: "Avaliações",
        href: "/dashboard/ratings",
        icon: "Star",
      },
// add
      {
        title: "Denúncias",
        href: "/dashboard/reports",
        icon: "Flag",
      },
```

---

## PART 4 — VERIFICATION STATUS, FILE INDEX, ENVIRONMENT VARIABLES, DEPLOYMENT STEPS

### Verification status (honest accounting)

**Actually executed by the assistant:** `php -l` (syntax lint only) against 5 Phase 5 files — `CompanyPolicy.php`, `config/sentry.php`, `bootstrap/app.php`, `CompanyCreateTest.php`, `SentryConfigTest.php`. All passed. PHP 8.3 CLI was installed in the assistant's sandbox specifically for this.

**Never executed by the assistant, anywhere, any phase:**

- No `php artisan test` run (no Composer dependencies installed — Packagist isn't network-reachable from the sandbox; no configured database).
- No TypeScript file compiled or type-checked (`tsc`, `next build`) — front and admin changes across all 5 phases are reviewed-by-reasoning only.
- No Sentry or Plausible integration verified live — no DSN, no deployed site.
- Phases 1–4's PHP files were never even materialized in a sandbox until Phase 5's two files; everything else exists only as the code blocks delivered in this conversation.

**Treat every single file below as "written and reasoned through, not run," until your own verification pass below says otherwise.**

### Full file index (all phases)

**Backend — new files:**

```
database/migrations/2026_10_08_000001_add_status_to_posts_table.php
database/migrations/2026_10_08_000002_create_reports_table.php
database/migrations/2026_10_08_000003_add_deleted_at_to_users_table.php
app/Models/Report.php
database/factories/ReportFactory.php
app/Policies/ReportPolicy.php
app/Http/Requests/Post/RejectPostRequest.php
app/Http/Requests/Report/StoreReportRequest.php
app/Http/Requests/Report/FilterReportRequest.php
app/Services/Post/ApprovePost.php
app/Services/Post/RejectPost.php
app/Services/Report/CreateReport.php
app/Services/Report/MarkReportReviewed.php
app/Services/Report/ListReports.php
app/Http/Resources/Report/ReportResource.php
app/Http/Resources/Report/ReportCollectionResource.php
app/Http/Controllers/ReportController.php
app/Notifications/PostApproved.php
app/Notifications/PostRejected.php
resources/views/emails/post_approved.blade.php
resources/views/emails/post_rejected.blade.php
config/sentry.php
tests/Feature/Post/PostApprovalTest.php
tests/Feature/Report/ReportTest.php
tests/Feature/User/DeleteUserTest.php
tests/Feature/Company/CompanyCreateTest.php
tests/Unit/SentryConfigTest.php
apps/front/src/lib/api/serverApi.ts
apps/front/src/lib/api/report.server.ts
apps/front/src/components/shared/ReportDialog.tsx
apps/front/src/instrumentation-client.ts
apps/front/src/sentry.server.config.ts
apps/front/src/sentry.edge.config.ts
apps/front/src/instrumentation.ts
apps/front/src/app/global-error.tsx
apps/admin/src/lib/api/posts.ts
apps/admin/src/lib/actions/posts.ts
apps/admin/src/app/dashboard/posts/page.tsx
apps/admin/src/lib/types/report.ts
apps/admin/src/lib/api/reports.ts
apps/admin/src/lib/actions/reports.ts
apps/admin/src/app/dashboard/reports/page.tsx
apps/admin/src/instrumentation-client.ts
apps/admin/src/sentry.server.config.ts
apps/admin/src/sentry.edge.config.ts
apps/admin/src/instrumentation.ts
apps/admin/src/app/global-error.tsx
```

**Backend — modified files:**

```
app/Http/Middleware/CheckPlanLimit.php
app/Policies/PostPolicy.php
app/Policies/CompanyPolicy.php
app/Http/Requests/Post/StorePostRequest.php
app/Models/Post.php
app/Models/User.php
app/Services/Post/CreatePost.php
app/Services/Post/ListPost.php
app/Services/Concerns/BaseListService.php
app/Http/Resources/Post/PostResource.php
app/Http/Resources/Post/PostCollectionResource.php
app/Http/Resources/User/UserResource.php
app/Http/Controllers/PostController.php
app/Services/User/DeleteUser.php
app/Providers/AuthServiceProvider.php
bootstrap/app.php
routes/api.php
.env.example
tests/Feature/Post/PostTestSetup.php
tests/Feature/Post/PostStoreTest.php
```

**Deleted files:**

```
apps/front/src/lib/api/user.ts
apps/front/src/lib/api/company.ts
```

**Frontend (apps/front) — modified files:**

```
src/lib/api/interactions.server.ts
src/lib/api/user.server.ts
src/lib/api/blog.server.ts
src/lib/api/recipe.server.ts
src/lib/api/company.server.ts
src/lib/api/blog.ts
src/lib/api/recipe.ts
src/app/actions/auth.ts
src/context/AuthContext.tsx
src/types/blog.ts
src/lib/env.ts
src/app/layout.tsx
next.config.js
src/components/company/CompanyForm.tsx
src/components/company/CompanyView.tsx
src/components/blog/ArticleForm.tsx
src/components/blog/UserArticleCard.tsx
src/components/blog/BlogPostCard.tsx
src/components/blog/BlogPostHeader.tsx
src/components/blog/PostActions.tsx
src/components/blog/FavoriteArticleCard.tsx
src/components/recipe/forms/RecipeForm.tsx
src/components/recipe/UserRecipeCard.tsx
src/components/recipe/FavoriteRecipeCard.tsx
src/components/recipe/RecipeHeader.tsx
src/components/recipe/RecipeCard.tsx
src/components/user-profile/UserProfileForm.tsx
src/components/comments/CommentList.tsx
src/components/navigation/Footer.tsx
```

**Admin (apps/admin) — modified files:**

```
src/lib/types/post.ts
src/config/dashboard.ts
next.config.ts
```

### Required environment variables (complete, all phases)

| Var                                                                               | App                            | Purpose                                            |
| --------------------------------------------------------------------------------- | ------------------------------ | -------------------------------------------------- |
| `SENTRY_LARAVEL_DSN`                                                              | API                            | Sentry project DSN                                 |
| `SENTRY_ENVIRONMENT`                                                              | API                            | `production` / `staging`                           |
| `SENTRY_TRACES_SAMPLE_RATE`                                                       | API                            | default `0.2`                                      |
| `SENTRY_PROFILES_SAMPLE_RATE`                                                     | API                            | default `0.0`                                      |
| `SENTRY_SEND_DEFAULT_PII`                                                         | API                            | must stay `false`                                  |
| `NEXT_PUBLIC_SENTRY_DSN`                                                          | front, admin                   | public DSN per app (2 Sentry projects recommended) |
| `NEXT_PUBLIC_SENTRY_ENVIRONMENT`                                                  | front, admin                   | optional, defaults to `NODE_ENV`                   |
| `SENTRY_ORG`, `SENTRY_PROJECT_FRONT`, `SENTRY_PROJECT_ADMIN`, `SENTRY_AUTH_TOKEN` | front, admin (build-time only) | source map upload; `SENTRY_AUTH_TOKEN` is a secret |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`                                                    | front                          | e.g. `temperinho.pepefcardoso.dev`                 |

_(All other pre-existing env vars — DB, S3, Meilisearch, SES, Sanctum, Google OAuth — are unchanged by this work.)_

### Staging verification steps (developer-owned)

1. `composer require sentry/sentry-laravel` in `apps/api`; `npm install @sentry/nextjs` in `apps/front` and `apps/admin`.
2. Create 3 Sentry projects (API, front, admin) and a Plausible site for the domain; set every env var listed above.
3. `php artisan migrate` — confirms all three new migrations (post status, reports table, users.deleted_at) apply cleanly.
4. `php artisan test` — first real execution of every PHPUnit test from all 5 phases.
5. `npm run build` in front and admin — first real TypeScript compilation of all 5 phases' changes.
6. Manually exercise every P0 flow end to end: login/logout, comment/rate/favorite a recipe, create a recipe, sponsor company self-registration (Phase 5 fix), a sponsor submitting and getting an article approved/rejected (check the email), filing and reviewing a report, deleting an account and confirming content survives as "Usuário Removido."
7. Trigger a deliberate exception in each app and confirm it lands in the correct Sentry project with no PII attached.
8. Load the site and confirm a pageview appears in Plausible.
9. Deploy via existing Docker/VPS pipeline.
