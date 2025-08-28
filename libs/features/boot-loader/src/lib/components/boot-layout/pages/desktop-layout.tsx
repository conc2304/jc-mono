import React, { CSSProperties } from 'react';
import { Box, Grid, Stack, useTheme } from '@mui/material';
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
import { BackgroundOverlay } from '@jc/ui-components';

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
    <BrowserFrame>
      <Header passwordMsg={passwordMessage} />
      <BackgroundOverlay
        url={bgTexture.url}
        style={{ ...bgTexture.style, backgroundPosition: 'center center' }}
        className="ThemedBackground--overlay"
      />
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
              <RadarPanel
                animatedData={radarData.animatedData}
                title={radarMetricsConfig.title}
                onRadarHover={radarData.stopAnimation}
                onRadarBlur={radarData.startAnimation}
                theme={theme}
                flex={1}
              />

              <Box flex={1} display="flex" flexDirection="column" gap={1}>
                <GifContainer
                  url={themedWidgetGifUrl.url}
                  sx={{
                    height: 128,
                    backgroundPositionY: themedWidgetGifUrl.backgroundPositionY,
                  }}
                />

                {radarData.animatedData && (
                  <DataPanel
                    metrics={radarData.animatedData}
                    title={radarMetricsConfig.title}
                  />
                )}
              </Box>
            </Box>
          </Grid>

          {/* Center Panel */}
          <Grid size={{ xs: 5 }}>
            <Box display="flex" flexDirection="column" gap={2} height="100%">
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

              <ThemePickerPanel />
            </Box>
          </Grid>

          {/* Right Panel */}
          <Grid size={{ xs: 4 }}>
            <Box display="flex" flexDirection="column" gap={2} height="100%">
              <ProgressPanel
                progress={progress}
                isComplete={isComplete}
                progressMessages={progressMessages}
              />
              <Box>
                <BootTextPanel
                  bootMessages={bootMessages}
                  scrambleCharacterSet={scrambleCharacterSet}
                  onProgress={handlers.handleProgress}
                  onComplete={handlers.handleBootComplete}
                  flex={0}
                />
              </Box>
              <WarningPanel {...infoPanelContent} />
            </Box>
          </Grid>
        </Grid>
      </Box>

      <BottomPanel flexShrink={0}>
        <Grid container columns={12} spacing={4}>
          <Grid size={7} display="flex">
            <Stack>
              <HeroText />
            </Stack>
            <Box flexGrow={1} />
          </Grid>

          <BackgroundControls
            backgroundAnimated={backgroundState.animateBackground}
            onBackgroundSizeChange={backgroundState.handleBackgroundResize}
            onBlendModeChange={backgroundState.setBackgroundBlendMode}
            onToggleBackground={() =>
              backgroundState.setAnimateBackground((prev: boolean) => !prev)
            }
            blendModeActive={backgroundState.backgroundBlendMode}
          />

          <Grid size={{ xs: 3 }} sx={{ flex: 1 }}>
            <EnterButton />
          </Grid>
        </Grid>
      </BottomPanel>

      <Footer />
    </BrowserFrame>
  );
};
