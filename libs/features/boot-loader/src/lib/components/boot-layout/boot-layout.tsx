'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Grid,
  useTheme,
  lighten,
  darken,
} from '@mui/material';
import { Warning, RadioButtonChecked, Home } from '@mui/icons-material';
import { TorusFieldProgressMemo } from '../torus-field-progress';
import { BootText } from '../boot-text';
import { BootMessage } from '../../types';

import {
  AddressBar,
  BootContainer,
  BottomPanel,
  BrowserFrame,
  BrowserHeader,
  ControlIcon,
  ControlSlider,
  RadarChartBox,
  Footer,
  MultiplexText,
  TorusLoaderCardAug,
  RightDisplay,
  RightDisplayInner,
  ScanlinesOverlay,
  SliderGradient,
  SliderInner,
  SpinningShape,
  StatusBar,
  StatusButton,
  StatusIcon,
  StatusIcons,
  StatusIndicator,
  SystemsText,
  WarningPanel,
  WarningStripe,
  WarningStripes,
} from './atoms';
import { RadarData } from '../radar-chart-widget/radar-chart-widget';
import { AnimatedRadarChart } from '../radar-chart-widget/animated-radar';
import * as d3 from 'd3';
import { remap } from '../utils';
import { DataPanel } from './molecules';

const bootMessages: BootMessage[] = [
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

interface SciFiLayoutProps {
  className?: string;
}

const sampleData: RadarData = [
  [
    { axis: '', value: 80, metricGroupName: '1' },
    { axis: '', value: 90, metricGroupName: '1' },
    { axis: '', value: 70, metricGroupName: '1' },
    { axis: '', value: 85, metricGroupName: '1' },
    { axis: '', value: 75, metricGroupName: '1' },
  ],
];

export const BootLayout: React.FC<SciFiLayoutProps> = ({ className = '' }) => {
  const theme = useTheme();

  const [dataValues, setDataValues] = useState({
    temp: 23.7,
    pressure: 101.3,
    oxygen: 98.2,
  });

  const [progress, setProgress] = useState({
    current: 0,
    total: 0,
    message: '',
  });
  const [isComplete, setIsComplete] = useState(false);

  const handleProgress = useCallback(
    (current: number, total: number, message: string) => {
      setProgress({ current, total, message });
    },
    []
  );

  const handleBootComplete = useCallback(() => {
    setIsComplete(true);
    console.log('Boot sequence complete!');
  }, []);

  return (
    <BootContainer className={className}>
      <BrowserFrame elevation={0}>
        {/* Browser Header */}
        <BrowserHeader>
          {/* <Box display="flex" alignItems="center" gap={1}>
            <TrafficLight color={theme.palette.error.main} />
            <TrafficLight color={theme.palette.warning.main} />
            <TrafficLight color={theme.palette.success.main} />
          </Box> */}
          <AddressBar>
            CT14 | USERNAME: JOSE-CONCHELLO | PASSWORD: *******
          </AddressBar>
          <Typography variant="caption" sx={{ color: 'primary.main' }}>
            MAINFRAME-RESEARCH
          </Typography>
        </BrowserHeader>

        {/* Main Content Area */}
        <Box p={2} height={600}>
          <Grid container spacing={2} height="100%">
            {/* Left Panel */}
            <Grid size={{ xs: 3 }}>
              <Box display="flex" flexDirection="column" gap={2} height="100%">
                {/* Radar Display */}
                <RadarChartBox>
                  <AnimatedRadarChart
                    id="animated-radar"
                    data={sampleData}
                    animationConfig={{
                      animationSpeed: 1500,
                      numTrails: 3,
                      trailOffset: 50.0,
                      noiseScale: 1,
                      trailIntensity: 0.5,
                      enableAnimation: true,
                      easing: d3.easeSinInOut,
                    }}
                    levels={5}
                    labelFactor={1}
                    opacityArea={0.1}
                    strokeWidth={1}
                    dotRadius={5}
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
                  {/* <RadarChartExample /> */}
                </RadarChartBox>

                {/* Control Panel */}
                <Box flex={1} display="flex" flexDirection="column" gap={1}>
                  {/* Slider */}
                  <ControlSlider>
                    <SliderInner>
                      <ScanlinesOverlay />
                      <SliderGradient />
                      {/* TODO - maybe switch to progress */}
                    </SliderInner>
                  </ControlSlider>

                  {/* Warning Panel */}
                  <WarningPanel elevation={0}>
                    <Typography
                      variant="h6"
                      align="center"
                      sx={{ color: 'warning.main', fontWeight: 'bold' }}
                    >
                      !
                    </Typography>
                    <Typography
                      variant="caption"
                      align="center"
                      display="block"
                      sx={{ color: 'warning.main' }}
                    >
                      DANGER
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: 'primary.main',
                        fontSize: '0.7rem',
                        lineHeight: 1.2,
                        mt: 1,
                        display: 'block',
                      }}
                    >
                      HAZARD ZONE AREA
                      <br />
                      AUTHORIZED ONLY
                      <br />
                      <br />
                      DO NOT
                      <br />
                      DISTURB OR
                      <br />
                      MOVE
                    </Typography>
                    <Box
                      sx={(theme) => ({
                        borderBottom: `1px solid ${theme.palette.warning.main}`,
                        my: 1,
                      })}
                    />
                    <WarningStripes>
                      {[...Array(8)].map((_, i) => (
                        <WarningStripe key={i} />
                      ))}
                    </WarningStripes>
                  </WarningPanel>
                </Box>
              </Box>
            </Grid>

            {/* Center Panel */}
            <Grid size={{ xs: 6 }}>
              <Box display="flex" flexDirection="column" gap={2} height="100%">
                {/* Main Scanner */}
                <TorusLoaderCardAug>
                  <ScanlinesOverlay />
                  <TorusFieldProgressMemo
                    progress={(progress.current / progress.total) * 100}
                    progressMessage={progress.message}
                    colors={{
                      backgroundColor: theme.palette.background.paper,
                      beamColor:
                        theme.palette.info[theme.palette.getInvertedMode()],
                      torusColor: theme.palette.primary.main,
                      particleColor: theme.palette.info.main,
                      verticalLineColor: theme.palette.warning.main,
                    }}
                  />
                </TorusLoaderCardAug>

                {/* Status Bar */}
                <StatusBar>
                  <Box display="flex" alignItems="center" gap={2}>
                    <StatusIndicator />
                    <Typography
                      variant="caption"
                      sx={{ color: 'primary.main' }}
                    >
                      FULL INTEGRATION STATUS
                    </Typography>
                  </Box>
                  <StatusIcons>
                    <StatusIcon color={theme.palette.primary.main}>
                      <div />
                    </StatusIcon>
                    <StatusIcon color={theme.palette.warning.main}>
                      <div />
                    </StatusIcon>
                    <StatusIcon color={theme.palette.primary.main}>
                      <div />
                    </StatusIcon>
                  </StatusIcons>
                </StatusBar>
                <Typography
                  variant="caption"
                  align="right"
                  sx={{ color: 'primary.main', mt: 0.5 }}
                  // TODO UPDATE THIS TEXT
                >
                  YOUNGSTA X SLEEPER
                </Typography>
              </Box>
            </Grid>

            {/* Right Panel */}
            <Grid size={{ xs: 3 }}>
              <Box display="flex" flexDirection="column" gap={2} height="100%">
                {/* Data Display */}
                <DataPanel />

                {/* Additional Panels */}
                <Box display="flex" flexDirection="column" gap={1} flex={1}>
                  <StatusButton>
                    <Typography
                      variant="caption"
                      sx={{ color: 'primary.main' }}
                    >
                      SYSTEM ACTIVE
                    </Typography>
                  </StatusButton>
                  <StatusButton>
                    <Typography
                      variant="caption"
                      sx={{ color: 'primary.main' }}
                    >
                      READY
                    </Typography>
                  </StatusButton>
                  <StatusButton>
                    <Typography
                      variant="caption"
                      sx={{ color: 'primary.main' }}
                    >
                      STANDBY
                    </Typography>
                  </StatusButton>
                </Box>

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
            <Grid size={8}>
              <MultiplexText>MULTIPLEX</MultiplexText>
              <SystemsText>SYSTEMS</SystemsText>
            </Grid>

            {/* Control Icons */}
            <Grid size={{ xs: 2 }}>
              <ControlIcon>
                <Warning sx={{ color: 'primary.main', fontSize: 16 }} />
              </ControlIcon>
              <ControlIcon>
                <RadioButtonChecked
                  sx={{ color: 'primary.main', fontSize: 16 }}
                />
              </ControlIcon>
              <ControlIcon>
                <Home sx={{ color: 'primary.main', fontSize: 16 }} />
              </ControlIcon>
            </Grid>

            {/* Right Display */}
            <Grid size={{ xs: 2 }}>
              <RightDisplay>
                <RightDisplayInner>
                  <SpinningShape />
                </RightDisplayInner>
              </RightDisplay>
            </Grid>
          </Grid>
        </BottomPanel>

        {/* Footer */}
        <Footer>
          <Typography variant="caption" sx={{ color: 'primary.main' }}>
            © 2157 - ALL RIGHTS RESERVED
          </Typography>
          <Box display="flex" gap={2}>
            <Typography variant="caption" sx={{ color: 'primary.main' }}>
              SECURE CONNECTION
            </Typography>
            <Typography variant="caption" sx={{ color: 'primary.main' }}>
              ENCRYPTED
            </Typography>
          </Box>
        </Footer>
      </BrowserFrame>
    </BootContainer>
  );
};
