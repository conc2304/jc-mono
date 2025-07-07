// hooks/useBeveledStyles.ts
import { ComponentState, useMemo } from 'react';

import {
  generateBeveledStyles,
  BeveledComponentType,
  BeveledVariant,
  BeveledColor,
  BeveledSize,
} from '../components/theme/beveled-style-generators';

export interface UseBeveledStylesProps {
  componentType: BeveledComponentType;
  variant?: BeveledVariant;
  color?: BeveledColor;
  size?: BeveledSize;
  disabled?: boolean;
  isActive?: boolean;
  isHover?: boolean;
  isFocus?: boolean;
}

export const useBeveledStyles = ({
  componentType,
  variant,
  color,
  size,
  disabled = false,
  isActive = false,
  isHover = false,
  isFocus = false,
}: UseBeveledStylesProps) => {
  return useMemo(() => {
    // Determine current state based on props
    let state: ComponentState = 'default';
    if (disabled) state = 'disabled';
    else if (isActive) state = 'active';
    else if (isFocus) state = 'focus';
    else if (isHover) state = 'hover';

    return generateBeveledStyles({
      componentType,
      variant,
      color,
      size,
      state,
    });
  }, [
    componentType,
    variant,
    color,
    size,
    disabled,
    isActive,
    isHover,
    isFocus,
  ]);
};
