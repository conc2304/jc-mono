'use client';

import React, { useState } from 'react';

import { useBeveledStyles } from '../../ui-hooks/use-bevel-styles';
import { BaseBeveledContainer } from '../base-beveled-container/base-beveled-container';
import {
  BeveledVariant,
  BeveledColor,
  BeveledSize,
} from '../theme/beveled-style-generators';

interface ButtonProps {
  variant?: BeveledVariant;
  color?: BeveledColor;
  size?: BeveledSize;
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'contained',
  color = 'primary',
  size = 'medium',
  disabled = false,
  children,
  onClick,
  className = '',
}) => {
  const [isHover, setIsHover] = useState(false);
  const [isFocus, setIsFocus] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const slotStyles = useBeveledStyles({
    componentType: 'button',
    variant,
    color,
    size,
    disabled,
    isActive,
    isHover,
    isFocus,
  });

  console.log({ slotStyles });

  return (
    <BaseBeveledContainer
      component="button"
      className={`button button--${variant} button--${color} button--${size} ${className}`}
      bevelConfig={{
        topLeft: { bevelSize: 30, bevelAngle: 45 },
        topRight: { bevelSize: 8, bevelAngle: 45 },
        bottomRight: { bevelSize: 30, bevelAngle: 45 },
        bottomLeft: { bevelSize: 10, bevelAngle: 45 },
      }}
      stepsConfig={{
        top: {
          segments: [
            {
              start: 0.5,
              end: 1,
              height: 30,
            },
          ],
        },
      }}
      onClick={onClick}
      disabled={disabled}
      isActive={isActive}
      // Pass generated styles to slots
      backgroundStyle={slotStyles.background}
      borderStyle={slotStyles.border}
      contentStyle={slotStyles.content}
      shadowStyle={slotStyles.shadow}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      onFocus={() => setIsFocus(true)}
      onBlur={() => setIsFocus(false)}
      onMouseDown={() => setIsActive(true)}
      onMouseUp={() => setIsActive(false)}
    >
      {children}
    </BaseBeveledContainer>
  );
};

// Usage:
// <Button variant="contained" color="primary" size="large">Click me</Button>
// <Button variant="outlined" color="secondary">Cancel</Button>
// <Button variant="text" disabled>Disabled</Button>
