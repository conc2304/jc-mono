import type {
  AttractorBounds,
  AttractorMotionState,
  AttractorMotionStrategy,
} from './attractor-motion-strategy';

export class LissajousMotionStrategy implements AttractorMotionStrategy {
  resetFrom(_position: import('three').Vector3): void {}

  update(state: AttractorMotionState, time: number, bounds: AttractorBounds): void {
    const { amplitudeRatio, freqX, freqY, freqZ, phase } = state.motionParams;
    const cx = (bounds.x[0] + bounds.x[1]) / 2;
    const cy = (bounds.y[0] + bounds.y[1]) / 2;
    const cz = (bounds.z[0] + bounds.z[1]) / 2;
    const ax = ((bounds.x[1] - bounds.x[0]) / 2) * amplitudeRatio;
    const ay = ((bounds.y[1] - bounds.y[0]) / 2) * amplitudeRatio;
    const az = ((bounds.z[1] - bounds.z[0]) / 2) * amplitudeRatio;
    const t = time * state.speed + phase;

    state.position.x = cx + ax * Math.sin(freqX * t);
    state.position.y = cy + ay * Math.sin(freqY * t);
    state.position.z = cz + az * Math.cos(freqZ * t);
  }
}
