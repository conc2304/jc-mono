import React from 'react';
import Box from '@mui/material/Box';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';

export interface ControlToggleProps {
  id: string;
  label: string;
  value: boolean;
  description?: string;
  disabled?: boolean;
  onChange: (id: string, value: boolean) => void;
}

export const ControlToggle: React.FC<ControlToggleProps> = ({
  id,
  label,
  value,
  description,
  disabled = false,
  onChange,
}) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
      <Tooltip title={description ?? ''} placement="top-start" disableHoverListener={!description}>
        <Typography variant="caption" color="text.secondary" sx={{ userSelect: 'none' }}>
          {label}
        </Typography>
      </Tooltip>
      <Switch
        size="small"
        checked={!!value}
        disabled={disabled}
        onChange={(e) => onChange(id, e.target.checked)}
        inputProps={{ 'aria-label': label }}
      />
    </Box>
  );
};
