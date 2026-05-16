export type Vec2 = { x: number; y: number };

export type CanvasViewport = {
  scale: number;
  offsetX: number;
  offsetY: number;
  minScale: number;
  maxScale: number;
  fitScale: number;
  marginPx: number;
};

export type CanvasInteractionMode =
  | 'idle'
  | 'mask-edit'
  | 'canvas-pan'
  | 'canvas-zoom'
  | 'canvas-gesture';
