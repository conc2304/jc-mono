import { Box, darken, Stack, Typography, useTheme } from '@mui/material';
import { CSSProperties } from 'react';
import { DiagonalLines } from '../../atoms/diagonal-lines/diagonal-lines';
import { HorizontalCompass } from './digital-compass';
import { MinimalThemeSwitcher } from '@jc/themes';
import { Text404 } from './404-text';
import { NavigationButtons } from './navigation-button';
import { RetroVideoPanel } from './retro-video-panel';
import { useNavigate } from 'react-router-dom';
import { getImageUrl } from '@jc/utils';

export const DesktopPageNotFound404 = ({
  onHomeClick,
}: {
  onHomeClick: () => void;
}) => {
  const bgOverlayProps: CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  };

  const theme = useTheme();

  return (
    <Box
      sx={{
        height: [
          '100vh', // Fallback
          '100dvh', // Preferred value
        ],
        width: '100vw',
        padding: 2,
        bgcolor: theme.palette.background.paper,
      }}
    >
      {/* UPPER SECTION */}

      <Box
        className="digital-compass-container"
        data-augmented-ui="border bl-clip br-clip"
        sx={{
          position: 'absolute',
          zIndex: 10,
          top: theme.spacing(2),
          width: '41%',
          height: '2.5rem',
          '--aug-border-top': '2px',
          '--aug-border-bottom': '0px',
          '--aug-border-left': '5px',
          '--aug-border-right': '5px',
          '--aug-br': '1.5rem',
          '--aug-bl': '1.5rem',
          left: 'calc(50% - 3rem - 1.6rem)',
          transform: 'translate(-50%, 0)',
          overflow: 'hidden',
          background: `linear-gradient(180deg, ${theme.palette.error.main}80, ${theme.palette.error.main}50, ${theme.palette.secondary.main}00)`,
        }}
      >
        <HorizontalCompass
          width="100%"
          height="100%"
          showGridLines={false}
          showCurrentDegree={false}
          minorTickSx={{
            top: '50%',
            transform: 'translateY(-50%)',
            bgcolor: 'info.main',
          }}
          customCardinalComponent={({ name, degree, position }) => (
            <Stack
              sx={{
                position: 'absolute',
                transform: 'translate(-50%, 0)',
                alignItems: 'center',
                height: '100%',
              }}
              style={{
                left: `${position}px`,
              }}
            >
              <Typography variant="caption">{name}</Typography>
              <Box
                sx={{
                  background: theme.palette.getInvertedMode('error'),
                  width: '2px',
                  height: '100%',
                }}
              />
              {/* <Typography variant="overline">{degree}°</Typography> */}
            </Stack>
          )}
          customCenterMarker={
            <Box
              className="all-triangle-up border"
              data-augmented-ui="all-triangle-up border"
              sx={(theme) => ({
                '--aug-border-all': '2px',
                '--aug-border-bg': theme.palette.text.primary,
              })}
            />
          }
        />
      </Box>
      <Box
        className="background-upper"
        data-augmented-ui="both tl-clip t-clip-x br-2-clip-y bl-2-clip-y tr-clip"
        sx={(theme) => ({
          position: 'relative',
          '--aug-border-bg': theme.palette.getInvertedMode('error', false),
          '--aug-inlay-bg': theme.palette.getInvertedMode('error', false),
          '--aug-inlay-opacity': 1,
          backgroundColor: theme.palette.error.main,

          '--aug-t': '3rem',
          '--aug-t-extend1': '40%',
          '--aug-bl': '3rem',
          '--aug-tr': '10rem',

          '--aug-br-inset2': '25%',
          '--aug-br-extend1': '15%',
          height: '50%',
          width: '100%',

          display: 'flex',
          justifyContent: 'end',
        })}
      >
        <Box
          // Upper Panel Background Texture
          sx={{
            backgroundImage: `url(${getImageUrl(
              'textures/ui/stone-texture.jpg',
              'full'
            )})`,
            backgroundPosition: '0 0',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: 0.15,
            mixBlendMode: 'screen',
            zIndex: 0,
          }}
        />

        <Box
          className="gif-player-container"
          sx={{
            mt: `8rem`,
            mr: `5rem`,
            height: '250px',

            width: 'calc(100% - 72% - 10rem)',
            back: 'yellow',
          }}
        >
          <RetroVideoPanel />
        </Box>
      </Box>

      <Box
        className="background-up-large-lines"
        data-augmented-ui="both tl-clip bl-2-clip-y tr-clip-x br-2-clip-x"
        sx={(theme) => ({
          '--aug-border-bg': theme.palette.background.paper,
          '--aug-border-all': '5px',
          '--aug-border-bottom': '20px',

          '--aug-inlay-bg': 'transparent',
          '--aug-inlay-opacity': 0.5,

          '--aug-bl1': '8rem',
          '--aug-bl-inset1': '15%',
          '--aug-br1': '6rem',
          '--aug-br2': '2rem',

          '--aug-tr-inset2': '70%',
          '--aug-tr': '3rem',

          height: `calc(100% - ${theme.spacing(8)})`,
          width: '72%',

          zIndex: 5,
          position: 'absolute',
          top: 0,
          left: 0,
          m: 4,
          pt: 10,
          pl: 12,
          pr: 4,
        })}
      >
        <Box
          // Diagonal Line Container
          sx={{
            // make the diagonal line ends not visible
            position: 'absolute',
            top: '-10%',
            bottom: '-10%',
            left: 0,
            width: '105%',
            height: ' 105%',
          }}
        >
          <DiagonalLines
            lineThickness={60}
            spacing={120}
            direction="diagonal-alt"
            width="105%"
            height="105%"
            color={theme.palette.background.paper}
            opacity={1}
          />
        </Box>

        {/* MAIN TEXT SECTION */}
        <Box
          className="404Text"
          sx={{
            width: '100%',
            zIndex: 100,
          }}
        >
          <Text404 />
        </Box>
      </Box>

      {/* MAIN BUTTON NAVIGATION SECTION */}
      <Box
        sx={{
          position: 'absolute',
          zIndex: 150,
          width: '35rem',
          left: '21%',
          bottom: '4rem',
        }}
      >
        <NavigationButtons onHomeClick={onHomeClick} />
      </Box>
      <Box
        className="background-upper-right-triangle"
        data-augmented-ui="both bl-clip tr-clip"
        sx={(theme) => ({
          m: 2,
          '--aug-border-bg': theme.palette.getInvertedMode('error', false),
          '--aug-inlay-bg': theme.palette.getInvertedMode('error', false),
          '--aug-inlay-opacity': 1,
          backgroundColor: theme.palette.mode === 'light' ? 'black' : 'white',

          '--aug-bl': '90%',
          position: 'absolute',
          top: 0,
          right: 0,
          height: '8rem',
          width: '8rem',
        })}
      >
        <DiagonalLines
          lineThickness={2}
          spacing={15}
          direction="diagonal-alt"
          width="99%"
          height="100%"
          color={theme.palette.mode === 'light' ? 'black' : 'white'}
          opacity={0.8}
        />
      </Box>

      {/* MIDDLE LEFT EMBELLISHMENT */}
      <Box
        className="middle-left-embellishment"
        data-augmented-ui=" br-clip tr-2-clip-y"
        sx={(theme) => ({
          m: 2,
          '--aug-border-bg': theme.palette.mode === 'light' ? 'black' : 'white',
          '--aug-inlay-bg': 'transparent',
          '--aug-inlay-opacity': 1,
          opacity: 0.85,

          '--aug-br': '4rem',
          '--aug-tr-inset1': '20px',
          '--aug-tr-extend2': '95px',
          '--aug-tr2': '2.2rem',
          '--aug-tr1': '2.5rem',

          position: 'absolute',
          bottom: 'calc(50% - 6.75rem)',
          left: 0,
          height: 'calc(15% + 9.25rem )',
          width: 'calc(4.5rem)',
        })}
      >
        <DiagonalLines
          lineThickness={2}
          spacing={10}
          direction="diagonal-alt"
          width="99%"
          height="100%"
          color={theme.palette.mode === 'light' ? 'black' : 'white'}
          opacity={0.8}
        />
      </Box>

      {/* BOTTOM SECTION */}
      <Box
        className="bottom-container"
        data-augmented-ui="both br-clip bl-clip t-clip  tl-2-clip-y br-2-clip-x tr-2-clip-x"
        sx={(theme) => ({
          '--aug-border-bg': theme.palette.getInvertedMode('primary'),
          '--aug-inlay-bg': theme.palette.getInvertedMode('primary'),
          backgroundColor: 'black',
          display: 'flex',
          justifyContent: 'space-between',

          '--aug-tr': '2rem',
          '--aug-tr-extend1': 'calc(25% - 2rem)',
          '--aug-t': '2rem',
          '--aug-t-extend1': '25%',
          '--aug-t-center': '35%',
          '--aug-tl-extend1': '15%',
          '--aug-tl1': '5rem',
          '--aug-tl2': '2rem',

          '--aug-br-inset1': '25%',
          '--aug-br1': '5rem',
          '--aug-br2': '2rem',
          '--aug-bl': '2rem',

          position: 'relative',
          mt: '-5rem',
          height: 'calc(50% + 5rem)',
          width: '100%',
          overflow: 'visible',
          p: 5,
        })}
      >
        <Box
          className="bottom-overlay"
          sx={{
            position: 'absolute',
            ...bgOverlayProps,
            backgroundImage: `url(${getImageUrl(
              'textures/ui/old-black-fabric-material.jpg',
              'full'
            )})`,

            backgroundPosition: '0 0%',
            backgroundSize: '100%',
            opacity: 0.5,
            mixBlendMode: 'screen',
          }}
        />
        <Box
          className="bottom-inner-left-bg"
          data-augmented-ui="both br-clip
           bl-clip
            tr-clip
             tl-2-clip-y
           "
          sx={(theme) => ({
            '--aug-border-bg': theme.palette.getInvertedMode('secondary'),
            '--aug-inlay-opacity': 0.4,
            backgroundColor: theme.palette.getInvertedMode('secondary'),
            '--aug-tr': '2rem',
            '--aug-tl-extend1': '15%',
            '--aug-tl1': '5rem',
            '--aug-tl2': '2rem',

            '--aug-br1': '5rem',
            '--aug-br2': '2rem',
            '--aug-bl': '2rem',

            height: '100%',
            width: '19%',
          })}
        >
          <Box
            className="bottom-inner-left-bg--bg-overlay"
            sx={(theme) => ({
              ...bgOverlayProps,
              backgroundImage: `url(${getImageUrl(
                'textures/ui/grunge-dirty-concrete-texture-background.jpg',
                'full'
              )})`,
              opacity: 0.5,
              backgroundSize: 'cover',
              mixBlendMode: 'overlay',
            })}
          />
        </Box>

        <Box
          className="ThemeSwitcher--container"
          data-augmented-ui="border tr-clip tl-clip"
          sx={{
            height: `calc(100% - 5rem - ${theme.spacing(4)})`,
            width: 'calc(25% - 1.1rem)',
            '--aug-tr': '2rem',
            '--aug-tl': '2rem',
            position: 'relative',
            right: '-1rem',
            mt: 2,

            background: `linear-gradient(-135deg, ${theme.palette.background.paper}FF, ${theme.palette.background.paper}AA, ${theme.palette.secondary.main}22)`,
            backdropFilter: 'blur(1px)',
          }}
        >
          <Box
            sx={{
              width: '100%',
              height: '100%',
              position: 'absolute',
              backgroundImage: `url(${getImageUrl(
                'textures/ui/scratched-glass-with-scuffs.jpg',
                'full'
              )})`,
              backgroundBlendMode: 'screen',
              opacity: 0.25,
              top: 0,
              zIndex: -1,
            }}
          />

          <MinimalThemeSwitcher />
        </Box>
      </Box>

      {/* BOTTOM RIGHT CORNER EMBELLISHMENTS */}
      <Box
        className="bottom-right-embellishment--upper-large"
        data-augmented-ui="both tr-clip tl-clip"
        sx={(theme) => ({
          m: 2,
          backgroundColor: theme.palette.mode === 'light' ? 'black' : 'white',
          '--aug-border-bg': theme.palette.getInvertedMode('primary', false),
          '--aug-inlay-bg': theme.palette.getInvertedMode('primary', false),
          '--aug-inlay-opacity': 1,
          '--aug-tl': '4rem',

          position: 'absolute',
          bottom: '2rem',
          right: 0,
          height: '4.5rem',
          width: 'calc(25% + 3rem)',
        })}
      >
        <Box
          sx={{
            width: '100%',
            height: '100%',
            bgcolor: theme.palette.getInvertedMode('primary'),
            position: 'absolute',
            zIndex: -1,
          }}
        />
        <DiagonalLines
          lineThickness={10}
          spacing={25}
          direction="diagonal-alt"
          width="99%"
          height="100%"
          color={theme.palette.background.paper}
          opacity={1}
        />
      </Box>
      <Box
        className="bottom-right-embellishment--lower-small"
        data-augmented-ui="both  tl-clip br-clip"
        sx={(theme) => ({
          m: 2,
          '--aug-border-bg': theme.palette.getInvertedMode('primary', true),
          '--aug-inlay-bg': theme.palette.getInvertedMode('primary', true),
          '--aug-inlay-opacity': 1,

          backgroundColor: theme.palette.mode === 'dark' ? 'black' : 'white',

          '--aug-tl': '1rem',
          position: 'absolute',
          bottom: 0,
          right: 0,
          height: '1.5rem',
          width: 'calc(35% + 5rem)',
        })}
      >
        <DiagonalLines
          lineThickness={2}
          spacing={10}
          direction="diagonal-alt"
          width="99%"
          height="100%"
          color={theme.palette.mode === 'dark' ? 'black' : 'white'}
          opacity={0.8}
        />
      </Box>
    </Box>
  );
};
