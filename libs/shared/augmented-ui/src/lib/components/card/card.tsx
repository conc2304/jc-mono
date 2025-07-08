import React, { forwardRef } from 'react';
import { clsx } from 'clsx';
import {
  augmentedBase,
  augmentedSizes,
  augmentedVariants,
  augmentedGlow,
} from '../base/augmented-base.css';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'cyberpunk' | 'neon';
  size?: 'small' | 'medium' | 'large';
  glow?: boolean;
  shape?: 'hex' | 'triangle' | 'hexangle' | 'custom';
  customAugmentation?: string;
  children: React.ReactNode;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'primary',
      size = 'medium',
      glow = false,
      shape = 'custom',
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
        hex: 'all-hex border',
        triangle: 'all-triangle-up border',
        hexangle: 'all-hexangle-up border',
        custom: 'tl-clip tr-scoop br-clip bl-scoop border inlay',
      };

      return shapes[shape];
    };

    return (
      <div
        ref={ref}
        data-augmented-ui={getAugmentedUIAttribute()}
        className={clsx(
          augmentedBase,
          augmentedSizes[size],
          augmentedVariants[variant],
          glow && augmentedGlow,
          className
        )}
        style={{
          padding: '1rem',
          backgroundColor: 'var(--aug-inlay-bg, #1a1a1a)',
          color: 'var(--theme-text, #ffffff)',
          ...(shape === 'hex' && { '--aug-all-width': '200px' }),
          ...(shape === 'triangle' && { '--aug-all-width': '200px' }),
          ...(shape === 'hexangle' && { '--aug-all-width': '200px' }),
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'AugmentedCard';
