'use client';

import { Box } from '@mui/material';
import {
  FileSystemItem,
  IconPosition,
  TaskBar,
  WindowProvider,
} from '@jc/ui-components';

import { DesktopItemsRenderer } from './desktop-items-render';
import { WindowsRenderer } from './windows-renderer';
type DesktopOSProps = {
  fileSystem?: FileSystemItem[];
};

export const DesktopOS = ({ fileSystem = [] }: DesktopOSProps) => {
  const defaultIconPositions = fileSystem.reduce((acc, icon, index) => {
    acc[icon.id] = { x: 50, y: 50 + index * 100 };
    return acc;
  }, {} as Record<string, IconPosition>);

  return (
    <WindowProvider
      fileSystemItems={fileSystem}
      defaultIconPositions={defaultIconPositions}
    >
      <Box className="Desktop-OS--root">
        <Box>
          <DesktopItemsRenderer />
          <WindowsRenderer />
          <TaskBar />
        </Box>
      </Box>
    </WindowProvider>
  );
};
