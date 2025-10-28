import { Box, Typography, alpha } from '@mui/material';

import { ensureContrast, getContextualImage } from '@jc/utils';

import {
  GlitchText,
  ScrambleText,
} from '../../../../../libs/shared/components/src/lib/atoms';

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
            backdropFilter: 'blur(2px)',

            background: alpha(
              ensureContrast(
                theme.palette.error.main,
                theme.palette.text.primary,
                1.5
              ).color,
              0.85
            ),
          })}
        >
          <Box
            sx={{
              width: '100%',
              height: '100%',
              position: 'absolute',
              backgroundImage: `url(${
                getContextualImage(
                  'textures/ui/scratched-glass-with-scuffs.jpg',
                  'full'
                ).src
              })`,
              backgroundBlendMode: 'screen',
              backgroundSize: 'cover',
              opacity: 0.15,
              top: 0,
              zIndex: -1,
              transform: 'scale(-1)',
            }}
          />
          {'404'.split('').map((char, i) => (
            <Box
              key={char + i}
              sx={(theme) => ({
                textAlign: 'center',
                verticalAlign: 'top',
                width: '30%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              })}
            >
              <GlitchText
                color="text.primary"
                variant="display"
                intensity="extreme"
                sx={(theme) => ({
                  textAlign: 'center',
                  verticalAlign: 'top',

                  [theme.breakpoints.up('sm')]: {
                    fontSize: '10rem',
                  },
                  [theme.breakpoints.up('md')]: {
                    fontSize: '16rem',
                  },
                  [theme.breakpoints.up('lg')]: {
                    fontSize: '22rem',
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
            background: alpha(
              ensureContrast(
                theme.palette.error.main,
                theme.palette.text.primary,
                1.5
              ).color,
              0.65
            ),
            '--aug-l-extend1': '40%',
            '--aug-br-inset2': '26%',
            '--aug-tr-inset1': '26%',
          })}
        >
          <Box
            sx={{
              width: '100%',
              height: '100%',
              position: 'absolute',
              backgroundImage: `url(${
                getContextualImage(
                  'textures/ui/scratched-glass-with-scuffs.jpg',
                  'full'
                ).src
              })`,
              backgroundBlendMode: 'screen',
              backgroundSize: 'cover',
              opacity: 0.15,
              top: 0,
              left: 0,
              right: 0,
              zIndex: -1,
            }}
          />
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
