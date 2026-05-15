import { BaseTool } from './BaseTool';
import type { Vec2, MaskEditMode, CanvasViewport } from '../types';
import type { MaskHistory } from '../history/MaskHistory';
import { polygonDirtyRect } from '../geometry/polygonBounds';

export type BrushToolOptions = {
  getMaskCtx: () => CanvasRenderingContext2D | null;
  getBrushSize: () => number;
  color: '#000000' | '#ffffff';
};

export class BrushTool extends BaseTool {
  private opts: BrushToolOptions;
  private painting = false;
  private beforeSnap: Uint8ClampedArray | null = null;
  private strokes: Vec2[] = [];
  protected lastMaskPt: Vec2 | null = null;

  constructor(opts: BrushToolOptions) {
    super();
    this.opts = opts;
  }

  onPointerDown(_e: PointerEvent, maskPt: Vec2): void {
    this.lastMaskPt = maskPt;
    const ctx = this.opts.getMaskCtx();
    if (!ctx || !ctx.canvas) return;
    const { width, height } = ctx.canvas;
    this.beforeSnap = ctx.getImageData(0, 0, width, height).data.slice() as Uint8ClampedArray;
    this.strokes = [maskPt];
    this.painting = true;
    this.paintAt(maskPt, ctx);
  }

  onPointerMove(_e: PointerEvent, maskPt: Vec2): void {
    this.lastMaskPt = maskPt;
    if (!this.painting) return;
    const ctx = this.opts.getMaskCtx();
    if (!ctx) return;
    this.strokes.push(maskPt);
    this.paintAt(maskPt, ctx);
  }

  onPointerUp(_e: PointerEvent, _maskPt: Vec2): void {
    if (!this.painting) return;
    this.painting = false;
    const ctx = this.opts.getMaskCtx();
    if (!ctx || !ctx.canvas || !this.beforeSnap) return;
    const { width, height } = ctx.canvas;
    const dirty = polygonDirtyRect(this.strokes, width, height, Math.ceil(this.opts.getBrushSize() / 2));
    const after = ctx.getImageData(dirty.x, dirty.y, dirty.width, dirty.height).data.slice() as Uint8ClampedArray;
    const beforeCropped = (() => {
      const tmp = document.createElement('canvas');
      tmp.width = width; tmp.height = height;
      const tctx = tmp.getContext('2d')!;
      tctx.putImageData(new ImageData(this.beforeSnap, width, height), 0, 0);
      return tctx.getImageData(dirty.x, dirty.y, dirty.width, dirty.height).data.slice() as Uint8ClampedArray;
    })();
    // history push is handled by useMaskEditor after this call via onStrokeEnd callback
    this._pendingDirty = dirty;
    this._pendingBefore = beforeCropped;
    this._pendingAfter = after;
    this.beforeSnap = null;
    this.strokes = [];
  }

  _pendingDirty: import('../types').Rect | null = null;
  _pendingBefore: Uint8ClampedArray | null = null;
  _pendingAfter: Uint8ClampedArray | null = null;

  private paintAt(maskPt: Vec2, ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = this.opts.color;
    ctx.beginPath();
    ctx.arc(maskPt.x, maskPt.y, this.opts.getBrushSize() / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  renderPreview(ctx: CanvasRenderingContext2D, viewport: CanvasViewport): void {
    if (!this.lastMaskPt) return;
    const r = this.opts.getBrushSize() / 2;
    const lw = Math.max(0.5, 1 / viewport.scale);
    ctx.save();
    ctx.beginPath();
    ctx.arc(this.lastMaskPt.x, this.lastMaskPt.y, r, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(0,0,0,0.5)';
    ctx.lineWidth = lw * 2.5;
    ctx.stroke();
    ctx.strokeStyle = 'rgba(255,255,255,0.9)';
    ctx.lineWidth = lw;
    ctx.stroke();
    ctx.restore();
  }
  canCommit(): boolean { return false; }
  commit(_maskCtx: CanvasRenderingContext2D, _history: MaskHistory, _mode: MaskEditMode): void {}
}
