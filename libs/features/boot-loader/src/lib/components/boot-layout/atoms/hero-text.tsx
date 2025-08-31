import { useTheme, useMediaQuery, Typography } from '@mui/material';

export const HeroText = () => {
  const isSm = useMediaQuery(useTheme().breakpoints.down('sm'));
  return (
    <>
      <Typography
        variant="display"
        color="primary"
        fontSize={isSm ? '1.9rem' : undefined}
      >
        Jose Conchello
      </Typography>
      <Typography variant="h3" color="primary">
        UI Engineer & Artist
      </Typography>
      <Typography variant="h3" color="primary">
        Creative Technologist"
      </Typography>
    </>
  );
};
