import React, { useMemo } from 'react';
import { css, ThemeColor, ThemeSize, ThemeVariant } from '@jc/theming';
import { Property } from 'csstype';

import { BaseBeveledContainer } from '../base-beveled-container';
import { buttonTheme, SIZE_CONFIG } from './variants-config';
import { BevelConfig } from '../../types';

export type ButtonSize = Extract<ThemeSize, 'sm' | 'md' | 'lg'>;

type SizeConfigItem = {
  bevelConfig: BevelConfig;
  strokeWidth: Property.StrokeWidth;
  className: string;
};

type SizeConfig = Record<ButtonSize, SizeConfigItem>;

interface BeveledButtonProps {
  children: React.ReactNode;
  color?: ThemeColor;
  variant?: ThemeVariant;
  disabled?: boolean;
  isActive?: boolean;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  className?: string;
  size?: ButtonSize;
}

export const BeveledButton: React.FC<BeveledButtonProps> = ({
  children,
  color = 'primary',
  variant = 'solid',
  disabled = false,
  isActive = false,
  onClick,
  className,
  size = 'md',
  ...props
}) => {
  console.log('BeveledButton render');
  // Memoize the theme config to prevent unnecessary recalculations
  const themeConfig = useMemo(() => {
    return buttonTheme[color]?.[variant] || buttonTheme.primary.solid;
  }, [color, variant]);

  // Get size config from the constant object
  const currentSizeConfig = SIZE_CONFIG[size];

  console.log({ themeConfig, currentSizeConfig });

  return (
    <BaseBeveledContainer
      component="button"
      color={color}
      variant={variant}
      disabled={disabled}
      isActive={isActive}
      onClick={onClick}
      bevelConfig={currentSizeConfig.bevelConfig}
      slotStyles={themeConfig}
      className={`beveled-button ${currentSizeConfig.className} ${
        className || ''
      }`}
      role="button"
      {...props}
    >
      {children}
    </BaseBeveledContainer>
  );
};
