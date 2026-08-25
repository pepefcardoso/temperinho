import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  sendDefaultPii: false,
  tracesSampleRate: 1.0,
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.feedbackIntegration({
      colorScheme: 'system',
    }),
  ],
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  enableLogs: true,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;

let isReplayActivated = false;

function enableSentryReplay() {
  if (isReplayActivated) return;

  Sentry.addIntegration(
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    })
  );
  isReplayActivated = true;
}

function verifyAndEnableReplay(acceptedCategories: string[]) {
  if (
    acceptedCategories.includes('analytics') ||
    acceptedCategories.includes('performance')
  ) {
    enableSentryReplay();
  }
}

function checkStoredConsent() {
  if (typeof document === 'undefined') return;
  const match = document.cookie.match(/(?:^|; )cookieyes-consent=([^;]*)/);
  if (match) {
    const consentDetails = decodeURIComponent(match[1]);
    if (
      consentDetails.includes('analytics=yes') ||
      consentDetails.includes('performance=yes')
    ) {
      enableSentryReplay();
    }
  }
}

if (typeof window !== 'undefined') {
  const handleConsentChange = (event: any) => {
    const acceptedCategories = event.detail?.accepted || [];
    verifyAndEnableReplay(acceptedCategories);
  };

  window.addEventListener('cookieyes_consent_update', handleConsentChange);
  document.addEventListener('cookieyes_consent_update', handleConsentChange);
  window.addEventListener('CookieYes-consent-update', handleConsentChange);
  document.addEventListener('CookieYes-consent-update', handleConsentChange);

  checkStoredConsent();
}
