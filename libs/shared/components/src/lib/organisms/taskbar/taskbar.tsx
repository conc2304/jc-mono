import { alpha, Box, Divider, Typography } from '@mui/material';

import { AugmentedButton } from '../../atoms';
import { useWindowActions, useWindowManager } from '../../context';
import { NotificationCenter } from '../notification-center';

export const TaskBar = () => {
  const { windows } = useWindowManager();
  const { minimizeWindow } = useWindowActions();

  return (
    <Box
      className="TaskBar--root"
      sx={(theme) => ({
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: theme.mixins.taskbar.height,
        background: alpha(theme.palette.primary[theme.palette.mode], 0.9),
        display: 'flex',
        alignItems: 'center',
        p: 0.5,
      })}
    >
      <AugmentedButton
        shape="buttonLeft"
        size="medium"
        variant="contained"
        sx={{ ml: 1 }}
      >
        Start
      </AugmentedButton>

      <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
      <Box
        className="Taskbar--right"
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flex: 1,
        }}
      >
        <Box
          className="Taskbar--windows"
          sx={{
            display: 'flex',
            flex: 1,
          }}
        >
          {windows.map((window) => (
            <AugmentedButton
              key={window.id}
              size="medium"
              shape="buttonRight"
              variant="outlined"
              color="inherit"
              onClick={() => minimizeWindow(window.id)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                mx: 1,
                opacity: window.minimized ? 0.7 : 1,
              }}
            >
              {window.icon}
              <Typography component="span" variant="body2" sx={{ ml: 0.25 }}>
                {window.title}
              </Typography>
            </AugmentedButton>
          ))}
        </Box>

        {/* <NotificationCenter /> */}
      </Box>
    </Box>
  );
};
