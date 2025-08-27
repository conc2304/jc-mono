import { Components, alpha } from '@mui/material/styles';
import { fontFaces } from './baseline-font';

import { Theme } from '@mui/material';

export default function BaselineCSS(theme: Theme): Components {
  return {
    MuiCssBaseline: {
      styleOverrides: {
        // Default Scroll Styles
        body: {
          height: '100dvh',
          width: '100dvw',
          overflow: 'hidden',
        },
        '*': {
          '&::-webkit-scrollbar': {
            width: '12px',
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
            border: theme.palette.background.paper,
            boxShadow: `inset 0px 0px 4px ${
              theme.palette.mode === 'dark'
                ? alpha(theme.palette.secondary.dark, 0.3)
                : alpha(theme.palette.secondary.light, 0.3)
            }`,
          },
          '&::-webkit-scrollbar-thumb': {
            background: alpha(theme.palette.secondary.dark, 0.3),
            boxShadow: theme.shadows[10],
            // theme.palette.mode === 'dark'
            //   ? alpha(theme.palette.common.white, 0.3)
            //   : alpha(theme.palette.common.black, 0.3),
            borderRadius: '0px',
            '&:hover': {
              background:
                theme.palette.mode === 'dark'
                  ? alpha(theme.palette.secondary.dark, 0.4)
                  : alpha(theme.palette.secondary.light, 0.4),
            },
          },
        },
        fontFaces,
      },
    },
  };
}
