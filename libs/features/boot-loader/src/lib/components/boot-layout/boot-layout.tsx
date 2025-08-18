import React, { useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Grid,
  useTheme,
  useMediaQuery,
  lighten,
  darken,
} from '@mui/material';
import { TorusFieldProgressMemo } from '../torus-field-progress';
import { BootText } from '../boot-text';
import { BootMessage } from '../../types';

import {
  BootContainer,
  BottomPanel,
  BrowserFrame,
  RadarChartBox,
  MultiplexText,
  TorusLoaderCardAug,
  ScanLinesOverlay,
  SystemsText,
  WarningStripe,
  WarningStripes,
} from './atoms';
import { RadarData } from '../radar-chart-widget/radar-chart-widget';
import { AnimatedRadarChart } from '../radar-chart-widget/animated-radar';
import { easeSinInOut } from 'd3';
import { remap } from '../utils';
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
import { AugmentedButton } from '@jc/ui-components';

interface SciFiLayoutProps {
  className?: string;
  bootMessages?: BootMessage[];
}

const defaultBootMessages: BootMessage[] = [
  'Initializing system...',
  ['Loading kernel modules...', 'Injecting backdoor...'],
  'Starting network services...',
  ['Mounting file systems...', 'Accessing classified data...'],
  'Starting user services...',
  ['System boot complete.', 'Welcome, Agent Smith.'],
  '',
  'Welcome to Terminal OS v2.1.0',
  ['Type "help" for available commands.', 'Type "hack" to begin infiltration.'],
];

const scrambleCharacterSet =
  '!@#$%^&*()_+-=[]{}|;:,.<>?ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

const sampleData: RadarData = [
  [
    { axis: 'a', value: 80, metricGroupName: '1' },
    { axis: 'b', value: 90, metricGroupName: '1' },
    { axis: 'c', value: 70, metricGroupName: '1' },
    { axis: 'd', value: 85, metricGroupName: '1' },
    { axis: 'e', value: 75, metricGroupName: '1' },
  ],
];

export const BootLayout: React.FC<SciFiLayoutProps> = ({
  className = '',
  bootMessages = defaultBootMessages,
}) => {
  const theme = useTheme();

  const isSm = useMediaQuery(theme.breakpoints.down('md'));
  const isMd = useMediaQuery(theme.breakpoints.between('md', 'lg'));

  const [progress, setProgress] = useState({
    current: 0,
    total: 0,
    message: '',
  });

  // BackgroundImage State
  const initialBgSize = 200;
  const [animateBackground, setAnimateBackground] = useState(false);
  const [backgroundSize, setBackgroundSize] = useState(initialBgSize);
  const [backgroundBlendMode, setBackgroundBlendMode] =
    useState<Property.BackgroundBlendMode>('color-burn');
  const bgUrl =
    'https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExcTdtdTA3aTRzMWVsNnhvOTMycjdmZjNqNHNmZXEwaWQzajV1aHVnciZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/9PD6etrOTUxby/giphy.gif';

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
    (current: number, total: number, message: string) => {
      // setProgress({ current, total, message });
    },
    []
  );

  const handleBootComplete = useCallback(() => {
    setIsComplete(true);
    console.log('Boot sequence complete!');
  }, []);

  const cloudGif = `url('https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExODAwejhrMW0weGZ4dGV5YWp6N3c4YzV3ZXl4OWM1ZzE4eTM1dDY2cCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xT9IgC2RzpbE7vBZ6M/giphy.gif')`;

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
      >
        <BrowserFrame elevation={0}>
          <Header compact={true} />

          {/* Mobile Content - Minimal Layout */}
          <Box
            p={1}
            display="flex"
            flexDirection="column"
            gap={1}
            flex={1}
            sx={{
              height: [
                '100vh', // Fallback
                '100dvh', // Preferred value
              ],
            }}
          >
            {/* Boot Text Panel - Takes most of the space */}
            <Box
              // flex={1}
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

              <Box
                sx={{
                  position: 'absolute',
                  height: '100%',
                  width: '100%',
                  top: 0,
                  zIndex: 0,
                  opacity: 0.5,
                }}
              >
                <ScanLinesOverlay />
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
              </Box>
            </Box>

            <ThemePickerPanel />

            <GifContainer url={cloudGif} sx={{ height: '15%' }} />

            {/* Enter Button */}
            <AugmentedButton
              variant="contained"
              shape="buttonRight"
              fullWidth
              size="large"
              sx={{ flexGrow: 1 }}
              href="/desktop"
            >
              <Typography variant="h2">ENTER</Typography>
            </AugmentedButton>
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
        <BrowserFrame elevation={0}>
          <Header />

          <Box p={2} flex={10}>
            <Grid container spacing={2} height="100%">
              {/* Left Panel - Reduced */}
              <Grid size={{ xs: 5 }}>
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
                  <RadarChartBox flex={1}>
                    <AnimatedRadarChart
                      id="animated-radar"
                      data={sampleData}
                      animationConfig={{
                        animationSpeed: 1500,
                        numTrails: 4,
                        trailOffset: 80.0,
                        noiseScale: 1.5,
                        trailIntensity: 1,
                        enableAnimation: true,
                        easing: easeSinInOut,
                      }}
                      levels={5}
                      showLabels={false}
                      labelFactor={1}
                      opacityArea={0.1}
                      strokeWidth={1}
                      dotRadius={3}
                      lineType="curved"
                      colors={{
                        primary: theme.palette.primary.main,
                        accent: theme.palette.warning.main,
                        series: new Array(3).fill('').map((_, i) => {
                          const fn =
                            theme.palette.mode === 'light' ? darken : lighten;
                          return fn(
                            theme.palette.primary[theme.palette.mode],
                            remap(i, 0, 3, 0, 0.5)
                          );
                        }),
                      }}
                      margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                    />
                  </RadarChartBox>
                </Box>
              </Grid>

              {/* Center Panel */}
              <Grid size={{ xs: 7 }}>
                <Box
                  display="flex"
                  flexDirection="column"
                  gap={2}
                  height="100%"
                >
                  <TorusLoaderCardAug>
                    <ScanLinesOverlay />
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
                  </TorusLoaderCardAug>
                  <GifContainer url={cloudGif} sx={{ height: '20%' }} />
                </Box>
              </Grid>
            </Grid>
          </Box>

          <ThemePickerPanel />

          <BottomPanel>
            <Grid container columns={12} spacing={4}>
              <Grid size={7}>
                <MultiplexText variant="display">MULTIPLEX</MultiplexText>
                <SystemsText variant="display">SYSTEMS</SystemsText>
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

              <Grid size={{ xs: 3 }} sx={{ flex: 1 }}>
                <AugmentedButton
                  variant="contained"
                  shape="buttonRight"
                  fullWidth
                  size="large"
                  sx={{ height: '100%' }}
                  href="/desktop"
                >
                  <Typography variant="h2">ENTER</Typography>
                </AugmentedButton>
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
                  <AnimatedRadarChart
                    id="animated-radar"
                    data={sampleData}
                    animationConfig={{
                      animationSpeed: 1500,
                      numTrails: 4,
                      trailOffset: 80.0,
                      noiseScale: 1.5,
                      trailIntensity: 1,
                      enableAnimation: true,
                      easing: easeSinInOut,
                    }}
                    levels={5}
                    showLabels={false}
                    labelFactor={1}
                    opacityArea={0.1}
                    strokeWidth={1}
                    dotRadius={3}
                    lineType="curved"
                    colors={{
                      primary: theme.palette.primary.main,
                      accent: theme.palette.warning.main,
                      // series number should be at least number of trails
                      series: new Array(3).fill('').map((_, i) => {
                        const fn =
                          theme.palette.mode === 'light' ? darken : lighten;
                        return fn(
                          theme.palette.primary[theme.palette.mode],
                          remap(i, 0, 3, 0, 0.5)
                        );
                      }),
                    }}
                    margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                  />
                </RadarChartBox>

                {/* Ambient Panels */}
                <Box flex={1} display="flex" flexDirection="column" gap={1}>
                  <GifContainer url={cloudGif} sx={{ height: 128 }} />
                  <WarningPanel />
                </Box>
              </Box>
            </Grid>

            {/* Center Panel */}
            <Grid size={{ xs: 6 }}>
              <Box display="flex" flexDirection="column" gap={2} height="100%">
                {/* Main Scanner */}
                <TorusLoaderCardAug>
                  <ScanLinesOverlay />
                  <TorusFieldProgressMemo
                    // progress={(progress.current / progress.total) * 100}
                    // progressMessage={progress.message}
                    colors={{
                      backgroundColor: theme.palette.background.paper,
                      beamColor: theme.palette.getInvertedMode('info'),
                      torusColor: theme.palette.primary.main,
                      particleColor: theme.palette.getInvertedMode('info'),
                      verticalLineColor: theme.palette.warning.main,
                      themeMode: theme.palette.mode,
                    }}
                  />
                </TorusLoaderCardAug>

                <ThemePickerPanel />
              </Box>
            </Grid>

            {/* Right Panel */}
            <Grid size={{ xs: 3 }}>
              <Box display="flex" flexDirection="column" gap={2} height="100%">
                <DataPanel />

                {/* Ambient Panel */}
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
                      '--aug-br2': '2rem',
                      '--aug-br-extend2': '25%',
                      '--aug-border-all': '1px',
                      '--aug-border-bg': theme.palette.secondary.main,
                    },
                  })}
                >
                  <WarningStripes
                    sx={{
                      minHeight: '80px',
                      m: 0,
                      gap: 5,
                      backgroundColor: theme.palette.background.paper,
                    }}
                  >
                    {[...Array(8)].map((_, i) => (
                      <WarningStripe
                        key={i}
                        sx={{
                          height: '250%',
                          px: 2,
                          backgroundColor: theme.palette.action.focus,
                        }}
                      />
                    ))}
                  </WarningStripes>
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
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Bottom Panel */}
        <BottomPanel>
          <Grid container columns={12} spacing={4}>
            {/* Large Text Display */}
            {/* TODO UPDATE THIS TEXT */}
            <Grid size={8}>
              <MultiplexText variant="h1" color="primary">
                MULTIPLEX
              </MultiplexText>
              <SystemsText variant="h1" color="primary">
                SYSTEMS
              </SystemsText>
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
              size={{ xs: 2 }}
              sx={{
                flex: 1,
              }}
            >
              <AugmentedButton
                variant="contained"
                shape="buttonRight"
                fullWidth
                size="large"
                sx={{ height: '100%' }}
                href="/desktop"
              >
                <Typography variant="h1">ENTER</Typography>
              </AugmentedButton>
            </Grid>
          </Grid>
        </BottomPanel>

        <Footer />
      </BrowserFrame>
    </BootContainer>
  );
};
