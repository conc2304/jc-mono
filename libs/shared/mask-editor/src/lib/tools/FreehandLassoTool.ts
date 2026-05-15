import { v4 as uuidv4 } from 'uuid';
import { BaseTool } from './BaseTool';
import type { Vec2, MaskEditMode, CanvasViewport, Rect } from '../types';
import type { MaskHistory } from '../history/MaskHistory';
import { simplifyPath } from '../geometry/simplifyPath';
import { polygonDirtyRect } from '../geometry/polygonBounds';
import { fillPath } from '../geometry/fillPath';
import { distSq } from '../geometry/hitTest';

const MIN_POINT_SPACING_SQ = 3 * 3;
const SIMPLIFY_TOLERANCE = 1.5;
const MIN_PATH_POINTS = 3;

export class FreehandLassoTool extends BaseTool {
  private points: Vec2[] = [];
  private drawing = false;
  private _closed = false;

  override onPointerDown(_e: PointerEvent, maskPt: Vec2): void {
    this.points = [maskPt];
    this.drawing = true;
    this._closed = false;
  }

  override onPointerMove(_e: PointerEvent, maskPt: Vec2): void {
    if (!this.drawing || this.points.length === 0) return;
    const last = this.points[this.points.length - 1];
    if (distSq(maskPt, last) >= MIN_POINT_SPACING_SQ) {
      this.points.push(maskPt);
    }
  }

  override onPointerUp(_e: PointerEvent, _maskPt: Vec2): void {
    if (!this.drawing) return;
    this.drawing = false;
    this.points = simplifyPath(this.points, SIMPLIFY_TOLERANCE);
    if (this.points.length >= MIN_PATH_POINTS) this._closed = true;
    else this.points = [];
  }

  override onKeyDown(e: KeyboardEvent): void {
    if (e.key === 'Escape') this.cancel();
  }

  override renderPreview(ctx: CanvasRenderingContext2D, _viewport: CanvasViewport): void {
    if (this.points.length < 2) return;
    ctx.save();
    ctx.strokeStyle = '#00aaff';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([6, 3]);
    ctx.beginPath();
    ctx.moveTo(this.points[0].x, this.points[0].y);
    for (let i = 1; i < this.points.length; i++) ctx.lineTo(this.points[i].x, this.points[i].y);
    if (this._closed) ctx.closePath();
    ctx.stroke();
    ctx.restore();
  }

  override canCommit(): boolean { return this._closed && this.points.length >= MIN_PATH_POINTS; }

  override commit(maskCtx: CanvasRenderingContext2D, history: MaskHistory, mode: MaskEditMode): void {
    if (!this.canCommit()) return;
    const { width, height } = maskCtx.canvas;
    const dirty: Rect = polygonDirtyRect(this.points, width, height);
    const before = history.snapshot(maskCtx, dirty);
    fillPath(this.points, 'evenodd', mode, maskCtx);
    const after = history.snapshot(maskCtx, dirty);
    history.push(
      { id: uuidv4(), tool: 'lasso-freehand', mode, maskWidth: width, maskHeight: height, dirtyRect: dirty, createdAtMs: Date.now() },
      dirty, before, after
    );
    this.cancel();
  }

  override cancel(): void {
    this.points = [];
    this.drawing = false;
    this._closed = false;
  }
}
