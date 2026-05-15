import type { UndoEntry, MaskEditOperation, Rect } from '../types';

const MAX_OPERATIONS = 100;
const MAX_MEMORY_BYTES = 256 * 1024 * 1024;

export class MaskHistory {
  private stack: UndoEntry[] = [];
  private cursor = -1;
  private totalBytes = 0;
  onChanged?: () => void;

  get canUndo(): boolean { return this.cursor >= 0; }
  get canRedo(): boolean { return this.cursor < this.stack.length - 1; }

  snapshot(ctx: CanvasRenderingContext2D, rect: Rect): Uint8ClampedArray {
    const imageData = ctx.getImageData(rect.x, rect.y, rect.width, rect.height);
    return imageData.data.slice();
  }

  push(
    operation: MaskEditOperation,
    dirtyRect: Rect,
    beforePixels: Uint8ClampedArray,
    afterPixels: Uint8ClampedArray
  ): void {
    // Drop redo entries above cursor
    if (this.cursor < this.stack.length - 1) {
      const dropped = this.stack.splice(this.cursor + 1);
      for (const e of dropped) this.totalBytes -= e.beforePixels.byteLength + e.afterPixels.byteLength;
    }

    const entry: UndoEntry = { id: operation.id, operation, dirtyRect, beforePixels, afterPixels };
    this.stack.push(entry);
    this.cursor++;
    this.totalBytes += beforePixels.byteLength + afterPixels.byteLength;

    // Evict oldest if over limits
    while (
      (this.stack.length > MAX_OPERATIONS || this.totalBytes > MAX_MEMORY_BYTES) &&
      this.stack.length > 1
    ) {
      const evicted = this.stack.shift()!;
      this.cursor--;
      this.totalBytes -= evicted.beforePixels.byteLength + evicted.afterPixels.byteLength;
    }

    this.onChanged?.();
  }

  undo(ctx: CanvasRenderingContext2D): Rect | null {
    if (!this.canUndo) return null;
    const entry = this.stack[this.cursor];
    this.cursor--;
    const id = ctx.createImageData(entry.dirtyRect.width, entry.dirtyRect.height);
    id.data.set(entry.beforePixels);
    ctx.putImageData(id, entry.dirtyRect.x, entry.dirtyRect.y);
    this.onChanged?.();
    return entry.dirtyRect;
  }

  redo(ctx: CanvasRenderingContext2D): Rect | null {
    if (!this.canRedo) return null;
    this.cursor++;
    const entry = this.stack[this.cursor];
    const id = ctx.createImageData(entry.dirtyRect.width, entry.dirtyRect.height);
    id.data.set(entry.afterPixels);
    ctx.putImageData(id, entry.dirtyRect.x, entry.dirtyRect.y);
    this.onChanged?.();
    return entry.dirtyRect;
  }

  clear(): void {
    this.stack = [];
    this.cursor = -1;
    this.totalBytes = 0;
    this.onChanged?.();
  }
}
