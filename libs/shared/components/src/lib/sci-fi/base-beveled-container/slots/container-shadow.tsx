import { ReactNode, RefObject, useCallback, useEffect, useState } from 'react';
import { useDebounce } from '@jc/ui-hooks';

import { useMousePosition } from '../../context';
import { StateStyles } from '../../types';
import { calculateDynamicShadow } from '../utils';

interface ContainerShadowProps {
  shadowStyles: React.CSSProperties;
  containerRef: RefObject<HTMLDivElement | null>;
  children?: ReactNode;
}

export const ContainerShadow = ({
  shadowStyles,
  containerRef,
  children,
}: ContainerShadowProps) => {
  const [shadowOffset, setShadowOffset] = useState({ x: 0, y: 0 });

  // Create debounced update function
  const updateShadow = useCallback(() => {
    if (containerRef && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const shadow = calculateDynamicShadow(rect, 15);
      setShadowOffset(shadow);
    }
  }, [containerRef]);

  const debouncedUpdateShadow = useDebounce(updateShadow, 50);

  useEffect(() => {
    updateShadow();
    window.addEventListener('scroll', debouncedUpdateShadow);
    window.addEventListener('resize', debouncedUpdateShadow);

    return () => {
      window.removeEventListener('scroll', debouncedUpdateShadow);
      window.removeEventListener('resize', debouncedUpdateShadow);
    };
  }, [updateShadow, debouncedUpdateShadow]);

  return (
    <div
      className={'base-beveled-container--shadow'}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        filter:
          shadowStyles.filter ??
          `drop-shadow(${shadowOffset.x * 5.5}px ${
            shadowOffset.y * 5.5
          }px 2.5px rgba(0, 0, 0, 0.35))`,
        transition: shadowStyles.transition ?? 'filter 300ms, all 0.2s ease',

        ...shadowStyles,
      }}
    >
      {children}
    </div>
  );
};
