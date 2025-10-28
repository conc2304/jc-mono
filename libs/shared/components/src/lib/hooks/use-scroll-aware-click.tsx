import { useState, useCallback, useRef, CSSProperties, useMemo } from 'react';

// Configuration interface for the hook
export interface ScrollAwareClickConfig {
  /** Distance threshold in pixels before considering it a scroll gesture */
  threshold?: number;
  /** Whether to prevent the default behavior on scroll-triggered clicks */
  preventDefault?: boolean;
  /** Whether to stop event propagation on scroll-triggered clicks */
  stopPropagation?: boolean;
  /** Custom touch-action CSS property value */
  touchAction?: CSSProperties['touchAction'];
  /** Whether to enable debug logging */
  debug?: boolean;
  /** Custom condition to determine if click should be allowed */
  allowClickCondition?: (moveDistance: { x: number; y: number }) => boolean;
}

// Touch position interface
interface TouchPosition {
  x: number;
  y: number;
  timestamp: number;
}

// Return type for the hook
interface ScrollAwareClickReturn<T extends HTMLElement = HTMLElement> {
  /** Props to spread on your element */
  props: {
    onTouchStart: (e: React.TouchEvent<T>) => void;
    onTouchMove: (e: React.TouchEvent<T>) => void;
    onTouchEnd: (e: React.TouchEvent<T>) => void;
    onClick: (e: React.MouseEvent<T>) => void;
    onMouseDown: (e: React.MouseEvent<T>) => void;
    style: CSSProperties;
  };
  /** Current state information */
  state: {
    moved: boolean;
    isScrolling: boolean;
    moveDistance: { x: number; y: number };
  };
  /** Manual reset function */
  reset: () => void;
}

// Default configuration
const DEFAULT_CONFIG: Required<ScrollAwareClickConfig> = {
  threshold: 10,
  preventDefault: true,
  stopPropagation: true,
  touchAction: 'manipulation',
  debug: false,
  allowClickCondition: () => false,
};

/**
 * A flexible hook to prevent click events during scroll/drag gestures on mobile devices
 *
 * @param onClick - The click handler to call when it's a legitimate click
 * @param config - Configuration options for the hook behavior
 * @returns Object with props to spread on element, current state, and utilities
 *
 * @example
 * ```tsx
 * const MyComponent = () => {
 *   const handleClick = (e: React.MouseEvent) => {
 *     console.log('Legitimate click!');
 *   };
 *
 *   const scrollAware = useScrollAwareClick(handleClick, {
 *     threshold: 15,
 *     debug: true
 *   });
 *
 *   return (
 *     <div {...scrollAware.props}>
 *       Click me (scroll-safe)
 *     </div>
 *   );
 * };
 * ```
 */
export const useScrollAwareClick = <T extends HTMLElement = HTMLElement>(
  onClick?: (e: React.MouseEvent<T>) => void,
  config: ScrollAwareClickConfig = {}
): ScrollAwareClickReturn<T> => {
  const mergedConfig = useMemo(
    () => ({ ...DEFAULT_CONFIG, ...config }),
    [config]
  );

  // State management
  const [moved, setMoved] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [moveDistance, setMoveDistance] = useState({ x: 0, y: 0 });

  // Refs to track touch state
  const touchStart = useRef<TouchPosition | null>(null);
  const mouseDown = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>(null);

  // Reset function to clear all state
  const reset = useCallback(() => {
    setMoved(false);
    setIsScrolling(false);
    setMoveDistance({ x: 0, y: 0 });
    touchStart.current = null;
    mouseDown.current = false;

    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
  }, []);

  // Touch start handler
  const handleTouchStart = useCallback((e: React.TouchEvent<T>) => {
    const touch = e.touches[0];
    if (!touch) return;

    touchStart.current = {
      x: touch.pageX,
      y: touch.pageY,
      timestamp: Date.now(),
    };

    setMoved(false);
    setIsScrolling(false);
    setMoveDistance({ x: 0, y: 0 });
  }, []);

  // Touch move handler
  const handleTouchMove = useCallback(
    (e: React.TouchEvent<T>) => {
      if (!touchStart.current) return;

      const touch = e.touches[0];
      if (!touch) return;

      const currentX = touch.pageX;
      const currentY = touch.pageY;
      const moveX = Math.abs(currentX - touchStart.current.x);
      const moveY = Math.abs(currentY - touchStart.current.y);

      const newMoveDistance = { x: moveX, y: moveY };
      setMoveDistance(newMoveDistance);

      const shouldConsiderMoved = mergedConfig.allowClickCondition
        ? !mergedConfig.allowClickCondition(newMoveDistance)
        : moveX > mergedConfig.threshold || moveY > mergedConfig.threshold;

      if (shouldConsiderMoved) {
        setMoved(true);
        setIsScrolling(true);
      }
    },
    [mergedConfig]
  );

  // Touch end handler
  const handleTouchEnd = useCallback(
    (e: React.TouchEvent<T>) => {
      // Set a timeout to reset scrolling state after touch ends
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 100);
    },
    [moved]
  );

  // Mouse down handler (for desktop compatibility)
  const handleMouseDown = useCallback((e: React.MouseEvent<T>) => {
    mouseDown.current = true;
  }, []);

  // Click handler
  const handleClick = useCallback(
    (e: React.MouseEvent<T>) => {
      const shouldPreventClick = moved || isScrolling;
      if (shouldPreventClick) {
        if (mergedConfig.preventDefault) {
          e.preventDefault();
        }
        if (mergedConfig.stopPropagation) {
          e.stopPropagation();
        }

        return false;
      }

      // Call the original onClick handler
      if (onClick) {
        onClick(e);
      }

      // Reset state after successful click
      setTimeout(reset, 50);
      return true;
    },
    [
      moved,
      isScrolling,
      // moveDistance,
      mergedConfig,
      onClick,
      reset,
    ]
  );

  return {
    props: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
      onClick: handleClick,
      onMouseDown: handleMouseDown,
      style: { touchAction: mergedConfig.touchAction },
    },
    state: {
      moved,
      isScrolling,
      moveDistance,
    },
    reset,
  };
};
