import { ScrambleText } from '@jc/ui-components';
import { useTheme, useMediaQuery, Typography } from '@mui/material';

export const HeroText = () => {
  const isSm = useMediaQuery(useTheme().breakpoints.down('sm'));
  return (
    <>
      <Typography variant="h4" color="primary" my={1}>
        A Portfolio Site Experience by
      </Typography>

      <ScrambleText
        defaultText="Jose Conchello"
        hoverText="Via @CLYZBY_OS"
        variant="display"
        color="primary"
        fontSize={isSm ? '1.9rem' : undefined}
        my={1}
      />
      <Typography variant="h3" color="primary">
        UI Engineer & Artist
      </Typography>
      <Typography variant="h3" color="primary">
        Creative Technologist
      </Typography>
    </>
  );
};
