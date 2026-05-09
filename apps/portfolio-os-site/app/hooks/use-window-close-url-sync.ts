import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { useWindowState } from '@jc/file-system';

import { FileSystem } from '../data/file-system';
import { buildFlatIndex, itemToPathSlugs } from '../data/routing-utils';
import { urlDrivenOpenRef } from './use-route-windows';

const flatIndex = buildFlatIndex(FileSystem);

// Watches the windows array and keeps the URL in sync when windows close.
// Must be mounted inside WindowProvider.
export function useWindowCloseUrlSync() {
  const navigate = useNavigate();
  const { windows } = useWindowState();
  const prevWindowCount = useRef(windows.length);

  useEffect(() => {
    const currentCount = windows.length;
    const windowWasClosed = currentCount < prevWindowCount.current;
    prevWindowCount.current = currentCount;

    // Only update URL on close events, not on open (handled by onOpenWindow).
    // Also skip if this render was caused by a URL-driven open.
    if (!windowWasClosed || urlDrivenOpenRef.current) return;

    const visible = windows.filter((w) => !w.isClosing && !w.minimized);

    if (visible.length === 0) {
      navigate('/home', { replace: true });
      return;
    }

    const active = visible.reduce((top, w) => (w.zIndex > top.zIndex ? w : top));
    const fsId = active.id.replace(/^window-/, '');
    const item = flatIndex.get(fsId);
    if (!item) return;

    const slugs = itemToPathSlugs(item, FileSystem);
    navigate('/home/' + slugs.join('/'), { replace: true });
  }, [windows, navigate]);
}
