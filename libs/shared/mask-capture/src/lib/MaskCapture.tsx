import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import EditIcon from '@mui/icons-material/Edit';

interface Props {
  baseUrl?: string;
  maskVersion?: number;
  onOpenEditor?: () => void;
}

export const MaskCapture: React.FC<Props> = ({ baseUrl = '', maskVersion, onOpenEditor }) => {
  const [maskStatus, setMaskStatus] = useState<'loading' | 'loaded' | 'none'>('loading');
  const maskUrl = `${baseUrl}/api/mask/current.png?v=${maskVersion ?? Date.now()}`;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="overline" sx={{ letterSpacing: 1 }}>Mask</Typography>

      <Box
        sx={{
          position: 'relative',
          backgroundColor: '#111',
          borderRadius: 2,
          overflow: 'hidden',
          minHeight: 120,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          component="img"
          src={maskUrl}
          alt="Current mask"
          sx={{
            width: '100%',
            display: 'block',
            maxHeight: 240,
            objectFit: 'contain',
            visibility: maskStatus === 'loaded' ? 'visible' : 'hidden',
          }}
          onLoad={() => setMaskStatus('loaded')}
          onError={() => setMaskStatus('none')}
        />
        {maskStatus === 'loading' && (
          <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CircularProgress size={32} />
          </Box>
        )}
        {maskStatus === 'none' && (
          <Box sx={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
            <Typography variant="body2" color="text.secondary">No mask configured</Typography>
            <Typography variant="caption" color="text.disabled">Open the editor to create one</Typography>
          </Box>
        )}
      </Box>

      <Button variant="contained" startIcon={<EditIcon />} onClick={onOpenEditor} fullWidth>
        Open Mask Editor
      </Button>
    </Box>
  );
};
