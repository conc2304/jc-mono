import React, { CSSProperties } from 'react';
import { alpha, Box, Grid, Stack, Typography, useTheme } from '@mui/material';
import { BrowserFrame, EnterButton, AugmentedPanel } from '../atoms';
import { Header, GifContainer, Footer, WarningPanel } from '../molecules';
import { ThemePickerPanel } from '../molecules/theme-picker/theme-picker';
import { BackgroundControls } from '../molecules/background-controls/background-controls';
import { BootTextPanel, ProgressPanel, TorusProgressPanel } from '../panels';
import {
  BackgroundOverlay,
  DiagonalLines,
  ScrambleText,
} from '@jc/ui-components';

interface FullDesktopLayoutProps {
  bootMessages: any[];
  scrambleCharacterSet: string;
  passwordMessage: string;
  themedWidgetGifUrl: any;
  progressMessages: any;
  radarMetricsConfig: any;
  infoPanelContent: any;
  progress: any;
  isComplete: boolean;
  backgroundState: any;
  radarData: any;
  handlers: any;
  bgTexture: {
    url: string;
    style: CSSProperties;
  };
  triggerPreload?: () => void;
}

const FullDesktopLayout: React.FC<FullDesktopLayoutProps> = ({
  bootMessages,
  scrambleCharacterSet,
  passwordMessage,
  themedWidgetGifUrl,
  progressMessages,
  infoPanelContent,
  progress,
  isComplete,
  backgroundState,
  handlers,
  bgTexture,
  triggerPreload,
}) => {
  const theme = useTheme();

  return (
    <>
      <BackgroundOverlay
        className="ThemedBackgroundTexture--overlay"
        url={bgTexture.url}
        style={{
          backgroundPosition: 'center center',
          backgroundSize: 'cover',
          zIndex: 0,
          ...bgTexture.style,
        }}
      />
      <BrowserFrame>
        <Header passwordMsg={passwordMessage} />

        <Box p={2} flex={1} position={'relative'} zIndex={1}>
          <Grid container spacing={2} height="100%">
            {/* Left Panel */}
            <Grid size={{ xs: 3 }} height="100%">
              <Box
                display="flex"
                flexDirection="column"
                gap={2}
                flexGrow={1}
                height="100%"
              >
                <Box flex={1} display="flex" flexDirection="column" gap={1}>
                  <AugmentedPanel
                    augmentType="bootText"
                    sx={{
                      flexGrow: 1,
                      width: '100%',
                      backgroundColor: 'transparent',
                      position: 'relative',
                      overflow: 'hidden',
                      padding: theme.spacing(0),
                    }}
                  >
                    <TorusProgressPanel
                      progress={progress.current}
                      progressMessage={progress.message}
                    />
                  </AugmentedPanel>
                  <GifContainer
                    url={themedWidgetGifUrl.url}
                    sx={{
                      height: 128,
                      backgroundPositionY:
                        themedWidgetGifUrl.backgroundPositionY,
                    }}
                  />
                </Box>
              </Box>
            </Grid>

            {/* Center Panel */}
            <Grid size={{ xs: 5 }} display={'flex'} position={'relative'}>
              {/* Accent Diags */}
              <Box
                data-augmented-ui="bl-2-clip-x tr-clip"
                sx={{
                  '--aug-bl': '3.5rem',
                  '--aug-bl-extend1': 'calc(100% - 7rem)',
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: `calc(25% + 7rem - 8px)`,
                  height: 'calc(7rem - 8px)',
                }}
              >
                <DiagonalLines
                  height="100%"
                  width="100%"
                  lineThickness={1}
                  spacing={10}
                  color={alpha(theme.palette.primary.main, 0.5)}
                  direction="diagonal-alt"
                />
              </Box>

              {/* Main */}
              <Stack flex={1} gap={1}>
                <Stack
                  flex={1}
                  data-augmented-ui="both tr-2-clip-x tl-2-clip-y"
                  sx={{
                    '--aug-border-all': '1px',
                    '--aug-tl2': '0.5rem',
                    '--aug-tl1': '0.5rem',
                    '--aug-tr1': '3.5rem',
                    '--aug-tr-extend1': '25%',
                    '--aug-tl-extend1': '20%',
                    '--aug-inlay-bg': theme.palette.background.paper,
                    '--aug-inlay-opacity': 0.6,
                    '--aug-inlay-x': '1rem',
                    '--aug-inlay-y': '1rem',
                  }}
                >
                  {/* Hero Text */}
                  <Stack
                    flex={1}
                    alignItems="center"
                    justifyContent="space-between"
                    data-augmented-ui=""
                    pl={8}
                  >
                    <Stack
                      width={'100%'}
                      display={'flex'}
                      justifyContent={'left'}
                      mt="2.5rem"
                      gap={0.5}
                    >
                      <Typography
                        variant="h4"
                        color="primary"
                        mr="calc(7rem + 25%)"
                        mb={2}
                      >
                        A Portfolio Site Experience by
                      </Typography>

                      <Typography
                        variant="display"
                        color="primary"
                        mr="calc(3.5rem * 0.5 )"
                      >
                        Jose Conchello
                      </Typography>
                      <Typography
                        variant="h2"
                        color="primary"
                        mr="calc(3.5rem * 0.5)"
                      >
                        UI Engineer & Artist
                      </Typography>
                      <Typography variant="h2" color="primary">
                        Creative Technologist
                      </Typography>
                    </Stack>

                    {/* Enter Button */}
                    <Stack
                      justifyContent={'space-around'}
                      width={'100%'}
                      flexGrow={1}
                      pr={8}
                      mt={2}
                    >
                      <Stack width={'100%'} height="33%">
                        <EnterButton
                          onMouseEnter={triggerPreload}
                          fontSize={'4.5rem'}
                        />
                      </Stack>

                      <Stack width="100%" px={6}>
                        <WarningPanel
                          {...infoPanelContent}
                          sx={{ width: '100%' }}
                        />
                      </Stack>
                    </Stack>
                  </Stack>
                </Stack>
                <ThemePickerPanel />
              </Stack>
            </Grid>

            {/* Right Panel */}
            <Grid size={{ xs: 4 }}>
              <Stack gap={2} height="100%">
                <Stack height={'100px'}>
                  <ProgressPanel
                    progress={progress}
                    isComplete={isComplete}
                    progressMessages={progressMessages}
                  />
                </Stack>

                <Box
                  flex="1 1 0"
                  minHeight={0} // Critical: allows flex item to shrink below content size
                  overflow="hidden" // Prevent this container from growing
                >
                  <BootTextPanel
                    bootMessages={bootMessages}
                    scrambleCharacterSet={scrambleCharacterSet}
                    onProgress={handlers.handleProgress}
                    onComplete={handlers.handleBootComplete}
                    textWrapMode="wrap"
                    flex={1} // let it fill the available space
                  />
                </Box>

                <Box
                  width={'100%'}
                  p={3}
                  // pt={3.5}
                  flexShrink={0} // prevent shrinking
                  data-augmented-ui="both br-clip bl-clip tr-clip tl-clip"
                  sx={{
                    '--aug-all-width': '25px',
                    '--aug-all-height': '25px',
                    '--aug-border-bg': theme.palette.primary.main,
                    '--aug-border-all': '1px',
                    '--aug-inlay-bg': theme.palette.background.paper,
                    '--aug-inlay-opacity': 0.6,
                    '--aug-inlay-x': '1rem',
                    '--aug-inlay-y': '1rem',
                  }}
                >
                  <BackgroundControls
                    backgroundAnimated={backgroundState.animateBackground}
                    onBackgroundSizeChange={
                      backgroundState.handleBackgroundResize
                    }
                    onBlendModeChange={backgroundState.setBackgroundBlendMode}
                    onToggleBackground={() =>
                      backgroundState.setAnimateBackground(
                        (prev: boolean) => !prev
                      )
                    }
                    blendModeActive={backgroundState.backgroundBlendMode}
                  />
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </Box>
        <Footer />
      </BrowserFrame>
    </>
  );
};

export default FullDesktopLayout;
