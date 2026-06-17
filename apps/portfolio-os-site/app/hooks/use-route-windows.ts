import { useEffect, useRef } from 'react';
import { useParams } from 'react-router';
import { useWindowActions } from '@jc/file-system';

import { FileSystem } from '../data/file-system';
import { resolvePathSlugs } from '../data/routing-utils';

// Shared flag: true while openWindow calls are driven by the URL, so
// onOpenWindow in useWindowUrlSync can skip re-navigating.
export const urlDrivenOpenRef = { current: false };

// Set when in-window navigation (next/prev) updates the URL after
// replaceWindowContent already swapped content — skip opening a duplicate window.
export const navigationUrlSyncRef = { current: false };

export function useRouteWindows() {
  const params = useParams();
  const { openWindow } = useWindowActions();
  const splat = params['*'];
  const prevSplat = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (splat === prevSplat.current) return;
    prevSplat.current = splat;

    if (!splat) return;

    const slugs = splat.split('/').filter(Boolean);
    if (slugs.length === 0) return;

    if (navigationUrlSyncRef.current) {
      navigationUrlSyncRef.current = false;
      return;
    }

    const items = resolvePathSlugs(slugs, FileSystem);
    urlDrivenOpenRef.current = true;
    items.forEach((item) => openWindow(item.id));
    urlDrivenOpenRef.current = false;
  }, [splat, openWindow]);
}
