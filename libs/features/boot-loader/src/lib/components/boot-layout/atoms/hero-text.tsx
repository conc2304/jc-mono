import { ScrambleText } from '@jc/ui-components';
import { Typography } from '@mui/material';

export const HeroText = () => {
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
        sx={{
          fontSize: { sm: '1.9rem', md: '2.35rem', lg: '3rem' },
        }}
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
