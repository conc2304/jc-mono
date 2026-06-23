import { BoidsSimulationWithSettings } from '@jc/boids';
import { useTheme } from '@mui/material';

export const BoidsThemed = () => {
  const theme = useTheme();

  return (
    <BoidsSimulationWithSettings
      physics={false}
      debug={false}
      obstacles="aquarium"
      gridColors={{
        gridColor: theme.palette.primary.main,
        centerColor: theme.palette.secondary.main,
      }}
    />
  );
};
