import type { Vec2, MaskEditMode, CanvasViewport } from '../types';
import type { MaskHistory } from '../history/MaskHistory';

export abstract class BaseTool {
  abstract onPointerDown(e: PointerEvent, maskPt: Vec2): void;
  abstract onPointerMove(e: PointerEvent, maskPt: Vec2): void;
  abstract onPointerUp(e: PointerEvent, maskPt: Vec2): void;
  onKeyDown(_e: KeyboardEvent): void {}
  abstract renderPreview(ctx: CanvasRenderingContext2D, viewport: CanvasViewport): void;
  abstract canCommit(): boolean;
  abstract commit(
    maskCtx: CanvasRenderingContext2D,
    history: MaskHistory,
    mode: MaskEditMode
  ): void;
  cancel(): void {}
  dispose(): void {}
}
