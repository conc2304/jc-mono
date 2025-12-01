import { Box, useTheme } from '@mui/material';
import { LoadingFallback } from '@jc/ui-components';

import { lazy, Suspense } from 'react';

const LedControllerPage = lazy(() => import('../components/LedControllerPage'));

function LedControllerRoute() {
  const theme = useTheme();
  console.log(
    'Current theme in LED Controller Route: ',
    theme.palette.background.paper,
    theme.palette.text.primary
  );
  return (
    <Box position={'relative'} height="100%">
      <Suspense
        fallback={
          <LoadingFallback message="Loading LED Controller Experience." />
        }
      >
        <LedControllerPage />
      </Suspense>
    </Box>
  );
}

export default LedControllerRoute;
