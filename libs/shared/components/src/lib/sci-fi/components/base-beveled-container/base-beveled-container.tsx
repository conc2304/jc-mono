'use client';
import {
  useRef,
  useMemo,
  createElement,
  CSSProperties,
  ElementType,
  useCallback,
} from 'react';
import { Property } from 'csstype';

import {
  generateShapePath,
  getMinPadding,
  getStepBounds,
  getStrokeWidthPixels,
} from './bevel-augmentation';
import {
  generateAugmentedShapePath,
  BorderConfig,
  isBorderConfig,
  isBevelConfig,
  getBorderPadding,
} from './border-augmentation';
import {
  ContainerBackground,
  ContainerBorder,
  ContainerContent,
} from './slots';
import { ShapeConfig } from '../../types';
import {
  DynamicShadowConfig,
  useContainerDimensions,
  useDynamicShadow,
} from '../../ui-hooks';

const DEFAULT_EMPTY_OBJ = {};

interface BaseBeveledContainerProps {
  component?: ElementType;
  shapeConfig?: BorderConfig | ShapeConfig;
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
  shapeConfig,
  shadowConfig = DEFAULT_EMPTY_OBJ,
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

  const isBevelShape = useMemo(
    () => (shapeConfig ? isBevelConfig(shapeConfig) : false),
    [shapeConfig]
  );

  const padding = useMemo(() => {
    if (!shapeConfig) {
      return {
        padding: 0,
        paddingTop: 0,
        paddingRight: 0,
        paddingBottom: 0,
        paddingLeft: 0,
      };
    }

    if (isBevelShape) {
      const { bevelConfig, stepsConfig } = shapeConfig as ShapeConfig;
      return getMinPadding({
        bevelConfig,
        stepsConfig,
        strokeWidth,
      });
    } else {
      // shapeConfig is BorderConfig here
      const borderConfig = shapeConfig as BorderConfig;
      return getBorderPadding(borderConfig, strokeWidth);
    }
  }, [shapeConfig, strokeWidth, isBevelShape]);
  const { paddingTop, paddingRight, paddingBottom, paddingLeft } = padding;

  const stepBounds = useMemo(
    () =>
      isBevelShape
        ? getStepBounds((shapeConfig as ShapeConfig).stepsConfig)
        : { top: 0, right: 0, bottom: 0, left: 0 },
    [shapeConfig, isBevelShape]
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
  };

  // Calculate the inner rectangle for the main shape (accounting for step space)
  const innerRect = useMemo(
    () => ({
      x: stepBounds.left,
      y: stepBounds.top,
      width: dimensions.width - stepBounds.left - stepBounds.right,
      height: dimensions.height - stepBounds.top - stepBounds.bottom,
    }),
    [dimensions, stepBounds]
  );

  const getShapePath = useCallback(() => {
    if (!shapeConfig || !isInitialized) {
      return ''; // Return empty path if no config
    }

    if (isBevelShape) {
      // Use legacy bevel generation logic
      return generateShapePath(
        innerRect.width,
        innerRect.height,
        (shapeConfig as ShapeConfig).bevelConfig,
        (shapeConfig as ShapeConfig).stepsConfig
      );
    } else if (isBorderConfig(shapeConfig)) {
      // Use new border generation logic
      return generateAugmentedShapePath(
        innerRect.width,
        innerRect.height,
        shapeConfig
      );
    }

    return '';
  }, [shapeConfig, isBevelShape, isInitialized, innerRect]);

  const path = getShapePath();

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

  const shapeTransform = `translate(${innerRect.x}, ${innerRect.y})`;

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
        createElement(ContainerBackground, {
          key: 'background',
          innerRect,
          fillPath: path,
          style: {
            transition: 'all 0.2s ease',
            zIndex: 1,
            background: 'rgba(67, 56, 56, 0.38)',
          },
        }),

        createElement(ContainerBorder, {
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
          createElement(ContainerContent, {
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
