import { Box, useTheme } from '@mui/material';

import { BoidsSimulation } from '@jc/boids';

export const BoidsThemed = () => {
  const theme = useTheme();

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
        gridColors={{
          gridColor: theme.palette.primary.main,
          centerColor: theme.palette.secondary.main,
        }}
      />
    </Box>
  );
};
