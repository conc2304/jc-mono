// base-beveled-container/base-beveled-container.tsx
'use client';

import React, { ElementType, forwardRef } from 'react';
import { useTheme } from '@jc/theming';
import { assignInlineVars } from '@vanilla-extract/dynamic';

export interface BevelConfig {
  topLeft?: { bevelSize: number; bevelAngle: number };
  topRight?: { bevelSize: number; bevelAngle: number };
  bottomRight?: { bevelSize: number; bevelAngle: number };
  bottomLeft?: { bevelSize: number; bevelAngle: number };
}

export interface StepsConfig {
  top?: {
    segments: Array<{
      start: number;
      end: number;
      height: number;
    }>;
  };
  right?: {
    segments: Array<{
      start: number;
      end: number;
      height: number;
    }>;
  };
  bottom?: {
    segments: Array<{
      start: number;
      end: number;
      height: number;
    }>;
  };
  left?: {
    segments: Array<{
      start: number;
      end: number;
      height: number;
    }>;
  };
}

export interface SlotStyle {
  [key: string]: string | undefined;
}

export interface BaseBeveledContainerProps {
  component?: ElementType;
  className?: string;
  bevelConfig?: BevelConfig;
  stepsConfig?: StepsConfig;
  children?: React.ReactNode;

  // Slot styles
  backgroundStyle?: SlotStyle;
  borderStyle?: SlotStyle;
  contentStyle?: SlotStyle;
  shadowStyle?: SlotStyle;

  // Event handlers
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onMouseDown?: () => void;
  onMouseUp?: () => void;

  // States
  disabled?: boolean;
  isActive?: boolean;

  // Additional props
  [key: string]: any;
}

export const BaseBeveledContainer = forwardRef<
  HTMLElement,
  BaseBeveledContainerProps
>(
  (
    {
      component: Component = 'div',
      className = '',
      bevelConfig,
      stepsConfig,
      children,
      backgroundStyle = {},
      borderStyle = {},
      contentStyle = {},
      shadowStyle = {},
      onClick,
      onMouseEnter,
      onMouseLeave,
      onFocus,
      onBlur,
      onMouseDown,
      onMouseUp,
      disabled = false,
      isActive = false,
      ...props
    },
    ref
  ) => {
    const { currentThemeClass } = useTheme();

    // Combine all slot styles into CSS custom properties
    const combinedStyles = {
      ...backgroundStyle,
      ...borderStyle,
      ...contentStyle,
      ...shadowStyle,
    };

    // Generate the bevel path based on config
    const generateBevelPath = (config: BevelConfig) => {
      // Implementation for generating SVG path or CSS clip-path
      // This would create the beveled shape based on your config
      return '';
    };

    // Generate step effects based on config
    const generateSteps = (config: StepsConfig) => {
      // Implementation for generating step effects
      return {};
    };

    const bevelPath = bevelConfig ? generateBevelPath(bevelConfig) : '';
    const stepStyles = stepsConfig ? generateSteps(stepsConfig) : {};

    return (
      <Component
        ref={ref}
        className={`base-beveled-container ${currentThemeClass} ${className}`}
        style={{
          // Apply slot styles as CSS custom properties
          ...assignInlineVars(combinedStyles),
          // Apply bevel and step styles
          clipPath: bevelPath,
          ...stepStyles,
        }}
        onClick={disabled ? undefined : onClick}
        onMouseEnter={disabled ? undefined : onMouseEnter}
        onMouseLeave={disabled ? undefined : onMouseLeave}
        onFocus={disabled ? undefined : onFocus}
        onBlur={disabled ? undefined : onBlur}
        onMouseDown={disabled ? undefined : onMouseDown}
        onMouseUp={disabled ? undefined : onMouseUp}
        disabled={disabled}
        {...props}
      >
        <div className="beveled-background" />
        <div className="beveled-border" />
        <div className="beveled-content" style={contentStyle}>
          {children}
        </div>
      </Component>
    );
  }
);
