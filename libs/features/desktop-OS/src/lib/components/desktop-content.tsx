import {
  DesktopIcon,
  LiveTile,
  TaskBar,
  useWindowManager,
  Window,
} from '@jc/ui-components';
import { useMediaQuery, useTheme } from '@mui/material';
import { Box } from '@mui/system';
import { useMemo } from 'react';

export // Inner component that uses the context
const DesktopContent = () => {
  const { windows, desktopItemPositions, fileSystemItems, draggedIcon } =
    useWindowManager();
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down('md'));

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
        overflow: isSm ? 'auto' : 'hidden',
        contain: 'layout style paint',
        p: isSm ? 2 : 0,
        display: isSm ? 'flex' : undefined,
        flexWrap: isSm ? 'wrap' : undefined,
        gap: isSm ? 2 : undefined,
        // flexDirection: isXs ? 'column'
      })}
    >
      {/* Desktop Icons */}
      {desktopItems.map((dItem) => {
        const position = desktopItemPositions[dItem.id] || { x: 0, y: 0 };

        return (
          <LiveTile
            key={dItem.id}
            id={dItem.id}
            name={dItem.name}
            icon={dItem.icon}
            position={position}
            isDragging={draggedIcon === dItem.id}
            tileRenderer={dItem.tileRenderer}
            tileData={dItem.tileData}
            metadata={dItem.metadata}
            dateModified={dItem.dateModified}
            size={dItem.size}
            type={dItem.type}
            children={dItem.children}
          />
        );
      })}

      {/* Windows */}
      {windows.map((window) => (
        <Window key={window.id} {...window} isActive={window.isActive} />
      ))}
      {!isSm && <TaskBar />}
    </Box>
  );
};
