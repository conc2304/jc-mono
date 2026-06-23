import { getBoidPresetConfig } from './boid-presets';
import {
  isBoidConfigNearTarget,
  lerpBoidConfig,
  morphAlpha,
  morphBoidConfigInPlace,
} from './preset-morph';

describe('morphAlpha', () => {
  it('approaches 1 over time', () => {
    expect(morphAlpha(0.5)).toBeGreaterThan(0);
    expect(morphAlpha(0.5)).toBeLessThan(1);
  });
});

describe('lerpBoidConfig', () => {
  it('reaches target when alpha is 1', () => {
    const current = getBoidPresetConfig('default');
    const target = getBoidPresetConfig('scatter');
    const result = lerpBoidConfig(current, target, 1);
    expect(result.boidSpeed).toBe(target.boidSpeed);
    expect(result.separationPower).toBe(target.separationPower);
  });
});

describe('morphBoidConfigInPlace', () => {
  it('converges toward target', () => {
    const current = getBoidPresetConfig('default');
    const target = getBoidPresetConfig('tight');
    for (let i = 0; i < 200; i++) {
      morphBoidConfigInPlace(current, target, morphAlpha(1 / 60));
    }
    expect(isBoidConfigNearTarget(current, target, 0.05)).toBe(true);
  });
});

describe('default preset parity', () => {
  it('matches legacy boid constants', () => {
    const config = getBoidPresetConfig('default');
    expect(config.neighborhoodRadiusScale).toBe(1);
    expect(config.neighborhoodAngle).toBe(20);
    expect(config.weightOld).toBe(0.5);
    expect(config.weightAvg).toBe(0.5);
    expect(config.cohesionWeight).toBe(0);
    expect(config.separationPower).toBe(4);
    expect(config.boidSpeed).toBe(2);
    expect(config.rotationSpeed).toBe(0.35);
    expect(config.noiseStrength).toBe(0.01);
    expect(config.noiseScale).toBe(0.05);
    expect(config.attractorStrengthMultiplier).toBe(1);
  });

  it('scatter preset has stronger separation than default', () => {
    const scatter = getBoidPresetConfig('scatter');
    const defaultConfig = getBoidPresetConfig('default');
    expect(scatter.separationPower).toBeGreaterThan(defaultConfig.separationPower);
  });
});
