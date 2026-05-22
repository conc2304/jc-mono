import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import SettingsIcon from '@mui/icons-material/Settings';
import type { ControlParam } from '@jc/shared/of-control-protocol';
import { getSummaryFields } from './globalSettingsManifest';

interface Props {
  params: ControlParam[];
  values: Record<string, unknown>;
  onOpen: () => void;
}

export const GlobalSettingsLauncher: React.FC<Props> = ({ params, values, onOpen }) => {
  const summaryFields = getSummaryFields(params, values);
  const remaining = params.length - summaryFields.length;

  return (
    <Box
      onClick={onOpen}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        px: 1.5,
        py: 1,
        mb: 1,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        cursor: 'pointer',
        '&:hover': { borderColor: 'text.disabled' },
      }}
    >
      <Typography
        variant="caption"
        color="text.disabled"
        sx={{ flexShrink: 0, letterSpacing: 0.5, textTransform: 'uppercase', fontSize: '0.65rem' }}
      >
        Global
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flex: 1, overflow: 'hidden', flexWrap: 'nowrap' }}>
        {summaryFields.map((f, i) => (
          <React.Fragment key={f.id}>
            {i > 0 && (
              <Typography variant="caption" color="text.disabled" sx={{ flexShrink: 0 }}>
                ·
              </Typography>
            )}
            <Typography
              variant="caption"
              color="text.secondary"
              noWrap
              sx={{ flexShrink: 0 }}
            >
              {f.label} {f.formattedValue}
            </Typography>
          </React.Fragment>
        ))}
        {remaining > 0 && (
          <>
            <Typography variant="caption" color="text.disabled" sx={{ flexShrink: 0 }}>·</Typography>
            <Typography variant="caption" color="text.disabled" sx={{ flexShrink: 0 }}>
              +{remaining} more
            </Typography>
          </>
        )}
      </Box>

      <Button
        size="small"
        variant="text"
        startIcon={<SettingsIcon sx={{ fontSize: '0.9rem !important' }} />}
        onClick={(e) => { e.stopPropagation(); onOpen(); }}
        sx={{
          flexShrink: 0,
          ml: 'auto',
          minWidth: 0,
          px: 1,
          fontSize: '0.7rem',
          color: 'text.secondary',
          '&:hover': { color: 'text.primary' },
        }}
      >
        Edit
      </Button>
    </Box>
  );
};
