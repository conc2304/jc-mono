import { createTheme } from '@mui/material/styles';

export const fireplaceTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ff6b35',
      light: '#ff9a6c',
      dark: '#c43e00',
    },
    secondary: {
      main: '#ffd166',
      light: '#ffe599',
      dark: '#c99f00',
    },
    background: {
      default: '#0d0d12',
      paper: '#16161f',
    },
    text: {
      primary: '#f0e6d3',
      secondary: '#9b8e7f',
    },
    divider: 'rgba(255, 107, 53, 0.15)',
    error: { main: '#ef5350' },
    success: { main: '#66bb6a' },
    warning: { main: '#ffa726' },
  },
  typography: {
    fontFamily: `'Inter', system-ui, -apple-system, sans-serif`,
    overline: {
      fontSize: '0.65rem',
      fontWeight: 600,
      letterSpacing: '0.12em',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiSlider: {
      styleOverrides: {
        root: { color: '#ff6b35' },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        switchBase: {
          '&.Mui-checked': { color: '#ff6b35' },
          '&.Mui-checked + .MuiSwitch-track': { backgroundColor: '#ff6b35' },
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: { backgroundColor: '#1c1c28' },
      },
    },
    MuiBottomNavigation: {
      styleOverrides: {
        root: { backgroundColor: '#16161f', borderTop: '1px solid rgba(255,107,53,0.15)' },
      },
    },
    MuiBottomNavigationAction: {
      styleOverrides: {
        root: {
          color: '#9b8e7f',
          '&.Mui-selected': { color: '#ff6b35' },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: { backgroundColor: '#16161f', borderBottom: '1px solid rgba(255,107,53,0.15)' },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(255,107,53,0.2)',
          '&.Mui-selected': {
            backgroundColor: 'rgba(255,107,53,0.2)',
            color: '#ff6b35',
            borderColor: '#ff6b35',
          },
        },
      },
    },
  },
});
