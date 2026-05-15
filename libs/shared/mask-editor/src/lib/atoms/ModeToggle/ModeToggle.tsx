import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import type { MaskEditMode } from '../../types';

export interface ModeToggleProps {
  mode: MaskEditMode;
  onChange: (mode: MaskEditMode) => void;
  size?: 'small' | 'medium';
}

export const ModeToggle: React.FC<ModeToggleProps> = ({ mode, onChange, size = 'small' }) => (
  <Box sx={{ display: 'inline-flex', gap: 0.5 }}>
    <Tooltip title="Add to mask — paint where the mask is drawn (X)">
      <Button
        size={size}
        disableElevation
        onClick={() => onChange('add-black')}
        variant={mode === 'add-black' ? 'contained' : 'outlined'}
        color="success"
        startIcon={<AddIcon />}
        sx={{ minWidth: size === 'medium' ? 86 : 70, px: 1.25 }}
      >
        Add
      </Button>
    </Tooltip>
    <Tooltip title="Subtract from mask — remove painted area (X)">
      <Button
        size={size}
        disableElevation
        onClick={() => onChange('subtract-white')}
        variant={mode === 'subtract-white' ? 'contained' : 'outlined'}
        color="error"
        startIcon={<RemoveIcon />}
        sx={{ minWidth: size === 'medium' ? 108 : 88, px: 1.25 }}
      >
        Subtract
      </Button>
    </Tooltip>
  </Box>
);
