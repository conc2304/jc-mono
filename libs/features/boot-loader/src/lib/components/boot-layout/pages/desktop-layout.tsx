import React, { CSSProperties } from 'react';
import { Box, Divider, Grid, Stack, Typography, useTheme } from '@mui/material';
import {
  BrowserFrame,
  BottomPanel,
  HeroText,
  EnterButton,
  AugmentedPanel,
} from '../atoms';
import {
  Header,
  GifContainer,
  Footer,
  DataPanel,
  WarningPanel,
} from '../molecules';
import { ThemePickerPanel } from '../molecules/theme-picker/theme-picker';
import { BackgroundControls } from '../molecules/background-controls/background-controls';
import {
  BootTextPanel,
  ProgressPanel,
  RadarPanel,
  TorusProgressPanel,
} from '../panels';
import { BackgroundOverlay, ScrambleText } from '@jc/ui-components';

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
}

export const FullDesktopLayout: React.FC<FullDesktopLayoutProps> = ({
  bootMessages,
  scrambleCharacterSet,
  passwordMessage,
  themedWidgetGifUrl,
  progressMessages,
  radarMetricsConfig,
  infoPanelContent,
  progress,
  isComplete,
  backgroundState,
  radarData,
  handlers,
  bgTexture,
}) => {
  const theme = useTheme();

  return (
    <>
      <BackgroundOverlay
        url={bgTexture.url}
        style={{
          ...bgTexture.style,
          backgroundPosition: 'center center',
          zIndex: 0,
        }}
        className="ThemedBackground--overlay"
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
                      height: '100%',
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
            <Grid
              size={{ xs: 5 }}
              display={'flex'}
              // border="3px dashed green"
            >
              <Stack
                flex={1}
                gap={5}
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
                  '--aug-inlay-y': '0.5rem',
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
                    mt="2rem"
                    gap={0.5}
                  >
                    <Typography
                      variant="h4"
                      color="primary"
                      mr="calc(7rem + 25%)"
                    >
                      A Portfolio Site Experience by
                    </Typography>
                    <ScrambleText
                      variant="display"
                      color="primary"
                      defaultText="Jose Conchello"
                      hoverText="Via CLYZBY_OS"
                      mr="calc(3.5rem )"
                    />
                    <ScrambleText
                      variant="h1"
                      color="primary"
                      defaultText="UI Engineer & Artist"
                      hoverText="Creative Technologist"
                      mr="calc(3.5rem)"
                    />
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
                      <EnterButton />
                    </Stack>

                    <Stack width="100%" px={6}>
                      <WarningPanel
                        {...infoPanelContent}
                        sx={{ width: '100%' }}
                      />
                    </Stack>
                  </Stack>
                </Stack>

                <Box
                  // border="1px solid red"
                  m={1}
                >
                  <ThemePickerPanel />
                </Box>
              </Stack>
            </Grid>

            {/* Right Panel */}
            <Grid
              size={{ xs: 4 }}
              // border="1px solid black"
            >
              <Stack
                gap={2}
                //  border="1px dashed green"
                height="100%"
              >
                <Box height={'100px'}>
                  <ProgressPanel
                    progress={progress}
                    isComplete={isComplete}
                    progressMessages={progressMessages}
                  />
                </Box>

                {/* Key changes: minHeight: 0 and flex: "1 1 0" to allow proper shrinking */}
                <Box
                  // border="1px solid red"
                  flex="1 1 0" // flex-grow: 1, flex-shrink: 1, flex-basis: 0
                  minHeight={0} // Critical: allows flex item to shrink below content size
                  overflow="hidden" // Prevent this container from growing
                >
                  <BootTextPanel
                    bootMessages={bootMessages}
                    scrambleCharacterSet={scrambleCharacterSet}
                    onProgress={handlers.handleProgress}
                    onComplete={handlers.handleBootComplete}
                    textWrapMode="wrap"
                    flex={1} // Changed from 0 to 1 - let it fill the available space
                  />
                </Box>

                <Box
                  width={'100%'}
                  p={3}
                  pt={3.5}
                  flexShrink={0} // Keep this as-is to prevent shrinking
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
