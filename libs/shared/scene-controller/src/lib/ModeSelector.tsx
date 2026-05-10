import React from 'react';
import Box from '@mui/material/Box';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
import type { ModeSummary } from '@jc/of-control-protocol';

interface Props {
  modes: ModeSummary[];
  currentMode: string | null;
  onChange: (mode: string) => void;
}

export const ModeSelector: React.FC<Props> = ({ modes, currentMode, onChange }) => {
  if (modes.length === 0) return null;

  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="overline" color="text.secondary" sx={{ display: 'block', mb: 0.5, letterSpacing: 1 }}>
        Mode
      </Typography>
      <ToggleButtonGroup
        value={currentMode}
        exclusive
        onChange={(_, v) => { if (v !== null) onChange(v); }}
        size="small"
        fullWidth
        sx={{ flexWrap: 'wrap', gap: 0.5 }}
      >
        {modes.map((m) => (
          <ToggleButton
            key={m.id}
            value={m.id}
            disabled={!m.enabled}
            sx={{ flex: '1 1 auto', minWidth: 60, textTransform: 'capitalize', fontSize: '0.75rem' }}
          >
            {m.label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Box>
  );
};
