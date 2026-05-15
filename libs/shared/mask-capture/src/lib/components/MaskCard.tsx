import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import CircularProgress from '@mui/material/CircularProgress';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import type { Mask } from '../hooks/useMasks';

interface Props {
  mask: Mask;
  canDelete: boolean;
  onActivate: (id: string) => Promise<void>;
  onDeleteRequest: (mask: Mask) => void;
}

export const MaskCard: React.FC<Props> = ({ mask, canDelete, onActivate, onDeleteRequest }) => {
  const [activating, setActivating] = useState(false);

  const handleActivate = async () => {
    if (mask.active || activating) return;
    setActivating(true);
    try {
      await onActivate(mask.id);
    } finally {
      setActivating(false);
    }
  };

  return (
    <Box
      onClick={handleActivate}
      sx={{
        position: 'relative',
        borderRadius: 2,
        overflow: 'hidden',
        border: '2px solid',
        borderColor: mask.active ? 'primary.main' : 'divider',
        backgroundColor: 'background.paper',
        cursor: mask.active ? 'default' : 'pointer',
        transition: 'border-color 0.15s',
        '&:hover': mask.active ? {} : { borderColor: 'primary.light' },
      }}
    >
      {/* Thumbnail */}
      <Box
        sx={{
          position: 'relative',
          backgroundColor: '#111',
          aspectRatio: '16/9',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          component="img"
          src={mask.thumbUrl}
          alt={mask.name}
          sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          onError={(e) => {
            (e.target as HTMLImageElement).style.opacity = '0';
          }}
        />
        {activating && (
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(0,0,0,0.5)',
            }}
          >
            <CircularProgress size={24} />
          </Box>
        )}
        {mask.active && (
          <CheckCircleIcon
            sx={{
              position: 'absolute',
              top: 6,
              right: 6,
              color: 'primary.main',
              fontSize: 20,
              filter: 'drop-shadow(0 0 3px rgba(0,0,0,0.8))',
            }}
          />
        )}
      </Box>

      {/* Footer */}
      <Box sx={{ px: 1, py: 0.75, display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <Typography
          variant="caption"
          noWrap
          title={mask.name}
          sx={{ flex: 1, fontWeight: mask.active ? 600 : 400, fontSize: '0.7rem' }}
        >
          {mask.name}
        </Typography>

        {mask.active && (
          <Chip
            label="Active"
            size="small"
            color="primary"
            sx={{ height: 16, fontSize: '0.6rem', flexShrink: 0 }}
          />
        )}

        {canDelete && (
          <Tooltip title="Delete mask">
            <IconButton
              size="small"
              color="error"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteRequest(mask);
              }}
              sx={{ p: 0.25 }}
            >
              <DeleteIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    </Box>
  );
};
