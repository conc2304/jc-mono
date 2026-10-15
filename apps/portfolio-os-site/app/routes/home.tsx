import { lazy, Suspense } from 'react';
import { Box } from '@mui/material';

import { LoadingFallback } from '@jc/ui-components';


import { useRouteWindows } from '../hooks/use-route-windows';
import { useWindowCloseUrlSync } from '../hooks/use-window-close-url-sync';
import { useWindowUrlSync } from '../hooks/use-window-url-sync';

const DesktopOS = lazy(() => import('../components/desktop-system'));

function RouteWindowsSync() {
  useRouteWindows();
  useWindowCloseUrlSync();
  return null;
}

export function Home() {
  const { onOpenWindow, onReplaceWindowContent } = useWindowUrlSync();

  return (
    <Box position={'relative'} height={'100%'}>
      <Suspense
        fallback={
          <LoadingFallback message="Loading portfolio operating system..." />
        }
      >
        <DesktopOS
          onOpenWindow={onOpenWindow}
          onReplaceWindowContent={onReplaceWindowContent}
          sideEffects={<RouteWindowsSync />}
        />
      </Suspense>
    </Box>
  );
}

export default Home;
