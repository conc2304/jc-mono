import { css, ThemeColor, ThemeVariant } from '@jc/theming';

import { ButtonSize } from './beveled-button';
import {
  ErrorTheme,
  InfoTheme,
  PrimaryTheme,
  SecondaryTheme,
  SuccessTheme,
  WarningTheme,
} from './variant-configs';
import { SizeConfigItem, SlotStyleConfig } from '../../types';

type SizeConfig = Record<ButtonSize, SizeConfigItem>;

export const SIZE_CONFIG: SizeConfig = {
  sm: {
    bevelConfig: {
      topLeft: { bevelSize: 30, bevelAngle: 45 },
      topRight: { bevelSize: 8, bevelAngle: 45 },
      bottomRight: { bevelSize: 30, bevelAngle: 45 },
      bottomLeft: { bevelSize: 10, bevelAngle: 45 },
    },
    strokeWidth: '1px',
    className: css({
      fontSize: '$sm',
      px: '$sm',
      py: '$xs',
      minHeight: '32px',
    })(),
  },
  md: {
    bevelConfig: {
      topLeft: { bevelSize: 30, bevelAngle: 45 },
      topRight: { bevelSize: 8, bevelAngle: 45 },
      bottomRight: { bevelSize: 30, bevelAngle: 45 },
      bottomLeft: { bevelSize: 10, bevelAngle: 45 },
    },
    strokeWidth: '2px',
    className: css({
      fontSize: '$base',
      px: '$md',
      py: '$sm',
      minHeight: '40px',
    })(),
  },
  lg: {
    bevelConfig: {
      topLeft: { bevelSize: 30, bevelAngle: 45 },
      topRight: { bevelSize: 8, bevelAngle: 45 },
      bottomRight: { bevelSize: 30, bevelAngle: 45 },
      bottomLeft: { bevelSize: 10, bevelAngle: 45 },
    },
    strokeWidth: '2px',
    className: css({
      fontSize: '$lg',
      px: '$lg',
      py: '$md',
      minHeight: '48px',
    })(),
  },
};

export const buttonTheme: Record<
  ThemeColor,
  Record<ThemeVariant, SlotStyleConfig>
> = {
  primary: PrimaryTheme,
  secondary: SecondaryTheme,
  error: ErrorTheme,
  warning: WarningTheme,
  info: InfoTheme,
  success: SuccessTheme,
};
