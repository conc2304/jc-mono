import { alpha, Box, Stack, Typography, useTheme } from '@mui/material';
import { CSSProperties } from 'react';
import { DiagonalLines } from './diagonal-box';
import { HorizontalCompass } from './digital-compass';
import { MinimalThemeSwitcher } from '@jc/themes';

export const PageNotFound404 = () => {
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
        height: '100%',
        width: '100%',
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
        })}
      >
        <Box
          sx={{
            backgroundImage: `url('https://img.freepik.com/free-photo/stone-texture_1194-5425.jpg?ga=GA1.1.547750373.1752437532&semt=ais_hybrid&w=740&q=80')`,
            backgroundPosition: '0 0%',
            backgroundSize: '100%',
            width: '100%',
            height: '100%',
            opacity: 0.15,
            border: '2px solid green',
            mixBlendMode: 'screen',
          }}
        />
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
        data-augmented-ui="both   br-clip tr-2-clip-y"
        sx={(theme) => ({
          m: 2,
          '--aug-border-bg': theme.palette.mode === 'light' ? 'black' : 'white',
          '--aug-border-all': '0px',
          '--aug-inlay-bg': 'transparent',
          '--aug-inlay-opacity': 1,
          opacity: 0.85,

          '--aug-br': '4rem',
          '--aug-tr-inset1': '20px',
          '--aug-tr-extend2': '90px',
          '--aug-tr2': '2rem',
          '--aug-tr1': '2.5rem',

          position: 'absolute',
          bottom: 'calc(50% - 6.5rem)',
          left: 0,
          height: 'calc(15% + 9rem )',
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
          '--aug-tr-extend1': '20%',
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

            // backgroundImage: `url('https://static.vecteezy.com/system/resources/previews/057/274/270/non_2x/monochrome-abstract-with-textured-patterns-and-halftone-effects-creating-a-visually-complex-and-striking-graphic-design-backdrop-free-photo.jpg')`,
            backgroundImage: `url('https://img.freepik.com/free-photo/old-black-fabric-material-with-copy-space_23-2148402339.jpg?ga=GA1.1.547750373.1752437532&semt=ais_hybrid&w=740&q=80')`,
            // backgroundImage: `url('https://img.freepik.com/free-photo/stone-texture_1194-5425.jpg?ga=GA1.1.547750373.1752437532&semt=ais_hybrid&w=740&q=80')`,
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
              background: `url('https://static.vecteezy.com/system/resources/previews/057/274/270/non_2x/monochrome-abstract-with-textured-patterns-and-halftone-effects-creating-a-visually-complex-and-striking-graphic-design-backdrop-free-photo.jpg')`,
              opacity: 0.5,
              backgroundSize: 'cover',
              mixBlendMode: 'color-burn',
            })}
          />
        </Box>

        {/*  */}
        <Box
          className="ThemeSwitcher--container"
          data-augmented-ui="border tr-clip"
          sx={{
            height: `calc(100% - 5rem - ${theme.spacing(2)})`,
            width: 'calc(25% - 2rem)',
            '--aug-tr': '2rem',
            my: 1,
            bgcolor: alpha(theme.palette.background.paper, 0.2),
            backdropFilter: 'blur(4px)',
          }}
        >
          <MinimalThemeSwitcher />
        </Box>
      </Box>

      {/* BOTTOM RIGHT CORNER EMBELLISHMENTS */}
      <Box
        className="bottom-right-embellishment--upper-large"
        data-augmented-ui="both tr-clip tl-clip"
        sx={(theme) => ({
          m: 2,
          '--aug-border-bg': theme.palette.getInvertedMode('primary', false),
          '--aug-inlay-bg': theme.palette.getInvertedMode('primary', false),
          '--aug-inlay-opacity': 1,

          backgroundColor: theme.palette.mode === 'light' ? 'black' : 'white',

          '--aug-tl': '4rem',
          position: 'absolute',
          bottom: '2rem',
          right: 0,
          height: '4.5rem',
          width: 'calc(25% + 3rem)',
        })}
      >
        <DiagonalLines
          lineThickness={10}
          spacing={25}
          direction="diagonal-alt"
          width="99%"
          height="100%"
          color={theme.palette.mode === 'dark' ? 'black' : 'white'}
          opacity={0.5}
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

          backgroundColor: theme.palette.mode === 'light' ? 'black' : 'white',

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
          color={theme.palette.mode === 'light' ? 'black' : 'white'}
          opacity={0.8}
        />
      </Box>
    </Box>
  );
};
