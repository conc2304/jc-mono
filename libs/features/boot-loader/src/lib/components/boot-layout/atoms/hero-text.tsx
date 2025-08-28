import { ScrambleText } from '@jc/ui-components';
import { useTheme, useMediaQuery } from '@mui/material';

export const HeroText = () => {
  const isSm = useMediaQuery(useTheme().breakpoints.down('sm'));
  return (
    <>
      <ScrambleText
        variant="display"
        color="primary"
        defaultText="Jose Conchello"
        hoverText="Via CLYZBY_OS"
        fontSize={isSm ? '1.9rem' : undefined}
        sx={(theme) => ({})}
      />
      <ScrambleText
        variant="h3"
        color="primary"
        defaultText="UI Engineer & Artist"
        hoverText="Creative Technologist"
      />
    </>
  );
};
