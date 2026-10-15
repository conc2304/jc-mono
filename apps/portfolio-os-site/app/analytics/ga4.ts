import type { AnalyticsTransport } from './page-view-tracker';

type Gtag = (...args: unknown[]) => void;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: Gtag;
  }
}

const GTAG_SRC = 'https://www.googletagmanager.com/gtag/js';

// EEA + UK + Switzerland default to denied until a consent UI exists.
const CONSENT_RESTRICTED_REGIONS = [
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR',
  'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK',
  'SI', 'ES', 'SE', 'IS', 'LI', 'NO', 'GB', 'CH',
];

const measurementId: string | undefined = import.meta.env.VITE_GA_MEASUREMENT_ID;
const isEnabled = import.meta.env.PROD && Boolean(measurementId);
const isDebugLogging = import.meta.env.VITE_ANALYTICS_DEBUG === 'true';

export function initAnalytics(): void {
  if (!isEnabled || !measurementId || typeof window === 'undefined') return;
  if (window.gtag) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // gtag.js only processes Arguments objects, not plain arrays.
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer?.push(arguments);
  };

  const deniedAds = {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  };
  window.gtag('consent', 'default', {
    ...deniedAds,
    analytics_storage: 'denied',
    region: CONSENT_RESTRICTED_REGIONS,
  });
  window.gtag('consent', 'default', {
    ...deniedAds,
    analytics_storage: 'granted',
  });

  const isDebugView = new URLSearchParams(window.location.search).has(
    'ga_debug'
  );

  window.gtag('js', new Date());
  window.gtag('config', measurementId, {
    // Page views are sent explicitly by usePageViewTracking.
    send_page_view: false,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    // GA treats any debug_mode value as on, so omit it unless needed.
    ...(isDebugView && { debug_mode: true }),
  });

  const script = document.createElement('script');
  script.async = true;
  script.src = `${GTAG_SRC}?id=${encodeURIComponent(measurementId)}`;
  document.head.appendChild(script);
}

const gtagTransport: AnalyticsTransport = {
  pageView: ({ page_path: _pagePath, ...params }) => {
    window.gtag?.('event', 'page_view', params);
  },
};

const consoleTransport: AnalyticsTransport = {
  pageView: (payload) => console.debug('[analytics] page_view', payload),
};

const noopTransport: AnalyticsTransport = {
  pageView: () => undefined,
};

export const analyticsTransport: AnalyticsTransport = isEnabled
  ? gtagTransport
  : isDebugLogging
  ? consoleTransport
  : noopTransport;
