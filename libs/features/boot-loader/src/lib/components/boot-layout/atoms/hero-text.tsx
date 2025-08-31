import { ScrambleText } from '@jc/ui-components';
import { useTheme, useMediaQuery, Typography } from '@mui/material';

export const HeroText = () => {
  const isSm = useMediaQuery(useTheme().breakpoints.down('sm'));
  return (
    <>
      <ScrambleText
        defaultText="Jose Conchello"
        hoverText="Via @CLYZBY_OS"
        variant="display"
        color="primary"
        fontSize={isSm ? '1.9rem' : undefined}
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
