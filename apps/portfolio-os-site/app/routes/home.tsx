import { Box } from '@mui/material';
import { LoadingFallback } from '@jc/ui-components';

import { lazy, Suspense } from 'react';

const DesktopOS = lazy(() => import('../components/desktop-system'));

export function Home() {
  return (
    <Box position={'relative'} height={'100%'}>
      <Suspense
        fallback={
          <LoadingFallback message="Loading portfolio operating system..." />
        }
      >
        <DesktopOS />
      </Suspense>
    </Box>
  );
}

export default Home;
