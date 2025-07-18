import React, { useMemo } from 'react';
import { Box } from '@mui/material';
import {
  DesktopIcon,
  FileSystemItem,
  IconPosition,
  TaskBar,
  useWindowManager,
  Window,
  WindowProvider,
} from '@jc/ui-components';

import { generateDefaultIconPositions } from '../utils';

type DesktopOSProps = {
  fileSystem?: FileSystemItem[];
  iconArrangement?: 'linear' | 'grid' | 'circular';
  customIconPositions?: Record<string, IconPosition>;
};

// Inner component that uses the context
const DesktopContent = () => {
  const { windows, iconPositions, fileSystemItems, draggedIcon } =
    useWindowManager();

  // Get desktop icons (root-level items only)
  const desktopIcons = useMemo(() => {
    return fileSystemItems.filter((item) => !item.parentId);
  }, [fileSystemItems]);

  return (
    <Box
      className="DesktopOS--root"
      sx={(theme) => ({
        width: '100vw',
        height: '100vh',
        // background: (theme) =>
        //   `linear-gradient(135deg, ${theme.palette.primary.main}20, ${theme.palette.secondary.main}20)`,
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
      <TaskBar />
    </Box>
  );
};

// Main component that provides the context
export const DesktopOS = ({
  fileSystem = [],
  iconArrangement = 'linear',
  customIconPositions,
}: DesktopOSProps) => {
  // Generate default icon positions
  const defaultIconPositions = useMemo(() => {
    if (customIconPositions) {
      return customIconPositions;
    }
    return generateDefaultIconPositions(fileSystem, iconArrangement);
  }, [fileSystem, iconArrangement, customIconPositions]);

  return (
    <WindowProvider
      fileSystemItems={fileSystem}
      defaultIconPositions={defaultIconPositions}
    >
      <DesktopContent />
    </WindowProvider>
  );
};

// Alternative: If you want to keep everything in one component
export const DesktopOSSingleComponent = ({
  fileSystem = [],
  iconArrangement = 'linear',
  customIconPositions,
}: DesktopOSProps) => {
  const defaultIconPositions = useMemo(() => {
    if (customIconPositions) return customIconPositions;
    return generateDefaultIconPositions(fileSystem, iconArrangement);
  }, [fileSystem, iconArrangement, customIconPositions]);

  return (
    <WindowProvider
      fileSystemItems={fileSystem}
      defaultIconPositions={defaultIconPositions}
    >
      {/* Render everything inline */}
      <Box
        className="DesktopOS--root"
        sx={{
          width: '100vw',
          height: '100vh',
          background: (theme) =>
            `linear-gradient(135deg, ${theme.palette.primary.main}20, ${theme.palette.secondary.main}20)`,
          position: 'relative',
          overflow: 'hidden',
          contain: 'layout style paint',
        }}
      >
        <DesktopIconRenderer />
        <WindowRenderer />
      </Box>
    </WindowProvider>
  );
};

// Helper components for cleaner separation
const DesktopIconRenderer = React.memo(() => {
  const { iconPositions, fileSystemItems, draggedIcon } = useWindowManager();

  const desktopIcons = useMemo(() => {
    return fileSystemItems.filter((item) => !item.parentId);
  }, [fileSystemItems]);

  return (
    <>
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
    </>
  );
});

const WindowRenderer = React.memo(() => {
  const { windows } = useWindowManager();

  return (
    <>
      {windows.map((window) => (
        <Window key={window.id} {...window} isActive={window.isActive} />
      ))}
    </>
  );
});

DesktopIconRenderer.displayName = 'DesktopIconRenderer';
WindowRenderer.displayName = 'WindowRenderer';
