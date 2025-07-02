import { useState, useEffect, useCallback, useRef } from 'react';
import { useDebounce } from '@jc/ui-hooks';

import { calculateDynamicShadow } from '../base-beveled-container/utils';

export const useDynamicShadow = (debounceMs = 50) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shadowOffset, setShadowOffset] = useState({ x: 0, y: 0 });

  const updateShadow = useCallback(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const shadow = calculateDynamicShadow(rect, 15);
      setShadowOffset(shadow);
    }
  }, []);

  const debouncedUpdateShadow = useDebounce(updateShadow, debounceMs);

  useEffect(() => {
    updateShadow();
    window.addEventListener('scroll', debouncedUpdateShadow);
    window.addEventListener('resize', debouncedUpdateShadow);

    return () => {
      window.removeEventListener('scroll', debouncedUpdateShadow);
      window.removeEventListener('resize', debouncedUpdateShadow);
    };
  }, [updateShadow, debouncedUpdateShadow]);

  return { containerRef, shadowOffset };
};
