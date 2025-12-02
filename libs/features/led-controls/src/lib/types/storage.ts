import type { Gradient, GradientPatternConfig } from '@jc/ui-components';

export interface Scene {
  id: string;
  name: string;
  description?: string;
  type: 'solid-color' | 'gradient-pattern';
  createdAt: number;
  updatedAt: number;
  // For solid color scenes
  color?: string;
  // For gradient pattern scenes
  gradient?: Gradient;
  patternConfig?: GradientPatternConfig;
}

export interface LedControllerStorage {
  savedColors: string[];
  savedGradients: Gradient[];
  scenes: Scene[];
}

export const STORAGE_KEYS = {
  SAVED_COLORS: 'led-controller:saved-colors',
  SAVED_GRADIENTS: 'led-controller:saved-gradients',
  SCENES: 'led-controller:scenes',
} as const;
