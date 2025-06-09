import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useDebounce } from '@jc/ui-hooks';
import { Properties, Property } from 'csstype';

import {
  calculateDynamicShadow,
  // generateBeveledCornersPath,
  generateFillPath,
  // generateStraightEdgesPath,
  generateShapePath,
  getMinPadding,
  getStepBounds,
} from './utils';
import {
  BevelConfig,
  ElementStyleConfig,
  ShadowConfig,
  StateStyles,
  StepConfig,
} from '../types';
import { PathAsLines } from './svg-path-as-lines';

interface BaseBeveledContainerProps
  extends Omit<React.SVGProps<SVGSVGElement>, 'width' | 'height' | 'onClick'> {
  bevelConfig?: BevelConfig;
  stepsConfig?: StepConfig;
  styleConfig?: ElementStyleConfig;
  stroke?: string;
  strokeWidth?: number;
  className?: string;
  // rootStyle?: React.CSSProperties;
  children?: React.ReactNode; // Content inside the shape
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void; // Click handler for button behavior
  disabled?: boolean; // For button-like behavior
  role?: string; // Accessibility role (button, dialog, etc.)
  tabIndex?: number; // For keyboard navigation
}

// Main component with dynamic viewBox based on children size and step support
export const BaseBeveledContainer = ({
  bevelConfig = {},
  stepsConfig = {},
  styleConfig = {},
  stroke,
  strokeWidth = 0,
  className = '',
  style: rootStyle = {},
  onClick,
  disabled = false,
  role,
  tabIndex,
  children,
  ...svgProps
}: BaseBeveledContainerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);
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

  // Helper function to get current state styles
  const getCurrentStateStyles = (elementStyles: StateStyles = {}) => {
    if (disabled && elementStyles.disabled) {
      return { ...elementStyles.default, ...elementStyles.disabled };
    }
    if (isActive && elementStyles.active) {
      return { ...elementStyles.default, ...elementStyles.active };
    }
    if (isHovered && elementStyles.hover) {
      return { ...elementStyles.default, ...elementStyles.hover };
    }
    return elementStyles.default || {};
  };

  // Calculate styles for each element
  const rootStyles = getCurrentStateStyles(styleConfig.root);
  const backgroundStyles = getCurrentStateStyles(styleConfig.background);
  const shadowStyles = getCurrentStateStyles(styleConfig.shadow);
  const borderStyles = getCurrentStateStyles(styleConfig.border);
  const contentStyles = getCurrentStateStyles(styleConfig.content);

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
          contentWidth +
          paddingValue * 2 +
          stepBounds.left +
          stepBounds.right +
          strokeWidth;
        const totalHeight =
          contentHeight +
          paddingValue * 2 +
          stepBounds.top +
          stepBounds.bottom +
          strokeWidth;

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
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseDown={() => setIsActive(true)}
        onMouseUp={() => setIsActive(false)}
        style={{
          display: 'inline-block',
          position: 'relative',
          ...rootStyles,
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
            padding: `${paddingTop}px ${paddingRight}px ${paddingBottom}px ${paddingLeft}px`,
            whiteSpace: 'nowrap', // Prevent text wrapping during measurement
            display: 'inline-block', // Let content determine its natural size
            ...contentStyles,
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
  const borderPath = generateShapePath(
    innerRect.width,
    innerRect.height,
    bevelConfig,
    stepsConfig
  );

  const isClickable = onClick && !disabled;

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
  const strokePadding = Math.ceil(strokeWidth / 2) + 1;

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
        ...rootStyles,
        border: 'unset !important',
        overflow: 'visible',
      }}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={() => setIsActive(true)}
      onMouseUp={() => setIsActive(false)}
      role={role || (onClick ? 'button' : undefined)}
      tabIndex={isClickable ? tabIndex ?? 0 : tabIndex}
      aria-disabled={disabled}
    >
      {/* Background div with CSS background */}
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
          transition: 'all 0.2s ease',
          ...backgroundStyles,
        }}
      />

      <div
        className={'base-beveled-container--background-shadow'}
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          // filter: `drop-shadow(${shadowOffset.x}px ${shadowOffset.y}px 2px rgba(17, 235, 255, 0.25))`, // TODO Migrate out of here
          // transition: 'filter 300ms, all 0.2s ease',
          ...shadowStyles,
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
            ...backgroundStyles,
          }}
        />
      </div>

      <svg
        className={'base-beveled-container--svg-border'}
        width="100%"
        height="100%"
        viewBox={`${-strokePadding} ${-strokePadding} ${
          dimensions.width + strokePadding * 2
        } ${dimensions.height + strokePadding * 2}`}
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
          {stroke && strokeWidth > 0 && (
            <PathAsLines
              pathString={borderPath}
              stroke={borderStyles.stroke || stroke}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
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
            style={{ ...contentStyles }}
          >
            {children}
          </div>
        </div>
      )}
    </div>
  );
};
