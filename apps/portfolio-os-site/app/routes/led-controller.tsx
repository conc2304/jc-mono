import { Box, ThemeProvider, useTheme } from '@mui/material';
import { LoadingFallback } from '@jc/ui-components';

import { lazy, Suspense } from 'react';

const LedControllerPage = lazy(() => import('../components/LedControllerPage'));

function LedControllerRoute() {
  const theme = useTheme();

  return (
    <ThemeProvider theme={theme}>
      <Box position={'relative'} height="100%">
        <Suspense
          fallback={
            <LoadingFallback message="Loading LED Controller Experience." />
          }
        >
          <LedControllerPage />
        </Suspense>
      </Box>
    </ThemeProvider>
  );
}

export default LedControllerRoute;
