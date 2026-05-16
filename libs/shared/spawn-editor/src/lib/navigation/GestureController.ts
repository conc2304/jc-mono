import type { CanvasInteractionMode } from './types';
import type { ViewportController } from './ViewportController';

export type GestureControllerOptions = {
  viewport: ViewportController;
  onInteractionModeChange: (mode: CanvasInteractionMode) => void;
  zoomStep?: number;
};

export class GestureController {
  private viewport: ViewportController;
  private onModeChange: (mode: CanvasInteractionMode) => void;
  private zoomStep: number;
  private spaceHeld = false;
  private middleDown = false;
  private lastPanPos: { x: number; y: number } | null = null;
  private activePointers = new Map<number, PointerEvent>();
  private lastPinchDist = 0;
  private lastPinchCenter: { x: number; y: number } = { x: 0, y: 0 };
  private keydownHandler: (e: KeyboardEvent) => void;
  private keyupHandler: (e: KeyboardEvent) => void;

  constructor(options: GestureControllerOptions) {
    this.viewport = options.viewport;
    this.onModeChange = options.onInteractionModeChange;
    this.zoomStep = options.zoomStep ?? 1.25;
    this.keydownHandler = this.handleKeyDown.bind(this);
    this.keyupHandler = this.handleKeyUp.bind(this);
    window.addEventListener('keydown', this.keydownHandler);
    window.addEventListener('keyup', this.keyupHandler);
  }

  dispose(): void {
    window.removeEventListener('keydown', this.keydownHandler);
    window.removeEventListener('keyup', this.keyupHandler);
  }

  private handleKeyDown(e: KeyboardEvent): void {
    if (e.code === 'Space' && !e.repeat && !this.spaceHeld) {
      this.spaceHeld = true;
      this.onModeChange('canvas-pan');
    }
  }

  private handleKeyUp(e: KeyboardEvent): void {
    if (e.code === 'Space') {
      this.spaceHeld = false;
      this.lastPanPos = null;
      this.onModeChange('mask-edit');
    }
  }

  panMode = false;

  get isSpacePanning(): boolean { return this.spaceHeld; }
  get isMiddlePanning(): boolean { return this.middleDown; }
  get isNavigating(): boolean {
    return this.panMode || this.spaceHeld || this.middleDown || this.activePointers.size >= 2;
  }

  handleWheel(e: WheelEvent): void {
    e.preventDefault();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;
    const delta = e.deltaY < 0 ? this.zoomStep : 1 / this.zoomStep;
    this.viewport.applyZoomAtScreenPoint(sx, sy, this.viewport.viewport.scale * delta);
  }

  handlePointerDown(e: PointerEvent): boolean {
    this.activePointers.set(e.pointerId, e);

    if (e.button === 1) {
      this.middleDown = true;
      this.lastPanPos = { x: e.clientX, y: e.clientY };
      this.onModeChange('canvas-pan');
      return true;
    }

    if (this.spaceHeld || this.panMode) {
      this.lastPanPos = { x: e.clientX, y: e.clientY };
      return true;
    }

    if (this.activePointers.size === 2) {
      this.onModeChange('canvas-gesture');
      this.initPinch();
      return true;
    }

    return false;
  }

  handlePointerMove(e: PointerEvent): boolean {
    this.activePointers.set(e.pointerId, e);

    if (this.activePointers.size >= 2) {
      this.updatePinch();
      return true;
    }

    if ((this.panMode || this.spaceHeld || this.middleDown) && this.lastPanPos) {
      const dx = e.clientX - this.lastPanPos.x;
      const dy = e.clientY - this.lastPanPos.y;
      this.viewport.panViewport(dx, dy);
      this.lastPanPos = { x: e.clientX, y: e.clientY };
      return true;
    }

    return false;
  }

  handlePointerUp(e: PointerEvent): boolean {
    const wasNavigating = this.isNavigating;
    this.activePointers.delete(e.pointerId);

    if (e.button === 1) {
      this.middleDown = false;
      this.lastPanPos = null;
      if (!this.spaceHeld) this.onModeChange('mask-edit');
      return true;
    }

    if (this.activePointers.size < 2 && wasNavigating) {
      this.lastPanPos = null;
      if (!this.spaceHeld && !this.middleDown) this.onModeChange('mask-edit');
      return true;
    }

    return wasNavigating;
  }

  handlePointerCancel(e: PointerEvent): void {
    this.activePointers.delete(e.pointerId);
    if (this.activePointers.size < 2) {
      this.lastPanPos = null;
      if (!this.spaceHeld && !this.middleDown) this.onModeChange('mask-edit');
    }
  }

  private initPinch(): void {
    const pts = [...this.activePointers.values()];
    if (pts.length < 2) return;
    const [a, b] = pts;
    this.lastPinchDist = Math.hypot(b.clientX - a.clientX, b.clientY - a.clientY);
    this.lastPinchCenter = {
      x: (a.clientX + b.clientX) / 2,
      y: (a.clientY + b.clientY) / 2,
    };
  }

  private updatePinch(): void {
    const pts = [...this.activePointers.values()];
    if (pts.length < 2) return;
    const [a, b] = pts;
    const dist = Math.hypot(b.clientX - a.clientX, b.clientY - a.clientY);
    const cx = (a.clientX + b.clientX) / 2;
    const cy = (a.clientY + b.clientY) / 2;

    if (this.lastPinchDist > 0) {
      const factor = dist / this.lastPinchDist;
      const containerEl = (a.target as HTMLElement)?.closest('[data-mask-container]') as HTMLElement;
      const rect = containerEl?.getBoundingClientRect();
      const sx = rect ? cx - rect.left : cx;
      const sy = rect ? cy - rect.top : cy;
      this.viewport.applyZoomAtScreenPoint(sx, sy, this.viewport.viewport.scale * factor);

      const dx = cx - this.lastPinchCenter.x;
      const dy = cy - this.lastPinchCenter.y;
      if (Math.abs(dx) > 0 || Math.abs(dy) > 0) {
        this.viewport.panViewport(dx, dy);
      }
    }

    this.lastPinchDist = dist;
    this.lastPinchCenter = { x: cx, y: cy };
  }
}
