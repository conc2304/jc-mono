import type { BoidBehaviorPreset, BoidMix } from './types';

export const BOID_PRESET_ORDER: BoidBehaviorPreset[] = [
  'default',
  'tight',
  'murmuration',
  'loose',
  'scatter',
  'orbiter',
];

export function normalizeBoidMix(mix: BoidMix): BoidMix {
  const entries = BOID_PRESET_ORDER.filter((key) => (mix[key] ?? 0) > 0).map(
    (key) => [key, mix[key] ?? 0] as const
  );

  if (entries.length === 0) {
    return { default: 1 };
  }

  const total = entries.reduce((sum, [, weight]) => sum + weight, 0);
  const normalized: BoidMix = {};
  for (const [key, weight] of entries) {
    normalized[key] = weight / total;
  }
  return normalized;
}

/** Largest-remainder method: integer counts summing to totalCount. */
export function boidMixToCounts(mix: BoidMix, totalCount: number): Record<BoidBehaviorPreset, number> {
  const normalized = normalizeBoidMix(mix);
  const counts = Object.fromEntries(
    BOID_PRESET_ORDER.map((key) => [key, 0])
  ) as Record<BoidBehaviorPreset, number>;

  const quotas = BOID_PRESET_ORDER.map((key) => ({
    key,
    exact: (normalized[key] ?? 0) * totalCount,
  }));

  let assigned = 0;
  const remainders: { key: BoidBehaviorPreset; remainder: number }[] = [];

  for (const { key, exact } of quotas) {
    const floor = Math.floor(exact);
    counts[key] = floor;
    assigned += floor;
    remainders.push({ key, remainder: exact - floor });
  }

  remainders.sort((a, b) => b.remainder - a.remainder);
  let remaining = totalCount - assigned;
  for (const { key } of remainders) {
    if (remaining <= 0) break;
    counts[key] += 1;
    remaining -= 1;
  }

  return counts;
}

export function assignBoidMix(mix: BoidMix, totalCount: number): BoidBehaviorPreset[] {
  const counts = boidMixToCounts(mix, totalCount);
  const assignments: BoidBehaviorPreset[] = [];

  for (const key of BOID_PRESET_ORDER) {
    for (let i = 0; i < counts[key]; i++) {
      assignments.push(key);
    }
  }

  shuffleInPlace(assignments);
  return assignments;
}

export function countBoidMix(
  assignments: BoidBehaviorPreset[]
): Record<BoidBehaviorPreset, number> {
  const counts = Object.fromEntries(
    BOID_PRESET_ORDER.map((key) => [key, 0])
  ) as Record<BoidBehaviorPreset, number>;

  for (const preset of assignments) {
    counts[preset] += 1;
  }
  return counts;
}

export function computeMixDelta(
  current: Record<BoidBehaviorPreset, number>,
  target: Record<BoidBehaviorPreset, number>
): { increase: BoidBehaviorPreset[]; decrease: BoidBehaviorPreset[] } {
  const increase: BoidBehaviorPreset[] = [];
  const decrease: BoidBehaviorPreset[] = [];

  for (const key of BOID_PRESET_ORDER) {
    const delta = target[key] - current[key];
    for (let i = 0; i < delta; i++) increase.push(key);
    for (let i = 0; i < -delta; i++) decrease.push(key);
  }

  return { increase, decrease };
}

function shuffleInPlace<T>(array: T[]): void {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
