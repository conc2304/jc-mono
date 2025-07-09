import React, { forwardRef } from 'react';
import { clsx } from 'clsx';

import { VariantColor, VariantShape, VariantSize } from '../../themes';

import { buttonBase, buttonShapes } from './button.css';
import {
  augmentedBase,
  augmentedSizes,
  augmentedVariants,
  augmentedGlow,
} from '../base/augmented-base.css';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: VariantColor;
  size?: VariantSize;
  shape?: VariantShape;
  glow?: boolean;
  customAugmentation?: string;
  children: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'medium',
      shape = 'clip',
      glow = false,
      customAugmentation,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const getAugmentedUIAttribute = () => {
      if (customAugmentation) {
        return customAugmentation;
      }

      const shapes = {
        clip: 'tl-clip tr-clip br-clip bl-clip',
        round: 'tl-round tr-round br-round bl-round',
        scoop: 'tl-scoop tr-scoop br-scoop bl-scoop',
        mixed: 'tl-clip tr-round br-clip bl-round',
      };

      return `${shapes[shape]} border inlay`;
    };

    return (
      <button
        ref={ref}
        data-augmented-ui={getAugmentedUIAttribute()}
        className={clsx(
          augmentedBase,
          augmentedSizes[size],
          augmentedVariants[variant],
          buttonBase,
          buttonShapes[shape],
          glow && augmentedGlow,
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'AugmentedButton';
