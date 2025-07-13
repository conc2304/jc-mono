import { Component, MouseEventHandler, ReactNode } from 'react';
import { alpha, Box, styled, ThemeOptions, Typography } from '@mui/material';

import { AugmentedButton } from '../../atoms';
import { DesktopIconMetaData } from '../../types';

interface DesktopIconProps extends DesktopIconMetaData {
  position: { x: number; y: number };
  isDragging?: boolean;
  onOpenWindow: (id: string) => void;
  onIconMouseDown: (
    e: React.MouseEvent<HTMLElement, MouseEvent>,
    id: string
  ) => void;
}

// TODO - can only have filter or backdrop filter, but not bot
export const DesktopIcon = ({
  id,
  position,
  isDragging = false,
  icon,
  name,
  // color,
  onOpenWindow,
  onIconMouseDown,
}: DesktopIconProps) => {
  return (
    <Box
      className="DesktopIcon--root"
      sx={{
        position: 'absolute',
        cursor: 'pointer',
        // transition: 'all 200ms',
        transition: (theme) =>
          theme.transitions.create(['transform', 'filter'], {
            duration: theme.transitions.duration.standard,
          }),
        transform: isDragging ? 'scale(1.1)' : 'scale(1)',
        filter: ({ palette }) => {
          const blurSize = isDragging ? '4px' : '0px';
          const color =
            palette.mode === 'light'
              ? palette.common.black
              : palette.common.white;

          const [x, y] = !isDragging ? ['0px', '0px'] : ['10px', '10px'];
          return `drop-shadow(${x} ${y} ${blurSize} ${alpha(color, 0.5)})`;
        },
      }}
      style={{
        left: position.x,
        top: position.y,
        zIndex: isDragging ? 10000 : 1,
      }}
      onMouseDown={(e) => onIconMouseDown(e, id)}
      onDoubleClick={() => onOpenWindow(id)}
    >
      <Box
        className="DesktopIcon--content"
        sx={{
          p: 0.25,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Box
          className="DesktopIcon--icon"
          sx={{
            p: 0.2,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            width: '50px',
            height: '50px',
            backgroundColor: ({ palette }) =>
              alpha(
                palette.mode === 'light'
                  ? palette.common.black
                  : palette.common.white,
                0.05
              ),
            backdropFilter: 'blur(4px)',
            transition: (theme) =>
              theme.transitions.create(['border'], {
                duration: theme.transitions.duration.standard,
              }),
            border: isDragging
              ? '1px solid rgba(255, 255, 255, 1)'
              : '1px solid rgba(255, 255, 255, 0)',
          }}
        >
          {icon}
        </Box>
        <Typography variant="body2" color="textPrimary">
          {name}
        </Typography>
      </Box>
    </Box>
  );
};
