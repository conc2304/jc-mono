import { createTransition } from '../../../../../../theming/src/lib/vanilla-extract';
import { ComponentState } from '../../types';

import { beveledThemeContract } from './components-theme.css';

export type BeveledComponentType = 'button';
export type BeveledVariant = 'contained' | 'outlined' | 'text';
export type BeveledColor =
  | 'primary'
  | 'secondary'
  | 'error'
  | 'warning'
  | 'info'
  | 'success';
export type BeveledSize = 'small' | 'medium' | 'large';

export interface BeveledSlotStyles {
  background: React.CSSProperties;
  border: React.CSSProperties;
  content: React.CSSProperties;
  shadow: React.CSSProperties;
}

export interface BeveledStyleGeneratorProps {
  componentType: BeveledComponentType;
  variant?: BeveledVariant;
  color?: BeveledColor;
  size?: BeveledSize;
  state: ComponentState;
}

export const generateBeveledStyles = ({
  componentType,
  variant = 'contained',
  color = 'primary',
  size = 'medium',
  state,
}: BeveledStyleGeneratorProps): BeveledSlotStyles => {
  const componentTheme = beveledThemeContract.components[componentType];

  // Base styles using CSS variables from the theme
  const baseStyles: BeveledSlotStyles = {
    background: {
      backgroundColor: componentTheme.background[state],
      transition: createTransition(['background-color']),
    },
    border: {
      stroke: componentTheme.border.color[state],
      strokeWidth: componentTheme.border.width[state],
      transition: createTransition(['stroke', 'stroke-width']),
    },
    content: {
      color: componentTheme.content.color[state],
      fontSize: componentTheme.content.fontSize,
      fontWeight: componentTheme.content.fontWeight,
      lineHeight: componentTheme.content.lineHeight,
      transition: createTransition(['color']),
    },
    shadow: {
      filter: `drop-shadow(${componentTheme.shadow[state]})`,
      transition: createTransition(['filter']),
    },
  };

  // Apply variant modifications
  if (variant === 'outlined') {
    baseStyles.background.backgroundColor = 'transparent';
  } else if (variant === 'text') {
    baseStyles.background.backgroundColor = 'transparent';
    baseStyles.border.stroke = 'transparent';
    baseStyles.border.strokeWidth = '0';
  }

  // Apply size modifications
  const sizeMultipliers = {
    small: 0.8,
    medium: 1,
    large: 1.2,
  };

  if (componentTheme.content.fontSize) {
    baseStyles.content.fontSize = `calc(${componentTheme.content.fontSize} * ${sizeMultipliers[size]})`;
  }

  return baseStyles;
};
