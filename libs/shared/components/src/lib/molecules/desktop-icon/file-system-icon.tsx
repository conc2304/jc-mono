import { ReactNode } from 'react';
import { alpha, Box, Typography } from '@mui/material';
import { Property } from 'csstype';

interface FileSystemIconProps {
  icon: ReactNode;
  name: string;
  isActive: boolean;
  tagContent?: ReactNode;
  iconSize?: Property.Width;
}
export const FileSystemIcon = ({
  icon,
  name,
  isActive,
  tagContent,
  iconSize = '65px',
}: FileSystemIconProps) => {
  return (
    <Box
      className="FileSystemIcon--root"
      sx={(theme) => ({
        p: 0.25,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
      })}
    >
      <Box
        className="FileSystemIcon--icon"
        data-augmented-ui={'tl-clip bl-clip br-clip tr-2-clip-x border'}
        sx={(theme) => ({
          p: 0.2,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width: theme.mixins.desktopIcon.width,
          height: theme.mixins.desktopIcon.width,
          backgroundColor: alpha(
            theme.palette.mode === 'light'
              ? theme.palette.common.black
              : theme.palette.common.white,
            !isActive ? 0.01 : 0.1
          ),
          transition: theme.transitions.create(['border'], {
            duration: theme.transitions.duration.standard,
          }),

          '&.FileSystemIcon--icon[data-augmented-ui]': {
            '--aug-tr': '6px',
            '--aug-tl': '5px',
            '--aug-bl': '5px',
            '--aug-br': '5px',
            '--aug-border-all': '1.5px',
            '--aug-border-bg': !isActive
              ? 'transparent'
              : theme.palette.primary.main,
          },
        })}
      >
        <Box sx={{ position: 'absolute', top: 5, left: 5 }}>{tagContent}</Box>
        {icon}
      </Box>
      <Box
        className="FileSystemIcon--text"
        sx={(theme) => ({
          position: 'relative',
          width: `calc(${theme.mixins.desktopIcon.width} * 1.5)`,

          alignItems: 'center',
          justifyContent: 'center',
          background: !isActive
            ? 'transparent'
            : alpha(
                theme.palette.getContrastText(theme.palette.text.primary),
                0.8
              ),
          borderRadius: 1,
        })}
      >
        <Typography
          variant="body2"
          color={!isActive ? 'textPrimary' : 'textDisabled'}
          sx={{
            mt: 0.25,
            textAlign: 'center',
            p: 0.125,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            wordBreak: 'break-word',
          }}
        >
          {/* {tagContent} */}
          {name}
        </Typography>
      </Box>
    </Box>
  );
};
