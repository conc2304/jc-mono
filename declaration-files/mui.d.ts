import { CSSProperties, PaletteMode } from '@mui/material/styles';

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

  type PaletteOptionNames =
    | 'primary'
    | 'secondary'
    | 'error'
    | 'warning'
    | 'info'
    | 'success';

  interface Palette {
    getInvertedMode(): 'light' | 'dark';
    getInvertedMode(paletteColor: PaletteOptionNames): string;
    getInvertedMode(
      paletteColor: PaletteOptionNames,
      reInvert: boolean
    ): string;
  }

  interface TypographyVariants {
    display: React.CSSProperties;
  }

  interface TypographyVariantsOptions {
    display?: React.CSSProperties;
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    display: true;
  }
}
