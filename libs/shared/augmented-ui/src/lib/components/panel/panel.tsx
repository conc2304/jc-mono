import React, { forwardRef } from 'react';
import { clsx } from 'clsx';

import { panelBase, panelVariants } from './panel.css';
import {
  augmentedBase,
  augmentedSizes,
  augmentedVariants,
  augmentedGlow,
} from '../base/augmented-base.css';

export interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'cyberpunk' | 'neon';
  size?: 'small' | 'medium' | 'large';
  panelType?: 'elevated' | 'flat' | 'glass';
  glow?: boolean;
  customAugmentation?: string;
  children: React.ReactNode;
}

export const Panel = forwardRef<HTMLDivElement, PanelProps>(
  (
    {
      variant = 'primary',
      size = 'medium',
      panelType = 'elevated',
      glow = false,
      customAugmentation,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const augmentedUIAttribute =
      customAugmentation ||
      'tl-clip-x tr-clip-x br-clip-x bl-clip-x border inlay';

    return (
      <div
        ref={ref}
        data-augmented-ui={augmentedUIAttribute}
        className={clsx(
          augmentedBase,
          augmentedSizes[size],
          augmentedVariants[variant],
          panelBase,
          panelVariants[panelType],
          glow && augmentedGlow,
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Panel.displayName = 'AugmentedPanel';
