import { TileGrid, useWindowManager, Window } from '@jc/file-system';
import { Box } from '@mui/system';
import { ReactNode, useMemo } from 'react';

export const DesktopContent = ({ footer }: { footer?: ReactNode }) => {
  const { windows, fileSystemItems } = useWindowManager();

  // Get desktop icons (root-level items only)
  const rootFileSystemItems = useMemo(() => {
    return fileSystemItems.filter((item) => !item.parentId);
  }, [fileSystemItems]);

  return (
    <Box
      className="DesktopOS--root"
      sx={{
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        contain: 'layout style paint',
      }}
    >
      <TileGrid gridTiles={rootFileSystemItems} footer={footer} />

      {/* Windows */}
      {windows.map((window) => (
        <Window key={window.id} {...window} isActive={window.isActive} />
      ))}
    </Box>
  );
};
