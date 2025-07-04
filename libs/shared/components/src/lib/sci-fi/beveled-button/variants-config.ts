import { BevelConfig, ElementStyleConfig } from '../types';
import { ButtonColor, ButtonSize, ButtonVariant } from './beveled-button';

// Size configurations
export const sizeConfigs = {
  small: {
    padding: '6px 16px',
    fontSize: '$sm',
    iconSize: '18px',
    bevelSize: 6,
  },
  medium: {
    padding: '8px 22px',
    fontSize: '$base',
    iconSize: '20px',
    bevelSize: 8,
  },
  large: {
    padding: '11px 28px',
    fontSize: '$lg',
    iconSize: '22px',
    bevelSize: 10,
  },
};

// Helper to generate style config based on variant and color
export const getStyleConfig = (
  variant: ButtonVariant,
  color: ButtonColor,
  size: ButtonSize,
  disableElevation: boolean
): ElementStyleConfig => {
  const { padding, fontSize } = sizeConfigs[size];

  const baseContentStyles: React.CSSProperties = {
    padding,
    fontSize,
    fontWeight: 500,
    letterSpacing: '0.02857em',
    textTransform: 'uppercase',
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap',
  };

  const configs: Record<ButtonVariant, ElementStyleConfig> = {
    contained: {
      root: {
        default: {},
        hover: {
          transform: disableElevation ? 'none' : 'translateY(-2px)',
        },
        active: {
          transform: 'translateY(0)',
        },
        disabled: {
          opacity: 0.38,
        },
      },
      background: {
        default: {
          backgroundColor: `var(--colors-${color})`,
        },
        hover: {
          backgroundColor: `var(--colors-${color}Hover)`,
          opacity: 0.9,
        },
        active: {
          backgroundColor: `var(--colors-${color}Active)`,
        },
        disabled: {
          backgroundColor: 'var(--colors-action-disabledBackground)',
        },
      },
      content: {
        default: {
          ...baseContentStyles,
          color:
            color === 'warning'
              ? 'var(--colors-text-primary)'
              : 'var(--colors-common-white)',
        },
        hover: {},
        active: {},
        disabled: {
          color: 'var(--colors-action-disabled)',
        },
      },
      border: {
        default: {
          stroke: 'transparent',
          strokeWidth: 0,
        },
      },
      shadow: {
        default: {
          filter: disableElevation
            ? 'none'
            : 'drop-shadow(0px 3px 1px -2px rgba(0,0,0,0.2)) drop-shadow(0px 2px 2px 0px rgba(0,0,0,0.14)) drop-shadow(0px 1px 5px 0px rgba(0,0,0,0.12))',
        },
        hover: {
          filter: disableElevation
            ? 'none'
            : 'drop-shadow(0px 2px 4px -1px rgba(0,0,0,0.2)) drop-shadow(0px 4px 5px 0px rgba(0,0,0,0.14)) drop-shadow(0px 1px 10px 0px rgba(0,0,0,0.12))',
        },
        active: {
          filter: disableElevation
            ? 'none'
            : 'drop-shadow(0px 5px 5px -3px rgba(0,0,0,0.2)) drop-shadow(0px 8px 10px 1px rgba(0,0,0,0.14)) drop-shadow(0px 3px 14px 2px rgba(0,0,0,0.12))',
        },
        disabled: {
          filter: 'none',
        },
      },
    },
    outlined: {
      root: {
        default: {},
        hover: {
          transform: 'translateY(-1px)',
        },
        active: {
          transform: 'translateY(0)',
        },
        disabled: {
          opacity: 0.38,
        },
      },
      background: {
        default: {
          backgroundColor: 'transparent',
        },
        hover: {
          backgroundColor: `var(--colors-${color})`,
          opacity: 0.08,
        },
        active: {
          backgroundColor: `var(--colors-${color})`,
          opacity: 0.12,
        },
        disabled: {
          backgroundColor: 'transparent',
        },
      },
      content: {
        default: {
          ...baseContentStyles,
          color: `var(--colors-${color})`,
          padding: `calc(${padding} - 1px)`, // Account for border
        },
        hover: {},
        active: {},
        disabled: {
          color: 'var(--colors-action-disabled)',
        },
      },
      border: {
        default: {
          stroke: `var(--colors-${color})`,
          strokeWidth: 2,
          opacity: 0.5,
        },
        hover: {
          stroke: `var(--colors-${color})`,
          strokeWidth: 2,
          opacity: 1,
        },
        active: {
          stroke: `var(--colors-${color})`,
          strokeWidth: 2,
        },
        disabled: {
          stroke: 'var(--colors-action-disabledBackground)',
          strokeWidth: 2,
        },
      },
      shadow: {
        default: {
          filter: 'none',
        },
      },
    },
    text: {
      root: {
        default: {},
        hover: {
          transform: 'none',
        },
        active: {
          transform: 'none',
        },
        disabled: {
          opacity: 0.38,
        },
      },
      background: {
        default: {
          backgroundColor: 'transparent',
        },
        hover: {
          backgroundColor: `var(--colors-${color})`,
          opacity: 0.08,
        },
        active: {
          backgroundColor: `var(--colors-${color})`,
          opacity: 0.12,
        },
        disabled: {
          backgroundColor: 'transparent',
        },
      },
      content: {
        default: {
          ...baseContentStyles,
          color: `var(--colors-${color})`,
        },
        hover: {},
        active: {},
        disabled: {
          color: 'var(--colors-action-disabled)',
        },
      },
      border: {
        default: {
          stroke: 'transparent',
          strokeWidth: 0,
        },
      },
      shadow: {
        default: {
          filter: 'none',
        },
      },
    },
  };

  return configs[variant];
};

// Helper to generate bevel config based on size
export const getBevelConfig = (
  size: ButtonSize,
  customConfig?: BevelConfig
): BevelConfig => {
  const { bevelSize } = sizeConfigs[size];
  const defaultConfig: BevelConfig = {
    topLeft: { bevelSize, bevelAngle: 45 },
    topRight: { bevelSize, bevelAngle: 45 },
    bottomRight: { bevelSize, bevelAngle: 45 },
    bottomLeft: { bevelSize, bevelAngle: 45 },
  };

  return customConfig || defaultConfig;
};
