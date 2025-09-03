import React, { CSSProperties } from 'react';
import { Box, Grid, Stack, Typography, useTheme } from '@mui/material';
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
import { BootTextPanel, TorusProgressPanel } from '../panels';
import { BackgroundOverlay } from '@jc/ui-components';

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
  bgTexture: {
    url: string;
    style: CSSProperties;
  };
  triggerPreload?: () => void;
}

const TabletLayout: React.FC<SmallDesktopLayoutProps> = ({
  bootMessages,
  scrambleCharacterSet,
  passwordMessage,
  themedWidgetGifUrl,
  backgroundState,
  handlers,
  progress,
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

      {/* Content */}
      <BrowserFrame>
        <Header passwordMsg={passwordMessage} />

        <Stack p={2} flex={1} className="MainContent--root">
          <Grid container spacing={2} height="100%">
            {/* Left Panel */}
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
              </Box>
            </Grid>

            {/* Right Panel */}
            <Grid
              size={{ xs: 5.5 }}
              className="RightContentPanel--grid-wrapper"
            >
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
          <Stack
            flexShrink={0}
            flexGrow={1}
            className="ThemePickerPanel--wrapper"
            mx={2}
            my={0.5}
          >
            <ThemePickerPanel />
          </Stack>
        </Stack>

        <BottomPanel flexShrink={0} className="BottomPanel--root">
          <Grid container columns={12} spacing={4}>
            <Grid size={{ xs: 7 }} display="flex">
              <Stack gap={1}>
                <HeroText />
              </Stack>
            </Grid>

            <Grid size={{ xs: 5 }} sx={{ flex: 1 }} flexShrink={0}>
              <EnterButton fontSize={'4rem'} onMouseEnter={triggerPreload} />
            </Grid>
          </Grid>
        </BottomPanel>

        <Box flexShrink={0}>
          <Footer />
        </Box>
      </BrowserFrame>
    </>
  );
};

export default TabletLayout;
