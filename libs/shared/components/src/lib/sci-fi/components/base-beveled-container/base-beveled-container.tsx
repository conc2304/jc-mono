'use client';
import React, {
  useRef,
  useMemo,
  createElement,
  CSSProperties,
  ElementType,
} from 'react';
import { Property } from 'csstype';

import {
  ContainerBackground,
  ContainerBorder,
  ContainerContent,
} from './slots';
import {
  generateFillPath,
  generateShapePath,
  getMinPadding,
  getStepBounds,
  getStrokeWidthPixels,
} from './utils';
import { generateAugmentedShapePath, NewShapeConfig } from './utils_new';
import { BevelConfig, StepConfig, ComponentState } from '../../types';
import {
  DynamicShadowConfig,
  useContainerDimensions,
  useDynamicShadow,
} from '../../ui-hooks';

const DEFAULT_EMPTY_OBJ = {};

interface BaseBeveledContainerProps {
  component?: ElementType;
  bevelConfig?: BevelConfig;
  stepsConfig?: StepConfig;
  shadowConfig?: DynamicShadowConfig;

  className?: string;
  children?: React.ReactNode;
  style?: CSSProperties;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  disabled?: boolean;
  role?: string;
  tabIndex?: number;

  isActive?: boolean;

  stroke: Property.Stroke;
  strokeWidth: Property.StrokeWidth;
}

export const BaseBeveledContainer = ({
  component = 'div',
  bevelConfig = DEFAULT_EMPTY_OBJ,
  stepsConfig = DEFAULT_EMPTY_OBJ,
  shadowConfig,
  className = '',
  style: rootStyle = DEFAULT_EMPTY_OBJ,
  isActive = false,
  disabled = false,
  onClick,
  role,
  tabIndex,
  children,
  stroke = 'red',
  strokeWidth: strokeWidthProp = '1',
}: BaseBeveledContainerProps) => {
  // Refs
  const containerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Configuration
  const strokeWidth = getStrokeWidthPixels(strokeWidthProp ?? '2px');

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

  // Determine current component state
  const currentState: ComponentState = useMemo(() => {
    if (disabled) return 'disabled';
    if (isActive) return 'active';
    return 'default';
  }, [disabled, isActive]);

  // Get styles for current state

  const shadowFilter = useMemo(() => {
    if (!isShadowVisible) return 'none';

    // Use custom shadow styles filter if provided, otherwise calculate based on offset
    return `drop-shadow(${shadowOffset.x}px ${shadowOffset.y}px 2.5px rgba(0, 0, 0, 0.35))`;
  }, [isShadowVisible, shadowOffset]);

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
      border: 'unset !important',
      borderStyle: 'unset !important',
      borderRadius: 'unset !important',
      borderWidth: 'unset !important',
      transition: 'all 0.2s ease',
      cursor: isClickable ? 'pointer' : 'default',
      opacity: disabled ? 0.6 : 1,
      ...rootStyle,
    },
    onClick: handleClick,
    onKeyDown: handleKeyDown,
    role: role || (onClick ? 'button' : undefined),
    tabIndex: isClickable ? tabIndex ?? 0 : tabIndex,
    'aria-disabled': disabled,
    'data-state': currentState,
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

  // const fillPath = generateFillPath(
  //   innerRect.width,
  //   innerRect.height,
  //   bevelConfig,
  //   stepsConfig
  // );
  // const borderPath = generateShapePath(
  //   innerRect.width,
  //   innerRect.height,
  //   bevelConfig,
  //   stepsConfig
  // );

  const config: NewShapeConfig = {
    topLeft: { type: 'clip', size: 'md' },
    top: { type: 'round', size: 'lg' },
    topRight: { type: 'round', size: 'lg' },
    right: { type: 'clip', size: 'lg' },
    bottomRight: { type: 'scoop', size: 'md' },
    bottom: { type: 'round', size: 'lg' },
    bottomLeft: { type: 'rect', size: 'sm' },
    left: { type: 'clip', size: 'lg' },
  };

  const path = generateAugmentedShapePath(
    innerRect.width,
    innerRect.height,
    config
  );
  // const lines = convertPathToLines(path); // For your line-based rendering

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
          '&:after': {
            border: '2px solid red',
          },
        },
      },
      [
        React.createElement(ContainerBackground, {
          key: 'background',
          innerRect,
          fillPath: path,
          style: {
            transition: 'all 0.2s ease',
            zIndex: 1,
            background: 'rgba(67, 56, 56, 0.38)',
          },
        }),

        React.createElement(ContainerBorder, {
          key: 'border',
          dimensions,
          shapeTransform,
          borderPath: path,
          style: {
            stroke,
            strokeWidth,
            transition: 'all 0.2s ease',
          },
        }),

        // Content layer
        children &&
          React.createElement(ContainerContent, {
            key: 'content',
            children,
            innerRect,
            fillPath: path,
            paddingTop,
            paddingBottom,
            paddingLeft,
            paddingRight,
            style: {
              transition: 'all 0.2s ease',
            },
            isClickable,
            contentRef,
          }),
      ]
    )
  );
};
