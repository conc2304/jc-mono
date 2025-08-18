import {
  DesktopIcon,
  TaskBar,
  useWindowManager,
  Window,
} from '@jc/ui-components';
import { useMediaQuery, useTheme } from '@mui/material';
import { Box } from '@mui/system';
import { useMemo } from 'react';

export // Inner component that uses the context
const DesktopContent = () => {
  const { windows, iconPositions, fileSystemItems, draggedIcon } =
    useWindowManager();
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('md'));

  // Get desktop icons (root-level items only)
  const desktopIcons = useMemo(() => {
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
      {/* Desktop Icons */}
      {desktopIcons.map((icon) => {
        const position = iconPositions[icon.id] || { x: 0, y: 0 };
        return (
          <DesktopIcon
            key={icon.id}
            id={icon.id}
            name={icon.name}
            icon={icon.icon}
            position={position}
            isDragging={draggedIcon === icon.id}
          />
        );
      })}

      {/* Windows */}
      {windows.map((window) => (
        <Window key={window.id} {...window} isActive={window.isActive} />
      ))}
      {!isXs && <TaskBar />}
    </Box>
  );
};
