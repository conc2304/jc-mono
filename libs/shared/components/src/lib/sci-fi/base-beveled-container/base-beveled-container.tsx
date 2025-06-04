import React, { useRef, useEffect, useState } from 'react';

import { BevelConfig, GlowConfig } from '../types';
import {
  generateBeveledCornersPath,
  generateFillPath,
  generateStraightEdgesPath,
  getAdjustedStrokeWidth,
  getAverageBevelAngle,
} from './utils';

interface BaseBeveledContainerProps
  extends Omit<React.SVGProps<SVGSVGElement>, 'width' | 'height' | 'onClick'> {
  bevelConfig?: BevelConfig;
  fill?: string;
  background?: string; // CSS background value (color, gradient, image, etc.)
  stroke?: string;
  strokeWidth?: number;
  glow?: GlowConfig;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode; // Content inside the shape
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void; // Click handler for button behavior
  disabled?: boolean; // For button-like behavior
  role?: string; // Accessibility role (button, dialog, etc.)
  tabIndex?: number; // For keyboard navigation
  contentStyle?: React.CSSProperties;
  padding?: number | string; // Additional padding around children
}

// Main component with dynamic viewBox based on children size
export const BaseBeveledContainer = ({
  bevelConfig = {},
  fill = 'currentColor',
  background,
  stroke,
  strokeWidth = 0,
  glow,
  className = '',
  style = {},
  children,
  onClick,
  disabled = false,
  role,
  tabIndex,
  contentStyle,
  padding = '0.5rem',
  ...svgProps
}: BaseBeveledContainerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isInitialized, setIsInitialized] = useState(false);

  // Generate unique IDs (must be before early return to maintain hook order)
  const glowFilterId = React.useMemo(
    () => `glow-filter-${Math.random().toString(36).substr(2, 9)}`,
    []
  );

  // Convert padding to pixels for calculations
  const getPaddingPixels = (paddingValue: number | string): number => {
    if (typeof paddingValue === 'number') return paddingValue;

    // Simple conversion for common CSS units - you might want to enhance this
    if (paddingValue.endsWith('px')) {
      return parseFloat(paddingValue);
    } else if (paddingValue.endsWith('rem')) {
      return parseFloat(paddingValue) * 16; // Assuming 16px = 1rem
    } else if (paddingValue.endsWith('em')) {
      return parseFloat(paddingValue) * 16; // Simplified assumption
    }

    return 16; // Default fallback
  };

  const paddingPixels = getPaddingPixels(padding);

  // Measure content size and update viewBox dimensions
  useEffect(() => {
    const updateDimensions = () => {
      if (contentRef.current) {
        const contentRect = contentRef.current.getBoundingClientRect();

        // If content has no size, use minimum dimensions
        const contentWidth = contentRect.width || 100;
        const contentHeight = contentRect.height || 50;

        // Add padding around the content
        const totalWidth = contentWidth + paddingPixels * 2;
        const totalHeight = contentHeight + paddingPixels * 2;

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

        // Add padding around the content
        const totalWidth = (width || 100) + paddingPixels * 2;
        const totalHeight = (height || 50) + paddingPixels * 2;

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
  }, [isInitialized, paddingPixels]);

  // Don't render SVG until we have real dimensions
  if (!isInitialized || dimensions.width === 0 || dimensions.height === 0) {
    return (
      <div
        ref={containerRef}
        className={className}
        style={{
          display: 'inline-block',
          position: 'relative',
          ...style,
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
            padding: typeof padding === 'string' ? padding : `${padding}px`,
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

  const fillPath = generateFillPath(
    dimensions.width,
    dimensions.height,
    bevelConfig
  );
  const straightEdgesPath = generateStraightEdgesPath(
    dimensions.width,
    dimensions.height,
    bevelConfig
  );
  const beveledCornersPath = generateBeveledCornersPath(
    dimensions.width,
    dimensions.height,
    bevelConfig
  );

  // Calculate adjusted stroke width for beveled corners
  const averageBevelAngle = getAverageBevelAngle(bevelConfig);
  const adjustedStrokeWidth = getAdjustedStrokeWidth(
    averageBevelAngle,
    strokeWidth
  );

  // Glow configuration with defaults
  const glowColor = glow?.color || stroke || '#ffffff';
  const glowIntensity = (glow?.intensity ?? 3) * 2;
  const glowSpread = glow?.spread ?? 1;
  const glowOpacity = glow?.opacity ?? 0.8;

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

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        display: 'inline-block',
        position: 'relative',
        width: `${dimensions.width}px`,
        height: `${dimensions.height}px`,
        ...interactiveStyles,
        ...style,
      }}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role={role || (onClick ? 'button' : undefined)}
      tabIndex={isClickable ? tabIndex ?? 0 : tabIndex}
      aria-disabled={disabled}
    >
      {/* Background div with CSS background */}
      {background && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: background,
            clipPath: `path('${fillPath}')`,
            zIndex: 1,
            pointerEvents: 'none',
          }}
        />
      )}

      <svg
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
        <defs>
          {/* Define glow filter if provided */}
          {glow && (
            <filter
              id={glowFilterId}
              x="-50%"
              y="-50%"
              width="200%"
              height="200%"
            >
              <feGaussianBlur
                stdDeviation={glowIntensity}
                result="coloredBlur"
              />
              <feMorphology
                operator="dilate"
                radius={glowSpread}
                result="dilated"
              />
              <feGaussianBlur
                in="dilated"
                stdDeviation={glowIntensity}
                result="glowBlur"
              />

              <feFlood
                floodColor={glowColor}
                floodOpacity={glowOpacity}
                result="glowColor"
              />
              <feComposite
                in="glowColor"
                in2="glowBlur"
                operator="in"
                result="coloredGlow"
              />

              <feMerge>
                <feMergeNode in="coloredGlow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          )}
        </defs>

        {/* Fill path (only if no background is provided) */}
        {!background && <path d={fillPath} fill={fill} stroke="none" />}

        {/* Straight edges with normal stroke width */}
        {stroke && strokeWidth > 0 && (
          <path
            d={straightEdgesPath}
            fill="none"
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="square"
            filter={glow ? `url(#${glowFilterId})` : undefined}
          />
        )}

        {/* Beveled corners with adjusted stroke width */}
        {stroke && strokeWidth > 0 && (
          <path
            d={beveledCornersPath}
            fill="none"
            stroke={stroke}
            strokeWidth={adjustedStrokeWidth}
            strokeLinecap="square"
            filter={glow ? `url(#${glowFilterId})` : undefined}
          />
        )}
      </svg>

      {/* Content layer */}
      {children && (
        <div
          ref={contentRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: typeof padding === 'string' ? padding : `${padding}px`,
            boxSizing: 'border-box',
            clipPath: `path('${fillPath}')`,
            pointerEvents: isClickable ? 'none' : 'auto', // Allow content interaction for modals
            whiteSpace: 'nowrap', // Prevent text wrapping in final render too
            ...contentStyle,
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
};
