import type { Vec2, MaskEditMode, ValidationResult } from '../types';

export function fillPath(
  points: Vec2[],
  fillRule: 'evenodd' | 'nonzero',
  mode: MaskEditMode,
  ctx: CanvasRenderingContext2D
): void {
  if (points.length < 3) return;
  ctx.save();
  ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = mode === 'add-black' ? '#000000' : '#ffffff';
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) ctx.lineTo(points[i].x, points[i].y);
  ctx.closePath();
  if (fillRule === 'evenodd') ctx.fill('evenodd');
  else ctx.fill('nonzero');
  ctx.restore();
}

export function validateMask(ctx: CanvasRenderingContext2D, width: number, height: number): ValidationResult {
  const data = ctx.getImageData(0, 0, width, height).data;
  let black = 0;
  const total = width * height;
  for (let i = 0; i < data.length; i += 4) {
    if ((data[i] + data[i + 1] + data[i + 2]) / 3 < 128) black++;
  }
  const openPercent = Math.round((black / total) * 100);
  const blockedPercent = 100 - openPercent;
  const warnings: string[] = [];
  if (openPercent === 0) warnings.push('Mask is entirely blocked (all white). No grout will show.');
  if (openPercent === 100) warnings.push('Mask is entirely open (all black). All grout will show.');
  if (openPercent < 5) warnings.push('Very little grout is open — result may appear mostly blocked.');
  if (openPercent > 95) warnings.push('Almost all grout is open — result may lack contrast.');
  return { openPercent, blockedPercent, warnings };
}
