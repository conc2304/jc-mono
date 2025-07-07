// ui-hooks/use-bevel-styles.ts
import { useMemo } from 'react';
import { useTheme } from '@jc/theming';


export interface BeveledStylesConfig {
  componentType: 'button' | 'card' | 'input' | 'container';
  variant?: 'contained' | 'outlined' | 'text' | 'elevated' | 'filled';
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  isActive?: boolean;
  isHover?: boolean;
  isFocus?: boolean;
}

export interface SlotStyles {
  background: Record<string, string>;
  border: Record<string, string>;
  content: Record<string, string>;
  shadow: Record<string, string>;
}

export const useBeveledStyles = (config: BeveledStylesConfig): SlotStyles => {
  const { resolvedTheme, currentThemeClass } = useTheme();

  return useMemo(() => {
    const {
      componentType,
      variant = 'contained',
      color = 'primary',
      size = 'medium',
      disabled = false,
      isActive = false,
      isHover = false,
      isFocus = false,
    } = config;

    // Determine the current state
    const getState = () => {
      if (disabled) return 'disabled';
      if (isActive) return 'active';
      if (isFocus) return 'focus';
      if (isHover) return 'hover';
      return 'default';
    };

    const state = getState();

    // Generate theme-aware styles based on the current theme
    const generateStyles = (): SlotStyles => {
      // This is where you'd access your theme contract values
      // The actual implementation depends on how your theme contract is structured

      const baseStyles: SlotStyles = {
        background: {
          '--beveled-bg-color': `var(--theme-${componentType}-background-${state})`,
          '--beveled-bg-opacity': disabled ? '0.38' : '1',
        },
        border: {
          '--beveled-border-color': `var(--theme-${componentType}-border-color-${state})`,
          '--beveled-border-width': `var(--theme-${componentType}-border-width-${state})`,
          '--beveled-border-style': 'solid',
        },
        content: {
          '--beveled-content-color': `var(--theme-${componentType}-content-color-${state})`,
          '--beveled-content-font-size': `var(--theme-${componentType}-content-fontSize)`,
          '--beveled-content-font-weight': `var(--theme-${componentType}-content-fontWeight)`,
          '--beveled-content-line-height': `var(--theme-${componentType}-content-lineHeight)`,
        },
        shadow: {
          '--beveled-shadow': `var(--theme-${componentType}-shadow-${state})`,
        },
      };

      // Apply variant-specific overrides
      if (variant === 'outlined') {
        baseStyles.background['--beveled-bg-color'] = 'transparent';
        baseStyles.border['--beveled-border-width'] = '2px';
      } else if (variant === 'text') {
        baseStyles.background['--beveled-bg-color'] = 'transparent';
        baseStyles.border['--beveled-border-width'] = '0px';
        baseStyles.shadow['--beveled-shadow'] = 'none';
      }

      // Apply size-specific overrides
      if (size === 'small') {
        baseStyles.content['--beveled-content-font-size'] = '0.875rem';
      } else if (size === 'large') {
        baseStyles.content['--beveled-content-font-size'] = '1.125rem';
      }

      return baseStyles;
    };

    return generateStyles();
  }, [
    config.componentType,
    config.variant,
    config.color,
    config.size,
    config.disabled,
    config.isActive,
    config.isHover,
    config.isFocus,
    resolvedTheme,
    currentThemeClass,
  ]);
};
