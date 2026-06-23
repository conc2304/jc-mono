import type {
  AttractorBounds,
  AttractorMotionState,
  AttractorMotionStrategy,
} from './attractor-motion-strategy';

export class Figure8MotionStrategy implements AttractorMotionStrategy {
  resetFrom(_position: import('three').Vector3): void {}

  update(state: AttractorMotionState, time: number, bounds: AttractorBounds): void {
    const { amplitudeRatio, freqX, phase } = state.motionParams;
    const cx = (bounds.x[0] + bounds.x[1]) / 2;
    const cy = (bounds.y[0] + bounds.y[1]) / 2;
    const cz = (bounds.z[0] + bounds.z[1]) / 2;
    const ax = ((bounds.x[1] - bounds.x[0]) / 2) * amplitudeRatio;
    const ay = ((bounds.y[1] - bounds.y[0]) / 2) * amplitudeRatio;
    const az = ((bounds.z[1] - bounds.z[0]) / 2) * 0.3 * amplitudeRatio;
    const t = time * state.speed * freqX + phase;
    const denom = 1 + Math.pow(Math.sin(t), 2);

    state.position.x = cx + (ax * Math.cos(t)) / denom;
    state.position.y = cy + (ay * Math.sin(t) * Math.cos(t)) / denom;
    state.position.z = cz + az * Math.sin(t * 0.5);
  }
}
