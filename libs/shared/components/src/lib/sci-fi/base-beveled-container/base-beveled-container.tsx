import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useDebounce } from '@jc/ui-hooks';

import {
  calculateDynamicShadow,
  generateBeveledCornersPath,
  generateFillPath,
  generateStraightEdgesPath,
  getAdjustedStrokeWidth,
  getAverageBevelAngle,
  getMinPadding,
  getStepBounds,
} from './utils';
import { BevelConfig, StepConfig } from '../types';

interface BaseBeveledContainerProps
  extends Omit<React.SVGProps<SVGSVGElement>, 'width' | 'height' | 'onClick'> {
  bevelConfig?: BevelConfig;
  stepsConfig?: StepConfig;
  backgroundStyle?: React.CSSProperties; // CSS background value (color, gradient, image, etc.)
  stroke?: string;
  strokeWidth?: number;
  className?: string;
  rootStyle?: React.CSSProperties;
  children?: React.ReactNode; // Content inside the shape
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void; // Click handler for button behavior
  disabled?: boolean; // For button-like behavior
  role?: string; // Accessibility role (button, dialog, etc.)
  tabIndex?: number; // For keyboard navigation
  contentStyle?: React.CSSProperties;
}

// Main component with dynamic viewBox based on children size and step support
export const BaseBeveledContainer = ({
  bevelConfig = {},
  stepsConfig = {},
  backgroundStyle,
  stroke,
  strokeWidth = 0,
  className = '',
  style: rootStyle = {},
  children,
  onClick,
  disabled = false,
  role,
  tabIndex,
  contentStyle,
  ...svgProps
}: BaseBeveledContainerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isInitialized, setIsInitialized] = useState(false);
  const [shadowOffset, setShadowOffset] = useState({ x: 0, y: 0 });

  const {
    padding: paddingValue,
    paddingBottom,
    paddingLeft,
    paddingRight,
    paddingTop,
  } = getMinPadding({
    bevelConfig,
    stepsConfig,
    strokeWidth,
  });

  const stepBounds = getStepBounds(stepsConfig);

  // Measure content size and update viewBox dimensions
  useEffect(() => {
    const updateDimensions = () => {
      if (contentRef.current) {
        const contentRect = contentRef.current.getBoundingClientRect();

        // If content has no size, use minimum dimensions
        const contentWidth = contentRect.width || 100;
        const contentHeight = contentRect.height || 50;

        // Add padding around the content and extra space for steps
        const totalWidth =
          contentWidth + paddingValue * 2 + stepBounds.left + stepBounds.right;
        const totalHeight =
          contentHeight + paddingValue * 2 + stepBounds.top + stepBounds.bottom;

        if (totalWidth > 0 && totalHeight > 0) {
          setDimensions({ width: totalWidth, height: totalHeight });
          if (!isInitialized) {
            setIsInitialized(true);
          }
        }
      }
    };

    // Use requestAnimationFrame for smoother initial render
    const rafId = requestAnimationFrame(updateDimensions);

    // Create ResizeObserver to watch for content size changes
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;

        // Add padding around the content and extra space for steps
        const totalWidth =
          (width || 100) +
          paddingValue * 2 +
          stepBounds.left +
          stepBounds.right;
        const totalHeight =
          (height || 50) +
          paddingValue * 2 +
          stepBounds.top +
          stepBounds.bottom;

        if (totalWidth > 0 && totalHeight > 0) {
          setDimensions({ width: totalWidth, height: totalHeight });
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
    paddingValue,
    stepBounds.top,
    stepBounds.right,
    stepBounds.bottom,
    stepBounds.left,
  ]);

  // Create debounced update function
  const updateShadow = useCallback(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const shadow = calculateDynamicShadow(rect, 15);
      setShadowOffset(shadow);
    }
  }, []);

  const debouncedUpdateShadow = useDebounce(updateShadow, 50); // 50ms debounce

  useEffect(() => {
    // Initial calculation
    updateShadow();

    // Use debounced version for events
    window.addEventListener('scroll', debouncedUpdateShadow);
    window.addEventListener('resize', debouncedUpdateShadow);

    return () => {
      window.removeEventListener('scroll', debouncedUpdateShadow);
      window.removeEventListener('resize', debouncedUpdateShadow);
    };
  }, [updateShadow, debouncedUpdateShadow]);

  // Don't render SVG until we have real dimensions
  if (!isInitialized || dimensions.width === 0 || dimensions.height === 0) {
    return (
      <div
        ref={containerRef}
        className={className}
        style={{
          display: 'inline-block',
          position: 'relative',
          ...rootStyle,
        }}
      >
        {/* Hidden content measurer - let content flow naturally */}
        <div
          ref={contentRef}
          style={{
            visibility: 'hidden',
            position: 'absolute',
            top: 0,
            left: 0,
            padding:
              typeof paddingValue === 'string'
                ? paddingValue
                : `${paddingValue}px`,
            whiteSpace: 'nowrap', // Prevent text wrapping during measurement
            display: 'inline-block', // Let content determine its natural size
            ...contentStyle,
          }}
        >
          {children}
        </div>
      </div>
    );
  }

  // Calculate the inner rectangle for the main shape (accounting for step space)
  const innerRect = {
    x: stepBounds.left,
    y: stepBounds.top,
    width: dimensions.width - stepBounds.left - stepBounds.right,
    height: dimensions.height - stepBounds.top - stepBounds.bottom,
  };

  const fillPath = generateFillPath(
    innerRect.width,
    innerRect.height,
    bevelConfig,
    stepsConfig
  );
  const straightEdgesPath = generateStraightEdgesPath(
    innerRect.width,
    innerRect.height,
    bevelConfig,
    stepsConfig
  );
  const beveledCornersPath = generateBeveledCornersPath(
    innerRect.width,
    innerRect.height,
    bevelConfig,
    stepsConfig
  );

  // Calculate adjusted stroke width for beveled corners
  const averageBevelAngle = getAverageBevelAngle(bevelConfig);
  const adjustedStrokeWidth = getAdjustedStrokeWidth(
    averageBevelAngle,
    strokeWidth
  );

  // Determine interactive styles
  const isClickable = onClick && !disabled;
  const interactiveStyles: React.CSSProperties = {
    cursor: isClickable ? 'pointer' : disabled ? 'not-allowed' : 'default',
    opacity: disabled ? 0.6 : 1,
    transition: 'opacity 0.2s ease, transform 0.1s ease',
    ...(isClickable && {
      ':hover': {
        transform: 'scale(1.02)',
      },
      ':active': {
        transform: 'scale(0.98)',
      },
    }),
  };

  // Handle click events
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!disabled && onClick) {
      onClick(event);
    }
  };

  // Handle keyboard events for accessibility
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!disabled && onClick && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      onClick(event as any);
    }
  };

  // Create transform for the main shape (offset by step bounds)
  const shapeTransform = `translate(${innerRect.x}, ${innerRect.y})`;

  return (
    <div
      ref={containerRef}
      className={`base-beveled-container--root  ${className}`}
      style={{
        display: 'inline-block',
        position: 'relative',
        width: `${dimensions.width}px`,
        height: `${dimensions.height}px`,
        margin: '8px',
        ...interactiveStyles,
        ...rootStyle,
        border: 'unset !important',
        overflow: 'visible',
      }}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role={role || (onClick ? 'button' : undefined)}
      tabIndex={isClickable ? tabIndex ?? 0 : tabIndex}
      aria-disabled={disabled}
    >
      {/* Background div with CSS background */}
      {/* {background && ( */}
      <div
        className={'base-beveled-container--background'}
        style={{
          position: 'absolute',
          top: innerRect.y,
          left: innerRect.x,
          width: `${innerRect.width}px`,
          height: `${innerRect.height}px`,
          clipPath: `path('${fillPath}')`,
          zIndex: 1,
          pointerEvents: 'none',
          ...backgroundStyle,
        }}
      />

      <div
        className={'base-beveled-container--background-shadow'}
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          filter: `drop-shadow(${shadowOffset.x}px ${shadowOffset.y}px 2px rgba(17, 235, 255, 0.25))`,
          transition: 'filter 300ms',
        }}
      >
        <div
          className={'base-beveled-container--background'}
          style={{
            position: 'absolute',
            top: innerRect.y,
            left: innerRect.x,
            width: `${innerRect.width}px`,
            height: `${innerRect.height}px`,
            clipPath: `path('${fillPath}')`,
            zIndex: 1,
            pointerEvents: 'none',
            ...backgroundStyle,
          }}
        />
      </div>
      {/* )} */}

      <svg
        className={'base-beveled-container--svg-border'}
        width="100%"
        height="100%"
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        style={{
          display: 'block',
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 2,
          pointerEvents: 'none',
        }}
        preserveAspectRatio="none"
        {...svgProps}
      >
        <g transform={shapeTransform}>
          {/* Fill path (only if no background is provided) */}
          {/* {!background && <path d={fillPath} fill={fill} stroke="none" />} */}

          {/* Straight edges with normal stroke width */}
          {stroke && strokeWidth > 0 && (
            <path
              d={straightEdgesPath}
              fill="none"
              stroke={stroke}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
          )}

          {/* Beveled corners with adjusted stroke width */}
          {stroke && strokeWidth > 0 && (
            <path
              d={beveledCornersPath}
              fill="none"
              stroke={stroke}
              strokeWidth={adjustedStrokeWidth}
              strokeLinecap="round"
            />
          )}
        </g>
      </svg>

      {/* Content layer */}
      {children && (
        <div
          className={'base-beveled-container--children-wrapper'}
          ref={contentRef}
          style={{
            position: 'absolute',
            top: innerRect.y,
            left: innerRect.x,
            // width: `${innerRect.width}px`,
            // height: `${innerRect.height}px`,
            zIndex: 3,

            padding: `${paddingTop}px ${paddingRight}px ${paddingBottom}px ${paddingLeft}px`,
            boxSizing: 'border-box',
            clipPath: `path('${fillPath}')`,
            pointerEvents: isClickable ? 'none' : 'auto', // Allow content interaction for modals

            // whiteSpace: 'nowrap', // Prevent text wrapping in final render too
          }}
        >
          <div
            className={'base-beveled-container--children-wrapper'}
            style={{ ...contentStyle }}
          >
            {children}
          </div>
        </div>
      )}
    </div>
  );
};
