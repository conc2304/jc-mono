import type { Vec2 } from '../types';

function perpendicularDistance(point: Vec2, lineStart: Vec2, lineEnd: Vec2): number {
  const dx = lineEnd.x - lineStart.x;
  const dy = lineEnd.y - lineStart.y;
  if (dx === 0 && dy === 0) {
    return Math.hypot(point.x - lineStart.x, point.y - lineStart.y);
  }
  const t = ((point.x - lineStart.x) * dx + (point.y - lineStart.y) * dy) / (dx * dx + dy * dy);
  const nearestX = lineStart.x + t * dx;
  const nearestY = lineStart.y + t * dy;
  return Math.hypot(point.x - nearestX, point.y - nearestY);
}

function rdp(points: Vec2[], start: number, end: number, tolerance: number, result: boolean[]): void {
  if (end <= start + 1) return;
  let maxDist = 0;
  let maxIdx = start;
  for (let i = start + 1; i < end; i++) {
    const d = perpendicularDistance(points[i], points[start], points[end]);
    if (d > maxDist) { maxDist = d; maxIdx = i; }
  }
  if (maxDist > tolerance) {
    result[maxIdx] = true;
    rdp(points, start, maxIdx, tolerance, result);
    rdp(points, maxIdx, end, tolerance, result);
  }
}

export function simplifyPath(points: Vec2[], tolerance: number): Vec2[] {
  if (points.length <= 2) return points;
  const keep = new Array(points.length).fill(false) as boolean[];
  keep[0] = true;
  keep[points.length - 1] = true;
  rdp(points, 0, points.length - 1, tolerance, keep);
  return points.filter((_, i) => keep[i]);
}
