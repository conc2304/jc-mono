import { Box } from '@mui/material';

import { BoidsSimulation } from '@jc/boids';

export const BoidsThemed = () => {
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
      <BoidsSimulation physics={false} debug={false} />
    </Box>
  );
};
