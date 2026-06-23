import type { ScenePresetDefinition } from './types';

export const DEFAULT_SCENE_ATTRACTOR_COUNT = 15;

export const SCENE_PRESETS: Record<
  ScenePresetDefinition['id'],
  ScenePresetDefinition
> = {
  default: {
    id: 'default',
    label: 'Default',
    attractorMotion: 'noise',
    fieldMode: 'points',
    flowFieldPreset: 'curlNoise',
    flowWeight: 0,
    boidMix: { default: 1 },
    attractorCount: DEFAULT_SCENE_ATTRACTOR_COUNT,
    attractorVisible: false,
    obstacles: 'none',
    obstaclesEnabled: false,
  },

  vaporwaveDrift: {
    id: 'vaporwaveDrift',
    label: 'Vaporwave Drift',
    attractorMotion: 'noise',
    fieldMode: 'points',
    flowFieldPreset: 'curlNoise',
    flowWeight: 0,
    boidMix: { default: 1 },
    attractorVisible: false,
  },

  neonChase: {
    id: 'neonChase',
    label: 'Neon Chase',
    attractorMotion: 'figure8',
    fieldMode: 'points',
    flowFieldPreset: 'curlNoise',
    flowWeight: 0,
    boidMix: { orbiter: 0.6, default: 0.4 },
    attractorCount: 1,
    attractorVisible: true,
  },

  aquariumSchool: {
    id: 'aquariumSchool',
    label: 'Aquarium School',
    attractorMotion: 'noise',
    fieldMode: 'points',
    flowFieldPreset: 'curlNoise',
    flowWeight: 0,
    boidMix: { tight: 0.7, default: 0.3 },
    obstacles: 'aquarium',
    obstaclesEnabled: true,
    attractorVisible: false,
  },

  murmurationDusk: {
    id: 'murmurationDusk',
    label: 'Murmuration Dusk',
    attractorMotion: 'lissajous',
    fieldMode: 'points',
    flowFieldPreset: 'curlNoise',
    flowWeight: 0,
    boidMix: { murmuration: 0.85, loose: 0.15 },
    boidCount: 300,
    attractorVisible: false,
  },

  stormFlow: {
    id: 'stormFlow',
    label: 'Storm Flow',
    attractorMotion: 'noise',
    fieldMode: 'flow',
    flowFieldPreset: 'curlNoise',
    flowWeight: 0.85,
    boidMix: { scatter: 0.4, loose: 0.6 },
    attractorVisible: false,
  },

  splitFlock: {
    id: 'splitFlock',
    label: 'Split Flock',
    attractorMotion: 'lissajous',
    fieldMode: 'points',
    flowFieldPreset: 'curlNoise',
    flowWeight: 0,
    boidMix: { tight: 0.5, murmuration: 0.5 },
    attractorCount: 15,
    attractorVisible: false,
  },
};

export const SCENE_PRESET_LIST: ScenePresetDefinition[] = [
  SCENE_PRESETS.default,
  SCENE_PRESETS.vaporwaveDrift,
  SCENE_PRESETS.neonChase,
  SCENE_PRESETS.aquariumSchool,
  SCENE_PRESETS.murmurationDusk,
  SCENE_PRESETS.stormFlow,
  SCENE_PRESETS.splitFlock,
];

export function getScenePreset(id: ScenePresetDefinition['id']): ScenePresetDefinition {
  return SCENE_PRESETS[id];
}
