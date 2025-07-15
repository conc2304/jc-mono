import { CSSProperties } from '@mui/material/styles';

declare module '@mui/material/styles' {
  // Allow for custom mixins to be added
  interface Mixins {
    taskbar: CSSProperties;
    window: {
      titlebar: CSSProperties;
    };
  }
}
