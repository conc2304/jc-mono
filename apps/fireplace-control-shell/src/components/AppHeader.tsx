import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import { ConnectionStatusBadge } from '@jc/fireplace-control-shared-ui';
import { useOFStore } from '@jc/shared/of-control-client';

export const AppHeader: React.FC = () => {
  const store = useOFStore();
  const { connection, currentMode, fps } = store;

  return (
    <AppBar position="fixed" elevation={0}>
      <Toolbar variant="dense" sx={{ gap: 1, minHeight: 48 }}>
        <LocalFireDepartmentIcon sx={{ color: 'primary.main', fontSize: 20 }} />
        <Typography variant="subtitle2" sx={{ fontWeight: 700, letterSpacing: 0.5, flexShrink: 0 }}>
          Fireplace
        </Typography>

        <Box sx={{ flex: 1 }} />

        {currentMode && (
          <Chip
            size="small"
            label={currentMode}
            variant="outlined"
            sx={{ fontSize: '0.65rem', height: 20, textTransform: 'capitalize', borderColor: 'primary.dark' }}
          />
        )}

        {fps !== null && (
          <Typography variant="caption" color="text.disabled" sx={{ fontVariantNumeric: 'tabular-nums', flexShrink: 0 }}>
            {fps.toFixed(0)} fps
          </Typography>
        )}

        <ConnectionStatusBadge status={connection.status} reconnectAttempt={connection.reconnectAttempt} />
      </Toolbar>
    </AppBar>
  );
};
