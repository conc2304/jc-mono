import { CSSProperties, PaletteMode } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface BreakpointOverrides {
    // Add custom height breakpoints
    shortHeight: true;
    mediumHeight: true;
    tallHeight: true;
  }

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

  type PaletteOptionName =
    | 'primary'
    | 'secondary'
    | 'error'
    | 'warning'
    | 'info'
    | 'success';
  interface Palette {
    getInvertedMode(): 'light' | 'dark';
    getInvertedMode(paletteColor: PaletteOptionName): string;
    getInvertedMode(paletteColor: PaletteOptionName, reInvert: boolean): string;
  }

  interface TypographyVariants {
    display: React.CSSProperties;
    displayOutline?: React.CSSProperties;
    monospace: React.CSSProperties;
  }

  interface TypographyVariantsOptions {
    display?: React.CSSProperties;
    displayOutline?: React.CSSProperties;
    monospace?: React.CSSProperties;
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    display: true;
    displayOutline: true;
    monospace: true;
  }
}
