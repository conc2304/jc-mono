import type { AttractorMotionPreset } from '../../../presets/types';
import type { AttractorMotionStrategy } from './attractor-motion-strategy';
import { Figure8MotionStrategy } from './figure8-motion';
import { LissajousMotionStrategy } from './lissajous-motion';
import { NoiseMotionStrategy } from './noise-motion';

export function createMotionStrategy(
  preset: AttractorMotionPreset
): AttractorMotionStrategy {
  switch (preset) {
    case 'lissajous':
      return new LissajousMotionStrategy();
    case 'figure8':
      return new Figure8MotionStrategy();
    case 'noise':
    default:
      return new NoiseMotionStrategy();
  }
}
