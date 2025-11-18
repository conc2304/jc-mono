import { Box } from '@mui/material';
import { LoadingFallback } from '@jc/ui-components';

import { lazy, Suspense } from 'react';

const ColorPickerPage = lazy(() => import('../components/LedController'));

function LedControllerRoute() {
  return (
    <Box position={'relative'} height="100%">
      <Suspense
        fallback={
          <LoadingFallback message="Loading LED Controller Experience." />
        }
      >
        <ColorPickerPage />
      </Suspense>
    </Box>
  );
}

export default LedControllerRoute;
