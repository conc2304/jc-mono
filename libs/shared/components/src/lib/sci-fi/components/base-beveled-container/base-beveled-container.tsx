'use client';

import React, {
  useRef,
  useMemo,
  createElement,
  CSSProperties,
  ElementType,
  useState,
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
  stroke?: Property.Stroke;
  strokeWidth?: Property.StrokeWidth;
  className?: string;
  children?: React.ReactNode;
  style?: CSSProperties;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  disabled?: boolean;
  role?: string;
  tabIndex?: number;
  isActive?: boolean;

  // New theme-aware style props
  backgroundStyle?: CSSProperties;
  borderStyle?: CSSProperties;
  contentStyle?: CSSProperties;
  shadowStyle?: CSSProperties;

  // Event handlers for state management
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onMouseDown?: () => void;
  onMouseUp?: () => void;
}

export const BaseBeveledContainer = ({
  component = 'div',
  bevelConfig = DEFAULT_EMPTY_OBJ,
  stepsConfig = DEFAULT_EMPTY_OBJ,
  shadowConfig,
  className = '',
  style: rootStyle = DEFAULT_EMPTY_OBJ,
  onClick,
  disabled = false,
  role,
  tabIndex,
  children,
  isActive = false,
  strokeWidth: strokeWidthProp = 0,

  // Theme style props
  backgroundStyle = DEFAULT_EMPTY_OBJ,
  borderStyle = DEFAULT_EMPTY_OBJ,
  contentStyle = DEFAULT_EMPTY_OBJ,
  shadowStyle = DEFAULT_EMPTY_OBJ,

  // Event handlers
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  onMouseDown,
  onMouseUp,
}: BaseBeveledContainerProps) => {
  // Refs
  const containerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Configuration - prioritize borderStyle.strokeWidth over strokeWidthProp
  const strokeWidth = 3;
  // getStrokeWidthPixels(
  //   borderStyle.strokeWidth || strokeWidthProp
  // );

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

  // Enhanced shadow filter that combines dynamic shadow with theme shadow
  const shadowFilter = useMemo(() => {
    const themeShadowFilter = shadowStyle.filter;

    if (!isShadowVisible && !themeShadowFilter) return 'none';

    // If we have a theme shadow filter, use it; otherwise use dynamic shadow
    if (themeShadowFilter) {
      return themeShadowFilter;
    }

    // Fallback to dynamic shadow
    return `drop-shadow(${shadowOffset.x}px ${shadowOffset.y}px 2.5px rgba(0, 0, 0, 0.35))`;
  }, [isShadowVisible, shadowStyle.filter, shadowOffset]);

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

  // Enhanced event handlers that call both internal and external handlers
  const handleMouseEnter = () => {
    onMouseEnter?.();
  };

  const handleMouseLeave = () => {
    onMouseLeave?.();
  };

  const handleFocus = () => {
    onFocus?.();
  };

  const handleBlur = () => {
    onBlur?.();
  };

  const handleMouseDown = () => {
    onMouseDown?.();
  };

  const handleMouseUp = () => {
    onMouseUp?.();
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
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    onFocus: handleFocus,
    onBlur: handleBlur,
    onMouseDown: handleMouseDown,
    onMouseUp: handleMouseUp,
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
            // Apply content styles for measurement
            ...contentStyle,
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
          // Merge theme shadow styles (excluding filter which we handle above)
          ...Object.fromEntries(
            Object.entries(shadowStyle).filter(([key]) => key !== 'filter')
          ),
        },
      },
      [
        React.createElement(ContainerBackground, {
          key: 'background',
          innerRect,
          fillPath,
          style: {
            transition: 'all 0.2s ease',
            zIndex: 1,
            // Merge theme background styles
            ...backgroundStyle,
          },
        }),

        React.createElement(ContainerBorder, {
          key: 'border',
          dimensions,
          shapeTransform,
          borderPath,
          style: {
            transition: 'all 0.2s ease',
            // Merge theme border styles
            ...borderStyle,
          },
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
            contentStyles: {
              transition: 'all 0.2s ease',
              // Merge theme content styles
              ...contentStyle,
            },
            isClickable,
            contentRef,
          }),
      ]
    )
  );
};
