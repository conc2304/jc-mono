import type { BoidBehaviorConfig, GlobalMorphState } from './types';
import { MORPH_RATE as DEFAULT_MORPH_RATE } from './types';
import { cloneBoidConfig } from './boid-presets';

export function morphAlpha(dt: number, rate = DEFAULT_MORPH_RATE): number {
  return 1 - Math.exp(-rate * dt);
}

export function lerpScalar(current: number, target: number, alpha: number): number {
  return current + (target - current) * alpha;
}

export function lerpBoidConfig(
  current: BoidBehaviorConfig,
  target: BoidBehaviorConfig,
  alpha: number
): BoidBehaviorConfig {
  const result = cloneBoidConfig(current);
  const keys = Object.keys(target) as (keyof BoidBehaviorConfig)[];

  for (const key of keys) {
    result[key] = lerpScalar(current[key], target[key], alpha);
  }

  return result;
}

export function morphBoidConfigInPlace(
  current: BoidBehaviorConfig,
  target: BoidBehaviorConfig,
  alpha: number
): void {
  const keys = Object.keys(target) as (keyof BoidBehaviorConfig)[];
  for (const key of keys) {
    current[key] = lerpScalar(current[key], target[key], alpha);
  }
}

export function morphGlobalStateInPlace(
  current: GlobalMorphState,
  target: GlobalMorphState,
  alpha: number
): void {
  current.flowWeight = lerpScalar(current.flowWeight, target.flowWeight, alpha);
  current.pointAttractorWeight = lerpScalar(
    current.pointAttractorWeight,
    target.pointAttractorWeight,
    alpha
  );
  current.attractorStrength = lerpScalar(
    current.attractorStrength,
    target.attractorStrength,
    alpha
  );
  current.attractorSpeed = lerpScalar(current.attractorSpeed, target.attractorSpeed, alpha);
}

export function isBoidConfigNearTarget(
  current: BoidBehaviorConfig,
  target: BoidBehaviorConfig,
  epsilon = 0.001
): boolean {
  const keys = Object.keys(target) as (keyof BoidBehaviorConfig)[];
  return keys.every((key) => Math.abs(current[key] - target[key]) < epsilon);
}

export function isGlobalStateNearTarget(
  current: GlobalMorphState,
  target: GlobalMorphState,
  epsilon = 0.001
): boolean {
  return (
    Math.abs(current.flowWeight - target.flowWeight) < epsilon &&
    Math.abs(current.pointAttractorWeight - target.pointAttractorWeight) < epsilon &&
    Math.abs(current.attractorStrength - target.attractorStrength) < epsilon &&
    Math.abs(current.attractorSpeed - target.attractorSpeed) < epsilon
  );
}

// Re-export for tests
export { DEFAULT_MORPH_RATE as MORPH_RATE_K };
