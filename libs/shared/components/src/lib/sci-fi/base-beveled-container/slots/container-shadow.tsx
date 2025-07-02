import React, { useRef, useEffect, useCallback, memo } from 'react';
import { useDebounce } from '@jc/ui-hooks';

import { BeveledContainerState } from '../../context';
import { StateStyles } from '../../types';
import { calculateDynamicShadow } from '../utils';

interface ContainerShadowProps {
  children: React.ReactNode;
  shadowStyles: Record<string, any>;
  currentState: BeveledContainerState['currentState'];
  styleConfig?: {
    shadow?: StateStyles;
  };
  containerRef?: React.RefObject<HTMLDivElement | null>;
}

export const ContainerShadow = memo(
  ({
    children,
    shadowStyles,
    currentState,
    styleConfig,
    containerRef,
  }: ContainerShadowProps) => {
    const shadowRef = useRef<HTMLDivElement>(null);
    const shadowOffsetRef = useRef({ x: 0, y: 0 });

    // Create debounced update function
    const updateShadow = useCallback(() => {
      if (shadowRef.current) {
        const rect = shadowRef.current.getBoundingClientRect();
        const shadow = calculateDynamicShadow(rect, 15);

        // Only update if shadow actually changed
        if (
          shadow.x !== shadowOffsetRef.current.x ||
          shadow.y !== shadowOffsetRef.current.y
        ) {
          shadowOffsetRef.current = shadow;

          // Update shadow directly via DOM to avoid re-renders
          const filterValue =
            styleConfig?.shadow?.[currentState]?.filter ??
            styleConfig?.shadow?.default?.filter ??
            `drop-shadow(${shadow.x * 5.5}px ${
              shadow.y * 5.5
            }px 2.5px rgba(0, 0, 0, 0.35))`;

          shadowRef.current.style.filter = filterValue;
        }
      }
    }, [currentState, styleConfig]);

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
        ref={shadowRef}
        className="base-beveled-container--shadow"
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'block', // Ensure proper block layout
          filter:
            shadowStyles.filter ??
            `drop-shadow(${shadowOffsetRef.current.x * 5.5}px ${
              shadowOffsetRef.current.y * 5.5
            }px 2.5px rgba(0, 0, 0, 0.35))`,
          transition: shadowStyles.transition ?? 'filter 300ms, all 0.2s ease',
          ...shadowStyles,
        }}
      >
        {children}
      </div>
    );
  }
);
