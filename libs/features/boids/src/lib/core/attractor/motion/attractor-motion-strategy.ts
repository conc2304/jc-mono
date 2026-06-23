import type { Vector3 } from 'three';

export type AttractorBounds = {
  x: [number, number];
  y: [number, number];
  z: [number, number];
};

export type AttractorMotionState = {
  position: Vector3;
  speed: number;
  motionParams: {
    amplitudeRatio: number;
    freqX: number;
    freqY: number;
    freqZ: number;
    phase: number;
  };
};

export interface AttractorMotionStrategy {
  resetFrom(position: Vector3): void;
  update(state: AttractorMotionState, time: number, bounds: AttractorBounds): void;
}
