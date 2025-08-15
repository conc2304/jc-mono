import { Box, Typography, TypographyProps } from '@mui/material';
import { GlitchText, ScrambleText } from '../../atoms';
import { ensureContrast } from '@jc/utils';

export const Text404 = () => {
  const typographyProps: TypographyProps = {
    variant: 'h1',
    color: 'text.primary',
    sx: {
      fontSize: '22rem',
      lineHeight: '20rem',
      width: '22rem',
      height: '22rem',
      // pb: 2,
      textAlign: 'center',
      verticalAlign: 'top',
      // bgcolor: 'error.main',
    },
  };
  const text = '404';
  return (
    <>
      <Box display={'flex'}>
        <Box
          data-augmented-ui="border bl-clip tl-clip tr-clip-y br-clip-y"
          sx={(theme) => ({
            display: 'flex',
            '--aug-tl': '2.5rem',
            '--aug-bl': '8rem',
            '--aug-br-inset2': '26%',
            '--aug-tr-inset1': '26%',
            background: ensureContrast(
              theme.palette.error.main,
              theme.palette.text.primary,
              1.5
            ).color,
          })}
        >
          {text.split('').map((t) => (
            <GlitchText
              {...typographyProps}
              intensity="extreme"
              sx={{
                '--aug-tl': '4rem',
                ...typographyProps.sx,
              }}
            >
              {t}
            </GlitchText>
          ))}
        </Box>
        <Box
          data-augmented-ui="border l-clip-y  tr-clip-y br-clip-y"
          sx={(theme) => ({
            writingMode: 'sideways-lr',
            textAlign: 'center',
            pl: 4,
            pr: 4,
            background: ensureContrast(
              theme.palette.error.main,
              theme.palette.text.primary,
              1.5
            ).color,
            '--aug-l-extend1': '40%',
            '--aug-br-inset2': '26%',
            '--aug-tr-inset1': '26%',
          })}
        >
          <Typography variant="h2">PAGE NOT FOUND</Typography>
        </Box>
      </Box>
      <Box
        data-augmented-ui="both br-clip bl-2-clip-x"
        sx={(theme) => ({
          '--aug-border-bg': theme.palette.getInvertedMode('error'),
          '--aug-inlay-bg': theme.palette.getInvertedMode('error', true),
          '--aug-inlay-opacity': 0.8,

          '--aug-bl-extend1': `calc(100% - 350px)`,
          '--aug-bl1': '3rem',
          '--aug-bl2': '2.5rem',
          flexGrow: 0,
          display: 'flex',
          justifyContent: 'end',
          float: 'right',
          width: '80%',
          p: 3,
          fontSize: 'initial',
          mr: 2,
        })}
      >
        <ScrambleText
          variant="h3"
          defaultText="Are you lost?"
          hoverText="You look lost."
          scrambleChars={5}
          scrambleDuration={0.3}
          style={{}}
          color="text.primary"
        />
      </Box>
    </>
  );
};
