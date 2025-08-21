import { CSSProperties, PaletteMode } from '@mui/material/styles';

export type PaletteOptionName =
  | 'primary'
  | 'secondary'
  | 'error'
  | 'warning'
  | 'info'
  | 'success';

declare module '@mui/material/styles' {
  // Allow for custom mixins to be added
  interface Mixins {
    taskbar: CSSProperties;
    window: {
      titleBar: CSSProperties;
    };
    desktopIcon: CSSProperties;
    paper: CSSProperties;
  }

  interface ZIndex {
    window: number;
  }

  interface Palette {
    getInvertedMode(): 'light' | 'dark';
    getInvertedMode(paletteColor: PaletteOptionName): string;
    getInvertedMode(paletteColor: PaletteOptionName, reInvert: boolean): string;
  }

  interface TypographyVariants {
    display: React.CSSProperties;
    displayOutline?: React.CSSProperties;
  }

  interface TypographyVariantsOptions {
    display?: React.CSSProperties;
    displayOutline?: React.CSSProperties;
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    display: true;
    displayOutline: true;
  }
}
