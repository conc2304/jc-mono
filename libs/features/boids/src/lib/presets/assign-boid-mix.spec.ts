import { assignBoidMix, boidMixToCounts, normalizeBoidMix } from './assign-boid-mix';

describe('normalizeBoidMix', () => {
  it('returns default when empty', () => {
    expect(normalizeBoidMix({})).toEqual({ default: 1 });
  });

  it('normalizes ratios to sum to 1', () => {
    const normalized = normalizeBoidMix({ default: 1, tight: 1 });
    expect(normalized.default).toBeCloseTo(0.5);
    expect(normalized.tight).toBeCloseTo(0.5);
  });
});

describe('boidMixToCounts', () => {
  it('produces counts summing to totalCount', () => {
    const counts = boidMixToCounts({ default: 0.7, murmuration: 0.3 }, 100);
    const sum = Object.values(counts).reduce((a, b) => a + b, 0);
    expect(sum).toBe(100);
  });
});

describe('assignBoidMix', () => {
  it('assigns correct number of presets', () => {
    const assignments = assignBoidMix({ default: 0.5, tight: 0.5 }, 10);
    expect(assignments).toHaveLength(10);
    const tightCount = assignments.filter((p) => p === 'tight').length;
    const defaultCount = assignments.filter((p) => p === 'default').length;
    expect(tightCount + defaultCount).toBe(10);
    expect(tightCount).toBe(5);
    expect(defaultCount).toBe(5);
  });
});
