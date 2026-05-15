import type { Vec2 } from '../types';

export function hitTestPoint(screenPt: Vec2, targetScreenPt: Vec2, radiusPx: number): boolean {
  const dx = screenPt.x - targetScreenPt.x;
  const dy = screenPt.y - targetScreenPt.y;
  return dx * dx + dy * dy <= radiusPx * radiusPx;
}

export function distSq(a: Vec2, b: Vec2): number {
  return (a.x - b.x) ** 2 + (a.y - b.y) ** 2;
}
