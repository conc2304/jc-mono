import { useEffect, useState, useRef, useCallback, useMemo } from 'react';

// Shadow target configuration types
export type ShadowTarget =
  | { type: 'viewport'; position: { x: number; y: number } } // Position as percentage (0-1)
  | { type: 'mouse' }
  | { type: 'element'; ref: React.RefObject<HTMLElement> }
  | { type: 'static'; offset: { x: number; y: number } };

export interface DynamicShadowConfig {
  target?: ShadowTarget;
  maxShadowDistance?: number;
  updateOnScroll?: boolean;
  updateOnResize?: boolean;
  checkVisibility?: boolean;
  visibilityThreshold?: number; // 0-1, how much of element should be visible
  smoothing?: number; // 0-1, for smooth transitions
}

const defaultConfig: Required<DynamicShadowConfig> = {
  target: { type: 'viewport', position: { x: 0.5, y: 0.5 } },
  maxShadowDistance: 20,
  updateOnScroll: true,
  updateOnResize: true,
  checkVisibility: true,
  visibilityThreshold: 0.1,
  smoothing: 0,
};

export const useDynamicShadow = (
  containerRef: React.RefObject<HTMLElement | null>,
  config?: DynamicShadowConfig
) => {
  const mergedConfig = useMemo(
    () => ({ ...defaultConfig, ...config }),
    [config]
  );
  const [shadowOffset, setShadowOffset] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(true);
  const animationFrameRef = useRef<number>(null);
  const previousOffsetRef = useRef({ x: 0, y: 0 });
  const mousePositionRef = useRef({ x: 0, y: 0 });

  // Check if element is in viewport
  const checkElementVisibility = useCallback(() => {
    if (!containerRef.current || !mergedConfig.checkVisibility) return true;

    const rect = containerRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const windowWidth = window.innerWidth;

    // Calculate how much of the element is visible
    const visibleHeight =
      Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
    const visibleWidth =
      Math.min(rect.right, windowWidth) - Math.max(rect.left, 0);

    const visibleArea = visibleHeight * visibleWidth;
    const totalArea = rect.height * rect.width;
    const visibilityRatio = totalArea > 0 ? visibleArea / totalArea : 0;

    return visibilityRatio >= mergedConfig.visibilityThreshold;
  }, [
    containerRef,
    mergedConfig.checkVisibility,
    mergedConfig.visibilityThreshold,
  ]);

  // Get target position based on configuration
  const getTargetPosition = useCallback(() => {
    const { target } = mergedConfig;

    switch (target.type) {
      case 'viewport':
        return {
          x: window.innerWidth * target.position.x,
          y: window.innerHeight * target.position.y,
        };

      case 'mouse':
        return mousePositionRef.current;

      case 'element':
        if (target.ref.current) {
          const rect = target.ref.current.getBoundingClientRect();
          return {
            x: rect.x + rect.width / 2,
            y: rect.y + rect.height / 2,
          };
        }
        return { x: window.innerWidth / 2, y: window.innerHeight / 2 };

      case 'static':
        return null; // Static shadows don't need target position

      default:
        return { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    }
  }, [mergedConfig]);

  // Calculate shadow offset
  const calculateShadow = useCallback(() => {
    if (!containerRef.current) return { x: 0, y: 0 };

    const { target, maxShadowDistance, smoothing } = mergedConfig;

    // For static shadows, return the configured offset
    if (target.type === 'static') {
      return target.offset;
    }

    const targetPos = getTargetPosition();
    if (!targetPos) return { x: 0, y: 0 };

    const rect = containerRef.current.getBoundingClientRect();
    const elementCenterX = rect.x + rect.width / 2;
    const elementCenterY = rect.y + rect.height / 2;

    // Calculate direction from element to target
    const deltaX = targetPos.x - elementCenterX;
    const deltaY = targetPos.y - elementCenterY;

    // Calculate distance and normalize
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const maxDistance =
      Math.sqrt(
        window.innerWidth * window.innerWidth +
          window.innerHeight * window.innerHeight
      ) / 2;

    // Normalize based on max possible distance
    const normalizedDistance = Math.min(distance / maxDistance, 1);

    // Calculate shadow offset (shadow appears on opposite side of light source)
    const shadowX =
      distance > 0
        ? -(deltaX / distance) * normalizedDistance * maxShadowDistance
        : 0;
    const shadowY =
      distance > 0
        ? -(deltaY / distance) * normalizedDistance * maxShadowDistance
        : 0;

    // Apply smoothing if configured
    if (smoothing > 0) {
      const prevX = previousOffsetRef.current.x;
      const prevY = previousOffsetRef.current.y;

      return {
        x: prevX + (shadowX - prevX) * (1 - smoothing),
        y: prevY + (shadowY - prevY) * (1 - smoothing),
      };
    }

    return {
      x: Math.round(shadowX),
      y: Math.round(shadowY),
    };
  }, [containerRef, mergedConfig, getTargetPosition]);

  // Update shadow with visibility check
  const updateShadow = useCallback(() => {
    // Cancel any pending animation frame
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    animationFrameRef.current = requestAnimationFrame(() => {
      const visible = checkElementVisibility();
      setIsVisible(visible);

      if (visible) {
        const newOffset = calculateShadow();
        previousOffsetRef.current = newOffset;
        setShadowOffset(newOffset);
      }
    });
  }, [checkElementVisibility, calculateShadow]);

  // Mouse move handler
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      mousePositionRef.current = { x: e.clientX, y: e.clientY };
      if (mergedConfig.target.type === 'mouse') {
        updateShadow();
      }
    },
    [mergedConfig.target.type, updateShadow]
  );

  // Setup event listeners
  useEffect(() => {
    updateShadow();

    const listeners: Array<[string, EventListener, EventTarget]> = [];

    if (mergedConfig.updateOnScroll) {
      listeners.push(['scroll', updateShadow, window]);
    }

    if (mergedConfig.updateOnResize) {
      listeners.push(['resize', updateShadow, window]);
    }

    if (mergedConfig.target.type === 'mouse') {
      listeners.push(['mousemove', handleMouseMove as EventListener, window]);
    }

    // Add listeners
    listeners.forEach(([event, handler, target]) => {
      target.addEventListener(event, handler, { passive: true });
    });

    // Cleanup
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      listeners.forEach(([event, handler, target]) => {
        target.removeEventListener(event, handler);
      });
    };
  }, [mergedConfig, updateShadow, handleMouseMove]);

  // Watch for changes in element target
  useEffect(() => {
    if (
      mergedConfig.target.type === 'element' &&
      mergedConfig.target.ref.current
    ) {
      const observer = new ResizeObserver(() => {
        updateShadow();
      });

      observer.observe(mergedConfig.target.ref.current);

      return () => {
        observer.disconnect();
      };
    }
  }, [mergedConfig.target, updateShadow]);

  return {
    shadowOffset: isVisible ? shadowOffset : { x: 0, y: 0 },
    isVisible,
  };
};
