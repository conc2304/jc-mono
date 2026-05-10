import React from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import type { ConnectionStatus } from '@jc/of-control-protocol';

interface Props {
  status: ConnectionStatus;
  reconnectAttempt?: number;
}

const STATUS_CONFIG: Record<ConnectionStatus, { label: string; color: 'success' | 'warning' | 'error' | 'default' }> = {
  connected:     { label: 'Connected',     color: 'success' },
  connecting:    { label: 'Connecting…',   color: 'warning' },
  reconnecting:  { label: 'Reconnecting…', color: 'warning' },
  disconnected:  { label: 'Disconnected',  color: 'default' },
  error:         { label: 'Error',         color: 'error'   },
};

export const ConnectionStatusBadge: React.FC<Props> = ({ status, reconnectAttempt }) => {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.disconnected;
  const label = reconnectAttempt && reconnectAttempt > 0
    ? `${cfg.label} (#${reconnectAttempt})`
    : cfg.label;

  return (
    <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
      <Chip
        size="small"
        label={label}
        color={cfg.color}
        variant="outlined"
        sx={{ fontSize: '0.7rem', height: 22 }}
      />
    </Box>
  );
};
