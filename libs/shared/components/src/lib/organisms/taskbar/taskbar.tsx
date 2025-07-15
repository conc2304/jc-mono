import { alpha, Box, Divider, Typography } from '@mui/material';

import { AugmentedButton } from '../../atoms';
import { useWindowActions, useWindowManager } from '../../context';
import { WindowMetaData } from '../../types';

interface TaskBarProps {
  // windows?: WindowMetaData[];
  // minimizeWindow: (id: string) => void;
}

export const TaskBar = ({}: TaskBarProps) => {
  const { windows } = useWindowManager();
  const { minimizeWindow } = useWindowActions();
  return (
    <Box
      className="TaskBar--root"
      sx={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: (theme) => theme.mixins.taskbar.height,
        background: (theme) => alpha(theme.palette.info.light, 0.9),
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        p: 0.5,
      }}
    >
      <AugmentedButton
        shape="buttonLeft"
        size="medium"
        variant="contained"
        sx={{ ml: 1 }}
      >
        Start
      </AugmentedButton>

      <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

      {windows.map((window) => (
        <AugmentedButton
          key={window.id}
          size="medium"
          shape="buttonRight"
          variant="outlined"
          onClick={() => minimizeWindow(window.id)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            mx: 1,
            opacity: window.minimized ? 0.6 : 1,
          }}
          className={`flex items-center space-x-2 px-3 py-1 rounded text-sm ${
            window.minimized
              ? 'bg-gray-600 text-gray-300'
              : 'bg-gray-700 text-white hover:bg-gray-600'
          }`}
        >
          {window.icon}
          <Typography component="span" variant="body2" sx={{ ml: 0.25 }}>
            {window.title}
          </Typography>
        </AugmentedButton>
      ))}
    </Box>
  );
};
