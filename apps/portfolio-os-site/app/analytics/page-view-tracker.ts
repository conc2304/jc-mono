import { buildPageMetadata, PageMetadata } from './page-metadata';

// Passed as router `state` by navigations that only reflect UI changes
// (e.g. closing a window), so they don't count as page views.
export const UI_ONLY_NAVIGATION_STATE = { pageView: 'skip' } as const;

export type NavigationAction = 'POP' | 'PUSH' | 'REPLACE';

export type PageViewPayload = PageMetadata & { page_referrer?: string };

export interface AnalyticsTransport {
  pageView: (payload: PageViewPayload) => void;
}

export type TrackedNavigation = {
  key: string;
  pathname: string;
  search: string;
  state: unknown;
  action: NavigationAction;
  origin: string;
  routeId?: string;
};

function isUiOnlyNavigation(state: unknown): boolean {
  return (
    typeof state === 'object' &&
    state !== null &&
    (state as { pageView?: unknown }).pageView ===
      UI_ONLY_NAVIGATION_STATE.pageView
  );
}

export function createPageViewTracker(transport: AnalyticsTransport) {
  let lastKey: string | undefined;
  let lastPath: string | undefined;
  let lastLocation: string | undefined;

  return {
    onNavigation(navigation: TrackedNavigation): void {
      // Same committed navigation seen again (StrictMode, re-render).
      if (navigation.key === lastKey) return;
      lastKey = navigation.key;

      const metadata = buildPageMetadata(navigation);
      const referrer = lastLocation;
      const isSamePath = metadata.page_path === lastPath;

      // Track every committed location, including skipped ones, so a later
      // revisit of the same path is not mistaken for a duplicate.
      lastPath = metadata.page_path;
      lastLocation = metadata.page_location;

      // New history entry, same destination (re-focus, double push).
      if (isSamePath) return;

      // history.state survives Back/Forward and reloads, so the skip marker is
      // only honoured on the navigation that set it.
      if (navigation.action !== 'POP' && isUiOnlyNavigation(navigation.state)) {
        return;
      }

      transport.pageView(
        referrer ? { ...metadata, page_referrer: referrer } : metadata
      );
    },
  };
}

export type PageViewTracker = ReturnType<typeof createPageViewTracker>;
