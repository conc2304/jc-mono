import { MutableRefObject, useCallback, useEffect, useRef } from 'react';

import {
  expandMirroredPositions,
  MAX_POINTER_POINTS,
  PointerPosition,
} from './expand-mirrored-positions';

export type PointerPattern = 'perlin' | 'dvd-bounce';

export interface UseSyntheticPointerOptions {
  width: number;
  height: number;
  pattern: PointerPattern;
  mirrorX: boolean;
  mirrorY: boolean;
  enabled: boolean;
  /** Live speed multiplier (default 1). Use a ref so sliders update without restarting. */
  speedRef?: MutableRefObject<number>;
}

const OFFSCREEN: PointerPosition = { x: -1000, y: -1000 };

const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const hash = (n: number) => {
  const s = Math.sin(n) * 43758.5453;
  return s - Math.floor(s);
};

const noise2D = (x: number, y: number) => {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;
  const u = fade(xf);
  const v = fade(yf);
  const aa = hash(xi + yi * 57);
  const ab = hash(xi + (yi + 1) * 57);
  const ba = hash(xi + 1 + yi * 57);
  const bb = hash(xi + 1 + (yi + 1) * 57);
  return lerp(lerp(aa, ba, u), lerp(ab, bb, u), v);
};

export function useSyntheticPointer({
  width,
  height,
  pattern,
  mirrorX,
  mirrorY,
  enabled,
  speedRef,
}: UseSyntheticPointerOptions) {
  const positionsRef = useRef<PointerPosition[]>([OFFSCREEN]);
  const baseRef = useRef<PointerPosition>({ x: width * 0.5, y: height * 0.5 });
  const dvdVelocityRef = useRef({ x: 120, y: 90 });
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  const updatePositions = useCallback(() => {
    positionsRef.current = expandMirroredPositions(
      baseRef.current,
      width,
      height,
      mirrorX,
      mirrorY
    );
  }, [width, height, mirrorX, mirrorY]);

  useEffect(() => {
    if (!enabled || width <= 0 || height <= 0) {
      positionsRef.current = [OFFSCREEN];
      return;
    }

    baseRef.current = { x: width * 0.5, y: height * 0.5 };
    dvdVelocityRef.current = {
      x: (Math.random() > 0.5 ? 1 : -1) * 120,
      y: (Math.random() > 0.5 ? 1 : -1) * 90,
    };
    lastTimeRef.current = null;
    updatePositions();

    const tick = (time: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = time;
      }
      const dt = Math.min((time - lastTimeRef.current) / 1000, 0.05);
      lastTimeRef.current = time;
      const speed = speedRef?.current ?? 1;

      if (pattern === 'dvd-bounce') {
        const vel = dvdVelocityRef.current;
        let { x, y } = baseRef.current;
        x += vel.x * dt * speed;
        y += vel.y * dt * speed;

        if (x <= 0) {
          x = 0;
          vel.x = Math.abs(vel.x);
        } else if (x >= width) {
          x = width;
          vel.x = -Math.abs(vel.x);
        }
        if (y <= 0) {
          y = 0;
          vel.y = Math.abs(vel.y);
        } else if (y >= height) {
          y = height;
          vel.y = -Math.abs(vel.y);
        }

        baseRef.current = { x, y };
      } else {
        const t = time * 0.00025 * speed;
        const targetX = noise2D(t, 1.7) * width;
        const targetY = noise2D(2.3, t) * height;
        const smooth = 1 - Math.pow(0.001, dt * speed);
        baseRef.current = {
          x: lerp(baseRef.current.x, targetX, smooth),
          y: lerp(baseRef.current.y, targetY, smooth),
        };
      }

      updatePositions();
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
      positionsRef.current = [OFFSCREEN];
    };
  }, [enabled, width, height, pattern, updatePositions]);

  return { positionsRef, maxPoints: MAX_POINTER_POINTS };
}
