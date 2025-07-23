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
    getInvertedMode<T extends PaletteOptionNames | undefined = undefined>(
      paletteColor?: T
    ): T extends PaletteOptionNames ? string : 'light' | 'dark';
  }
}
