# Testing Strategy

This project relies on automated testing to ensure quality and prevent regressions.

## Types of Tests

1.  **Unit & Component Tests (Vitest + React Testing Library):**
    Used to test individual functions, hooks, and isolated UI components. These tests are fast and verify specific logic.

2.  **End-to-End Tests (Playwright):**
    Used to test entire user flows (e.g., logging in, navigating the dashboard, submitting a form) exactly as a user would experience them in a real browser.

## Running Tests

### Unit Tests

```bash
# Run tests once
npm run test

# Run tests in watch mode (ideal during development)
npm run test:watch
```

*Tests should be placed alongside the files they test (e.g., `Button.test.tsx` next to `Button.tsx`) or inside a `__tests__` folder.*

### E2E Tests

Before running E2E tests for the first time, you need to install Playwright browsers:
```bash
npx playwright install
```

```bash
# Run E2E tests in headless mode
npm run test:e2e

# Run E2E tests with UI (interactive)
npx playwright test --ui
```

*E2E tests reside in the `/tests/e2e` directory.*
