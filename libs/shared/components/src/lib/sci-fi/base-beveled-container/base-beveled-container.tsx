import React, {
  useRef,
  useCallback,
  useMemo,
  createElement,
  CSSProperties,
  ElementType,
} from 'react';
import { DynamicShadowConfig, useDynamicShadow } from '@jc/ui-hooks';

import {
  generateFillPath,
  generateShapePath,
  getMinPadding,
  getStepBounds,
} from './utils';
import { BevelConfig, ElementStyleConfig, StepConfig } from '../types';
import {
  ContainerBackground,
  ContainerBorder,
  ContainerContent,
} from './slots';
import { useContainerDimensions } from '../ui-hooks';

interface BaseBeveledContainerProps {
  component?: ElementType;
  bevelConfig?: BevelConfig;
  stepsConfig?: StepConfig;
  styleConfig?: ElementStyleConfig;
  shadowConfig?: DynamicShadowConfig;
  stroke?: string;
  strokeWidth?: number;
  className?: string;
  children: React.ReactNode;
  style?: CSSProperties;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  disabled?: boolean;
  role?: string;
  tabIndex?: number;
}

export const BaseBeveledContainer = ({
  component = 'div',
  bevelConfig = {},
  stepsConfig = {},
  styleConfig = {},
  shadowConfig,
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
  // Refs
  const containerRef = useRef<HTMLElement>(null);
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

  const { shadowOffset, isVisible: isShadowVisible } = useDynamicShadow(
    containerRef,
    shadowConfig
  );

  const rootStyles = styleConfig.root?.default ?? {},
    backgroundStyles = styleConfig.background?.default ?? {},
    shadowStyles = styleConfig.shadow?.default ?? {},
    borderStyles = styleConfig.border?.default ?? {},
    contentStyles = styleConfig.content?.default ?? {};

  const shadowFilter = useMemo(() => {
    if (!isShadowVisible) return 'none';

    // Use custom shadow styles filter if provided, otherwise calculate based on offset
    return (
      shadowStyles.filter ??
      `drop-shadow(${shadowOffset.x}px ${shadowOffset.y}px 2.5px rgba(0, 0, 0, 0.35))`
    );
  }, [isShadowVisible, shadowStyles.filter, shadowOffset]);

  // Event handlers
  const isClickable = Boolean(onClick && !disabled);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (!disabled && onClick) {
      onClick(event);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (!disabled && onClick && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      onClick(event as any);
    }
  };

  // Common props that will be passed to the dynamic component
  const commonProps = {
    ref: containerRef,
    className: `base-beveled-container--root ${className}`,
    style: {
      position: 'relative' as const,
      display: 'inline-block' as const,
      ...rootStyles,
      border: 'unset !important',
      borderStyle: 'unset !important',
      borderRadius: 'unset !important',
      borderWidth: 'unset !important',
    },
    onClick: handleClick,
    onKeyDown: handleKeyDown,
    role: role || (onClick ? 'button' : undefined),
    tabIndex: isClickable ? tabIndex ?? 0 : tabIndex,
    'aria-disabled': disabled,
  };

  // Don't render SVG until we have real dimensions
  if (!isInitialized || dimensions.width === 0 || dimensions.height === 0) {
    return createElement(
      component,
      commonProps,
      // Hidden content measurer - let content flow naturally
      createElement(
        'div',
        {
          ref: contentRef,
          style: {
            visibility: 'hidden',
            position: 'absolute',
            top: 0,
            left: 0,
            padding: `${paddingTop}px ${paddingRight}px ${paddingBottom}px ${paddingLeft}px`,
            whiteSpace: 'nowrap',
            display: 'inline-block',
            ...contentStyles,
          },
        },
        children
      )
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

  // Create transform for the main shape (offset by step bounds)
  const shapeTransform = `translate(${innerRect.x}, ${innerRect.y})`;

  // Update the style to include dimensions
  const finalStyle = {
    ...commonProps.style,
    width: `${dimensions.width}px`,
    height: `${dimensions.height}px`,
  };

  return createElement(
    component,
    {
      ...commonProps,
      style: finalStyle,
    },
    createElement(
      'div',
      {
        className: 'base-beveled-container--shadow',
        style: {
          position: 'relative',
          width: '100%',
          height: '100%',
          filter: shadowFilter,
          transition: shadowStyles.transition ?? 'filter 3ms, all 0.2s ease',
          ...shadowStyles,
        },
      },
      [
        React.createElement(ContainerBackground, {
          key: 'background',
          innerRect,
          fillPath,
          backgroundStyles: {
            ...backgroundStyles,
            zIndex: 1,
          },
        }),

        React.createElement(ContainerBorder, {
          key: 'border',
          dimensions,
          shapeTransform,
          borderPath,
          strokeWidth: strokeWidth ?? Number(borderStyles.strokeWidth ?? 0),
          stroke: borderStyles?.stroke ?? stroke,
          borderStyles: {
            ...borderStyles,
          },
          svgProps,
        }),

        // Content layer
        children &&
          React.createElement(ContainerContent, {
            key: 'content',
            children,
            innerRect,
            fillPath,
            paddingTop,
            paddingBottom,
            paddingLeft,
            paddingRight,
            contentStyles,
            isClickable,
            contentRef,
          }),
      ]
    )
  );
};
