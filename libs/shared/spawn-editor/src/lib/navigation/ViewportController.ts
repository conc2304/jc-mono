import type { CanvasViewport, Vec2 } from './types';

const DEFAULT_VIEWPORT: CanvasViewport = {
  scale: 1,
  offsetX: 0,
  offsetY: 0,
  minScale: 0.1,
  maxScale: 32,
  fitScale: 1,
  marginPx: 64,
};

export class ViewportController {
  private vp: CanvasViewport = { ...DEFAULT_VIEWPORT };
  onUpdate?: () => void;

  get viewport(): Readonly<CanvasViewport> { return this.vp; }

  screenToMask(sx: number, sy: number): Vec2 {
    return {
      x: (sx - this.vp.offsetX) / this.vp.scale,
      y: (sy - this.vp.offsetY) / this.vp.scale,
    };
  }

  maskToScreen(mx: number, my: number): Vec2 {
    return {
      x: mx * this.vp.scale + this.vp.offsetX,
      y: my * this.vp.scale + this.vp.offsetY,
    };
  }

  applyZoomAtScreenPoint(sx: number, sy: number, nextScale: number): void {
    const clamped = Math.min(Math.max(nextScale, this.vp.minScale), this.vp.maxScale);
    const maskPt = this.screenToMask(sx, sy);
    this.vp.scale = clamped;
    this.vp.offsetX = sx - maskPt.x * clamped;
    this.vp.offsetY = sy - maskPt.y * clamped;
    this.clampViewport();
    this.onUpdate?.();
  }

  panViewport(dx: number, dy: number): void {
    this.vp.offsetX += dx;
    this.vp.offsetY += dy;
    this.clampViewport();
    this.onUpdate?.();
  }

  fitViewportToCanvas(containerW: number, containerH: number, maskW: number, maskH: number): void {
    const scaleX = containerW / maskW;
    const scaleY = containerH / maskH;
    const fit = Math.min(scaleX, scaleY);
    this.vp.fitScale = fit;
    this.vp.minScale = Math.min(fit, DEFAULT_VIEWPORT.minScale);
    this.vp.scale = fit;
    this.vp.offsetX = (containerW - maskW * fit) / 2;
    this.vp.offsetY = (containerH - maskH * fit) / 2;
    this.onUpdate?.();
  }

  setActualSize(containerW: number, containerH: number, maskW: number, maskH: number): void {
    this.vp.scale = 1;
    this.vp.offsetX = (containerW - maskW) / 2;
    this.vp.offsetY = (containerH - maskH) / 2;
    this.clampViewport();
    this.onUpdate?.();
  }

  resetViewport(containerW: number, containerH: number, maskW: number, maskH: number): void {
    this.fitViewportToCanvas(containerW, containerH, maskW, maskH);
  }

  zoomStep(factor: number, containerW: number, containerH: number): void {
    const cx = containerW / 2;
    const cy = containerH / 2;
    this.applyZoomAtScreenPoint(cx, cy, this.vp.scale * factor);
  }

  clampViewport(): void {
    // Prevent mask from going fully offscreen; always keep marginPx visible
    // (no-op clamping here — just ensure scale stays in range)
    this.vp.scale = Math.min(Math.max(this.vp.scale, this.vp.minScale), this.vp.maxScale);
  }

  getTransformCSS(): string {
    return `translate(${this.vp.offsetX}px, ${this.vp.offsetY}px) scale(${this.vp.scale})`;
  }

  getZoomPercent(): number {
    return Math.round(this.vp.scale * 100);
  }
}
