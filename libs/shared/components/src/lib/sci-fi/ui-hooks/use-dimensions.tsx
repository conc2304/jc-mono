import { useRef, useEffect, useState } from 'react';

import { getMinPadding, getStepBounds } from '../base-beveled-container/utils';
import { Dimensions } from '../types';

export const useContainerDimensions = (
  contentRef: React.RefObject<HTMLDivElement | null>,
  padding: ReturnType<typeof getMinPadding>,
  stepBounds: ReturnType<typeof getStepBounds>,
  strokeWidth: number
) => {
  const [dimensions, setDimensions] = useState<Dimensions>({
    width: 0,
    height: 0,
  });
  const [isInitialized, setIsInitialized] = useState(false);

  const { paddingTop, paddingRight, paddingBottom, paddingLeft } = padding;

  useEffect(() => {
    const calculateDimensions = (width: number, height: number) => {
      const contentWidth = width || 100;
      const contentHeight = height || 50;

      return {
        width:
          contentWidth +
          paddingLeft +
          paddingRight +
          stepBounds.left +
          stepBounds.right +
          strokeWidth,
        height:
          contentHeight +
          paddingTop +
          paddingBottom +
          stepBounds.top +
          stepBounds.bottom +
          strokeWidth,
      };
    };

    const updateDimensions = () => {
      if (contentRef.current) {
        const rect = contentRef.current.getBoundingClientRect();
        const newDimensions = calculateDimensions(rect.width, rect.height);

        if (newDimensions.width > 0 && newDimensions.height > 0) {
          setDimensions(newDimensions);
          if (!isInitialized) {
            setIsInitialized(true);
          }
        }
      }
    };

    const rafId = requestAnimationFrame(updateDimensions);

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        const newDimensions = calculateDimensions(width, height);

        if (newDimensions.width > 0 && newDimensions.height > 0) {
          setDimensions(newDimensions);
          if (!isInitialized) {
            setIsInitialized(true);
          }
        }
      }
    });

    if (contentRef.current) {
      resizeObserver.observe(contentRef.current);
    }

    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
    };
  }, [
    isInitialized,
    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft,
    stepBounds,
    strokeWidth,
  ]);

  return { dimensions, isInitialized };
};
