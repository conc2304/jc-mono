import React, { forwardRef } from 'react';
import { clsx } from 'clsx';
import {
  augmentedBase,
  augmentedSizes,
  augmentedVariants,
} from '../base/augmented-base.css';
import { inputBase, inputStates } from './input.css';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'cyberpunk' | 'neon';
  size?: 'small' | 'medium' | 'large';
  state?: 'default' | 'error' | 'success';
  customAugmentation?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      variant = 'primary',
      size = 'medium',
      state = 'default',
      customAugmentation,
      className,
      ...props
    },
    ref
  ) => {
    const augmentedUIAttribute =
      customAugmentation ||
      'tl-2-clip-x tr-2-clip-x br-2-clip-x bl-2-clip-x border';

    return (
      <input
        ref={ref}
        data-augmented-ui={augmentedUIAttribute}
        className={clsx(
          augmentedBase,
          augmentedSizes[size],
          augmentedVariants[variant],
          inputBase,
          inputStates[state],
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = 'AugmentedInput';
