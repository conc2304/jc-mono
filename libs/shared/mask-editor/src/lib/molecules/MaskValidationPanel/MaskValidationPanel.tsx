import React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import type { ValidationResult } from '../../types';

export interface MaskValidationPanelProps {
  validation: ValidationResult | null;
}

export const MaskValidationPanel: React.FC<MaskValidationPanelProps> = ({ validation }) => {
  if (!validation) return null;
  return (
    <Box sx={{ p: 1.5, borderRadius: 1, border: '1px solid', borderColor: 'divider', backgroundColor: 'rgba(0,0,0,0.2)' }}>
      <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
        <Chip size="small" label={`${validation.openPercent}% open grout`} color="success" variant="outlined" />
        <Chip size="small" label={`${validation.blockedPercent}% blocked`} color="default" variant="outlined" />
      </Stack>
      {validation.warnings.map((w, i) => (
        <Alert key={i} severity="warning" sx={{ py: 0.25, mb: 0.5 }}>{w}</Alert>
      ))}
    </Box>
  );
};
