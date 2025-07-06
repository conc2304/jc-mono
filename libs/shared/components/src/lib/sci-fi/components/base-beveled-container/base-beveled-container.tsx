import React, {
  useRef,
  useCallback,
  useMemo,
  createElement,
  CSSProperties,
  ElementType,
} from 'react';
import { ThemeColor, ThemeVariant } from '@jc/theming';
// import { DynamicShadowConfig, useDynamicShadow } from '@jc/ui-hooks';

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
import {
  BevelConfig,
  ElementStyleConfig,
  StepConfig,
  SlotStyleConfig,
  ComponentState,
} from '../../types';
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
  styleConfig?: ElementStyleConfig;
  shadowConfig?: DynamicShadowConfig;
  // stroke?: string;
  // strokeWidth?: number;
  className?: string;
  children?: React.ReactNode;
  style?: CSSProperties;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  disabled?: boolean;
  role?: string;
  tabIndex?: number;

  // New props for enhanced styling
  color?: ThemeColor;
  variant?: ThemeVariant;
  isActive?: boolean;
  slotStyles?: SlotStyleConfig;
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
  color = 'primary',
  variant = 'solid',
  isActive = false,
  slotStyles = DEFAULT_EMPTY_OBJ,
}: BaseBeveledContainerProps) => {
  // Refs
  const containerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Configuration
  const strokeWidth = getStrokeWidthPixels(
    slotStyles.border?.default?.strokeWidth
  );

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
  const getSlotStyles = useCallback(
    (slotName: keyof SlotStyleConfig) => {
      const slotConfig = slotStyles[slotName];
      if (!slotConfig) return {};

      // Return styles for current state, falling back to default
      return slotConfig[currentState] || slotConfig.default || {};
    },
    [slotStyles, currentState]
  );

  // Enhanced styles with state support
  const enhancedRootStyles = getSlotStyles('root');
  const enhancedBackgroundStyles = getSlotStyles('background');
  const enhancedShadowStyles = getSlotStyles('shadow');
  const enhancedBorderStyles = getSlotStyles('border');
  const enhancedContentStyles = getSlotStyles('content');

  console.log({ enhancedBorderStyles });

  const shadowFilter = useMemo(() => {
    if (!isShadowVisible) return 'none';

    // Use custom shadow styles filter if provided, otherwise calculate based on offset
    return (
      enhancedShadowStyles.filter ??
      `drop-shadow(${shadowOffset.x}px ${shadowOffset.y}px 2.5px rgba(0, 0, 0, 0.35))`
    );
  }, [isShadowVisible, enhancedShadowStyles.filter, shadowOffset]);

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
      ...enhancedRootStyles,
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
    'data-color': color,
    'data-variant': variant,
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
            ...enhancedContentStyles,
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
          transition: 'filter 3ms, all 0.2s ease',
          ...enhancedShadowStyles,
        },
      },
      [
        React.createElement(ContainerBackground, {
          key: 'background',
          innerRect,
          fillPath,
          backgroundStyles: {
            transition: 'all 0.2s ease',
            ...enhancedBackgroundStyles,
            zIndex: 1,
          },
        }),

        React.createElement(ContainerBorder, {
          key: 'border',
          dimensions,
          shapeTransform,
          borderPath,
          borderStyles: {
            transition: 'all 0.2s ease',
            ...enhancedBorderStyles,
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
              ...enhancedContentStyles,
            },
            isClickable,
            contentRef,
          }),
      ]
    )
  );
};
