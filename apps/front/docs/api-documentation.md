# Temperinho API Documentation

This documentation is designed for frontend developers consuming the Temperinho API. It covers authentication, standard conventions, and a comprehensive list of all available endpoints.

## Global Conventions

### Base Configuration

-   **Base URL:** `/api` (e.g., `http://localhost:8000/api`)
-   **Headers Required:**
    -   `Accept: application/json`
    -   `Content-Type: application/json`

### Authentication

The API uses **Laravel Sanctum** for authentication. Protected routes require a Bearer token in the Authorization header.

-   **Header:** `Authorization: Bearer {your_token_here}`

### Responses & Pagination

The API follows standard RESTful JSON resource wrappers.

-   **Single Resource:** Wrapped in a `data` object.
-   **Collection (List):** Wrapped in a `data` array.
-   **Pagination:** List endpoints are paginated by default. The response includes a `meta` and `links` object for pagination controls.

```json
{
    "data": [{ "id": 1, "title": "Example" }],
    "links": {
        "first": "...",
        "last": "...",
        "prev": null,
        "next": "..."
    },
    "meta": {
        "current_page": 1,
        "from": 1,
        "last_page": 1,
        "per_page": 15,
        "to": 15,
        "total": 50
    }
}
```

### Standard Filters

List endpoints (`GET` on resources like `/posts`, `/recipes`, etc.) support the following standard query parameters:

-   `search`: Search term (e.g., `?search=bolo`)
-   `per_page`: Items per page (e.g., `?per_page=30`)
-   `order_by`: Field and direction to sort by (e.g., `?order_by=created_at,desc`)

---

## 1. Authentication (`/auth`)

| Method | Endpoint                           | Description                                                                 | Auth Required? |
| ------ | ---------------------------------- | --------------------------------------------------------------------------- | -------------- |
| `POST` | `/auth/login`                      | Authenticate user and get Bearer token.                                     | No             |
| `POST` | `/auth/register`                   | Register a new user (Note: mapped in standard AuthController if available). | No             |
| `POST` | `/auth/password/forgot`            | Send password reset link to email.                                          | No             |
| `POST` | `/auth/password/reset`             | Reset password using token from email.                                      | No             |
| `POST` | `/auth/logout`                     | Invalidate the current Bearer token.                                        | **Yes**        |
| `GET`  | `/auth/social/{provider}`          | Redirect to Social Provider (google, github, facebook).                     | No             |
| `GET`  | `/auth/social/{provider}/callback` | Handle callback from Social Provider.                                       | No             |

---

## 2. Users (`/users`)

| Method   | Endpoint                   | Description                                                        | Auth Required? |
| -------- | -------------------------- | ------------------------------------------------------------------ | -------------- |
| `GET`    | `/users/me`                | Get the currently authenticated user's profile.                    | **Yes**        |
| `PATCH`  | `/users/{id}/role`         | Update user role.                                                  | **Yes**        |
| `POST`   | `/users/favorites/posts`   | Toggle favorite status for a Post (payload: `{"post_id": 1}`).     | **Yes**        |
| `POST`   | `/users/favorites/recipes` | Toggle favorite status for a Recipe (payload: `{"recipe_id": 1}`). | **Yes**        |
| `GET`    | `/users`                   | List users.                                                        | **Yes**        |
| `GET`    | `/users/{id}`              | Get a specific user.                                               | **Yes**        |
| `PUT`    | `/users/{id}`              | Update a user.                                                     | **Yes**        |
| `DELETE` | `/users/{id}`              | Delete a user.                                                     | **Yes**        |

---

## 3. Posts (`/posts`)

> [!NOTE]
> Creating posts (`POST /posts`) is restricted by the user's active Plan Limits.

| Method   | Endpoint           | Description                                                       | Auth Required? |
| -------- | ------------------ | ----------------------------------------------------------------- | -------------- |
| `GET`    | `/posts`           | List posts. Supports standard filters + `category_id`, `user_id`. | No             |
| `GET`    | `/posts/{id}`      | Get a specific post details.                                      | No             |
| `GET`    | `/posts/my`        | List posts created by the authenticated user.                     | **Yes**        |
| `GET`    | `/posts/favorites` | List posts favorited by the authenticated user.                   | **Yes**        |
| `POST`   | `/posts`           | Create a new post.                                                | **Yes**        |
| `PUT`    | `/posts/{id}`      | Update an existing post.                                          | **Yes**        |
| `DELETE` | `/posts/{id}`      | Delete a post.                                                    | **Yes**        |

**Payload Example for POST/PUT:**

```json
{
    "title": "My Post Title",
    "summary": "Short summary",
    "content": "Full content body...",
    "category_id": 1,
    "topics": [1, 2, 3]
}
```

---

## 4. Recipes (`/recipes`)

> [!NOTE]
> Creating recipes (`POST /recipes`) is restricted by the user's active Plan Limits.

| Method   | Endpoint             | Description                                                                    | Auth Required? |
| -------- | -------------------- | ------------------------------------------------------------------------------ | -------------- |
| `GET`    | `/recipes`           | List recipes. Supports standard filters + `category_id`, `user_id`, `diets[]`. | No             |
| `GET`    | `/recipes/{id}`      | Get a specific recipe.                                                         | No             |
| `GET`    | `/recipes/my`        | List recipes created by the authenticated user.                                | **Yes**        |
| `GET`    | `/recipes/favorites` | List recipes favorited by the authenticated user.                              | **Yes**        |
| `POST`   | `/recipes`           | Create a new recipe.                                                           | **Yes**        |
| `PUT`    | `/recipes/{id}`      | Update a recipe.                                                               | **Yes**        |
| `DELETE` | `/recipes/{id}`      | Delete a recipe.                                                               | **Yes**        |

**Payload Example for POST/PUT:**

```json
{
    "title": "Bolo de Cenoura",
    "description": "Delicious carrot cake",
    "time": 45,
    "portion": 8,
    "difficulty": "medium",
    "category_id": 1,
    "diets": [1, 2],
    "ingredients": [{ "name": "Cenoura", "quantity": 3, "unit_id": 1 }],
    "steps": [{ "order": 1, "instruction": "Bata tudo no liquidificador." }]
}
```

---

## 5. Taxonomies (Categories, Topics, Diets, Units)

These endpoints follow the standard API Resource structure (`GET` for public list/show, `POST`/`PUT`/`DELETE` for protected management).

| Resource          | Base Endpoint        | Public Access   | Protected Access (Auth Required) |
| ----------------- | -------------------- | --------------- | -------------------------------- |
| Post Categories   | `/post-categories`   | `index`, `show` | `store`, `update`, `destroy`     |
| Post Topics       | `/post-topics`       | `index`, `show` | `store`, `update`, `destroy`     |
| Recipe Categories | `/recipe-categories` | `index`, `show` | `store`, `update`, `destroy`     |
| Recipe Diets      | `/recipe-diets`      | `index`, `show` | `store`, `update`, `destroy`     |
| Recipe Units      | `/recipe-units`      | `index`, `show` | `store`, `update`, `destroy`     |

---

## 6. Interactions (Comments & Ratings)

Comments and Ratings are polymorphic, meaning they apply to either `posts` or `recipes`. Replace `{type}` with either `posts` or `recipes`.

### Comments

| Method   | Endpoint                | Description                      | Auth Required? |
| -------- | ----------------------- | -------------------------------- | -------------- |
| `GET`    | `/{type}/{id}/comments` | List comments for a post/recipe. | No             |
| `GET`    | `/comments/{commentId}` | Show a single comment.           | No             |
| `POST`   | `/{type}/{id}/comments` | Add a comment to a post/recipe.  | **Yes**        |
| `PUT`    | `/comments/{commentId}` | Update your comment.             | **Yes**        |
| `DELETE` | `/comments/{commentId}` | Delete your comment.             | **Yes**        |

### Ratings

| Method   | Endpoint               | Description                                        | Auth Required? |
| -------- | ---------------------- | -------------------------------------------------- | -------------- |
| `GET`    | `/{type}/{id}/ratings` | List all ratings for a post/recipe.                | No             |
| `GET`    | `/{type}/{id}/rating`  | Get the authenticated user's rating for this item. | **Yes**        |
| `GET`    | `/ratings/{ratingId}`  | Show a single rating.                              | No             |
| `POST`   | `/{type}/{id}/ratings` | Submit a rating (1-5 stars) for a post/recipe.     | **Yes**        |
| `PUT`    | `/ratings/{ratingId}`  | Update an existing rating.                         | **Yes**        |
| `DELETE` | `/ratings/{ratingId}`  | Remove your rating.                                | **Yes**        |

**Rating Payload Example:** `{"value": 5, "comment": "Great!"}`

---

## 7. Billing & Subscriptions

| Method | Endpoint           | Description                                | Auth Required? |
| ------ | ------------------ | ------------------------------------------ | -------------- |
| `GET`  | `/plans`           | List available subscription plans.         | No             |
| `GET`  | `/plans/{id}`      | Show plan details.                         | No             |
| `GET`  | `/companies/my`    | Get the authenticated user's company info. | **Yes**        |
| `API`  | `/companies`       | Standard CRUD for companies.               | **Yes**        |
| `API`  | `/subscriptions`   | Standard CRUD for subscriptions.           | **Yes**        |
| `API`  | `/payments`        | Standard CRUD for payments.                | **Yes**        |
| `API`  | `/payment-methods` | Standard CRUD for payment methods.         | **Yes**        |

_(Note: `API` implies the standard `GET`, `POST`, `PUT`, `DELETE` methods for the resource)._

---

## 8. Images and File Uploads

Images are handled as polymorphic attachments. The upload pattern requires uploading the file to S3 first, then linking it.

| Method   | Endpoint       | Description                                        | Auth Required? |
| -------- | -------------- | -------------------------------------------------- | -------------- |
| `GET`    | `/images`      | List all images.                                   | No             |
| `GET`    | `/images/{id}` | Show an image.                                     | No             |
| `POST`   | `/images`      | Upload a new image (requires multipart/form-data). | **Yes**        |
| `DELETE` | `/images/{id}` | Delete an image.                                   | **Yes**        |

---

## 9. Misc

| Method  | Endpoint        | Description                                            | Auth Required? |
| ------- | --------------- | ------------------------------------------------------ | -------------- |
| `GET`   | `/health`       | API Healthcheck (Returns `{"status": "ok"}`).          | No             |
| `POST`  | `/contact`      | Submit a contact form.                                 | No             |
| `GET`   | `/contact`      | List customer contacts.                                | **Yes**        |
| `PATCH` | `/contact/{id}` | Update contact status.                                 | **Yes**        |
| `POST`  | `/newsletter`   | Subscribe to newsletter (payload: `{"email": "..."}`). | No             |
| `API`   | `/newsletter`   | Standard management for newsletter emails.             | **Yes**        |

---

> [!TIP] > **Error Handling**:
>
> -   Validation errors will return a `422 Unprocessable Entity` with an `errors` object detailing which fields failed.
> -   Unauthorized requests will return `401 Unauthorized`.
> -   Forbidden actions (e.g., trying to edit someone else's post) return `403 Forbidden`.
> -   Plan limit constraints returns appropriate error if user attempts to exceed active subscription quota on Posts/Recipes.
