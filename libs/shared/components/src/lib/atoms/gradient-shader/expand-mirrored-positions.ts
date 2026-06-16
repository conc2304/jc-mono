export interface PointerPosition {
  x: number;
  y: number;
}

export const MAX_POINTER_POINTS = 4;

/** Expand a base pointer into up to 4 additive mirror points (base + X + Y + XY). */
export function expandMirroredPositions(
  base: PointerPosition,
  width: number,
  height: number,
  mirrorX: boolean,
  mirrorY: boolean
): PointerPosition[] {
  const points: PointerPosition[] = [{ x: base.x, y: base.y }];

  if (mirrorX) {
    points.push({ x: width - base.x, y: base.y });
  }
  if (mirrorY) {
    points.push({ x: base.x, y: height - base.y });
  }
  if (mirrorX && mirrorY) {
    points.push({ x: width - base.x, y: height - base.y });
  }

  return points.slice(0, MAX_POINTER_POINTS);
}
