import { v4 as uuidv4 } from 'uuid';
import { BaseTool } from './BaseTool';
import type { Vec2, MaskEditMode, CanvasViewport, Rect } from '../types';
import type { MaskHistory } from '../history/MaskHistory';
import { polygonDirtyRect } from '../geometry/polygonBounds';
import { fillPath } from '../geometry/fillPath';
import { hitTestPoint, distSq } from '../geometry/hitTest';

/** Fixed screen-pixel close radius — scales inversely with zoom so it's always easy to hit */
const CLOSE_SCREEN_PX = 16;
const MIN_ANCHOR_DIST_SQ = 3 * 3;
const CONSTRAINED_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];

function snapAngle(from: Vec2, to: Vec2): Vec2 {
  const angle = Math.atan2(to.y - from.y, to.x - from.x) * (180 / Math.PI);
  const dist = Math.hypot(to.x - from.x, to.y - from.y);
  const nearest = CONSTRAINED_ANGLES.reduce((a, b) => Math.abs(b - angle) < Math.abs(a - angle) ? b : a);
  const rad = nearest * (Math.PI / 180);
  return { x: from.x + dist * Math.cos(rad), y: from.y + dist * Math.sin(rad) };
}

export class PolygonLassoTool extends BaseTool {
  private anchors: Vec2[] = [];
  private cursor: Vec2 | null = null;
  private closed = false;
  /** Updated by useMaskEditor before each pointer event so close radius scales with zoom */
  viewportScale = 1;

  private closeRadiusMask(): number {
    // Convert fixed screen-px close radius to mask pixels (larger radius when zoomed out)
    return CLOSE_SCREEN_PX / this.viewportScale;
  }

  override onPointerDown(e: PointerEvent, maskPt: Vec2): void {
    if (this.closed) return;

    let pt = e.shiftKey && this.anchors.length > 0
      ? snapAngle(this.anchors[this.anchors.length - 1], maskPt)
      : maskPt;

    // Close if clicking near first anchor
    if (this.anchors.length >= 3 && hitTestPoint(maskPt, this.anchors[0], this.closeRadiusMask())) {
      this.closed = true;
      return;
    }

    // Ignore duplicate clicks
    if (this.anchors.length > 0 && distSq(pt, this.anchors[this.anchors.length - 1]) < MIN_ANCHOR_DIST_SQ) return;

    this.anchors.push(pt);
  }

  override onPointerMove(e: PointerEvent, maskPt: Vec2): void {
    if (this.closed) return;
    this.cursor = e.shiftKey && this.anchors.length > 0
      ? snapAngle(this.anchors[this.anchors.length - 1], maskPt)
      : maskPt;
  }

  override onPointerUp(_e: PointerEvent, _maskPt: Vec2): void {}

  override onKeyDown(e: KeyboardEvent): void {
    if (e.key === 'Escape') { this.cancel(); return; }
    if ((e.key === 'Enter' || e.key === 'Return') && this.anchors.length >= 3) {
      this.closed = true;
      return;
    }
    if (e.key === 'Backspace' || e.key === 'Delete') {
      this.anchors.pop();
      return;
    }
  }

  handleDoubleClick(_maskPt: Vec2): void {
    if (this.anchors.length >= 3) this.closed = true;
  }

  override renderPreview(ctx: CanvasRenderingContext2D, _viewport: CanvasViewport): void {
    if (this.anchors.length === 0) return;
    ctx.save();
    ctx.strokeStyle = '#ff9900';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([6, 3]);
    ctx.fillStyle = 'rgba(255,153,0,0.15)';

    ctx.beginPath();
    ctx.moveTo(this.anchors[0].x, this.anchors[0].y);
    for (let i = 1; i < this.anchors.length; i++) ctx.lineTo(this.anchors[i].x, this.anchors[i].y);
    if (this.cursor && !this.closed) ctx.lineTo(this.cursor.x, this.cursor.y);
    if (this.closed) ctx.closePath();
    ctx.stroke();
    if (this.closed) ctx.fill('evenodd');

    // Anchor dots
    ctx.setLineDash([]);
    ctx.fillStyle = '#ff9900';
    for (const a of this.anchors) {
      ctx.beginPath();
      ctx.arc(a.x, a.y, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    // Close-snap highlight
    const closeR = this.closeRadiusMask();
    if (this.anchors.length >= 3 && this.cursor && hitTestPoint(this.cursor, this.anchors[0], closeR)) {
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(this.anchors[0].x, this.anchors[0].y, closeR, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.restore();
  }

  override canCommit(): boolean { return this.closed && this.anchors.length >= 3; }

  override commit(maskCtx: CanvasRenderingContext2D, history: MaskHistory, mode: MaskEditMode): void {
    if (!this.canCommit()) return;
    const { width, height } = maskCtx.canvas;
    const dirty: Rect = polygonDirtyRect(this.anchors, width, height);
    const before = history.snapshot(maskCtx, dirty);
    fillPath(this.anchors, 'evenodd', mode, maskCtx);
    const after = history.snapshot(maskCtx, dirty);
    history.push(
      { id: uuidv4(), tool: 'lasso-polygon', mode, maskWidth: width, maskHeight: height, dirtyRect: dirty, createdAtMs: Date.now() },
      dirty, before, after
    );
    this.cancel();
  }

  override cancel(): void {
    this.anchors = [];
    this.cursor = null;
    this.closed = false;
  }
}
