'use client';
import React from 'react';
import {
  ButtonProps,
  ButtonPropsVariantOverrides,
  Button as MuiButton,
} from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import { OverridableStringUnion } from '@mui/types';

import { getShapeData, SHAPE_MAPPINGS } from '../../augmented-ui-configs';

const borderMap: Record<
  OverridableStringUnion<
    'text' | 'outlined' | 'contained',
    ButtonPropsVariantOverrides
  >,
  number
> = {
  text: 0,
  outlined: 2,
  contained: 2,
};
interface AugmentedButtonProps extends ButtonProps {
  shape?: keyof typeof SHAPE_MAPPINGS;
  animateClick?: boolean;
}
const augmentationSizeMap = {
  small: 0.5,
  medium: 1,
  large: 1.5,
  default: 1,
};

// Base styled button that will receive the augmented-ui attributes
const StyledButton = styled(MuiButton)<AugmentedButtonProps>(
  ({ theme, color, variant, disabled, size }) => {
    const colorTheme = color && color !== 'inherit' ? color : undefined;
    const componentColor = theme.palette[colorTheme || 'primary'];
    const auSize = augmentationSizeMap[size ?? 'default'];

    // Border Styles
    const borderWidth = borderMap[variant ?? 'text'] ?? 0;
    const url = '/gifs/rainbow-color-swipe.gif';
    const urlStyle = `url("${url}") 50% 50% / 200% 200%;`;
    const gradientStyle = `radial-gradient(${alpha(
      componentColor.main,
      !disabled ? 0.5 : 0.1
    )}, ${alpha(componentColor.main, !disabled ? 0.7 : 0.2)})`;
    const styleHover = `${gradientStyle}, ${urlStyle}`;

    return {
      // Apply augmented-ui specific styles
      '&[data-augmented-ui]': {
        '--aug-border-all': borderWidth > 0 ? borderWidth + 'px' : undefined, // size
        '--aug-border-bg': gradientStyle, // style

        '--aug-tl': theme.spacing(auSize),
        '--aug-tr': theme.spacing(auSize),
        '--aug-bl': theme.spacing(auSize),
        '--aug-br': theme.spacing(auSize),
      },

      '&[data-augmented-ui]:hover': {
        '--aug-border-bg': styleHover,
      },

      position: 'relative',
    };
  }
);

// Main AugmentedButton component
export const AugmentedButton = React.forwardRef<
  HTMLButtonElement,
  AugmentedButtonProps
>(
  (
    { shape = 'buttonClipped', animateClick = false, children, ...props },
    ref
  ) => {
    const borderWidth = borderMap[props?.variant ?? 'text'] ?? 0;

    let shapeAttributes = getShapeData({ shape, hasBorder: borderWidth > 0 });

    if (!shapeAttributes) {
      console.warn(
        `Unknown shape: ${shape}. Using default 'buttonClipped' shape.`
      );
      shapeAttributes = SHAPE_MAPPINGS.buttonClipped;
    }

    return (
      <StyledButton
        ref={ref}
        // borderSize={borderWidth}
        {...shapeAttributes}
        {...props}
      >
        {children}
      </StyledButton>
    );
  }
);

AugmentedButton.displayName = 'AugmentedButton';
