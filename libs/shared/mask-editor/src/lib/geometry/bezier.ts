import type { Vec2 } from '../types';

function lerp(a: Vec2, b: Vec2, t: number): Vec2 {
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
}

function splitCubic(
  p0: Vec2, p1: Vec2, p2: Vec2, p3: Vec2, t: number
): [Vec2, Vec2, Vec2, Vec2, Vec2, Vec2, Vec2] {
  const p01 = lerp(p0, p1, t);
  const p12 = lerp(p1, p2, t);
  const p23 = lerp(p2, p3, t);
  const p012 = lerp(p01, p12, t);
  const p123 = lerp(p12, p23, t);
  const p0123 = lerp(p012, p123, t);
  return [p0, p01, p012, p0123, p123, p23, p3];
}

function flatnessSq(p0: Vec2, p1: Vec2, p2: Vec2, p3: Vec2): number {
  const ux = 3 * p1.x - 2 * p0.x - p3.x;
  const uy = 3 * p1.y - 2 * p0.y - p3.y;
  const vx = 3 * p2.x - 2 * p3.x - p0.x;
  const vy = 3 * p2.y - 2 * p3.y - p0.y;
  return Math.max(ux * ux + uy * uy, vx * vx + vy * vy);
}

function subdivide(
  p0: Vec2, p1: Vec2, p2: Vec2, p3: Vec2,
  toleranceSq: number, out: Vec2[]
): void {
  if (flatnessSq(p0, p1, p2, p3) <= toleranceSq) {
    out.push(p3);
    return;
  }
  const [a0, a1, a2, mid, b1, b2, b3] = splitCubic(p0, p1, p2, p3, 0.5);
  subdivide(a0, a1, a2, mid, toleranceSq, out);
  subdivide(mid, b1, b2, b3, toleranceSq, out);
}

export function flattenCubicBezier(
  p0: Vec2, p1: Vec2, p2: Vec2, p3: Vec2,
  tolerance: number
): Vec2[] {
  const out: Vec2[] = [p0];
  subdivide(p0, p1, p2, p3, tolerance * tolerance, out);
  return out;
}

export function flattenCurvePath(
  anchors: { x: number; y: number; in: Vec2; out: Vec2 }[],
  closed: boolean,
  tolerance: number
): Vec2[] {
  if (anchors.length < 2) return anchors.map((a) => ({ x: a.x, y: a.y }));
  const pts: Vec2[] = [];
  const count = closed ? anchors.length : anchors.length - 1;
  for (let i = 0; i < count; i++) {
    const a = anchors[i];
    const b = anchors[(i + 1) % anchors.length];
    const p0: Vec2 = { x: a.x, y: a.y };
    const p1: Vec2 = { x: a.x + a.out.x, y: a.y + a.out.y };
    const p2: Vec2 = { x: b.x + b.in.x, y: b.y + b.in.y };
    const p3: Vec2 = { x: b.x, y: b.y };
    const seg = flattenCubicBezier(p0, p1, p2, p3, tolerance);
    if (i === 0) pts.push(seg[0]);
    for (let j = 1; j < seg.length; j++) pts.push(seg[j]);
  }
  return pts;
}
