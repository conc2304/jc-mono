import { Components, Theme, alpha } from '@mui/material/styles';
import { height, width } from '@mui/system';

export default function BaselineCSS(theme: Theme): Components {
  return {
    MuiCssBaseline: {
      styleOverrides: {
        // Default Scroll Styles
        body: {
          height: '100vh',
          width: '100vw',
          overflow: 'hidden',
        },
        '*': {
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '&::-webkit-scrollbar-corner': {
            background: ' rgba(0, 0, 0, 0)',
          },
          '&::-webkit-scrollbar-track': {
            background:
              theme.palette.mode === 'dark'
                ? alpha(theme.palette.common.white, 0.1)
                : alpha(theme.palette.common.black, 0.1),
            borderRadius: '0px',
          },
          '&::-webkit-scrollbar-thumb': {
            background:
              theme.palette.mode === 'dark'
                ? alpha(theme.palette.common.white, 0.3)
                : alpha(theme.palette.common.black, 0.3),
            borderRadius: '0px',
            '&:hover': {
              background:
                theme.palette.mode === 'dark'
                  ? alpha(theme.palette.common.white, 0.5)
                  : alpha(theme.palette.common.black, 0.5),
            },
          },
        },
      },
    },
  };
}
