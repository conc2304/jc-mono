import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useDebounce, useDynamicShadow } from '@jc/ui-hooks';

import {
  calculateDynamicShadow,
  generateFillPath,
  generateShapePath,
  getCurrentStateStyles,
  getMinPadding,
  getStepBounds,
} from './utils';
import {
  BeveledContainerContext,
  BeveledContainerState,
  useContainerState,
} from '../context';
import {
  BevelConfig,
  ElementStyleConfig,
  StateStyles,
  StepConfig,
} from '../types';
import {
  ContainerBackground,
  ContainerBorder,
  ContainerContent,
} from './slots';
import { useContainerDimensions } from '../ui-hooks';

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
  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Configuration
  const padding = React.useMemo(
    () => getMinPadding({ bevelConfig, stepsConfig, strokeWidth }),
    [bevelConfig, stepsConfig, strokeWidth]
  );
  const { paddingTop, paddingRight, paddingBottom, paddingLeft } = padding;
  const stepBounds = React.useMemo(
    () => getStepBounds(stepsConfig),
    [stepsConfig]
  );

  // State management

  const { dimensions, isInitialized } = useContainerDimensions(
    contentRef,
    padding,
    stepBounds,
    strokeWidth
  );
  const { isHovered, setIsHovered, isActive, setIsActive, currentState } =
    useContainerState(disabled);
  const shadowOffset = useDynamicShadow(containerRef);

  // Context value for children
  const contextValue: BeveledContainerState = {
    isHovered,
    isActive,
    disabled,
    currentState,
  };

  // Calculate styles for each element
  const rootStyles = getCurrentStateStyles(
    styleConfig.root,
    isHovered,
    isActive,
    disabled
  );
  const backgroundStyles = getCurrentStateStyles(
    styleConfig.background,
    isHovered,
    isActive,
    disabled
  );
  const shadowStyles = getCurrentStateStyles(
    styleConfig.shadow,
    isHovered,
    isActive,
    disabled
  );
  const borderStyles = getCurrentStateStyles(
    styleConfig.border,
    isHovered,
    isActive,
    disabled
  );
  const contentStyles = getCurrentStateStyles(
    styleConfig.content,
    isHovered,
    isActive,
    disabled
  );

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
          filter:
            shadowStyles.filter ??
            `drop-shadow(${shadowOffset.x * 5.5}px ${
              shadowOffset.y * 5.5
            }px 2.5px rgba(0, 0, 0, 0.35))`,
          transition: shadowStyles.transition ?? 'filter 300ms, all 0.2s ease',

          ...shadowStyles,
        }}
      >
        <ContainerBackground
          innerRect={innerRect}
          fillPath={fillPath}
          backgroundStyles={{
            ...backgroundStyles,
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
          borderStyles={{
            ...borderStyles,
          }}
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
