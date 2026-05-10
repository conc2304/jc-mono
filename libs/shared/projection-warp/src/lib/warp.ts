import type { NormalizedPoint, ProjectionCorners } from '@jc/of-control-protocol';

// index 0=topLeft, 1=topRight, 2=bottomRight, 3=bottomLeft
export type CornerKey = 0 | 1 | 2 | 3;

export type PixelCorners = [
  { x: number; y: number },
  { x: number; y: number },
  { x: number; y: number },
  { x: number; y: number },
];

export function normalizedToPixel(p: NormalizedPoint, width: number, height: number): { x: number; y: number } {
  return { x: p.x * width, y: p.y * height };
}

export function pixelToNormalized(x: number, y: number, width: number, height: number): NormalizedPoint {
  return { x: x / width, y: y / height };
}

export function cornersToPixel(corners: ProjectionCorners, width: number, height: number): PixelCorners {
  return [
    normalizedToPixel(corners[0], width, height),
    normalizedToPixel(corners[1], width, height),
    normalizedToPixel(corners[2], width, height),
    normalizedToPixel(corners[3], width, height),
  ];
}

export function defaultCorners(): ProjectionCorners {
  return [
    { x: 0.0, y: 0.0 },
    { x: 1.0, y: 0.0 },
    { x: 1.0, y: 1.0 },
    { x: 0.0, y: 1.0 },
  ];
}

export function nudgeCorner(
  corners: ProjectionCorners,
  corner: CornerKey,
  dx: number,
  dy: number
): ProjectionCorners {
  const c = corners[corner];
  const updated: ProjectionCorners = [...corners] as unknown as ProjectionCorners;
  updated[corner] = {
    x: Math.max(0, Math.min(1, c.x + dx)),
    y: Math.max(0, Math.min(1, c.y + dy)),
  };
  return updated;
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
  ctx.moveTo(px[0].x, px[0].y);
  ctx.lineTo(px[1].x, px[1].y);
  ctx.lineTo(px[2].x, px[2].y);
  ctx.lineTo(px[3].x, px[3].y);
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
  for (let i = 0; i < 4; i++) {
    const key = i as CornerKey;
    const pt = px[key];
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
  for (let i = 0; i < 4; i++) {
    const pt = px[i as CornerKey];
    const dist = Math.hypot(pt.x - mouseX, pt.y - mouseY);
    if (dist <= hitRadius) return i as CornerKey;
  }
  return null;
}
