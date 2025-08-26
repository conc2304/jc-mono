import { easeQuadInOut, easeSinInOut } from 'd3';
import { BootMessage } from '../../types';
import { AnimatedRadarChartProps } from '../radar-chart-widget/animated-radar';
import { darken, lighten, Theme } from '@mui/material';
import { remap } from '../utils';
import { RadarChartProps } from '../radar-chart-widget/radar-chart-widget';
import { FormatDataFn } from '../radar-chart-widget';

export const defaultScrambleCharacterSet =
  '!@#$%^&*()_+-=[]{}|;:,.<>?ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

export const defaultBootMessages: BootMessage[] = [
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

export const DefaultProgressMessages = {
  start: 'initializing',
  end: 'install completed',
};

export const defaultGif = {
  url: '/textures/ambient-vintage-clouds.gif',
  backgroundPositionY: 'center',
};

// Animation configuration
export const radarAnimationConfig = {
  animationSpeed: 1500,
  numTrails: 4,
  trailOffset: 80.0,
  noiseScale: 1.5,
  trailIntensity: 1,
  enableAnimation: true,
  easing: easeSinInOut,
};

export const radarWidgetProps = (
  theme: Theme
): Partial<AnimatedRadarChartProps> => ({
  levels: 5,
  showLabels: false,
  labelFactor: 1,
  opacityArea: 0.1,
  strokeWidth: 1,
  dotRadius: 3,
  lineType: 'curved',
  colors: {
    primary: theme.palette.primary.main,
    accent: theme.palette.warning.main,
    series: new Array(3).fill('').map((_, i) => {
      const fn = theme.palette.mode === 'light' ? darken : lighten;
      return fn(
        theme.palette.primary[theme.palette.mode],
        remap(i, 0, 3, 0, 0.5)
      );
    }),
  },
  margin: { top: 20, right: 0, bottom: 0, left: 0 },
  animationConfig: radarAnimationConfig,
  transitionConfig: {
    duration: radarAnimationConfig.animationSpeed,
    ease: easeQuadInOut,
  },
  titleStyle: {
    left: 0,
    right: 0,
    textAlign: 'center',
  },
});

export const DefaultInfoPanelContent = {
  label: 'INFO',
  middleSection: ['FUN ZONE AREA', 'CURIOSITY REQUIRED'] as [string, string],
  rightSection: ['DO NOT', 'RESIST THE', 'EXPERIENCE'] as [
    string,
    string,
    string
  ],
};

// Default fallback metrics
export const DefaultRadarMetrics: {
  title: string;
  metrics: Array<{ label: string; formatFn: FormatDataFn }>;
} = {
  title: 'SYSTEM DIAGNOSTICS',
  metrics: [
    { label: 'SYSTEM', formatFn: (n) => `${n.valueOf().toFixed(1)}%` },
    { label: 'DATA', formatFn: (n) => `${n.valueOf().toFixed(1)}%` },
    { label: 'NETWORK', formatFn: (n) => `${n.valueOf().toFixed(1)}%` },
    { label: 'PROCESS', formatFn: (n) => `${n.valueOf().toFixed(1)}%` },
    { label: 'SECURITY', formatFn: (n) => `${n.valueOf().toFixed(1)}%` },
    { label: 'MEMORY', formatFn: (n) => `${n.valueOf().toFixed(1)}%` },
  ],
};
