import { ReactNode } from 'react';
import { alpha, Box, darken, Theme, Typography } from '@mui/material';

import { WindowControls } from '../window-controls';

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
        color: (theme) => alpha(theme.palette.text.primary, isActive ? 1 : 0.5),
        m: 0,
      }}
    >
      <Box
        className="Titlebar--move-handler"
        onMouseDown={(e) => onWindowMouseDown(e, id)}
        sx={{
          cursor: 'move',
          m: 0,
          display: 'flex',
          alignItems: 'end',
          justifyContent: 'space-between',
          position: 'relative',
        }}
      >
        <Box
          className="TitleBar--name"
          data-augmented-ui="border tr-2-clip-y tl-clip"
          sx={{
            display: 'flex',
            alignItems: 'center',
            height: (theme) => theme.mixins.window.titlebar.height,
            justifyContent: 'center',
            ml: 2,
            pt: 0.5,
            pl: 1.5,
            pr: 2.5,
            background: (theme) =>
              isActive
                ? theme.palette.primary.dark
                : darken(theme.palette.primary.dark, 0.5),

            '&[data-augmented-ui]': {
              '--aug-tr': '5px',
              '--aug-tl': '5px',
              '--aug-bl': '5px',
              '--aug-br': '5px',
              '--aug-border-all': '1px',
              '--aug-border-bottom': '-1px',
              '--aug-border-bg': (theme) =>
                isActive
                  ? theme.palette.primary.light
                  : darken(theme.palette.primary.light, 0.5),
            },
          }}
        >
          {icon}
          <Typography variant="body2" component="span" sx={{ ml: 1 }}>
            {title}
          </Typography>
        </Box>
        <Box
          data-augmented-ui="border tl-2-clip-y tr-clip"
          sx={{
            display: 'flex',
            alignItems: 'center',
            height: (theme) => theme.mixins.window.titlebar.height,
            pt: 0.5,
            pr: 0.5,
            pl: 1,
            background: (theme) =>
              isActive
                ? theme.palette.primary.dark
                : darken(theme.palette.primary.dark, 0.5),

            '&[data-augmented-ui]': {
              '--aug-tr': '5px',
              '--aug-tl': '5px',
              '--aug-bl': '5px',
              '--aug-br': '5px',
              '--aug-border-all': '1px',
              '--aug-border-bottom': '-1px',
              '--aug-border-bg': (theme) =>
                isActive
                  ? theme.palette.primary.light
                  : darken(theme.palette.primary.light, 0.5),
            },
          }}
        >
          <WindowControls
            id={id}
            minimizeWindow={minimizeWindow}
            maximizeWindow={maximizeWindow}
            closeWindow={closeWindow}
          />
        </Box>
      </Box>
    </Box>
  );
};
