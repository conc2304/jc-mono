import { alpha, Box, Typography } from '@mui/material';

import { useIconDrag, useWindowActions } from '../../context';
import { DesktopIconMetaData } from '../../types';

interface DesktopIconProps extends DesktopIconMetaData {
  position: { x: number; y: number };
  isDragging?: boolean;
}

// TODO - can only have filter or backdrop filter, but not bot
export const DesktopIcon = ({
  id,
  position,
  isDragging = false,
  icon,
  name,
}: DesktopIconProps) => {
  const { handleIconMouseDown } = useIconDrag();
  const { openWindow } = useWindowActions();
  return (
    <Box
      className="DesktopIcon--root"
      sx={{
        position: 'absolute',
        cursor: 'pointer',
        width: '4.375rem',
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
      onMouseDown={(e) => handleIconMouseDown(e, id)}
      onDoubleClick={() => openWindow(id)}
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
          data-augmented-ui={'tl-clip bl-clip br-clip tr-2-clip-x border'}
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
                !isDragging ? 0.01 : 0.1
              ),
            backdropFilter: 'blur(4px)',
            transition: (theme) =>
              theme.transitions.create(['border'], {
                duration: theme.transitions.duration.standard,
              }),
            // border: isDragging
            //   ? '1px solid rgba(255, 255, 255, 1)'
            //   : '1px solid rgba(255, 255, 255, 0)',

            '&[data-augmented-ui]': {
              '--aug-tr': '6px',
              '--aug-tl': '5px',
              '--aug-bl': '5px',
              '--aug-br': '5px',
              '--aug-border-all': '1.5px',
              '--aug-border-bg': (theme) =>
                !isDragging ? 'transparent' : theme.palette.primary.main,
            },
          }}
        >
          {icon}
        </Box>
        <Typography
          variant="body2"
          color={!isDragging ? 'textPrimary' : 'textDisabled'}
          sx={{
            mt: 0.25,
            width: '110%',
            top: '50%',
            left: '50%',
            transform: 'translate(-0%, -0%)',
            textAlign: 'center',
            p: 0.125,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            wordBreak: 'break-word',
            borderRadius: 1,
            background: (theme) =>
              !isDragging
                ? 'transparent'
                : // ? 'transparent'
                  alpha(
                    theme.palette.getContrastText(theme.palette.text.primary),
                    0.8
                  ),
          }}
        >
          {name}
        </Typography>
      </Box>
    </Box>
  );
};
