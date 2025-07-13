import { ReactNode } from 'react';
import { alpha, Box, darken, Typography } from '@mui/material';
import { Maximize2, Minimize2, X } from 'lucide-react';

import { AugmentedIconButton } from '../../atoms';

type WindowTitleBarProps = {
  isActive?: boolean;
  id: string;
  icon: ReactNode;
  title: string;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  closeWindow: (id: string) => void;
  onWindowMouseDown: (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    id: string
  ) => void;
};

export const WindowTitleBar = ({
  isActive,
  id,
  icon,
  title,
  onWindowMouseDown,
  minimizeWindow,
  maximizeWindow,
  closeWindow,
}: WindowTitleBarProps) => {
  return (
    <Box
      className="TitleBar--root"
      sx={{
        background: (theme) =>
          isActive
            ? theme.palette.primary.dark
            : darken(theme.palette.primary.dark, 0.5),
        color: (theme) => alpha(theme.palette.text.primary, isActive ? 1 : 0.5),
        p: 0.25,
      }}
    >
      <Box
        onMouseDown={(e) => onWindowMouseDown(e, id)}
        sx={{
          cursor: 'move',
          m: 0.1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
        }}
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
    </Box>
  );
};
