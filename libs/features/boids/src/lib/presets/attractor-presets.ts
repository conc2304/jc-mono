import type { AttractorMotionConfig, AttractorMotionPreset } from './types';

const DEFAULT_MOTION_PARAMS = {
  amplitudeRatio: 0.7,
  freqX: 3,
  freqY: 2,
  freqZ: 1,
  phase: 0,
};

export const ATTRACTOR_PRESETS: Record<AttractorMotionPreset, AttractorMotionConfig> = {
  noise: {
    strength: 0.5,
    speed: 0.12,
    rangeScale: 0.85,
    isVisible: false,
    motionParams: { ...DEFAULT_MOTION_PARAMS, amplitudeRatio: 1, phase: 0 },
  },

  lissajous: {
    strength: 0.55,
    speed: 0.08,
    rangeScale: 0.85,
    isVisible: false,
    motionParams: {
      amplitudeRatio: 0.7,
      freqX: 3,
      freqY: 2,
      freqZ: 1,
      phase: 0,
    },
  },

  figure8: {
    strength: 0.6,
    speed: 0.1,
    rangeScale: 0.85,
    isVisible: false,
    motionParams: {
      amplitudeRatio: 0.65,
      freqX: 2,
      freqY: 4,
      freqZ: 0.5,
      phase: 0,
    },
  },
};

export function getAttractorPresetConfig(
  preset: AttractorMotionPreset
): AttractorMotionConfig {
  const base = ATTRACTOR_PRESETS[preset];
  return {
    ...base,
    motionParams: { ...base.motionParams },
  };
}

export function cloneAttractorConfig(
  config: AttractorMotionConfig
): AttractorMotionConfig {
  return {
    ...config,
    motionParams: { ...config.motionParams },
  };
}
