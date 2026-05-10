import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useOFStore, useOFClient } from '@jc/shared/of-control-client';
import { ConnectionStatusBadge } from '@jc/fireplace-control-shared-ui';

export const StatusView: React.FC = () => {
  const store = useOFStore();
  const { client } = useOFClient();
  const { connection, schema, currentMode, currentPreset, fps, values } = store;

  const paramCount = schema?.params?.length ?? 0;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="overline" sx={{ letterSpacing: 1 }}>Connection Status</Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">WebSocket</Typography>
          <ConnectionStatusBadge status={connection.status} reconnectAttempt={connection.reconnectAttempt} />
        </Box>

        {connection.error && (
          <Typography variant="caption" color="error">{connection.error}</Typography>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2" color="text.secondary">Mode</Typography>
          <Typography variant="body2">{currentMode ?? '—'}</Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2" color="text.secondary">Preset</Typography>
          <Typography variant="body2">{currentPreset ?? '—'}</Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2" color="text.secondary">FPS</Typography>
          <Typography variant="body2" sx={{ fontVariantNumeric: 'tabular-nums' }}>
            {fps !== null ? fps.toFixed(1) : '—'}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2" color="text.secondary">Parameters</Typography>
          <Typography variant="body2">{paramCount}</Typography>
        </Box>
      </Box>

      <Divider />

      <Typography variant="overline" sx={{ letterSpacing: 1 }}>Actions</Typography>

      <Button
        variant="outlined"
        size="small"
        startIcon={<RefreshIcon />}
        onClick={() => {
          client.send({ type: 'getParamSchema' });
          client.send({ type: 'getState' });
        }}
      >
        Refresh Schema & State
      </Button>

      <Divider />

      <Typography variant="overline" sx={{ letterSpacing: 1 }}>Active Values</Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, maxHeight: 300, overflowY: 'auto' }}>
        {Object.entries(values).map(([k, v]) => (
          <Box key={k} sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace', flexShrink: 0 }}>{k}</Typography>
            <Typography variant="caption" sx={{ fontFamily: 'monospace', textAlign: 'right', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {JSON.stringify(v)}
            </Typography>
          </Box>
        ))}
        {Object.keys(values).length === 0 && (
          <Typography variant="caption" color="text.disabled">No values received yet</Typography>
        )}
      </Box>
    </Box>
  );
};
