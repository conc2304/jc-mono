import type { CSSProperties } from 'react';

import type {
  AttractorFieldMode,
  AttractorMotionPreset,
  BoidMix,
  FlowFieldPreset,
  ScenePresetId,
} from './presets/types';

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
  obstaclesEnabled?: boolean;
  enableViewControls?: boolean;
  attractorMotion?: AttractorMotionPreset;
  fieldMode?: AttractorFieldMode;
  flowFieldPreset?: FlowFieldPreset;
  boidMix?: BoidMix;
  scenePreset?: ScenePresetId;
};

export type BoidsSimulationProps = {
  physics?: boolean;
  debug?: boolean;
  boidCount?: number;
  attractorCount?: number;
  gridColors?: GridThemeColors;
  obstacles?: ObstaclePreset;
  obstacleCount?: number;
  obstaclesEnabled?: boolean;
  enableViewControls?: boolean;
  showSettings?: boolean;
  attractorMotion?: AttractorMotionPreset;
  fieldMode?: AttractorFieldMode;
  flowFieldPreset?: FlowFieldPreset;
  boidMix?: BoidMix;
  scenePreset?: ScenePresetId;
  className?: string;
  style?: CSSProperties;
};

export type {
  AttractorFieldMode,
  AttractorMotionPreset,
  BoidBehaviorPreset,
  BoidMix,
  FlowFieldPreset,
  PresetState,
  ScenePresetId,
} from './presets/types';

export { SCENE_PRESET_LIST } from './presets/scene-presets';
export { DEFAULT_BOID_MIX } from './presets/types';
