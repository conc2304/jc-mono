import React, { useState, useCallback, useMemo } from 'react';
import {
  Box,
  Typography,
  Grid,
  useTheme,
  useMediaQuery,
  lighten,
  darken,
  Stack,
  alpha,
} from '@mui/material';
import { TorusFieldProgressMemo } from '../torus-field-progress';
import { BootText } from '../boot-text';
import { BootMessage } from '../../types';

import {
  BootContainer,
  BottomPanel,
  BrowserFrame,
  RadarChartBox,
  TorusLoaderCardAug,
  ScanLinesOverlay,
} from './atoms';
import {
  MetricGroup,
  RadarChart,
  RadarData,
} from '../radar-chart-widget/radar-chart-widget';
import {
  DataPanel,
  Footer,
  GifContainer,
  Header,
  WarningPanel,
} from './molecules';
import { ThemePickerPanel } from './molecules/theme-picker/theme-picker';

import { Property } from 'csstype';
import { BackgroundControls } from './molecules/background-controls/background-controls';
import {
  AugmentedButton,
  DiagonalLines,
  ProgressBar,
  ScrambleText,
} from '@jc/ui-components';
import { useSharedAnimatedData } from '../radar-chart-widget/use-animated-data';
import {
  defaultBootMessages,
  defaultGif,
  DefaultProgressMessages,
  DefaultRadarMetrics,
  defaultScrambleCharacterSet,
  radarAnimationConfig,
  radarWidgetProps,
} from './default-data';

interface SciFiLayoutProps {
  className?: string;
  bootMessages?: BootMessage[];
  scrambleCharacterSet?: string;
  themedWidgetGifUrl?: {
    url?: string;
    backgroundPositionY?: Property.BackgroundPositionY;
  };
  progressMessages?: { start: string; end: string };
  radarMetricsConfig?: Array<{
    label: string;
    formatFn: (n: number | { valueOf(): number }) => string;
  }>;
}

const url =
  'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExbHV5eWhoaHl5d3Nmam4xNGY4enJoamZ2anhnYm45d3M5M2w3emJoaCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/WWSPhALYIBk1wtIwGZ/giphy.gif';
const urlStyle = `url("${url}") 50% 50% / 200% 200%;`;
const gradientStyle = `radial-gradient(${alpha('#fff', 0.3)}, ${alpha(
  '#000',
  0.4
)})`;
const bgStyle = `${gradientStyle}, ${urlStyle}`;

const EnterButton = ({ fontSize }: { fontSize?: Property.FontSize }) => (
  <AugmentedButton
    variant="contained"
    shape="buttonRight"
    fullWidth
    size="large"
    sx={{
      flexGrow: 1,
      flexShrink: 0,
      height: '100%',
      '&[data-augmented-ui]': { '--aug-border-bg': `${bgStyle} !important` },
    }}
    href="/desktop"
    style={{}}
  >
    <ScrambleText
      variant="display"
      defaultText="ENTER"
      hoverText="???"
      scrambleDuration={0.1}
      color="text.primary"
      fontSize={fontSize}
    />
  </AugmentedButton>
);

const HeroText = () => {
  const isSm = useMediaQuery(useTheme().breakpoints.down('sm'));
  return (
    <>
      <ScrambleText
        variant="display"
        color="primary"
        defaultText="Jose Conchello"
        hoverText="Via CLYZBY_OS"
        fontSize={isSm ? '1.9rem' : undefined}
        sx={(theme) => ({})}
      />
      <ScrambleText
        variant="h3"
        color="primary"
        defaultText="Engineer & Artist"
        hoverText="Creative Technologist"
      />
    </>
  );
};

export const BootLayout: React.FC<SciFiLayoutProps> = ({
  className = '',
  bootMessages = defaultBootMessages,
  scrambleCharacterSet = defaultScrambleCharacterSet,
  themedWidgetGifUrl: gifData,
  progressMessages = DefaultProgressMessages,
  radarMetricsConfig = DefaultRadarMetrics,
}) => {
  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.between('sm', 'lg'));
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));
  const isXs = useMediaQuery(theme.breakpoints.down('xs'));

  const [progress, setProgress] = useState({
    current: 0,
    total: 0,
    message: '',
  });

  const themedWidgetGifUrl = { ...defaultGif, ...gifData };

  // BackgroundImage State
  const initialBgSize = 200;
  const [animateBackground, setAnimateBackground] = useState(false);
  const [backgroundSize, setBackgroundSize] = useState(initialBgSize);
  const [backgroundBlendMode, setBackgroundBlendMode] =
    useState<Property.BackgroundBlendMode>('color-burn');
  const bgUrl = '/gifs/circle-tile-background.gif';

  const baseRadarData: RadarData = useMemo(() => {
    // Create a metric group with radar entries
    const systemMetrics: MetricGroup = [
      {
        value: 87.5,
        metricGroupName: 'Player 1',
      },
      {
        value: 42.3,
        metricGroupName: 'Player 1',
      },
      {
        value: 68.7,
        metricGroupName: 'Player 1',
      },
      {
        value: 91.2,
        metricGroupName: 'Player 1',
      },
      {
        value: 45.8,
        metricGroupName: 'Player 1',
      },
      {
        value: 73.4,
        metricGroupName: 'Player 1',
      },
    ].map((unThemedMetric, i) => ({
      ...unThemedMetric,
      axis: radarMetricsConfig[i].label,
      formatFn: radarMetricsConfig[i].formatFn,
    }));

    // Return as RadarData (array of MetricGroups)
    return [systemMetrics];
  }, []);

  const { animatedData, isAnimating, startAnimation, stopAnimation } =
    useSharedAnimatedData(baseRadarData, radarAnimationConfig);

  const handleBackgroundResize = (action: 'plus' | 'minus' | 'reset') => {
    if (action === 'reset') {
      setBackgroundSize(initialBgSize);
      return;
    }

    const incrementAmount = 20;
    const direction = action === 'plus' ? 1 : -1;
    const value = incrementAmount * direction;
    setBackgroundSize((prev) => prev + value);
    return;
  };

  const [isComplete, setIsComplete] = useState(false);

  const handleProgress = useCallback(
    (
      percentComplete: number,
      currentMessage: string,
      messageIndex: number,
      charIndex: number
    ) => {
      setProgress({
        current: percentComplete,
        total: 7,
        message: currentMessage,
      });
    },
    []
  );

  const handleBootComplete = useCallback(() => {
    setIsComplete(true);
  }, []);

  // Mobile Layout (1 column)
  if (isSm) {
    return (
      <BootContainer
        className={'BootContainer--root ' + className}
        style={{
          backgroundImage: animateBackground ? `url(${bgUrl})` : 'initial',
          backgroundSize: `${backgroundSize}px`,
          backgroundRepeat: 'repeat',
          backgroundBlendMode: backgroundBlendMode,
        }}
        // sx={{
        //   overflowY: 'auto',
        //   height: '100%',
        // }}
      >
        <BrowserFrame>
          {!isXs && <Header compact={true} />}

          {/* Mobile Content - Minimal Layout */}
          <Stack sx={{ textAlign: 'center', flexShrink: 0 }}>
            <HeroText />
          </Stack>

          <Box
            className="MobileContent--flex-wrapper"
            p={1}
            display="flex"
            flexDirection="column"
            gap={1}
            flexGrow={1}
            // height="100vh"
            overflow="hidden" // Prevent the container from growing
          >
            {/* Boot Text Panel - Takes most of the space */}
            <Box
              className="BootText--aug-panel"
              data-augmented-ui="border bl-clip br-clip tl-clip tr-2-clip-y"
              sx={(theme) => ({
                flex: 1,
                minHeight: 0, // Critical: allow shrinking below content size
                display: 'flex', // Make this a flex container
                flexDirection: 'column', // Stack children vertically
                overflow: 'hidden', // Prevent this panel from growing

                '&[data-augmented-ui]': {
                  '--aug-bl': '0.5rem',
                  '--aug-br': '0.5rem',
                  '--aug-tl': '0.5rem',
                  '--aug-tr1': '1rem',
                  '--aug-tr2': '2rem',
                  '--aug-tr-extend2': '25%',
                  '--aug-border-all': '1px',
                  '--aug-border-bg': theme.palette.primary.main,
                },
              })}
            >
              <BootText
                bootMessages={bootMessages}
                typeSpeed={1.8}
                lineDelay={1.2}
                cursorChar="█"
                scrambleChars={12}
                textColor={
                  theme.palette.primary[theme.palette.getInvertedMode()]
                }
                scrambleDuration={0.6}
                charDelay={0.05}
                scrambleCharSet={scrambleCharacterSet}
                hoverScrambleChars={8}
                hoverScrambleDuration={0.5}
                onProgress={handleProgress}
                onComplete={handleBootComplete}
                textWrapMode="ellipsis"
                flex={1}
              />

              <Box
                sx={{
                  position: 'absolute',
                  height: '100%',
                  width: '100%',
                  top: 0,
                  zIndex: -1,
                  opacity: 0.5,
                }}
              >
                <TorusFieldProgressMemo
                  hideText
                  colors={{
                    backgroundColor: theme.palette.background.paper,
                    beamColor: theme.palette.getInvertedMode('info'),
                    torusColor: theme.palette.primary.main,
                    particleColor: theme.palette.getInvertedMode('info'),
                    verticalLineColor: theme.palette.warning.main,
                    themeMode: theme.palette.mode,
                  }}
                />
                <ScanLinesOverlay className="ScanLinesOverlay--component" />
              </Box>
            </Box>

            <ThemePickerPanel compactMenu />

            <GifContainer
              flexGrow={1}
              url={themedWidgetGifUrl.url}
              sx={{
                minHeight: '15%',
                flexGrow: 0.5,
                backgroundPositionY: themedWidgetGifUrl.backgroundPositionY,
              }}
            />
            <Box flexGrow={0.25} flexShrink={0}>
              <EnterButton />
            </Box>
          </Box>
        </BrowserFrame>
      </BootContainer>
    );
  }

  // Small Desktop Layout (2 column)
  if (isMd) {
    return (
      <BootContainer
        className={'BootContainer--root ' + className}
        style={{
          backgroundImage: animateBackground ? `url(${bgUrl})` : 'initial',
          backgroundSize: `${backgroundSize}px`,
          backgroundRepeat: 'repeat',
          backgroundBlendMode: backgroundBlendMode,
        }}
      >
        <BrowserFrame
          elevation={0}
          sx={{ display: 'flex', flexDirection: 'column' }}
        >
          <Header />

          <Box p={2} className="MainContent--root">
            <Grid container spacing={2} height="100%">
              {/* Left Panel - Reduced */}
              <Grid
                size={{ xs: 6.5 }}
                className="LeftContentPanel--grid-wrapper"
              >
                <Box
                  display="flex"
                  flexDirection="column"
                  gap={2}
                  height="100%"
                >
                  <Box
                    data-augmented-ui="border bl-clip br-clip tl-clip tr-2-clip-y"
                    sx={(theme) => ({
                      '&[data-augmented-ui]': {
                        '--aug-bl': '0.5rem',
                        '--aug-br': '0.5rem',
                        '--aug-tl': '0.5rem',
                        '--aug-tr1': '1rem',
                        '--aug-tr2': '2rem',
                        '--aug-tr-extend2': '25%',
                        '--aug-border-all': '1px',
                        '--aug-border-bg': theme.palette.primary.main,
                      },
                    })}
                  >
                    <BootText
                      bootMessages={bootMessages}
                      typeSpeed={1.8}
                      lineDelay={1.2}
                      cursorChar="█"
                      scrambleChars={12}
                      maxHeight={'10px'}
                      textColor={
                        theme.palette.primary[theme.palette.getInvertedMode()]
                      }
                      scrambleDuration={0.6}
                      charDelay={0.05}
                      scrambleCharSet={scrambleCharacterSet}
                      hoverScrambleChars={8}
                      hoverScrambleDuration={0.5}
                      onProgress={handleProgress}
                      onComplete={handleBootComplete}
                      textWrapMode="wrap"
                    />
                  </Box>
                  <RadarChartBox flex={1}>
                    <RadarChart
                      id="animated-radar"
                      data={animatedData}
                      {...radarWidgetProps(theme)}
                    />
                  </RadarChartBox>
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
                >
                  <TorusLoaderCardAug>
                    <TorusFieldProgressMemo
                      colors={{
                        backgroundColor: theme.palette.background.paper,
                        beamColor: theme.palette.getInvertedMode('info'),
                        torusColor: theme.palette.primary.main,
                        particleColor: theme.palette.getInvertedMode('info'),
                        verticalLineColor: theme.palette.warning.main,
                        themeMode: theme.palette.mode,
                      }}
                    />
                    <ScanLinesOverlay className="ScanLinesOverlay--component" />
                  </TorusLoaderCardAug>
                  <GifContainer
                    url={themedWidgetGifUrl.url}
                    sx={{
                      height: '20%',
                      backgroundPositionY:
                        themedWidgetGifUrl.backgroundPositionY,
                    }}
                  />
                </Box>
              </Grid>
            </Grid>
          </Box>

          <Box flexShrink={0} className="ThemePickerPanel--wrapper">
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
                backgroundAnimated={animateBackground}
                onBackgroundSizeChange={(action) =>
                  handleBackgroundResize(action)
                }
                onBlendModeChange={(blendMode) =>
                  setBackgroundBlendMode(blendMode)
                }
                onToggleBackground={() => setAnimateBackground((prev) => !prev)}
                blendModeActive={backgroundBlendMode}
              />

              <Grid size={{ xs: 4 }} sx={{ flex: 1 }}>
                <EnterButton fontSize={'2.25rem'} />
              </Grid>
            </Grid>
          </BottomPanel>

          <Footer />
        </BrowserFrame>
      </BootContainer>
    );
  }

  // Full Desktop Layout (3 column - all components)
  return (
    <BootContainer
      className={'BootContainer--root ' + className}
      style={{
        backgroundImage: animateBackground ? `url(${bgUrl})` : 'initial',
        backgroundSize: `${backgroundSize}px`,
        backgroundRepeat: 'repeat',
        backgroundBlendMode: backgroundBlendMode,
      }}
    >
      <BrowserFrame elevation={0}>
        <Header />
        {/* Main Content Area */}
        <Box p={2} flex={1}>
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
                <RadarChartBox flex={1}>
                  <RadarChart
                    id="animated-radar"
                    data={animatedData}
                    {...radarWidgetProps(theme)}
                  />
                </RadarChartBox>

                {/* Ambient Panels */}
                <Box flex={1} display="flex" flexDirection="column" gap={1}>
                  <GifContainer
                    url={themedWidgetGifUrl.url}
                    sx={{
                      height: 128,
                      backgroundPositionY:
                        themedWidgetGifUrl.backgroundPositionY,
                    }}
                  />
                  {/*
                  {animatedData && (
                    <DataPanel metrics={animatedData} title="TEMPORARY TITLE" />
                  )} */}
                </Box>
              </Box>
            </Grid>

            {/* Center Panel */}
            <Grid size={{ xs: 5 }}>
              <Box display="flex" flexDirection="column" gap={2} height="100%">
                {/* Main Scanner */}
                <TorusLoaderCardAug>
                  <TorusFieldProgressMemo
                    progress={progress.current}
                    progressMessage={progress.message}
                    colors={{
                      backgroundColor: theme.palette.background.paper,
                      beamColor: theme.palette.getInvertedMode('info'),
                      torusColor: theme.palette.primary.main,
                      particleColor: theme.palette.getInvertedMode('info'),
                      verticalLineColor: theme.palette.warning.main,
                      themeMode: theme.palette.mode,
                    }}
                  />
                  <ScanLinesOverlay className="ScanLinesOverlay--component" />
                </TorusLoaderCardAug>

                <ThemePickerPanel />
              </Box>
            </Grid>

            {/* Right Panel */}
            <Grid size={{ xs: 4 }}>
              <Box display="flex" flexDirection="column" gap={2} height="100%">
                {/* <DataPanel /> */}

                {/* Progress Panel */}
                <Box
                  display="flex"
                  flexDirection="column"
                  gap={1}
                  flex={1}
                  data-augmented-ui="border bl-clip br-clip tl-clip br-2-clip-y"
                  sx={(theme) => ({
                    height: '100%',
                    '&[data-augmented-ui]': {
                      '--aug-bl': '0.5rem',
                      '--aug-br': '0.5rem',
                      '--aug-tl': '0.5rem',
                      '--aug-br1': '1rem',
                      '--aug-br2': '1.5rem',
                      '--aug-br-extend2': '25%',
                      '--aug-border-all': '1px',
                      '--aug-border-bg': theme.palette.primary.main,
                    },
                  })}
                >
                  <DiagonalLines
                    lineThickness={25}
                    spacing={65}
                    width="100%"
                    height="80px"
                    direction="diagonal-alt"
                    color={theme.palette.action.focus}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      height: '101%',
                      width: '101%',
                      top: -1,
                      left: -1,
                      opacity: 0.75,
                      zIndex: 0,
                      mixBlendMode: 'darken',
                    }}
                  >
                    <ProgressBar
                      progress={progress.current}
                      height="100%"
                      width="100%"
                      color={theme.palette.primary.main}
                      glowColor={theme.palette.getInvertedMode('primary')}
                      backgroundColor={theme.palette.background.paper}
                      borderColor={theme.palette.action.focus}
                      label={
                        isComplete && progress.current === 100
                          ? progressMessages.end
                          : progressMessages.start
                      }
                      progressFillColor={`linear-gradient(90deg,
              ${alpha(theme.palette.getInvertedMode('primary'), 0)} 0%,
              ${alpha(theme.palette.primary.main, 0.6)} 50%,
              ${alpha(theme.palette.getInvertedMode('primary', true), 0.4)} 100%
            )`}
                    />
                  </Box>
                </Box>

                {/* BootText Panel */}
                <Box
                  data-augmented-ui="border bl-clip br-clip tl-clip tr-2-clip-y"
                  sx={(theme) => ({
                    height: '100%',
                    '&[data-augmented-ui]': {
                      '--aug-bl': '0.5rem',
                      '--aug-br': '0.5rem',
                      '--aug-tl': '0.5rem',
                      '--aug-tr1': '1rem',
                      '--aug-tr2': '2rem',
                      '--aug-tr-extend2': '25%',
                      '--aug-border-all': '1px',
                      '--aug-border-bg': theme.palette.primary.main,
                    },
                  })}
                >
                  <BootText
                    bootMessages={bootMessages}
                    typeSpeed={1.8}
                    lineDelay={1.2}
                    cursorChar="█"
                    scrambleChars={12}
                    textColor={
                      theme.palette.primary[theme.palette.getInvertedMode()]
                    }
                    scrambleDuration={0.6}
                    charDelay={0.05}
                    scrambleCharSet={scrambleCharacterSet}
                    hoverScrambleChars={8}
                    hoverScrambleDuration={0.5}
                    onProgress={handleProgress}
                    onComplete={handleBootComplete}
                  />
                </Box>

                <WarningPanel />
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Bottom Panel */}
        <BottomPanel flexShrink={0}>
          <Grid container columns={12} spacing={4}>
            {/* Large Text Display */}
            <Grid size={7} display="flex">
              <Stack>
                <HeroText />
              </Stack>
              <Box flexGrow={1} />
            </Grid>

            {/* Control Icons */}
            <BackgroundControls
              backgroundAnimated={animateBackground}
              onBackgroundSizeChange={(action) =>
                handleBackgroundResize(action)
              }
              onBlendModeChange={(blendMode) =>
                setBackgroundBlendMode(blendMode)
              }
              onToggleBackground={() => setAnimateBackground((prev) => !prev)}
              blendModeActive={backgroundBlendMode}
            />

            {/* Right Display */}
            <Grid
              size={{ xs: 3 }}
              sx={{
                flex: 1,
              }}
            >
              <EnterButton />
            </Grid>
          </Grid>
        </BottomPanel>

        <Footer />
      </BrowserFrame>
    </BootContainer>
  );
};
