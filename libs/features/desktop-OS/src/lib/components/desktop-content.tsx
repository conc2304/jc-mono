import {
  BackgroundOverlay,
  TileGrid,
  useWindowManager,
  Window,
} from '@jc/ui-components';
import { Box } from '@mui/system';
import { useMemo } from 'react';

export // Inner component that uses the context
const DesktopContent = () => {
  const { windows, fileSystemItems } = useWindowManager();

  // Get desktop icons (root-level items only)
  const desktopItems = useMemo(() => {
    return fileSystemItems.filter((item) => !item.parentId);
  }, [fileSystemItems]);

  return (
    <Box
      className="DesktopOS--root"
      sx={(theme) => ({
        width: '100vw',
        height: [
          '100vh', // Fallback
          '100dvh', // Preferred value
        ],
        background: `linear-gradient(135deg, ${theme.palette.primary.main}20, ${theme.palette.secondary.main}20)`,
        position: 'relative',
        overflow: 'hidden',
        contain: 'layout style paint',
      })}
    >
      {/* <BackgroundOverlay
        url={bgTexture.url}
        style={{
          ...bgTexture.style,
          backgroundPosition: 'center center',
          zIndex: 0,
        }}
        className="ThemedBackground--overlay"
      /> */}
      <TileGrid gridTiles={desktopItems} />

      {/* Windows */}
      {windows.map((window) => (
        <Window key={window.id} {...window} isActive={window.isActive} />
      ))}
    </Box>
  );
};
