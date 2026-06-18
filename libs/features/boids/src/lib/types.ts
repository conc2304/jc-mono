import type { CSSProperties } from 'react';

export type GridThemeColors = {
  gridColor: string;
  centerColor: string;
};

export type ObstaclePreset = 'none' | 'aquarium';

export type BoidsAppOptions = {
  physics?: boolean;
  debug?: boolean;
  boidCount?: number;
  attractorCount?: number;
  debugContainer?: HTMLElement | null;
  statsContainer?: HTMLElement | null;
  gridColors?: GridThemeColors;
  obstacles?: ObstaclePreset;
  obstacleCount?: number;
  enableViewControls?: boolean;
};

export type BoidsSimulationProps = {
  physics?: boolean;
  debug?: boolean;
  boidCount?: number;
  attractorCount?: number;
  gridColors?: GridThemeColors;
  obstacles?: ObstaclePreset;
  obstacleCount?: number;
  enableViewControls?: boolean;
  className?: string;
  style?: CSSProperties;
};
