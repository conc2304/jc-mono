'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  styled,
  keyframes,
  useTheme,
  lighten,
} from '@mui/material';
import { Warning, RadioButtonChecked, Home } from '@mui/icons-material';
import { TorusFieldProgress } from '../torus-field-progress';
import { BootText } from '../boot-text';
import { BootMessage } from '../../types';

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

// Styled components with sci-fi styling
const BootContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.primary.main,
  fontFamily: 'monospace',
  minHeight: '100vh',
  padding: theme.spacing(2),
}));

const BrowserFrame = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  border: `2px solid ${theme.palette.primary.main}`,
  borderRadius: 0,
  overflow: 'hidden',
}));

const BrowserHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderBottom: `1px solid ${theme.palette.primary.main}`,
  padding: theme.spacing(1),
  backgroundColor: theme.palette.background.default,
}));

const TrafficLight = styled(Box)<{ color: string }>(({ color }) => ({
  width: 12,
  height: 12,
  borderRadius: '50%',
  backgroundColor: color,
}));

const AddressBar = styled(Box)(({ theme }) => ({
  flex: 1,
  margin: `0 ${theme.spacing(2)}`,
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.primary.main}`,
  padding: theme.spacing(0.5, 1.5),
  fontSize: '0.75rem',
  color: theme.palette.primary.main,
}));

const CrosshairDisplay = styled(Box)(({ theme }) => ({
  border: `1px solid ${theme.palette.primary.main}`,
  height: 192,
  backgroundColor: theme.palette.background.paper,
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const CrosshairContainer = styled(Box)({
  position: 'relative',
  width: 96,
  height: 96,
});

const CrosshairCircle = styled(Box)(({ theme }) => ({
  position: 'absolute',
  inset: 0,
  border: `2px solid ${theme.palette.primary.main}`,
  borderRadius: '50%',
}));

const CrosshairLine = styled(Box)<{ orientation: 'horizontal' | 'vertical' }>(
  ({ orientation, theme }) => ({
    position: 'absolute',
    backgroundColor: theme.palette.primary.main,
    ...(orientation === 'horizontal'
      ? {
          top: '50%',
          left: 0,
          width: '100%',
          height: 2,
          transform: 'translateY(-50%)',
        }
      : {
          top: 0,
          left: '50%',
          width: 2,
          height: '100%',
          transform: 'translateX(-50%)',
        }),
  })
);

const CrosshairCenter = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  width: 8,
  height: 8,
  backgroundColor: theme.palette.primary.main,
  borderRadius: '50%',
  transform: 'translate(-50%, -50%)',
}));

const CornerBracket = styled(Box)<{ position: 'tl' | 'tr' | 'bl' | 'br' }>(
  ({ position }) => {
    const color = 'yellow';
    const positions = {
      tl: {
        top: 8,
        left: 8,
        borderLeft: `2px solid ${color}`,
        borderTop: `2px solid ${color}`,
      },
      tr: {
        top: 8,
        right: 8,
        borderRight: `2px solid ${color}`,
        borderTop: `2px solid ${color}`,
      },
      bl: {
        bottom: 8,
        left: 8,
        borderLeft: `2px solid ${color}`,
        borderBottom: `2px solid ${color}`,
      },
      br: {
        bottom: 8,
        right: 8,
        borderRight: `2px solid ${color}`,
        borderBottom: `2px solid ${color}`,
      },
    };

    return {
      position: 'absolute',
      width: 16,
      height: 16,
      ...positions[position],
    };
  }
);

const ControlSlider = styled(Box)(({ theme }) => ({
  border: `1px solid ${theme.palette.primary.main}`,
  height: 128,
  // background: 'linear-gradient(to right, #000000, #064e3b, #000000)',
  position: 'relative',
}));

const SliderInner = styled(Paper)(({ theme }) => ({
  position: 'absolute',
  inset: 8,
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.primary.main}`,
}));

const SliderGradient = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%',
  background: `linear-gradient(to bottom, ${theme.palette.primary.main}, ${theme.palette.background.paper})`,
  opacity: 0.5,
}));

const SliderThumb = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: 16,
  left: '50%',
  width: 16,
  height: 16,
  backgroundColor: theme.palette.primary.main,
  borderRadius: '50%',
  transform: 'translateX(-50%)',
}));

const WarningPanel = styled(Paper)(({ theme }) => ({
  border: `1px solid ${theme.palette.warning.main}`,
  backgroundColor: 'rgba(154, 52, 18, 0.2)',
  padding: theme.spacing(1.5),
  borderRadius: 0,
}));

const WarningStripes = styled(Box)({
  display: 'flex',
  gap: 4,
  marginTop: 8,
});

const WarningStripe = styled(Box)(({ theme }) => ({
  width: 8,
  height: 8,
  backgroundColor: theme.palette.warning.main,
}));

const RadarDisplay = styled(Box)(({ theme }) => ({
  border: `1px solid ${theme.palette.primary.main}`,
  height: '100%',
  backgroundColor: 'transparent',
  position: 'relative',
  overflow: 'hidden',
  padding: theme.spacing(1),
}));

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
`;

const RadarTarget = styled(Box)<{ top: string; left: string; color: string }>(
  ({ top, left, color }) => ({
    position: 'absolute',
    top,
    left,
    width: 4,
    height: 4,
    backgroundColor: color,
    borderRadius: '50%',
    animation: `${pulse} 1.5s infinite`,
  })
);

const StatusBar = styled(Box)(({ theme }) => ({
  border: `1px solid ${theme.palette.primary.main}`,
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(1),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

const StatusIndicator = styled(Box)(({ theme }) => ({
  width: 16,
  height: 16,
  border: `1px solid ${theme.palette.primary.main}`,
  borderRadius: '50%',
  backgroundColor: theme.palette.success.main,
}));

const StatusIcons = styled(Box)({
  display: 'flex',
  gap: 8,
});

const StatusIcon = styled(Box)<{ color: string }>(({ color, theme }) => ({
  width: 24,
  height: 24,
  border: `1px solid ${theme.palette.primary.main}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '& > div': {
    width: 8,
    height: 8,
    backgroundColor: color,
  },
}));

const DataPanel = styled(Paper)(({ theme }) => ({
  border: `1px solid ${theme.palette.primary.main}`,
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(1.5),
  height: 128,
  borderRadius: 0,
}));

const StatusButton = styled(Box)(({ theme }) => ({
  border: `1px solid ${theme.palette.primary.main}`,
  backgroundColor: theme.palette.background.paper,
  height: 32,
  display: 'flex',
  alignItems: 'center',
  paddingLeft: theme.spacing(1),
  paddingRight: theme.spacing(1),
}));

const BottomPanel = styled(Box)(({ theme }) => ({
  borderTop: `1px solid ${theme.palette.primary.main}`,
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(2),
}));

const MultiplexText = styled(Typography)(({ theme }) => ({
  fontSize: '2.5rem',
  fontWeight: 'bold',
  letterSpacing: '0.1em',
  fontFamily: 'monospace',
  color: theme.palette.primary.main,
}));

const SystemsText = styled(Typography)(({ theme }) => ({
  fontSize: '1.5rem',
  fontWeight: 'bold',
  letterSpacing: '0.1em',
  fontFamily: 'monospace',
  color: theme.palette.primary.main,
  marginTop: 4,
}));

const ControlIcon = styled(Box)(({ theme }) => ({
  border: `1px solid ${theme.palette.primary.main}`,
  height: 32,
  backgroundColor: theme.palette.background.paper,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(1),
}));

const spinAnimation = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const RightDisplay = styled(Box)(({ theme }) => ({
  border: `1px solid ${theme.palette.primary.main}`,
  height: 64,
  backgroundColor: theme.palette.background.paper,
  position: 'relative',
}));

const RightDisplayInner = styled(Box)(({ theme }) => ({
  position: 'absolute',
  inset: 8,
  border: `1px solid ${theme.palette.primary.main}`,
  backgroundColor: theme.palette.background.paper,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const SpinningShape = styled(Box)(({ theme }) => ({
  height: 32,
  border: `5px solid ${theme.palette.primary.main}`,
  animation: `${spinAnimation} 2s linear infinite`,
  clipPath:
    'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
}));

const Footer = styled(Box)(({ theme }) => ({
  borderTop: `1px solid ${theme.palette.primary.main}`,
  backgroundColor: theme.palette.background.paper,
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  paddingTop: theme.spacing(0.5),
  paddingBottom: theme.spacing(0.5),
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  fontSize: '0.75rem',
}));

interface SciFiLayoutProps {
  className?: string;
}

export const BootLayout: React.FC<SciFiLayoutProps> = ({ className = '' }) => {
  const theme = useTheme();
  const [scannerAngle, setScannerAngle] = useState(0);
  const [systemStatus, setSystemStatus] = useState('ACTIVE');
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

  useEffect(() => {
    const interval = setInterval(() => {
      setScannerAngle((prev) => (prev + 2) % 360);
      setDataValues((prev) => ({
        temp: 23.7 + Math.sin(Date.now() / 1000) * 0.5,
        pressure: 101.3 + Math.cos(Date.now() / 1500) * 0.2,
        oxygen: 98.2 + Math.sin(Date.now() / 2000) * 0.3,
      }));
    }, 50);

    return () => clearInterval(interval);
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
            CT14 | USERNAME: GABRIEL-CORTEZ | PASSWORD: *******
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
                {/* Crosshair Display */}
                <CrosshairDisplay>
                  <CrosshairContainer>
                    <CrosshairCircle />
                    <CrosshairLine orientation="horizontal" />
                    <CrosshairLine orientation="vertical" />
                    <CrosshairCenter />
                    <CornerBracket position="tl" />
                    <CornerBracket position="tr" />
                    <CornerBracket position="bl" />
                    <CornerBracket position="br" />
                  </CrosshairContainer>
                  <Typography
                    variant="caption"
                    sx={{
                      position: 'absolute',
                      top: 8,
                      left: 8,
                      color: 'primary.main',
                    }}
                  >
                    A
                  </Typography>
                </CrosshairDisplay>

                {/* Control Panel */}
                <Box flex={1} display="flex" flexDirection="column" gap={1}>
                  {/* Slider */}
                  <ControlSlider>
                    <SliderInner>
                      <SliderGradient />
                    </SliderInner>
                    <SliderThumb />
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
                <RadarDisplay>
                  <Box
                    width="100%"
                    height="100%"
                    // sx={{ border: '2px solid cyan', p: 1 }}
                  >
                    <TorusFieldProgress
                      progress={(progress.current / progress.total) * 100}
                      title="QUANTUM FIELD"
                      subtitle="INITIALIZATION"
                    />
                  </Box>
                  <Typography
                    variant="caption"
                    sx={{
                      position: 'absolute',
                      top: 12,
                      left: 12,
                      color: 'primary.main',
                    }}
                  >
                    TARGET ACQUISITION
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      color: 'primary.main',
                    }}
                  >
                    {dataValues.temp.toFixed(1)}°
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      position: 'absolute',
                      bottom: 12,
                      right: 12,
                      color: 'primary.main',
                    }}
                  >
                    {dataValues.oxygen.toFixed(1)}%
                  </Typography>
                </RadarDisplay>

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
                >
                  YOUNGSTA X SLEEPER
                </Typography>
              </Box>
            </Grid>

            {/* Right Panel */}
            <Grid size={{ xs: 3 }}>
              <Box display="flex" flexDirection="column" gap={2} height="100%">
                {/* Data Display */}
                <DataPanel elevation={0}>
                  <Typography
                    variant="caption"
                    sx={{ color: 'primary.main', mb: 1, display: 'block' }}
                  >
                    SYS STATUS
                  </Typography>
                  <Box display="flex" flexDirection="column" gap={0.5}>
                    <Box display="flex" justifyContent="space-between">
                      <Typography
                        variant="caption"
                        sx={{ color: 'primary.main' }}
                      >
                        TEMP:
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: 'primary.main' }}
                      >
                        {dataValues.temp.toFixed(1)}°
                      </Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                      <Typography
                        variant="caption"
                        sx={{ color: 'primary.main' }}
                      >
                        PRES:
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: 'primary.main' }}
                      >
                        {dataValues.pressure.toFixed(1)}
                      </Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                      <Typography
                        variant="caption"
                        sx={{ color: 'primary.main' }}
                      >
                        O2:
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: 'primary.main' }}
                      >
                        {dataValues.oxygen.toFixed(1)}%
                      </Typography>
                    </Box>
                  </Box>
                </DataPanel>

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

                <BootText
                  bootMessages={bootMessages}
                  typeSpeed={1.8}
                  lineDelay={1.2}
                  cursorChar="█"
                  scrambleChars={12}
                  textColor={theme.palette.primary.main}
                  scrambleDuration={0.6}
                  charDelay={0.05}
                  scrambleCharSet={scrambleCharacterSet}
                  hoverScrambleChars={8}
                  hoverScrambleDuration={0.5}
                  onProgress={handleProgress}
                  onComplete={handleBootComplete}
                />
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
