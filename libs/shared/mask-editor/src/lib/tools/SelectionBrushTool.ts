import { v4 as uuidv4 } from 'uuid';
import { BaseTool } from './BaseTool';
import type { Vec2, MaskEditMode, CanvasViewport, Rect } from '../types';
import type { MaskHistory } from '../history/MaskHistory';
import { polygonDirtyRect } from '../geometry/polygonBounds';

const COMMIT_THRESHOLD = 0.5;

export type SelectionBrushOptions = {
  getBrushSize: () => number;
};

export class SelectionBrushTool extends BaseTool {
  private opts: SelectionBrushOptions;
  private selCanvas: OffscreenCanvas | HTMLCanvasElement | null = null;
  private selCtx: OffscreenCanvasRenderingContext2D | CanvasRenderingContext2D | null = null;
  private strokes: Vec2[] = [];
  private painting = false;
  private erasing = false;
  private maskW = 0;
  private maskH = 0;

  constructor(opts: SelectionBrushOptions) {
    super();
    this.opts = opts;
  }

  private ensureSelectionCanvas(w: number, h: number): void {
    if (this.selCanvas && this.maskW === w && this.maskH === h) return;
    this.maskW = w;
    this.maskH = h;
    if (typeof OffscreenCanvas !== 'undefined') {
      this.selCanvas = new OffscreenCanvas(w, h);
      this.selCtx = this.selCanvas.getContext('2d') as OffscreenCanvasRenderingContext2D;
    } else {
      const c = document.createElement('canvas');
      c.width = w; c.height = h;
      this.selCanvas = c;
      this.selCtx = c.getContext('2d')!;
    }
  }

  override onPointerDown(e: PointerEvent, maskPt: Vec2): void {
    this.erasing = e.altKey;
    this.strokes = [maskPt];
    this.painting = true;
    this.paintSelection(maskPt);
  }

  override onPointerMove(_e: PointerEvent, maskPt: Vec2): void {
    if (!this.painting) return;
    this.strokes.push(maskPt);
    this.paintSelection(maskPt);
  }

  override onPointerUp(_e: PointerEvent, _maskPt: Vec2): void {
    this.painting = false;
  }

  override onKeyDown(e: KeyboardEvent): void {
    if (e.key === 'Escape') this.cancel();
  }

  private paintSelection(pt: Vec2): void {
    if (!this.selCtx) return;
    const ctx = this.selCtx as CanvasRenderingContext2D;
    ctx.save();
    ctx.globalCompositeOperation = this.erasing ? 'destination-out' : 'source-over';
    ctx.fillStyle = this.erasing ? 'rgba(0,0,0,1)' : 'rgba(255,255,255,1)';
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, this.opts.getBrushSize() / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  override renderPreview(ctx: CanvasRenderingContext2D, _viewport: CanvasViewport): void {
    if (!this.selCanvas || this.strokes.length === 0) return;
    ctx.save();
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = '#00aaff';
    // Draw selection brush overlay
    const sCtx = this.selCtx as CanvasRenderingContext2D;
    const w = this.maskW || ctx.canvas.width;
    const h = this.maskH || ctx.canvas.height;
    const imgData = sCtx.getImageData(0, 0, w, h);
    for (let i = 0; i < imgData.data.length; i += 4) {
      const alpha = imgData.data[i + 3] / 255;
      if (alpha >= COMMIT_THRESHOLD) {
        imgData.data[i] = 0;
        imgData.data[i + 1] = 170;
        imgData.data[i + 2] = 255;
        imgData.data[i + 3] = 128;
      } else {
        imgData.data[i + 3] = 0;
      }
    }
    ctx.putImageData(imgData, 0, 0);
    ctx.restore();
  }

  initForMask(maskCtx: CanvasRenderingContext2D): void {
    this.ensureSelectionCanvas(maskCtx.canvas.width, maskCtx.canvas.height);
  }

  override canCommit(): boolean { return this.strokes.length > 0; }

  override commit(maskCtx: CanvasRenderingContext2D, history: MaskHistory, mode: MaskEditMode): void {
    if (!this.canCommit() || !this.selCtx) return;
    const { width, height } = maskCtx.canvas;
    const dirty: Rect = polygonDirtyRect(this.strokes, width, height, Math.ceil(this.opts.getBrushSize() / 2));
    const before = history.snapshot(maskCtx, dirty);

    const sCtx = this.selCtx as CanvasRenderingContext2D;
    const selData = sCtx.getImageData(0, 0, width, height);
    const maskData = maskCtx.getImageData(0, 0, width, height);
    const target = mode === 'add-black' ? 0 : 255;

    for (let i = 0; i < selData.data.length; i += 4) {
      const alpha = selData.data[i + 3] / 255;
      if (alpha >= COMMIT_THRESHOLD) {
        maskData.data[i] = target;
        maskData.data[i + 1] = target;
        maskData.data[i + 2] = target;
        maskData.data[i + 3] = 255;
      }
    }
    maskCtx.putImageData(maskData, 0, 0);

    const after = history.snapshot(maskCtx, dirty);
    history.push(
      { id: uuidv4(), tool: 'selection-brush', mode, maskWidth: width, maskHeight: height, dirtyRect: dirty, createdAtMs: Date.now() },
      dirty, before, after
    );
    this.cancel();
  }

  override cancel(): void {
    if (this.selCtx) {
      const ctx = this.selCtx as CanvasRenderingContext2D;
      ctx.clearRect(0, 0, this.maskW, this.maskH);
    }
    this.strokes = [];
    this.painting = false;
  }
}
