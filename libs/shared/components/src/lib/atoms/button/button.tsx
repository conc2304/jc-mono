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

// Extended button props to include shape
interface AugmentedButtonProps extends ButtonProps {
  shape?: keyof typeof SHAPE_MAPPINGS;
  borderSize?: number;
}
const augmentationSizeMap = {
  small: '6px',
  medium: '10px',
  large: '14px',
  default: '10px',
};

// Base styled button that will receive the augmented-ui attributes
const StyledButton = styled(MuiButton)<AugmentedButtonProps>(
  ({ theme, color, borderSize = 0, variant, disabled, size }) => {
    const colorTheme = color && color !== 'inherit' ? color : undefined;

    const componentColor = theme.palette[colorTheme || 'primary'];

    const auSize = augmentationSizeMap[size ?? 'default'];

    const borderWidth = borderSize > 0 ? borderSize + 'px' : undefined;
    console.log({ borderWidth, borderSize });

    const borderStyle = disabled
      ? alpha(componentColor.main, 0.2)
      : color && color !== 'inherit'
      ? componentColor.main
      : undefined;

    return {
      // Apply augmented-ui specific styles
      '&[data-augmented-ui]': {
        // You can add custom CSS variables here to customize the augmented-ui appearance
        '--aug-border-all': borderWidth,
        '--aug-border-bg': borderStyle,
        // '--aug-inlay-all': '1px',
        // '--aug-inlay-bg': `linear-gradient(45deg, ${theme.palette.primary.light}, ${theme.palette.primary.dark})`,
        // '--aug-inlay-opacity': '0.3',
        '--aug-tl': auSize,
        '--aug-tr': auSize,
        '--aug-bl': auSize,
        '--aug-br': auSize,
      },

      // Optional: Add some default styling that works well with augmented-ui
      position: 'relative',
      overflow: 'visible', // Allow augmented shapes to extend beyond normal bounds
    };
  }
);

// Main AugmentedButton component
export const AugmentedButton = React.forwardRef<
  HTMLButtonElement,
  AugmentedButtonProps
>(({ shape = 'buttonClipped', borderSize = 0, children, ...props }, ref) => {
  const borderMap: Record<
    OverridableStringUnion<
      'text' | 'outlined' | 'contained',
      ButtonPropsVariantOverrides
    >,
    number
  > = {
    text: 0,
    outlined: 1,
    contained: 2,
  };

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
      borderSize={borderWidth}
      {...shapeAttributes}
      {...props}
    >
      {children}
    </StyledButton>
  );
});

AugmentedButton.displayName = 'AugmentedButton';
