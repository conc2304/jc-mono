import type { SpawnRegion, SpawnInteraction, HandleId } from '../models/types';
import { regionToMask } from '../utils/coordinates';

const HANDLE_SCREEN_PX = 8;

interface RenderParams {
  ctx: CanvasRenderingContext2D;
  maskW: number;
  maskH: number;
  regions: SpawnRegion[];
  selectedRegionId: string | null;
  interaction: SpawnInteraction;
  viewportScale: number;
}

function cornerHandles(rx: number, ry: number, rw: number, rh: number): Array<{ id: HandleId; x: number; y: number }> {
  return [
    { id: 'nw', x: rx, y: ry },
    { id: 'ne', x: rx + rw, y: ry },
    { id: 'se', x: rx + rw, y: ry + rh },
    { id: 'sw', x: rx, y: ry + rh },
  ];
}

export function renderSpawnOverlay(params: RenderParams): void {
  const { ctx, maskW, maskH, regions, selectedRegionId, interaction, viewportScale } = params;

  ctx.clearRect(0, 0, maskW, maskH);

  const ls = 1 / viewportScale; // line scale: 1 screen pixel in mask space
  const hs = HANDLE_SCREEN_PX / viewportScale; // handle size in mask space

  for (const region of regions) {
    const { x: rx, y: ry, width: rw, height: rh } = regionToMask(region, maskW, maskH);
    const isSelected = region.id === selectedRegionId;
    const enabled = region.enabled;

    ctx.save();

    // Fill
    ctx.fillStyle = enabled ? 'rgba(255, 120, 0, 0.18)' : 'rgba(140, 140, 140, 0.1)';
    ctx.fillRect(rx, ry, rw, rh);

    // Border
    ctx.strokeStyle = isSelected
      ? '#ff8c00'
      : enabled ? 'rgba(255, 140, 0, 0.8)' : 'rgba(180, 180, 180, 0.5)';
    ctx.lineWidth = isSelected ? 2 * ls : 1.5 * ls;
    if (!enabled) ctx.setLineDash([5 * ls, 5 * ls]);
    ctx.strokeRect(rx, ry, rw, rh);
    ctx.setLineDash([]);

    // "OFF" label for disabled regions
    if (!enabled && rw > 24 * ls && rh > 16 * ls) {
      ctx.fillStyle = 'rgba(180, 180, 180, 0.7)';
      ctx.font = `${Math.max(9 * ls, 0.5)}px sans-serif`;
      ctx.fillText('OFF', rx + 4 * ls, ry + 13 * ls);
    }

    // Corner handles for selected region
    if (isSelected) {
      for (const { x: hx, y: hy } of cornerHandles(rx, ry, rw, rh)) {
        ctx.fillStyle = '#ff8c00';
        ctx.fillRect(hx - hs / 2, hy - hs / 2, hs, hs);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = ls;
        ctx.strokeRect(hx - hs / 2, hy - hs / 2, hs, hs);
      }
    }

    ctx.restore();
  }

  // Draft rectangle during drawing
  if (interaction.kind === 'drawing') {
    const x = Math.min(interaction.startMx, interaction.curMx);
    const y = Math.min(interaction.startMy, interaction.curMy);
    const w = Math.abs(interaction.curMx - interaction.startMx);
    const h = Math.abs(interaction.curMy - interaction.startMy);

    ctx.save();
    ctx.fillStyle = 'rgba(255, 180, 0, 0.1)';
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = 'rgba(255, 200, 0, 0.9)';
    ctx.lineWidth = 1.5 * ls;
    ctx.setLineDash([5 * ls, 4 * ls]);
    ctx.strokeRect(x, y, w, h);
    ctx.setLineDash([]);
    ctx.restore();
  }
}

export function hitTestSpawnRegions(
  mx: number,
  my: number,
  regions: SpawnRegion[],
  maskW: number,
  maskH: number,
  viewportScale: number,
  selectedRegionId: string | null,
): { regionId: string | null; handle: HandleId | null } {
  const tol = HANDLE_SCREEN_PX / viewportScale;

  // Check handles of selected region first
  if (selectedRegionId) {
    const sel = regions.find(r => r.id === selectedRegionId);
    if (sel) {
      const { x: rx, y: ry, width: rw, height: rh } = regionToMask(sel, maskW, maskH);
      for (const { id, x: hx, y: hy } of cornerHandles(rx, ry, rw, rh)) {
        if (Math.abs(mx - hx) <= tol && Math.abs(my - hy) <= tol) {
          return { regionId: selectedRegionId, handle: id };
        }
      }
    }
  }

  // Check region bodies, topmost first (reverse order)
  for (let i = regions.length - 1; i >= 0; i--) {
    const region = regions[i];
    const { x: rx, y: ry, width: rw, height: rh } = regionToMask(region, maskW, maskH);
    if (mx >= rx && mx <= rx + rw && my >= ry && my <= ry + rh) {
      return { regionId: region.id, handle: null };
    }
  }

  return { regionId: null, handle: null };
}
