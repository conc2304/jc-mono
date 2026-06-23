import { SimplexNoise } from 'three/examples/jsm/math/SimplexNoise.js';

import type {
  AttractorBounds,
  AttractorMotionState,
  AttractorMotionStrategy,
} from './attractor-motion-strategy';

export class NoiseMotionStrategy implements AttractorMotionStrategy {
  #noise = new SimplexNoise();

  resetFrom(_position: import('three').Vector3): void {
    // noise is time-driven; position continuity handled by state.position
  }

  update(state: AttractorMotionState, time: number, bounds: AttractorBounds): void {
    const scale = state.speed;
    state.position.x =
      (this.#noise.noise(time * scale, 0) * 0.5 + 0.5) *
        (bounds.x[1] - bounds.x[0]) +
      bounds.x[0];
    state.position.y =
      (this.#noise.noise(time * scale, 1) * 0.5 + 0.5) *
        (bounds.y[1] - bounds.y[0]) +
      bounds.y[0];
    state.position.z =
      (this.#noise.noise(time * scale, 2) * 0.5 + 0.5) *
        (bounds.z[1] - bounds.z[0]) +
      bounds.z[0];
  }
}
