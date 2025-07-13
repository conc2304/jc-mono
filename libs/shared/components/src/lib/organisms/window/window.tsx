import { Box, Typography } from '@mui/material';
import { Maximize2, Minimize2, X } from 'lucide-react';

import { AugmentedIconButton } from '../../atoms';
import { WindowMetaData } from '../../types';

interface WindowProps extends WindowMetaData {
  onWindowMouseDown: (event: any, id: string) => void;
  bringToFront: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  closeWindow: (id: string) => void;
}

export const Window = ({
  id,
  title,
  icon,
  x,
  y,
  width,
  height,
  zIndex,
  minimized,
  maximized,
  windowContent,
  onWindowMouseDown,
  bringToFront,
  minimizeWindow,
  maximizeWindow,
  closeWindow,
}: WindowProps) => {
  return (
    <Box
      className="Window--root"
      sx={{
        position: 'absolute',
        background: (theme) => theme.palette.background.paper,
        overflow: 'hidden',
        visibility: minimized ? 'hidden' : undefined,
      }}
      style={{
        left: x,
        top: y,
        width: width,
        height: height,
        zIndex: zIndex,
      }}
      onClick={() => bringToFront(id)}
    >
      {/* Title Bar */}
      <Box
        className="Window--title-bar"
        sx={{
          background: (theme) => theme.palette.primary.dark,
          color: (theme) => theme.palette.text.primary,
          cursor: 'move',
          p: 0.25,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
        onMouseDown={(e) => onWindowMouseDown(e, id)}
      >
        <Box
          className="flex items-center space-x-2"
          sx={{
            display: 'flex',
            alignItems: 'center',
            ml: 0.5,
          }}
        >
          {icon}
          <Typography variant="body2" component="span" sx={{ ml: 1 }}>
            {title}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <AugmentedIconButton
            color="info"
            size="small"
            shape="buttonRight"
            disableRipple
            onClick={(e) => {
              e.stopPropagation();
              minimizeWindow(id);
            }}
          >
            <Minimize2 />
          </AugmentedIconButton>
          <AugmentedIconButton
            color="info"
            size="small"
            shape="buttonRight"
            disableRipple
            onClick={(e) => {
              e.stopPropagation();
              maximizeWindow(id);
            }}
          >
            <Maximize2 />
          </AugmentedIconButton>
          <AugmentedIconButton
            color="error"
            size="small"
            shape="buttonRight"
            disableRipple
            onClick={(e) => {
              e.stopPropagation();
              closeWindow(id);
            }}
          >
            <X />
          </AugmentedIconButton>
        </Box>
      </Box>

      {/* Window Content */}
      <Box
        sx={{
          height: '100%',
          overflow: 'auto',
        }}
      >
        {windowContent}
      </Box>
    </Box>
  );
};
