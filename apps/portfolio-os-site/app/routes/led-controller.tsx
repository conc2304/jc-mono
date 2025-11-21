import { Box } from '@mui/material';
import { LoadingFallback } from '@jc/ui-components';

import { lazy, Suspense } from 'react';

const LedControllerPage = lazy(() => import('../components/LedControllerPage'));

function LedControllerRoute() {
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
