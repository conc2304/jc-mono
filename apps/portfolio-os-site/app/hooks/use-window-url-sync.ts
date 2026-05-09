import { useCallback } from 'react';
import { useNavigate } from 'react-router';

import { FileSystem } from '../data/file-system';
import { buildFlatIndex, itemToPathSlugs } from '../data/routing-utils';
import { urlDrivenOpenRef } from './use-route-windows';

const flatIndex = buildFlatIndex(FileSystem);

function fsIdToPath(fsId: string): string | null {
  const item = flatIndex.get(fsId);
  if (!item) return null;
  const slugs = itemToPathSlugs(item, FileSystem);
  return '/home/' + slugs.join('/');
}

export function useWindowUrlSync() {
  const navigate = useNavigate();

  const onOpenWindow = useCallback(
    (fsId: string) => {
      // Skip navigating when the open was triggered by the URL itself.
      if (urlDrivenOpenRef.current) return;
      const path = fsIdToPath(fsId);
      if (path) navigate(path, { replace: false });
    },
    [navigate]
  );

  const onReplaceWindowContent = useCallback(
    (_windowId: string, metadata?: Record<string, unknown>) => {
      const itemId = metadata?.['itemId'];
      if (typeof itemId !== 'string') return;
      const path = fsIdToPath(itemId);
      if (path) navigate(path, { replace: true });
    },
    [navigate]
  );

  return { onOpenWindow, onReplaceWindowContent };
}
