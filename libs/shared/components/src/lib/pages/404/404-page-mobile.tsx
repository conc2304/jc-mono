import { Box, darken, Stack, Typography, useTheme } from '@mui/material';
import { CSSProperties, ReactNode } from 'react';
import { DiagonalLines } from './diagonal-box';
import { HorizontalCompass } from './digital-compass';
import { MinimalThemeSwitcher } from '@jc/themes';
import { Text404 } from './404-text';
import { NavigationButtons } from './navigation-button';
import { RetroVideoPanel } from './retro-video-panel';

export const MobilePageNotFound404 = ({
  onHomeClick,
}: {
  onHomeClick: () => void;
}) => {
  const theme = useTheme();

  const HeroText = ({ children }: { children: ReactNode }) => (
    <Typography
      variant="display"
      color="error"
      sx={{
        height: '75%',
        zIndex: 1,
        px: 1,
        fontSize: '75cqh !important',
        textAlign: 'center',
        WebkitTextStrokeWidth: '2px',
        WebkitTextStrokeColor: theme.palette.getInvertedMode('error', true),
        WebkitTextFillColor: theme.palette.getInvertedMode('error', false),
      }}
    >
      {children}
    </Typography>
  );

  return (
    <Stack
      sx={{
        height: '100%',
        width: '100%',
        padding: 2,
        bgcolor: theme.palette.background.paper,
        backgroundImage: `url('https://img.freepik.com/free-photo/old-black-fabric-material-with-copy-space_23-2148402339.jpg?ga=GA1.1.547750373.1752437532&semt=ais_hybrid&w=740&q=80')`,
        // mixBlendMode: 'screen',
        backgroundPosition: '0 0%',
        backgroundSize: '100%',
        justifyContent: 'space-between',
        gap: 2,
        position: 'relative',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '120%',
          mt: '-20%',
          zIndex: 0,
        }}
      >
        <DiagonalLines
          lineThickness={1}
          spacing={5}
          direction="diagonal-alt"
          width="100%"
          height="100%"
          color={theme.palette.getInvertedMode('error', true)}
          opacity={1}
        />
      </Box>
      <Box
        className="digital-compass-container"
        data-augmented-ui="border bl-clip br-clip"
        sx={{
          position: 'absolute',
          zIndex: 10,
          top: theme.spacing(2),
          width: '45%',
          height: '2.5rem',
          '--aug-border-top': '2px',
          '--aug-border-bottom': '0px',
          '--aug-border-left': '5px',
          '--aug-border-right': '5px',
          '--aug-br': '1.5rem',
          '--aug-bl': '1.5rem',
          left: '50%',
          transform: 'translate(-50%, 0)',
          overflow: 'hidden',
          background: `linear-gradient(180deg, ${theme.palette.error.main}80, ${theme.palette.error.main}50, ${theme.palette.secondary.main}00)`,
          textAlign: 'center',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography variant="h2" fontSize={'200%'}>
          Lost?
        </Typography>
      </Box>

      <Box
        className="background-upper"
        data-augmented-ui="both tl-clip t-clip-x br-2-clip-y bl-2-clip-y tr-clip"
        sx={(theme) => ({
          zIndex: 1,
          position: 'relative',
          '--aug-border-bg': theme.palette.getInvertedMode('error', false),
          '--aug-inlay-bg': theme.palette.getInvertedMode('error', false),
          backgroundColor: theme.palette.error.main,
          '--aug-inlay-opacity': 1,
          '--aug-t': '3rem',
          '--aug-t-extend1': '40%',
          '--aug-bl': '1rem',
          '--aug-br': '1rem',
          '--aug-br-extend1': '25%',
          '--aug-bl-extend2': '25%',
          height: '50%',
          width: '100%',
          display: 'flex',
          flexGrow: 1,
          flexDirection: 'column',
          justifyContent: 'end',
          pt: '4rem',
          pl: '2rem',
          pr: '2rem',
          pb: '1rem',
        })}
      >
        <Box
          sx={{
            flexGrow: 1,
            mb: '2rem',
            maxHeight: 'calc(75% - 2rem)',
          }}
        >
          <RetroVideoPanel />
        </Box>

        <Box
          sx={{
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1,
            height: 'calc(25% + 1rem)',
            width: '100%',
            px: '2rem',
          }}
        >
          <Box
            data-augmented-ui="br-clip bl-clip"
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              zIndex: 0,
            }}
          >
            <DiagonalLines
              lineThickness={5}
              spacing={10}
              direction="diagonal-alt"
              width="100%"
              height="100%"
              color={theme.palette.mode === 'light' ? 'black' : 'white'}
              opacity={0.8}
            />
          </Box>
          <Stack
            sx={{
              containerType: 'size',
              height: '100%',
              width: '100%',
              textAlign: 'center',
              justifyContent: 'start',
            }}
          >
            <Box
              sx={{
                flexGrow: 1,
                display: 'flex',
                justifyContent: 'space-evenly',
              }}
            >
              {'404'.split('').map((char, i) => (
                <HeroText key={char + i}>{char}</HeroText>
              ))}
            </Box>
            <Typography
              variant="h2"
              zIndex={1}
              sx={{
                height: '20%',
                width: '100%',
                fontSize: '20cqh !important',
                color: theme.palette.mode === 'dark' ? 'black' : 'white', // inverse of lines
              }}
            >
              Page Not Found
            </Typography>
          </Stack>
        </Box>
      </Box>

      <Box
        maxHeight={'33vh'}
        sx={{
          aspectRatio: '1.85 / 1',
        }}
      >
        <NavigationButtons onHomeClick={onHomeClick} />
      </Box>
    </Stack>
  );
};
