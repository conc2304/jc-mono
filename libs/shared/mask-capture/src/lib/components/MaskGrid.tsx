import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import { MaskCard } from './MaskCard';
import { canDeleteMask } from '../hooks/useMasks';
import type { Mask } from '../hooks/useMasks';

interface Props {
  masks: Mask[];
  loading: boolean;
  error: string | null;
  onActivate: (id: string) => Promise<void>;
  onDeleteRequest: (mask: Mask) => void;
}

export const MaskGrid: React.FC<Props> = ({
  masks,
  loading,
  error,
  onActivate,
  onDeleteRequest,
}) => {
  if (loading && masks.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress size={32} />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (masks.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
        No masks available.
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 1.5,
      }}
    >
      {masks.map((mask) => (
        <MaskCard
          key={mask.id}
          mask={mask}
          canDelete={canDeleteMask(mask)}
          onActivate={onActivate}
          onDeleteRequest={onDeleteRequest}
        />
      ))}
    </Box>
  );
};
