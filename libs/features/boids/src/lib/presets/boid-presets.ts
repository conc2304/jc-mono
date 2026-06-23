import type { BoidBehaviorConfig, BoidBehaviorPreset } from './types';

const DEFAULT_CONFIG: BoidBehaviorConfig = {
  neighborhoodRadiusScale: 1,
  neighborhoodAngle: 20,
  crowdingRadiusScale: 1,
  collisionRadiusScale: 1,
  weightOld: 0.5,
  weightAvg: 0.5,
  cohesionWeight: 0,
  separationPower: 4,
  boidSpeed: 2,
  rotationSpeed: 0.35,
  noiseStrength: 0.01,
  noiseScale: 0.05,
  attractorStrengthMultiplier: 1,
  flowFollowStrength: 0.5,
  colorSaturation: 1,
};

export const BOID_PRESETS: Record<BoidBehaviorPreset, BoidBehaviorConfig> = {
  default: { ...DEFAULT_CONFIG },

  tight: {
    ...DEFAULT_CONFIG,
    neighborhoodRadiusScale: 0.8,
    neighborhoodAngle: 12,
    crowdingRadiusScale: 1.2,
    weightOld: 0.3,
    weightAvg: 0.7,
    cohesionWeight: 0.8,
    separationPower: 5,
    boidSpeed: 1.5,
    rotationSpeed: 0.4,
    noiseStrength: 0.005,
  },

  murmuration: {
    ...DEFAULT_CONFIG,
    neighborhoodRadiusScale: 1.4,
    neighborhoodAngle: 35,
    weightOld: 0.15,
    weightAvg: 0.85,
    cohesionWeight: 0.5,
    separationPower: 2.5,
    boidSpeed: 2.5,
    rotationSpeed: 0.45,
    noiseStrength: 0.008,
  },

  loose: {
    ...DEFAULT_CONFIG,
    neighborhoodRadiusScale: 1.2,
    neighborhoodAngle: 25,
    weightOld: 0.7,
    weightAvg: 0.3,
    cohesionWeight: 0.1,
    separationPower: 2,
    boidSpeed: 1,
    rotationSpeed: 0.25,
    noiseStrength: 0.02,
  },

  scatter: {
    ...DEFAULT_CONFIG,
    neighborhoodRadiusScale: 0.6,
    neighborhoodAngle: 15,
    crowdingRadiusScale: 1.5,
    weightOld: 0.8,
    weightAvg: 0.2,
    cohesionWeight: 0,
    separationPower: 6,
    boidSpeed: 4,
    rotationSpeed: 0.5,
    noiseStrength: 0.015,
    attractorStrengthMultiplier: 0.3,
  },

  orbiter: {
    ...DEFAULT_CONFIG,
    neighborhoodRadiusScale: 1,
    neighborhoodAngle: 18,
    weightOld: 0.4,
    weightAvg: 0.6,
    cohesionWeight: 0.15,
    separationPower: 3,
    boidSpeed: 1.8,
    rotationSpeed: 0.38,
    attractorStrengthMultiplier: 2.5,
    noiseStrength: 0.006,
  },
};

export function getBoidPresetConfig(preset: BoidBehaviorPreset): BoidBehaviorConfig {
  return { ...BOID_PRESETS[preset] };
}

export function cloneBoidConfig(config: BoidBehaviorConfig): BoidBehaviorConfig {
  return { ...config };
}
