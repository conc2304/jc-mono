import { Theme } from '@mui/material/styles';

export interface ThemePaletteColorOption {
  key: string;
  label: string;
  value: string;
}

/** Selectable theme palette colors for gradient stops. */
export function getThemePaletteColors(theme: Theme): ThemePaletteColorOption[] {
  const { palette } = theme;

  return [
    { key: 'primary.main', label: 'Primary', value: palette.primary.main },
    { key: 'primary.light', label: 'Primary Light', value: palette.primary.light },
    { key: 'primary.dark', label: 'Primary Dark', value: palette.primary.dark },
    {
      key: 'secondary.main',
      label: 'Secondary',
      value: palette.secondary.main,
    },
    {
      key: 'secondary.light',
      label: 'Secondary Light',
      value: palette.secondary.light,
    },
    {
      key: 'secondary.dark',
      label: 'Secondary Dark',
      value: palette.secondary.dark,
    },
    { key: 'error.main', label: 'Error', value: palette.error.main },
    { key: 'warning.main', label: 'Warning', value: palette.warning.main },
    { key: 'info.main', label: 'Info', value: palette.info.main },
    { key: 'success.main', label: 'Success', value: palette.success.main },
    {
      key: 'background.default',
      label: 'Background',
      value: palette.background.default,
    },
    {
      key: 'background.paper',
      label: 'Paper',
      value: palette.background.paper,
    },
  ];
}

export function resolveThemeColor(
  options: ThemePaletteColorOption[],
  key: string,
  fallback: string
): string {
  return options.find((option) => option.key === key)?.value ?? fallback;
}
