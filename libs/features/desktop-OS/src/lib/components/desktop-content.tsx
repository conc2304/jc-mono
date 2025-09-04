import { TileGrid, useWindowManager, Window } from '@jc/ui-components';
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
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        contain: 'layout style paint',
      })}
    >
      <TileGrid gridTiles={desktopItems} />

      {/* Windows */}
      {windows.map((window) => (
        <Window key={window.id} {...window} isActive={window.isActive} />
      ))}
    </Box>
  );
};
