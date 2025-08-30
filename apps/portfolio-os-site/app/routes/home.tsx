import { Box, useTheme } from '@mui/material';
import { DesktopOS } from '@jc/desktop-OS';
import { BackgroundOverlay } from '@jc/ui-components';
import { FileSystem } from '../data/file-system';

import { useMediaQuery } from '@mui/system';
import { PROJECT_NAVIGATION_GROUP } from '../data/project-files';
import { getThemedBgTexture } from '../data/themed-data/themed-background-texture';
import { useColorMode, useEnhancedTheme } from '@jc/themes';

export function App() {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('md'));

  const { currentThemeId } = useEnhancedTheme();
  const { resolvedMode } = useColorMode();
  const themedBgTexture = getThemedBgTexture(currentThemeId, resolvedMode);

  return (
    <>
      <Box position={'relative'}>
        <BackgroundOverlay
          url={themedBgTexture.url}
          style={{
            ...themedBgTexture.style,
            backgroundPosition: 'center center',
            zIndex: 0,
          }}
          className="ThemedBackground--overlay"
        />
        <DesktopOS
          fileSystem={FileSystem}
          navigationGroups={[PROJECT_NAVIGATION_GROUP]}
          iconArrangement={isXs ? 'grid' : 'linear'}
        />
      </Box>
    </>
  );
}

export default App;
