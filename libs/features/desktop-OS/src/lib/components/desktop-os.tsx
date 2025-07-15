'use client';

import { Box } from '@mui/material';
import {
  DesktopIconMetaData,
  IconPosition,
  TaskBar,
  WindowProvider,
} from '@jc/ui-components';

import { DesktopItemsRenderer } from './desktop-items-render';
import { WindowsRenderer } from './windows-renderer';
type DesktopOSProps = {
  desktopIcons?: DesktopIconMetaData[];
};

export const DesktopOS = ({ desktopIcons = [] }: DesktopOSProps) => {
  const defaultIconPositions = desktopIcons.reduce((acc, icon, index) => {
    acc[icon.id] = { x: 50, y: 50 + index * 100 };
    return acc;
  }, {} as Record<string, IconPosition>);

  return (
    <WindowProvider
      desktopIcons={desktopIcons}
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
