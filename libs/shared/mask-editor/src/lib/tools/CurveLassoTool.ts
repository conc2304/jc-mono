import { v4 as uuidv4 } from 'uuid';
import { BaseTool } from './BaseTool';
import type { Vec2, MaskEditMode, CanvasViewport, CurveAnchor, Rect } from '../types';
import type { MaskHistory } from '../history/MaskHistory';
import { flattenCurvePath } from '../geometry/bezier';
import { polygonDirtyRect } from '../geometry/polygonBounds';
import { fillPath } from '../geometry/fillPath';
import { hitTestPoint } from '../geometry/hitTest';

const HANDLE_HIT_RADIUS = 8;
const ANCHOR_HIT_RADIUS = 8;
const CLOSE_SCREEN_PX = 16;
const FLATTEN_TOLERANCE = 0.75;

type DragTarget =
  | { type: 'anchor'; idx: number }
  | { type: 'in'; idx: number }
  | { type: 'out'; idx: number }
  | null;

export class CurveLassoTool extends BaseTool {
  viewportScale = 1;
  private anchors: CurveAnchor[] = [];
  private cursor: Vec2 | null = null;
  private closed = false;
  private editMode = false;
  private dragging: DragTarget = null;
  private dragStartPt: Vec2 | null = null;
  override onPointerDown(e: PointerEvent, maskPt: Vec2): void {
    if (this.editMode) {
      this.dragging = this.hitTest(maskPt);
      if (this.dragging) this.dragStartPt = maskPt;
      return;
    }
    if (this.closed) return;

    // Close path if near first anchor
    if (this.anchors.length >= 3 && hitTestPoint(maskPt, this.anchors[0], CLOSE_SCREEN_PX / this.viewportScale)) {
      this.closed = true;
      this.editMode = true;
      return;
    }

    // Start drag for this anchor's out-handle
    this.dragging = null;
    const anchor: CurveAnchor = { x: maskPt.x, y: maskPt.y, in: { x: 0, y: 0 }, out: { x: 0, y: 0 }, mode: 'corner' };
    this.anchors.push(anchor);
    this.dragging = { type: 'out', idx: this.anchors.length - 1 };
    this.dragStartPt = maskPt;
  }

  override onPointerMove(_e: PointerEvent, maskPt: Vec2): void {
    this.cursor = maskPt;
    if (!this.dragging || !this.dragStartPt) return;

    const dx = maskPt.x - this.dragStartPt.x;
    const dy = maskPt.y - this.dragStartPt.y;

    if (this.dragging.type === 'anchor') {
      const a = this.anchors[this.dragging.idx];
      a.x = maskPt.x; a.y = maskPt.y;
    } else if (this.dragging.type === 'out') {
      const a = this.anchors[this.dragging.idx];
      a.out = { x: dx, y: dy };
      if (a.mode === 'smooth' || a.mode === 'symmetric') {
        a.in = { x: -dx, y: -dy };
      }
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) a.mode = 'smooth';
    } else if (this.dragging.type === 'in') {
      const a = this.anchors[this.dragging.idx];
      a.in = { x: dx, y: dy };
      if (a.mode === 'smooth' || a.mode === 'symmetric') {
        a.out = { x: -dx, y: -dy };
      }
    }
  }

  override onPointerUp(_e: PointerEvent, _maskPt: Vec2): void {
    this.dragging = null;
    this.dragStartPt = null;
  }

  override onKeyDown(e: KeyboardEvent): void {
    if (e.key === 'Escape') { this.cancel(); return; }
    if ((e.key === 'Enter' || e.key === 'Return') && this.anchors.length >= 3) {
      if (!this.closed) { this.closed = true; this.editMode = true; }
      return;
    }
    if ((e.key === 'Backspace' || e.key === 'Delete') && this.anchors.length > 0) {
      this.anchors.pop();
    }
  }

  handleDoubleClick(_maskPt: Vec2): void {
    if (this.anchors.length >= 3 && !this.closed) {
      this.closed = true;
      this.editMode = true;
    }
  }

  private hitTest(maskPt: Vec2): DragTarget {
    for (let i = 0; i < this.anchors.length; i++) {
      const a = this.anchors[i];
      if (hitTestPoint(maskPt, a, ANCHOR_HIT_RADIUS)) return { type: 'anchor', idx: i };
      const outPt = { x: a.x + a.out.x, y: a.y + a.out.y };
      if (hitTestPoint(maskPt, outPt, HANDLE_HIT_RADIUS)) return { type: 'out', idx: i };
      const inPt = { x: a.x + a.in.x, y: a.y + a.in.y };
      if (hitTestPoint(maskPt, inPt, HANDLE_HIT_RADIUS)) return { type: 'in', idx: i };
    }
    return null;
  }

  override renderPreview(ctx: CanvasRenderingContext2D, _viewport: CanvasViewport): void {
    if (this.anchors.length === 0) return;
    ctx.save();
    ctx.strokeStyle = '#aa44ff';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([6, 3]);
    ctx.fillStyle = 'rgba(170,68,255,0.12)';

    // Draw curve path
    ctx.beginPath();
    const drawAnchors = [...this.anchors];
    if (!this.closed && this.cursor) {
      // Preview next segment to cursor
      const last = drawAnchors[drawAnchors.length - 1];
      drawAnchors.push({ x: this.cursor.x, y: this.cursor.y, in: { x: 0, y: 0 }, out: { x: 0, y: 0 }, mode: 'corner' });
      void last;
    }
    if (drawAnchors.length >= 2) {
      const pts = flattenCurvePath(drawAnchors, this.closed, FLATTEN_TOLERANCE);
      if (pts.length > 0) {
        ctx.moveTo(pts[0].x, pts[0].y);
        for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
        if (this.closed) ctx.closePath();
      }
    }
    ctx.stroke();
    if (this.closed) ctx.fill('evenodd');

    // Draw handles in edit mode
    if (this.editMode || this.anchors.length > 0) {
      ctx.setLineDash([]);
      for (const a of this.anchors) {
        const outPt = { x: a.x + a.out.x, y: a.y + a.out.y };
        const inPt = { x: a.x + a.in.x, y: a.y + a.in.y };

        ctx.strokeStyle = 'rgba(170,68,255,0.6)';
        ctx.lineWidth = 1;
        if (a.out.x !== 0 || a.out.y !== 0) {
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(outPt.x, outPt.y); ctx.stroke();
          ctx.fillStyle = '#aa44ff';
          ctx.beginPath(); ctx.arc(outPt.x, outPt.y, 4, 0, Math.PI * 2); ctx.fill();
        }
        if (a.in.x !== 0 || a.in.y !== 0) {
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(inPt.x, inPt.y); ctx.stroke();
          ctx.fillStyle = '#ffffff';
          ctx.strokeStyle = '#aa44ff';
          ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.arc(inPt.x, inPt.y, 4, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        }

        // Anchor dot
        ctx.fillStyle = '#aa44ff';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(a.x, a.y, 5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      }
    }

    ctx.restore();
  }

  override canCommit(): boolean { return this.closed && this.anchors.length >= 3; }

  override commit(maskCtx: CanvasRenderingContext2D, history: MaskHistory, mode: MaskEditMode): void {
    if (!this.canCommit()) return;
    const pts = flattenCurvePath(this.anchors, true, FLATTEN_TOLERANCE);
    const { width, height } = maskCtx.canvas;
    const dirty: Rect = polygonDirtyRect(pts, width, height);
    const before = history.snapshot(maskCtx, dirty);
    fillPath(pts, 'evenodd', mode, maskCtx);
    const after = history.snapshot(maskCtx, dirty);
    history.push(
      { id: uuidv4(), tool: 'lasso-curve', mode, maskWidth: width, maskHeight: height, dirtyRect: dirty, createdAtMs: Date.now() },
      dirty, before, after
    );
    this.cancel();
  }

  override cancel(): void {
    this.anchors = [];
    this.cursor = null;
    this.closed = false;
    this.editMode = false;
    this.dragging = null;
  }
}
