import { ReactNode } from 'react';
import { alpha, Box, Typography } from '@mui/material';

interface FileSystemIconProps {
  icon: ReactNode;
  name: string;
  isActive: boolean;
  tagContent?: ReactNode;
}
export const FileSystemIcon = ({
  icon,
  name,
  isActive,
  tagContent,
}: FileSystemIconProps) => {
  return (
    <Box
      className="FileSystemIcon--root"
      sx={{
        p: 0.25,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Box
        className="FileSystemIcon--icon"
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
              !isActive ? 0.01 : 0.1
            ),
          transition: (theme) =>
            theme.transitions.create(['border'], {
              duration: theme.transitions.duration.standard,
            }),

          '&.FileSystemIcon--icon[data-augmented-ui]': {
            '--aug-tr': '6px',
            '--aug-tl': '5px',
            '--aug-bl': '5px',
            '--aug-br': '5px',
            '--aug-border-all': '1.5px',
            '--aug-border-bg': (theme) =>
              !isActive ? 'transparent' : theme.palette.primary.main,
          },
        }}
      >
        {icon}
      </Box>
      <Box
        className="FileSystemIcon--text"
        // sx={{ display: 'flex', alignItems: 'center' }}
      >
        <Typography
          variant="body2"
          color={!isActive ? 'textPrimary' : 'textDisabled'}
          sx={{
            mt: 0.25,
            width: '135%',
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
              !isActive
                ? 'transparent'
                : alpha(
                    theme.palette.getContrastText(theme.palette.text.primary),
                    0.8
                  ),
          }}
        >
          {tagContent && (
            <Box component={'span'} sx={{ mr: 0.25 }}>
              {tagContent}
            </Box>
          )}

          {name}
        </Typography>
      </Box>
    </Box>
  );
};
