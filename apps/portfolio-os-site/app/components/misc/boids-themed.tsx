import { Box, FormControlLabel, Switch, useTheme } from '@mui/material';
import { useState } from 'react';

import { BoidsSimulation } from '@jc/boids';

export const BoidsThemed = () => {
  const theme = useTheme();
  const [obstaclesEnabled, setObstaclesEnabled] = useState(false);

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: 320,
        overflow: 'hidden',
      }}
    >
      <BoidsSimulation
        physics={false}
        debug={false}
        obstacles="aquarium"
        obstaclesEnabled={obstaclesEnabled}
        gridColors={{
          gridColor: theme.palette.primary.main,
          centerColor: theme.palette.secondary.main,
        }}
      />
      <FormControlLabel
        control={
          <Switch
            checked={obstaclesEnabled}
            onChange={(event) => setObstaclesEnabled(event.target.checked)}
            size="small"
          />
        }
        label="Obstacles"
        sx={{
          position: 'absolute',
          bottom: 8,
          right: 8,
          zIndex: 2,
          m: 0,
          px: 1,
          py: 0.25,
          borderRadius: 1,
          bgcolor: 'rgba(0, 0, 0, 0.45)',
          color: theme.palette.text.primary,
          '& .MuiFormControlLabel-label': {
            fontSize: '0.75rem',
          },
        }}
      />
    </Box>
  );
};
