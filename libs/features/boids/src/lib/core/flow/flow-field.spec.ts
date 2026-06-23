jest.mock('three/examples/jsm/math/SimplexNoise.js', () => ({
  SimplexNoise: jest.fn().mockImplementation(() => ({
    noise: (x: number, y: number, z = 0) => Math.sin(x + y + z),
  })),
}));

import { Vector3 } from 'three';

import { CurlNoiseFlowField, VortexFlowField } from './create-flow-field';

describe('CurlNoiseFlowField', () => {
  it('returns a normalized vector', () => {
    const field = new CurlNoiseFlowField();
    const out = new Vector3();
    field.sample(new Vector3(10, 20, 30), 1, out);
    expect(out.length()).toBeCloseTo(1, 5);
  });

  it('changes over time', () => {
    const field = new CurlNoiseFlowField();
    const a = new Vector3();
    const b = new Vector3();
    const pos = new Vector3(50, 50, 50);
    field.sample(pos, 0, a);
    field.sample(pos, 5, b);
    expect(a.equals(b)).toBe(false);
  });
});

describe('VortexFlowField', () => {
  it('produces tangent-like flow at offset from origin', () => {
    const field = new VortexFlowField();
    const out = new Vector3();
    field.sample(new Vector3(100, 0, 0), 0, out);
    expect(Math.abs(out.z)).toBeGreaterThan(0.1);
  });
});
