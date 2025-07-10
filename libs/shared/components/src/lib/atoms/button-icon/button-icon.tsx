'use client';

import React from 'react';
import { IconButtonProps, IconButton as MuiIconButton } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import { OverridableStringUnion } from '@mui/types';

import { getShapeData, SHAPE_MAPPINGS } from '../../augmented-ui-configs';

interface AugmentedIconButtonProps extends IconButtonProps {
  shape?: keyof typeof SHAPE_MAPPINGS;
  borderSize?: number;
}

// Base styled button that will receive the augmented-ui attributes
const StyledButton = styled(MuiIconButton)<AugmentedIconButtonProps>(
  ({ theme, color, disabled, size }) => {
    // Create Border Styles
    const colorTheme = color && color !== 'inherit' ? color : undefined;
    const componentColor =
      colorTheme !== 'default'
        ? theme.palette[colorTheme || 'primary']
        : { main: theme.palette.grey[600] };
    const borderWidth = size === 'small' ? '1px' : '2px';
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
        '--aug-border-all': borderWidth,
      },

      '&[data-augmented-ui]:hover': {
        '--aug-border-bg': styleHover,
      },

      position: 'relative',
    };
  }
);

// Main AugmentedButton component
export const AugmentedIconButton = React.forwardRef<
  HTMLButtonElement,
  AugmentedIconButtonProps
>(({ shape = 'futuristicHex', borderSize = 1, children, ...props }, ref) => {
  // const borderWidth = borderMap[props?.variant ?? 'text'] ?? 0;

  let shapeAttributes = getShapeData({ shape, hasBorder: borderSize > 0 });

  if (!shapeAttributes) {
    console.warn(
      `Unknown shape: ${shape}. Using default 'buttonClipped' shape.`
    );
    shapeAttributes = SHAPE_MAPPINGS.buttonClipped;
  }

  return (
    <StyledButton ref={ref} {...shapeAttributes} {...props}>
      {children}
    </StyledButton>
  );
});

AugmentedIconButton.displayName = 'AugmentedIconButton';
