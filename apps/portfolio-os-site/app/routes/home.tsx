import { Box } from '@mui/material';
import { BackgroundOverlay, LoadingFallback } from '@jc/ui-components';

import { getThemedBgTexture } from '../data/themed-data/themed-background-texture';
import { useColorMode, useEnhancedTheme } from '@jc/themes';
import { lazy, Suspense } from 'react';

const DesktopOS = lazy(() => import('../components/desktop-system'));

export function App() {
  const { currentThemeId } = useEnhancedTheme();
  const { resolvedMode } = useColorMode();
  const themedBgTexture = getThemedBgTexture(currentThemeId, resolvedMode);

  return (
    <>
      <Box position={'relative'} height={'100%'}>
        <BackgroundOverlay
          url={themedBgTexture.url}
          style={{
            ...themedBgTexture.style,
            backgroundPosition: 'center center',
            zIndex: 0,
          }}
          className="ThemedBackground--overlay"
        />
        <Suspense
          fallback={
            <LoadingFallback message="Loading portfolio operating system..." />
          }
        >
          <DesktopOS />
        </Suspense>
      </Box>
    </>
  );
}

export default App;
