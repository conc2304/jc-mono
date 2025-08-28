import React from 'react';
import { Box, Grid, Stack, useTheme } from '@mui/material';
import {
  BrowserFrame,
  BottomPanel,
  HeroText,
  EnterButton,
  AugmentedPanel,
} from '../atoms';
import { Header, GifContainer, Footer } from '../molecules';
import { ThemePickerPanel } from '../molecules/theme-picker/theme-picker';
import { BackgroundControls } from '../molecules/background-controls/background-controls';
import { BootTextPanel, RadarPanel, TorusProgressPanel } from '../panels';

interface SmallDesktopLayoutProps {
  bootMessages: any[];
  scrambleCharacterSet: string;
  passwordMessage: string;
  themedWidgetGifUrl: any;
  radarMetricsConfig: any;
  backgroundState: any;
  radarData: any;
  handlers: any;
  progress: any;
}

export const TabletLayout: React.FC<SmallDesktopLayoutProps> = ({
  bootMessages,
  scrambleCharacterSet,
  passwordMessage,
  themedWidgetGifUrl,
  radarMetricsConfig,
  backgroundState,
  radarData,
  handlers,
  progress,
}) => {
  const theme = useTheme();

  return (
    <BrowserFrame>
      <Header passwordMsg={passwordMessage} />

      <Box p={2} flex={1} className="MainContent--root">
        <Grid container spacing={2} height="100%">
          <Grid
            size={{ xs: 6.5 }}
            className="LeftContentPanel--grid-wrapper"
            display="flex"
          >
            <Box
              className="MobileContent--flex-wrapper"
              p={1}
              display="flex"
              flexDirection="column"
              gap={2}
              flexGrow={1}
              overflow="hidden"
            >
              <Box
                sx={{
                  position: 'relative',
                  flex: 1,
                  minHeight: 0,
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
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
              </Box>

              <RadarPanel
                animatedData={radarData.animatedData}
                title={radarMetricsConfig.title}
                onRadarHover={radarData.stopAnimation}
                onRadarBlur={radarData.startAnimation}
                theme={theme}
                flex={1}
              />
            </Box>
          </Grid>

          <Grid size={{ xs: 5.5 }} className="RightContentPanel--grid-wrapper">
            <Box
              display="flex"
              flexDirection="column"
              gap={2}
              height="100%"
              p={1}
            >
              <BootTextPanel
                bootMessages={bootMessages}
                scrambleCharacterSet={scrambleCharacterSet}
                onProgress={handlers.handleProgress}
                onComplete={handlers.handleBootComplete}
                textWrapMode="ellipsis"
                flex={1}
              />

              <GifContainer
                url={themedWidgetGifUrl.url}
                sx={{
                  height: '20%',
                  backgroundPositionY: themedWidgetGifUrl.backgroundPositionY,
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Box flexShrink={0} className="ThemePickerPanel--wrapper" mx={2} my={0.5}>
        <ThemePickerPanel />
      </Box>

      <BottomPanel flexShrink={0} className="BottomPanel--root">
        <Grid container columns={12} spacing={4}>
          <Grid size={6} display="flex">
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

          <Grid size={{ xs: 4 }} sx={{ flex: 1 }}>
            <EnterButton fontSize={'2.25rem'} />
          </Grid>
        </Grid>
      </BottomPanel>

      <Footer />
    </BrowserFrame>
  );
};
