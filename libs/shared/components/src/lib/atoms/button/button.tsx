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
import { Property } from 'csstype';

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
  inlayBg?: Property.Background;
  inlayOffset?: Property.Width;
}
const augmentationSizeMap = {
  small: 0.5,
  medium: 1,
  large: 1.5,
  default: 1,
};

// Base styled button that will receive the augmented-ui attributes
const StyledButton = styled(MuiButton, {
  shouldForwardProp: (prop) =>
    !['shape', , 'inlayOffset', 'inlayBg'].includes(prop as string),
})<AugmentedButtonProps>(
  ({ theme, color, variant, disabled, size, inlayBg, inlayOffset }) => {
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
    const inlayOffsetValue =
      inlayBg && inlayOffset ? (!inlayOffset ? '3px' : inlayOffset) : undefined;

    return {
      // Apply augmented-ui specific styles
      '&[data-augmented-ui]': {
        background: inlayBg ? 'red' : undefined,

        '--aug-border-all': borderWidth > 0 ? borderWidth + 'px' : undefined, // size
        '--aug-border-bg': gradientStyle, // style

        '--aug-tl': theme.spacing(auSize),
        '--aug-tr': theme.spacing(auSize),
        '--aug-bl': theme.spacing(auSize),
        '--aug-br': theme.spacing(auSize),

        '--aug-inlay-bg': inlayBg || undefined,
        '--aug-inlay-all': inlayOffsetValue,
      },

      '&[data-augmented-ui]:hover': {
        '--aug-border-bg': styleHover,
      },

      // if Inlay is present do not use hover effect
      ...(inlayBg
        ? {}
        : {
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: '-100%',
              width: '100%',
              height: '100%',
              background: `linear-gradient(90deg, transparent, ${
                (color &&
                  color !== 'inherit' &&
                  theme.palette[color as Exclude<typeof color, 'inherit'>]
                    ?.light) ||
                'inherit'
              }, transparent)`,
              transition: 'left 0.5s',
            },

            '&:hover::before': {
              left: '100%',
            },
          }),

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
    { shape = 'buttonClipped', inlayBg, inlayOffset, children, ...props },
    ref
  ) => {
    const borderWidth = borderMap[props?.variant ?? 'text'] ?? 0;
    const hasInlay = Boolean(inlayBg);

    let shapeAttributes = getShapeData({
      shape,
      hasBorder: borderWidth > 0,
      hasInlay,
    });

    if (!shapeAttributes) {
      console.warn(
        `Unknown shape: ${shape}. Using default 'buttonClipped' shape.`
      );
      shapeAttributes = SHAPE_MAPPINGS.buttonClipped;
    }

    return (
      <StyledButton
        ref={ref}
        inlayBg={inlayBg}
        inlayOffset={inlayOffset}
        {...shapeAttributes}
        {...props}
      >
        {children}
      </StyledButton>
    );
  }
);

AugmentedButton.displayName = 'AugmentedButton';
