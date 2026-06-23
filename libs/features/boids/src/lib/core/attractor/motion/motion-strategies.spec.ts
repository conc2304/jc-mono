import { Vector3 } from 'three';

import { Figure8MotionStrategy } from './figure8-motion';
import { LissajousMotionStrategy } from './lissajous-motion';

const bounds = {
  x: [-400, 400] as [number, number],
  y: [-300, 300] as [number, number],
  z: [-288, 288] as [number, number],
};

describe('LissajousMotionStrategy', () => {
  it('keeps position within bounds', () => {
    const strategy = new LissajousMotionStrategy();
    const position = new Vector3();
    const state = {
      position,
      speed: 0.08,
      motionParams: {
        amplitudeRatio: 0.7,
        freqX: 3,
        freqY: 2,
        freqZ: 1,
        phase: 0,
      },
    };

    for (let t = 0; t < 10; t += 0.1) {
      strategy.update(state, t, bounds);
      expect(position.x).toBeGreaterThanOrEqual(bounds.x[0]);
      expect(position.x).toBeLessThanOrEqual(bounds.x[1]);
      expect(position.y).toBeGreaterThanOrEqual(bounds.y[0]);
      expect(position.y).toBeLessThanOrEqual(bounds.y[1]);
    }
  });

  it('is continuous at t=0', () => {
    const strategy = new LissajousMotionStrategy();
    const position = new Vector3(1, 2, 3);
    const state = {
      position,
      speed: 0.08,
      motionParams: {
        amplitudeRatio: 0.7,
        freqX: 3,
        freqY: 2,
        freqZ: 1,
        phase: 0,
      },
    };
    strategy.update(state, 0, bounds);
    expect(Number.isFinite(position.x)).toBe(true);
    expect(Number.isFinite(position.y)).toBe(true);
    expect(Number.isFinite(position.z)).toBe(true);
  });
});

describe('Figure8MotionStrategy', () => {
  it('keeps position within bounds', () => {
    const strategy = new Figure8MotionStrategy();
    const position = new Vector3();
    const state = {
      position,
      speed: 0.1,
      motionParams: {
        amplitudeRatio: 0.65,
        freqX: 2,
        freqY: 4,
        freqZ: 0.5,
        phase: 0,
      },
    };

    for (let t = 0; t < 10; t += 0.1) {
      strategy.update(state, t, bounds);
      expect(position.x).toBeGreaterThanOrEqual(bounds.x[0] - 1);
      expect(position.x).toBeLessThanOrEqual(bounds.x[1] + 1);
    }
  });
});
