import React, { useState } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import Box from '@mui/material/Box';
import { fireplaceTheme } from './theme';
import { OFClientProvider } from '@jc/shared/of-control-client';
import { AppShell } from './components/AppShell';

export const App: React.FC = () => {
  return (
    <ThemeProvider theme={fireplaceTheme}>
      <CssBaseline />
      <OFClientProvider>
        <AppShell />
      </OFClientProvider>
    </ThemeProvider>
  );
};
