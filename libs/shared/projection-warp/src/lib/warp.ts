import type { NormalizedPoint, ProjectionCorners } from '@jc/of-control-protocol';

export interface PixelCorners {
  topLeft: { x: number; y: number };
  topRight: { x: number; y: number };
  bottomRight: { x: number; y: number };
  bottomLeft: { x: number; y: number };
}

export function normalizedToPixel(p: NormalizedPoint, width: number, height: number): { x: number; y: number } {
  return { x: p.x * width, y: p.y * height };
}

export function pixelToNormalized(x: number, y: number, width: number, height: number): NormalizedPoint {
  return { x: x / width, y: y / height };
}

export function cornersToPixel(corners: ProjectionCorners, width: number, height: number): PixelCorners {
  return {
    topLeft:     normalizedToPixel(corners.topLeft,     width, height),
    topRight:    normalizedToPixel(corners.topRight,    width, height),
    bottomRight: normalizedToPixel(corners.bottomRight, width, height),
    bottomLeft:  normalizedToPixel(corners.bottomLeft,  width, height),
  };
}

export function defaultCorners(): ProjectionCorners {
  return {
    topLeft:     { x: 0.0, y: 0.0 },
    topRight:    { x: 1.0, y: 0.0 },
    bottomRight: { x: 1.0, y: 1.0 },
    bottomLeft:  { x: 0.0, y: 1.0 },
  };
}

export type CornerKey = 'topLeft' | 'topRight' | 'bottomRight' | 'bottomLeft';

export function nudgeCorner(
  corners: ProjectionCorners,
  corner: CornerKey,
  dx: number,
  dy: number
): ProjectionCorners {
  const c = corners[corner];
  return {
    ...corners,
    [corner]: {
      x: Math.max(0, Math.min(1, c.x + dx)),
      y: Math.max(0, Math.min(1, c.y + dy)),
    },
  };
}

export function drawWarpedOutline(
  ctx: CanvasRenderingContext2D,
  corners: ProjectionCorners,
  width: number,
  height: number,
  color = 'rgba(255,107,53,0.8)',
  lineWidth = 2
): void {
  const px = cornersToPixel(corners, width, height);
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.setLineDash([6, 4]);
  ctx.beginPath();
  ctx.moveTo(px.topLeft.x, px.topLeft.y);
  ctx.lineTo(px.topRight.x, px.topRight.y);
  ctx.lineTo(px.bottomRight.x, px.bottomRight.y);
  ctx.lineTo(px.bottomLeft.x, px.bottomLeft.y);
  ctx.closePath();
  ctx.stroke();
  ctx.restore();
}

export function drawCornerHandles(
  ctx: CanvasRenderingContext2D,
  corners: ProjectionCorners,
  width: number,
  height: number,
  selectedCorner: CornerKey | null,
  radius = 10
): void {
  const px = cornersToPixel(corners, width, height);
  const entries = Object.entries(px) as Array<[CornerKey, { x: number; y: number }]>;

  for (const [key, pt] of entries) {
    const isSelected = key === selectedCorner;
    ctx.save();
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, radius, 0, Math.PI * 2);
    ctx.fillStyle = isSelected ? '#ff6b35' : 'rgba(255,255,255,0.8)';
    ctx.fill();
    ctx.strokeStyle = isSelected ? '#ffffff' : '#ff6b35';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
  }
}

export function hitTestCorner(
  corners: ProjectionCorners,
  width: number,
  height: number,
  mouseX: number,
  mouseY: number,
  hitRadius = 18
): CornerKey | null {
  const px = cornersToPixel(corners, width, height);
  const entries = Object.entries(px) as Array<[CornerKey, { x: number; y: number }]>;
  for (const [key, pt] of entries) {
    const dist = Math.hypot(pt.x - mouseX, pt.y - mouseY);
    if (dist <= hitRadius) return key;
  }
  return null;
}
