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
        width: theme.mixins.desktopIcon.width,
        // maxHeight: theme.mixins.desktopIcon.maxHeight,
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
          width: iconSize,
          height: iconSize,
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
        {icon}
      </Box>
      <Box
        className="FileSystemIcon--text"
        sx={(theme) => ({
          display: 'flex',
          position: 'relative',
          width: '135%',
          alignItems: 'center',
          justifyContent: 'center',
          background: !isActive
            ? 'transparent'
            : alpha(
                theme.palette.getContrastText(theme.palette.text.primary),
                0.8
              ),
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
            borderRadius: 1,
            lineHeight: 1.5,
          }}
        >
          {tagContent}
          {name}
        </Typography>
      </Box>
    </Box>
  );
};
