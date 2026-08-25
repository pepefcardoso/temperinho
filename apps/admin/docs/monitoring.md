# Monitoring Setup

To ensure stability in production, we track unhandled errors and monitor performance using **Sentry**.

## Sentry Integration

Sentry is integrated deeply into Next.js. It automatically catches:
- Unhandled errors in React components.
- Errors thrown inside Server Actions.
- API Route failures.
- Web Vitals and page load performance metrics.

## Configuration

To enable Sentry reporting in production, you must provide the DSN (Data Source Name) as an environment variable:

```env
# Sentry DSN (Get this from your Sentry project settings)
NEXT_PUBLIC_SENTRY_DSN=https://examplePublicKey@o0.ingest.sentry.io/0
```

> [!NOTE]
> Sentry is automatically disabled during local development (when `NODE_ENV === 'development'`) to avoid polluting your issue stream with development errors.

## Verifying Setup

To verify Sentry is working:
1. Build the app for production: `npm run build && npm start`
2. Trigger an intentional error (e.g., throw a new Error on a button click).
3. Check the Sentry Dashboard for the issue.
