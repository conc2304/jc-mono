import type { Vec2, Rect } from '../types';

export function polygonDirtyRect(points: Vec2[], canvasW: number, canvasH: number, expand = 2): Rect {
  if (points.length === 0) return { x: 0, y: 0, width: canvasW, height: canvasH };
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const p of points) {
    if (p.x < minX) minX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.x > maxX) maxX = p.x;
    if (p.y > maxY) maxY = p.y;
  }
  const x = Math.max(0, Math.floor(minX) - expand);
  const y = Math.max(0, Math.floor(minY) - expand);
  const x2 = Math.min(canvasW, Math.ceil(maxX) + expand);
  const y2 = Math.min(canvasH, Math.ceil(maxY) + expand);
  return { x, y, width: x2 - x, height: y2 - y };
}
