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
  url: '/textures/ui/ambient-vintage-clouds.gif',
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

export const DefaultInfoPanelContent = {
  label: 'INFO',
  middleSection: ['FUN ZONE AREA', 'CURIOSITY REQUIRED'] as [string, string],
  rightSection: ['DO NOT', 'RESIST THE', 'EXPERIENCE'] as [
    string,
    string,
    string
  ],
};

export const DefaultPasswordHoverMessage = 'CAUGHT YOU SNOOPING';

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
