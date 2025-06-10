import { useRef, useEffect, useState } from 'react';

interface DimensionsConfig {
  paddingTop: number;
  paddingBottom: number;
  paddingLeft: number;
  paddingRight: number;
  stepBounds: { top: number; bottom: number; left: number; right: number };
  strokeWidth: number;
}

export const useDimensions = (config: DimensionsConfig) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isInitialized, setIsInitialized] = useState(false);

  const {
    paddingTop,
    paddingBottom,
    paddingLeft,
    paddingRight,
    stepBounds,
    strokeWidth,
  } = config;

  useEffect(() => {
    const updateDimensions = () => {
      if (!contentRef.current) return;

      const contentRect = contentRef.current.getBoundingClientRect();
      const contentWidth = contentRect.width || 100;
      const contentHeight = contentRect.height || 50;

      const totalWidth =
        contentWidth +
        paddingLeft +
        paddingRight +
        stepBounds.left +
        stepBounds.right +
        strokeWidth;
      const totalHeight =
        contentHeight +
        paddingTop +
        paddingBottom +
        stepBounds.top +
        stepBounds.bottom +
        strokeWidth;

      if (totalWidth > 0 && totalHeight > 0) {
        setDimensions({ width: totalWidth, height: totalHeight });
        if (!isInitialized) {
          setIsInitialized(true);
        }
      }
    };

    const rafId = requestAnimationFrame(updateDimensions);
    const resizeObserver = new ResizeObserver(updateDimensions);

    if (contentRef.current) {
      resizeObserver.observe(contentRef.current);
    }

    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
    };
  }, [
    paddingTop,
    paddingBottom,
    paddingLeft,
    paddingRight,
    stepBounds,
    strokeWidth,
    isInitialized,
  ]);

  return { contentRef, dimensions, isInitialized };
};
