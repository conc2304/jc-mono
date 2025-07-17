import { CSSProperties } from '@mui/material/styles';

declare module '@mui/material/styles' {
  // Allow for custom mixins to be added
  interface Mixins {
    taskbar: CSSProperties;
    window: {
      titleBar: CSSProperties;
    };
    desktopIcon: CSSProperties;
  }

  interface ZIndex {
    window: number;
  }

  interface Palette {
    getInvertedMode: () => 'light' | 'dark';
  }
  // interface PaletteOptions {
  //   // invertedMode?: 'light' | 'dark';
  // }
}
