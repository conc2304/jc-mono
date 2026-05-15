import { BrushTool } from './BrushTool';
import type { BrushToolOptions } from './BrushTool';

export class EraserTool extends BrushTool {
  constructor(opts: Omit<BrushToolOptions, 'color'>) {
    super({ ...opts, color: '#ffffff' });
  }
}
