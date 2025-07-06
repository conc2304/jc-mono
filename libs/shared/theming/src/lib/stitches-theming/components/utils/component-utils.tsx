import {
  ThemeColor,
  ThemeSize,
  ThemeTokens,
  ThemeVariant,
} from 'src/lib/stitches-theming/types';

export interface ComponentThemeProps {
  color?: ThemeColor;
  variant?: ThemeVariant;
  size?: ThemeSize;
}

export const getThemeProps = (
  theme: ThemeTokens,
  props: ComponentThemeProps
) => {
  const { color = 'primary', variant = 'default', size = 'md' } = props;

  return {
    colors: {
      main: theme.colors[color],
      hover:
        theme.colors[`${color}Hover` as keyof typeof theme.colors] ||
        theme.colors[color],
      text:
        color === 'primary'
          ? theme.colors.textOnPrimary
          : theme.colors.textPrimary,
    },
    spacing: theme.spacing[size],
    variant,
    size,
  };
};
