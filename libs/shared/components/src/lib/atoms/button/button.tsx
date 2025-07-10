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
  // borderSize?: number;
}
const augmentationSizeMap = {
  small: '6px',
  medium: '10px',
  large: '14px',
  default: '10px',
};

// Base styled button that will receive the augmented-ui attributes
const StyledButton = styled(MuiButton)<AugmentedButtonProps>(
  ({ theme, color, variant, disabled, size }) => {
    const colorTheme = color && color !== 'inherit' ? color : undefined;
    const componentColor = theme.palette[colorTheme || 'primary'];
    const auSize = augmentationSizeMap[size ?? 'default'];

    // Border Styles
    const borderWidth = borderMap[variant ?? 'text'] ?? 0;
    const url = `https://media4.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3ZGltMDB1YjNrZmdkM2FxZmM0Y3JwYTB1Nmk0Y2w3dW96ZnA2czg5dyZlcD12MV9naWZzX3JlbGF0ZWQmY3Q9Zw/NsDgwokd9edyc1IawD/giphy.webp`;
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

        '--aug-tl': auSize,
        '--aug-tr': auSize,
        '--aug-bl': auSize,
        '--aug-br': auSize,
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
    {
      shape = 'buttonClipped',
      // borderSize = 0,
      children,
      ...props
    },
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
