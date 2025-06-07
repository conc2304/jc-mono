import { ThemeTokens } from 'src/lib/themes/types';

export interface ComponentThemeProps {
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  variant?: 'default' | 'elevated' | 'minimal' | 'outlined' | 'filled';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
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
