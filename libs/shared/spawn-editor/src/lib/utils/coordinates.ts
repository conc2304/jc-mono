export const SIM_W = 640;
export const SIM_H = 360;

export function maskToSim(mx: number, my: number, maskW: number, maskH: number) {
  return {
    x: (mx / maskW) * SIM_W,
    y: (my / maskH) * SIM_H,
  };
}

export function simToMask(sx: number, sy: number, maskW: number, maskH: number) {
  return {
    x: (sx / SIM_W) * maskW,
    y: (sy / SIM_H) * maskH,
  };
}

export function regionToMask(
  region: { x: number; y: number; width: number; height: number },
  maskW: number,
  maskH: number,
) {
  return {
    x: (region.x / SIM_W) * maskW,
    y: (region.y / SIM_H) * maskH,
    width: (region.width / SIM_W) * maskW,
    height: (region.height / SIM_H) * maskH,
  };
}

export function rectMaskToSim(
  mx: number, my: number, mw: number, mh: number,
  maskW: number, maskH: number,
) {
  return {
    x: (mx / maskW) * SIM_W,
    y: (my / maskH) * SIM_H,
    width: (mw / maskW) * SIM_W,
    height: (mh / maskH) * SIM_H,
  };
}

export function clamp(val: number, min: number, max: number) {
  return Math.min(Math.max(val, min), max);
}
