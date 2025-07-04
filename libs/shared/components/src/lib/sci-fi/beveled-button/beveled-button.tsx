import React, { forwardRef } from 'react';
import { styled } from '@jc/theming';

import { BaseBeveledContainer } from '../base-beveled-container';
import { getBevelConfig, getStyleConfig } from './variants-config';

import type { BevelConfig, ElementStyleConfig, StepConfig } from '../types';
import type { DynamicShadowConfig } from '@jc/ui-hooks';

// Button variant types similar to MUI
export type ButtonVariant = 'contained' | 'outlined' | 'text';
export type ButtonColor =
  | 'primary'
  | 'secondary'
  | 'error'
  | 'warning'
  | 'info'
  | 'success';
export type ButtonSize = 'small' | 'medium' | 'large';

// Button props interface
export interface BeveledButtonProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'color'> {
  variant?: ButtonVariant;
  color?: ButtonColor;
  size?: ButtonSize;
  fullWidth?: boolean;
  disabled?: boolean;
  disableElevation?: boolean;
  disableRipple?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  loading?: boolean;
  href?: string;
  component?: React.ElementType;
  shadowConfig?: DynamicShadowConfig;
  bevelConfig?: BevelConfig;
  stepsConfig?: StepConfig;
}

// Icon wrapper component
const IconWrapper = styled('span', {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',

  variants: {
    size: {
      small: { fontSize: '18px' },
      medium: { fontSize: '20px' },
      large: { fontSize: '22px' },
    },
  },
});

// Styled components for button internals
const ButtonBase = styled('div', {
  position: 'relative',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  textDecoration: 'none',
  verticalAlign: 'middle',
  WebkitTapHighlightColor: 'transparent',
  cursor: 'pointer',
  userSelect: 'none',
  whiteSpace: 'nowrap',

  '&:focus-visible': {
    outline: '2px solid $primary',
    outlineOffset: '2px',
  },

  variants: {
    fullWidth: {
      true: {
        width: '100%',
      },
    },
    disabled: {
      true: {
        cursor: 'not-allowed',
        pointerEvents: 'none',
      },
    },
  },
});

const ButtonContent = styled('span', {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '$2',
  position: 'relative',
  zIndex: 1,
  whiteSpace: 'nowrap',
});

const LoadingSpinner = styled('span', {
  display: 'inline-block',
  width: '1em',
  height: '1em',
  border: '2px solid transparent',
  borderTopColor: 'currentColor',
  borderRadius: '50%',
  animation: 'button-spin 0.8s linear infinite',

  '@keyframes button-spin': {
    from: { transform: 'rotate(0deg)' },
    to: { transform: 'rotate(360deg)' },
  },
});

// Main Button Component
export const BeveledButton = forwardRef<HTMLDivElement, BeveledButtonProps>(
  (
    {
      variant = 'contained',
      color = 'primary',
      size = 'medium',
      fullWidth = false,
      disabled = false,
      disableElevation = false,
      disableRipple = false,
      startIcon,
      endIcon,
      loading = false,
      href,
      component: Component = href ? 'a' : 'button',
      children,
      onClick,
      shadowConfig,
      bevelConfig,
      stepsConfig,
      className,
      ...props
    },
    ref
  ) => {
    const styleConfig = getStyleConfig(variant, color, size, disableElevation);
    const finalBevelConfig = getBevelConfig(size, bevelConfig);

    // Default steps config (no steps for buttons)
    const defaultStepsConfig: StepConfig = {
      top: { segments: [] },
      right: { segments: [] },
      bottom: { segments: [] },
      left: { segments: [] },
    };

    const buttonContent = (
      <ButtonContent>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            {startIcon && <IconWrapper size={size}>{startIcon}</IconWrapper>}
            {children}
            {endIcon && <IconWrapper size={size}>{endIcon}</IconWrapper>}
          </>
        )}
      </ButtonContent>
    );

    return (
      <ButtonBase
        as={BaseBeveledContainer as any}
        ref={ref}
        fullWidth={fullWidth}
        disabled={disabled || loading}
        className={className}
        onClick={onClick}
        role={Component === 'button' ? 'button' : undefined}
        tabIndex={disabled ? -1 : 0}
        styleConfig={styleConfig}
        shadowConfig={shadowConfig}
        bevelConfig={finalBevelConfig}
        stepsConfig={stepsConfig || defaultStepsConfig}
        {...(href && { href })}
        {...props}
      >
        {buttonContent}
      </ButtonBase>
    );
  }
);

BeveledButton.displayName = 'BeveledButton';

// Example usage:
/*
// Basic contained button
<BeveledButton variant="contained" color="primary">
  Click Me
</BeveledButton>

// Outlined button with start icon
<BeveledButton
  variant="outlined"
  color="secondary"
  startIcon={<SaveIcon />}
>
  Save
</BeveledButton>

// Large text button
<BeveledButton
  variant="text"
  color="error"
  size="large"
>
  Delete
</BeveledButton>

// Full width loading button
<BeveledButton
  variant="contained"
  color="primary"
  fullWidth
  loading
>
  Processing...
</BeveledButton>

// Button with custom shadow
<BeveledButton
  variant="contained"
  color="primary"
  shadowConfig={{
    target: { type: 'mouse' },
    maxShadowDistance: 20,
    smoothing: 0.8
  }}
>
  Interactive Shadow
</BeveledButton>

// Link button
<BeveledButton
  variant="text"
  color="primary"
  href="/about"
  component="a"
>
  Learn More
</BeveledButton>
*/
