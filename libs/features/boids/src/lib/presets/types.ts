import type { ObstaclePreset } from '../types';

export type AttractorMotionPreset = 'noise' | 'lissajous' | 'figure8';
export type AttractorFieldMode = 'points' | 'flow';
export type FlowFieldPreset = 'curlNoise' | 'vortex';

export type BoidBehaviorPreset =
  | 'default'
  | 'tight'
  | 'murmuration'
  | 'loose'
  | 'scatter'
  | 'orbiter';

export type BoidMix = Partial<Record<BoidBehaviorPreset, number>>;

export type BoidBehaviorConfig = {
  neighborhoodRadiusScale: number;
  neighborhoodAngle: number;
  crowdingRadiusScale: number;
  collisionRadiusScale: number;
  weightOld: number;
  weightAvg: number;
  cohesionWeight: number;
  separationPower: number;
  boidSpeed: number;
  rotationSpeed: number;
  noiseStrength: number;
  noiseScale: number;
  attractorStrengthMultiplier: number;
  flowFollowStrength: number;
  colorSaturation: number;
};

export type AttractorMotionParams = {
  amplitudeRatio: number;
  freqX: number;
  freqY: number;
  freqZ: number;
  phase: number;
};

export type AttractorMotionConfig = {
  strength: number;
  speed: number;
  rangeScale: number;
  isVisible: boolean;
  motionParams: AttractorMotionParams;
};

export type FlowFieldConfig = {
  strength: number;
  evolutionSpeed: number;
  inwardPull: number;
};

export type ScenePresetId =
  | 'default'
  | 'vaporwaveDrift'
  | 'neonChase'
  | 'aquariumSchool'
  | 'murmurationDusk'
  | 'stormFlow'
  | 'splitFlock';

export type ScenePresetDefinition = {
  id: ScenePresetId;
  label: string;
  attractorMotion: AttractorMotionPreset;
  fieldMode: AttractorFieldMode;
  flowFieldPreset: FlowFieldPreset;
  flowWeight: number;
  boidMix: BoidMix;
  attractorCount?: number;
  attractorVisible?: boolean;
  obstacles?: ObstaclePreset;
  obstaclesEnabled?: boolean;
  boidCount?: number;
};

export type PresetState = {
  scenePresetId: ScenePresetId | null;
  attractorMotion: AttractorMotionPreset;
  fieldMode: AttractorFieldMode;
  flowFieldPreset: FlowFieldPreset;
  boidMix: BoidMix;
  flowWeight: number;
  pointAttractorWeight: number;
  attractorStrength: number;
  attractorSpeed: number;
};

export type GlobalMorphState = {
  flowWeight: number;
  pointAttractorWeight: number;
  attractorStrength: number;
  attractorSpeed: number;
};

export const DEFAULT_BOID_MIX: BoidMix = { default: 1 };
export const MORPH_RATE = 4;
