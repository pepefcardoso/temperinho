# Temperinho Admin - Coding Conventions

This document outlines the coding standards, patterns, and conventions that must be followed when developing the Temperinho Admin dashboard.

## 1. TypeScript & Type Safety

*   **Strict Mode:** The project uses TypeScript in strict mode. Never use `any`. Use `unknown` if the type is truly dynamic and assert it safely.
*   **Interface Over Type:** Prefer `interface` over `type` for defining entity shapes, as they are easier to extend. Use `type` for unions, intersections, or utility types.
*   **Domain Segregation:** Place all interfaces and types in `src/lib/types/` grouped by domain (e.g., `user.ts`, `company.ts`).

## 2. Next.js & React

*   **Server vs. Client Components:** Default to Server Components for layouts and data-fetching boundaries. Use `"use client"` only at the leaves of the component tree when interactivity (hooks, state, event listeners) is required.
*   **Server Actions:** All data mutations (Create, Update, Delete) must be performed using Next.js Server Actions.
    *   Actions should reside in `src/lib/actions/`.
    *   They must validate the session token.
    *   They must catch errors and return standardized responses (e.g., `{ success: boolean, message: string }`).
    *   Always use `revalidatePath` to update the UI after a successful mutation.

## 3. Data Validation

*   **Zod as Single Source of Truth:** Use Zod for all data validation. Define schemas in `src/lib/schemas/`.
*   **Type Inference:** Infer TypeScript types from Zod schemas where appropriate (e.g., `export type UserFormData = z.infer<typeof userSchema>`).
*   **Shared Validation:** The exact same Zod schema must be used in the `CrudPage` (for React Hook Form validation) and in the Server Action (for backend payload validation).

## 4. UI & Styling

*   **Tailwind CSS:** Use Tailwind CSS for all styling. Avoid custom CSS files unless absolutely necessary (e.g., complex animations not supported by Tailwind).
*   **shadcn/ui:** Use the pre-configured shadcn/ui components in `src/components/ui/` for basic interactive elements (buttons, inputs, dialogs, selects). Do not build these from scratch.
*   **Icons:** Use `lucide-react` for all icons to maintain visual consistency.

## 5. The `CrudPage` Pattern

When building a new dashboard management page for an entity:

1.  **Do not reinvent the wheel.** Use the `CrudPage` component located in `src/components/shared/crud/crudPage.tsx`.
2.  **Define Columns:** Create a `columns` array using TanStack Table's `ColumnDef`. Keep the `page.tsx` clean by moving complex cell renders out if necessary.
3.  **Define Form Fields:** Create an `AdditionalFormFields` component that receives an optional `entity` prop.
    *   If `entity` is null/undefined, render a creation form.
    *   If `entity` has data, populate default values for an edit form.
4.  **Connect Actions:** Pass the corresponding Server Actions (`fetch`, `create`, `update`, `delete`) to the `actions` prop of `CrudPage`.

## 6. File Naming

*   **React Components:** PascalCase (e.g., `CrudPage.tsx`, `UserForm.tsx`).
*   **Next.js App Router files:** lowercase (e.g., `page.tsx`, `layout.tsx`).
*   **Utility/Helper files:** camelCase (e.g., `formatDate.ts`, `users.ts`).
*   **Directories:** kebab-case or camelCase (e.g., `payment-methods/` or `paymentMethods/` - be consistent with existing patterns).

## 7. State Management

*   **URL State:** Use URL query parameters for filter state, sorting, and pagination. This ensures shareable URLs and works seamlessly with Server Components.
*   **Local State:** Use `useState` for simple UI toggles within Client Components.
*   **Global State:** Use Zustand (`src/stores/`) only for truly global client state that needs to be accessed across disparate parts of the app without prop drilling. Use React Context for scoped global state (e.g., the `UserSessionProvider`).

## 8. Error Handling

*   **Action Errors:** Server Actions should never throw unhandled exceptions to the client. Wrap API calls in `try/catch` and return safe error messages.
*   **UI Feedback:** The `CrudPage` automatically handles displaying toast notifications using Sonner based on the Server Action's return state. Ensure your actions return user-friendly error messages.
