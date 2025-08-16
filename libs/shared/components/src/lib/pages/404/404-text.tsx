import { Box, Typography, TypographyProps } from '@mui/material';
import { GlitchText, ScrambleText } from '../../atoms';
import { ensureContrast } from '@jc/utils';

export const Text404 = () => {
  return (
    <>
      <Box display={'flex'}>
        <Box
          data-augmented-ui="border bl-clip tl-clip tr-clip-y br-clip-y"
          sx={(theme) => ({
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            '--aug-tl': '2.5rem',
            '--aug-bl': '8rem',
            '--aug-br-inset2': '26%',
            '--aug-tr-inset1': '26%',
            width: '100%',
            background: ensureContrast(
              theme.palette.error.main,
              theme.palette.text.primary,
              1.5
            ).color,

            // [theme.breakpoints.up('sm')]: {
            //   height: '10rem',
            // },
            // [theme.breakpoints.up('md')]: {
            //   height: '16rem',
            // },
            // [theme.breakpoints.up('lg')]: {
            //   height: '22rem',
            // },
          })}
        >
          {'404'.split('').map((char) => (
            <Box
              sx={(theme) => ({
                textAlign: 'center',
                verticalAlign: 'top',
                width: '30%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',

                [theme.breakpoints.up('sm')]: {
                  height: '10rem',
                },
                [theme.breakpoints.up('md')]: {
                  height: '16rem',
                },
                [theme.breakpoints.up('lg')]: {
                  height: '22rem',
                },
              })}
            >
              <GlitchText
                color="text.primary"
                variant="display"
                intensity="extreme"
                sx={(theme) => ({
                  textAlign: 'center',
                  verticalAlign: 'top',
                  width: '30%',
                  maxWidth: '30%',
                  lineHeight: 0,

                  [theme.breakpoints.up('sm')]: {
                    height: '10rem',
                  },
                  [theme.breakpoints.up('md')]: {
                    height: '16rem',
                  },
                  [theme.breakpoints.up('lg')]: {
                    height: '22rem',
                  },
                })}
              >
                {char}
              </GlitchText>
            </Box>
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
