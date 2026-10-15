import { useEffect } from 'react';
import { useLocation, useMatches, useNavigationType } from 'react-router';

import { analyticsTransport } from './ga4';
import { createPageViewTracker, PageViewTracker } from './page-view-tracker';

// Module-level so dedupe state survives StrictMode remounts.
const defaultTracker = createPageViewTracker(analyticsTransport);

// Mount once, at the root route. Do not use in pages or windows.
export function usePageViewTracking(tracker: PageViewTracker = defaultTracker) {
  const location = useLocation();
  const action = useNavigationType();
  const matches = useMatches();
  const routeId = matches[matches.length - 1]?.id;

  useEffect(() => {
    tracker.onNavigation({
      key: location.key,
      pathname: location.pathname,
      search: location.search,
      state: location.state,
      action,
      origin: window.location.origin,
      routeId,
    });
  }, [tracker, location, action, routeId]);
}
