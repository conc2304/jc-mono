export type Vec2 = { x: number; y: number };
export type Rect = { x: number; y: number; width: number; height: number };

export type MaskEditMode = 'add-black' | 'subtract-white';

export type MaskToolId =
  | 'brush'
  | 'eraser'
  | 'lasso-freehand'
  | 'lasso-polygon'
  | 'lasso-curve'
  | 'lasso-magnetic'
  | 'selection-brush';

export type CanvasNavigationToolId = 'view-pan' | 'view-zoom';
export type EditorToolId = MaskToolId | CanvasNavigationToolId;

export type EditorInteractionMode =
  | 'mask-edit'
  | 'canvas-pan'
  | 'canvas-zoom'
  | 'canvas-gesture';

export type CanvasViewport = {
  scale: number;
  offsetX: number;
  offsetY: number;
  minScale: number;
  maxScale: number;
  fitScale: number;
  marginPx: number;
};

export type MaskEditOperation = {
  id: string;
  tool: MaskToolId;
  mode: MaskEditMode;
  maskWidth: number;
  maskHeight: number;
  dirtyRect: Rect;
  createdAtMs: number;
};

export type PathOperation = MaskEditOperation & {
  points?: Vec2[];
  curvePath?: CurvePath;
  fillRule: 'evenodd' | 'nonzero';
};

export type SelectionBrushOperation = MaskEditOperation & {
  brush: {
    sizePx: number;
    hardness: number;
    spacing: number;
  };
};

export type UndoEntry = {
  id: string;
  operation: MaskEditOperation;
  dirtyRect: Rect;
  beforePixels: Uint8ClampedArray;
  afterPixels: Uint8ClampedArray;
};

export type CurveAnchorMode = 'corner' | 'smooth' | 'symmetric';

export type CurveAnchor = {
  x: number;
  y: number;
  in: Vec2;
  out: Vec2;
  mode: CurveAnchorMode;
};

export type CurvePath = {
  type: 'curvePath';
  closed: boolean;
  anchors: CurveAnchor[];
};

export type ValidationResult = {
  openPercent: number;
  blockedPercent: number;
  warnings: string[];
};
