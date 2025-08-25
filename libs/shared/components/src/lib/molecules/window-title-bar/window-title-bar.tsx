import { ReactNode } from 'react';
import { alpha, Box, darken, Typography, useTheme } from '@mui/material';

import { useWindowManager } from '../../context';
import { WindowControls } from '../window-controls';
import { ensureContrast } from '@jc/utils';

type WindowTitleBarProps = {
  isActive?: boolean;
  id: string;
  icon: ReactNode;
  title: string;
  onMouseDown: (e: React.MouseEvent<HTMLElement>, windowId: string) => void;
  windowMaximized: boolean;
};

export const WindowTitleBar = ({
  isActive,
  id,
  icon,
  title,
  windowMaximized,
}: WindowTitleBarProps) => {
  const { handleWindowMouseDown } = useWindowManager();
  const theme = useTheme();
  const background = isActive
    ? alpha(theme.palette.getInvertedMode('primary'), 0.7)
    : alpha(theme.palette.background.paper, 0.3);

  return (
    <Box
      className="TitleBar--root"
      sx={(theme) => ({
        color: alpha(theme.palette.text.primary, isActive ? 1 : 0.5),
        m: 0,
      })}
    >
      <Box
        className="Titlebar--move-handler"
        onMouseDown={(e) => handleWindowMouseDown(e, id)}
        draggable={true}
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
          sx={(theme) => ({
            display: 'flex',
            alignItems: 'center',
            height: theme.mixins.window.titleBar.height,
            justifyContent: 'center',
            maxWidth: 0.6,
            ml: 2,
            pt: 0.5,
            pl: 1.5,
            pr: 2.5,
            background,
            backdropFilter: 'blur(4px)',
            color: ensureContrast(theme.palette.text.primary, background, 3)
              .color,

            '&[data-augmented-ui]': {
              '--aug-tr': '5px',
              '--aug-tl': '5px',
              '--aug-bl': '5px',
              '--aug-br': '5px',
              '--aug-border-all': '1px',
              '--aug-border-bottom': '-1px',
              '--aug-border-bg': isActive
                ? theme.palette.primary[theme.palette.getInvertedMode()]
                : darken(
                    theme.palette.primary[theme.palette.getInvertedMode()],
                    0.5
                  ),
            },
          })}
        >
          {icon}
          <Typography
            variant="body2"
            component="span"
            sx={{
              ml: 1,
              display: '-webkit-box',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              wordBreak: 'break-word',
            }}
          >
            {title}
          </Typography>
        </Box>
        <Box
          data-augmented-ui="border tl-2-clip-y tr-clip"
          sx={(theme) => ({
            display: 'flex',
            alignItems: 'center',
            height: theme.mixins.window.titleBar.height,
            pt: 0.5,
            pr: 0.5,
            pl: 1,
            transition: theme.transitions.create(['background']),
            background,
            backdropFilter: 'blur(4px)',

            '&[data-augmented-ui]': {
              '--aug-tr': '5px',
              '--aug-tl': '5px',
              '--aug-bl': '5px',
              '--aug-br': '5px',
              '--aug-border-all': '1px',
              '--aug-border-bottom': '-1px',
              '--aug-border-bg': isActive
                ? theme.palette.primary.light
                : darken(theme.palette.primary.light, 0.5),
            },
          })}
        >
          <WindowControls
            id={id}
            bgColor={background}
            windowMaximized={windowMaximized}
          />
        </Box>
      </Box>
    </Box>
  );
};
