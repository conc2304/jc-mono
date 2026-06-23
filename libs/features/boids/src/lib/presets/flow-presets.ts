import type { FlowFieldConfig, FlowFieldPreset } from './types';

export const FLOW_PRESETS: Record<FlowFieldPreset, FlowFieldConfig> = {
  curlNoise: {
    strength: 0.8,
    evolutionSpeed: 0.15,
    inwardPull: 0,
  },

  vortex: {
    strength: 1,
    evolutionSpeed: 0.05,
    inwardPull: 0.15,
  },
};

export function getFlowPresetConfig(preset: FlowFieldPreset): FlowFieldConfig {
  return { ...FLOW_PRESETS[preset] };
}
