import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useDebounce } from '@jc/ui-hooks';

import {
  calculateDynamicShadow,
  generateFillPath,
  generateShapePath,
  getMinPadding,
  getStepBounds,
} from './utils';
import { BeveledContainerContext, BeveledContainerState } from '../context';
import {
  BevelConfig,
  ElementStyleConfig,
  StateStyles,
  StepConfig,
} from '../types';
// import { PathAsLines } from './svg-path-as-lines';
import {
  ContainerBackground,
  ContainerBorder,
  ContainerContent,
} from './slots';
import { PathAsLines } from './slots/svg-path-as-lines';

interface BaseBeveledContainerProps
  extends Omit<
    React.SVGProps<SVGSVGElement>,
    'width' | 'height' | 'onClick' | 'children'
  > {
  bevelConfig?: BevelConfig;
  stepsConfig?: StepConfig;
  styleConfig?: ElementStyleConfig;
  stroke?: string;
  strokeWidth?: number;
  provideStateToChildren?: boolean;
  className?: string;
  children?:
    | React.ReactNode
    | ((state: BeveledContainerState) => React.ReactNode); // Support render prop pattern

  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void; // Click handler for button behavior
  disabled?: boolean; // For button-like behavior
  role?: string; // Accessibility role (button, dialog, etc.)
  tabIndex?: number; // For keyboard navigation
}

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
  provideStateToChildren = true,
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

  // Determine current state
  const getCurrentState = (): BeveledContainerState['currentState'] => {
    if (disabled) return 'disabled';
    if (isActive) return 'active';
    if (isHovered) return 'hover';
    return 'default';
  };

  const currentState = getCurrentState();

  // Context value for children
  const contextValue: BeveledContainerState = {
    isHovered,
    isActive,
    disabled,
    currentState,
  };

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
          paddingLeft +
          paddingRight +
          stepBounds.left +
          stepBounds.right;
        const totalHeight =
          (height || 50) +
          paddingTop +
          paddingBottom +
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

  // Render children with or without context
  const renderChildren = () => {
    if (typeof children === 'function') {
      // Render prop pattern - always provide state
      return children(contextValue);
    }

    if (provideStateToChildren) {
      // Wrap in context provider
      return (
        <BeveledContainerContext.Provider value={contextValue}>
          {children}
        </BeveledContainerContext.Provider>
      );
    }

    // Regular children without context
    return children;
  };

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
            whiteSpace: 'nowrap',
            display: 'inline-block',
            ...contentStyles,
          }}
        >
          {renderChildren()}
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

  const isClickable = Boolean(onClick && !disabled);

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
  const strokePadding = Math.ceil(strokeWidth / 2);

  return (
    <div
      ref={containerRef}
      className={`base-beveled-container--root  ${className}`}
      style={{
        position: 'relative',
        display: 'inline-block',
        width: `${dimensions.width}px`,
        height: `${dimensions.height}px`,
        ...rootStyles,
        border: 'unset !important',
        borderStyle: 'unset !important',
        borderRadius: 'unset !important',
        borderWidth: 'unset !important',
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
      <div
        className={'base-beveled-container--shadow'}
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          // TODO Migrate out of here
          filter: shadowStyles.filter,
          transition: shadowStyles.transition,
          filter: `drop-shadow(${shadowOffset.x * 5.5}px ${
            shadowOffset.y * 5.5
          }px 2.5px rgba(0, 0, 0, 0.35))`,
          transition: 'filter 300ms, all 0.2s ease',

          ...shadowStyles,
        }}
      >
        <ContainerBackground
          innerRect={innerRect}
          fillPath={fillPath}
          backgroundStyles={{
            ...(styleConfig?.background?.[contextValue.currentState] ??
              styleConfig?.background?.default ??
              {}),
            backgroundColor: 'rgba(54, 1, 1, 0.2)',
            zIndex: 1,
          }}
        />

        <ContainerBorder
          dimensions={dimensions}
          strokeWidth={strokeWidth}
          shapeTransform={shapeTransform}
          borderPath={borderPath}
          stroke={stroke}
          borderStyles={
            styleConfig?.border?.[contextValue.currentState] ??
            styleConfig?.border?.default ??
            {}
          }
          svgProps={svgProps}
        />
        {/* Content layer */}
        {children && (
          <ContainerContent
            children={children}
            contextValue={contextValue}
            provideStateToChildren={provideStateToChildren}
            innerRect={innerRect}
            fillPath={fillPath}
            paddingTop={paddingTop}
            paddingBottom={paddingBottom}
            paddingLeft={paddingLeft}
            paddingRight={paddingRight}
            contentStyles={contentStyles}
            isClickable={isClickable}
            contentRef={contentRef}
          />
        )}
      </div>
    </div>
  );
};
