import { useRef, useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { MaskHistory } from '../history/MaskHistory';
import { ViewportController } from '../navigation/ViewportController';
import { GestureController } from '../navigation/GestureController';
import { BrushTool } from '../tools/BrushTool';
import { EraserTool } from '../tools/EraserTool';
import { FreehandLassoTool } from '../tools/FreehandLassoTool';
import { PolygonLassoTool } from '../tools/PolygonLassoTool';
import { SelectionBrushTool } from '../tools/SelectionBrushTool';
import { CurveLassoTool } from '../tools/CurveLassoTool';
import { validateMask } from '../geometry/fillPath';
import type {
  EditorToolId,
  MaskEditMode,
  EditorInteractionMode,
  Vec2,
  ValidationResult,
} from '../types';
import type { BaseTool } from '../tools/BaseTool';

export type UseMaskEditorOptions = {
  maskCanvasRef: React.RefObject<HTMLCanvasElement | null>;
  previewCanvasRef: React.RefObject<HTMLCanvasElement | null>;
  /** The overflow:hidden canvas container div — used for coordinate transforms and gesture binding */
  canvasContainerRef: React.RefObject<HTMLDivElement | null>;
  /** The outer editor box — used for keyboard events */
  containerRef: React.RefObject<HTMLDivElement | null>;
  brushSize: number;
  onMaskChanged?: () => void;
};

export type UseMaskEditorReturn = {
  activeTool: EditorToolId;
  setActiveTool: (tool: EditorToolId) => void;
  editMode: MaskEditMode;
  setEditMode: (mode: MaskEditMode) => void;
  interactionMode: EditorInteractionMode;
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;
  invert: () => void;
  zoomPercent: number;
  viewportTransformCss: string;
  fitToView: () => void;
  actualSize: () => void;
  resetView: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  viewport: ViewportController;
  validation: ValidationResult | null;
  handlePointerDown: (e: React.PointerEvent) => void;
  handlePointerMove: (e: React.PointerEvent) => void;
  handlePointerUp: (e: React.PointerEvent) => void;
  handlePointerCancel: (e: React.PointerEvent) => void;
  handlePointerLeave: () => void;
  handleDoubleClick: (e: React.MouseEvent) => void;
  onWheelNative: (e: WheelEvent) => void;
};

const ZOOM_STEP = 1.25;

export function useMaskEditor(opts: UseMaskEditorOptions): UseMaskEditorReturn {
  const { maskCanvasRef, previewCanvasRef, canvasContainerRef, containerRef, brushSize, onMaskChanged } = opts;

  const brushSizeRef = useRef(brushSize);
  useEffect(() => { brushSizeRef.current = brushSize; }, [brushSize]);

  const historyRef = useRef(new MaskHistory());
  const viewportRef = useRef(new ViewportController());
  const gestureRef = useRef<GestureController | null>(null);
  const activeToolRef = useRef<BaseTool | null>(null);
  const rafRef = useRef<number | null>(null);
  // Keep editMode in a ref so event handlers see the latest value without stale closures
  const editModeRef = useRef<MaskEditMode>('add-black');

  const [activeTool, setActiveToolState] = useState<EditorToolId>('brush');
  const [editMode, setEditModeState] = useState<MaskEditMode>('add-black');
  const [interactionMode, setInteractionMode] = useState<EditorInteractionMode>('mask-edit');
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [zoomPercent, setZoomPercent] = useState(100);
  const [viewportTransformCss, setViewportTransformCss] = useState('translate(0px,0px) scale(1)');
  const [validation, setValidation] = useState<ValidationResult | null>(null);

  const getMaskCtx = useCallback((): CanvasRenderingContext2D | null =>
    maskCanvasRef.current?.getContext('2d') ?? null,
  [maskCanvasRef]);

  const getPreviewCtx = useCallback((): CanvasRenderingContext2D | null =>
    previewCanvasRef.current?.getContext('2d') ?? null,
  [previewCanvasRef]);

  const revalidate = useCallback(() => {
    const ctx = getMaskCtx();
    const c = maskCanvasRef.current;
    if (!ctx || !c) return;
    setValidation(validateMask(ctx, c.width, c.height));
  }, [getMaskCtx, maskCanvasRef]);

  useEffect(() => {
    const history = historyRef.current;
    history.onChanged = () => {
      setCanUndo(history.canUndo);
      setCanRedo(history.canRedo);
    };
  }, []);

  useEffect(() => {
    viewportRef.current.onUpdate = () => {
      setZoomPercent(viewportRef.current.getZoomPercent());
      setViewportTransformCss(viewportRef.current.getTransformCSS());
      schedulePreviewRedraw();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    gestureRef.current = new GestureController({
      viewport: viewportRef.current,
      onInteractionModeChange: setInteractionMode,
      zoomStep: ZOOM_STEP,
    });
    return () => { gestureRef.current?.dispose(); };
  }, []);

  const makeTool = useCallback((id: EditorToolId): BaseTool | null => {
    const getBrushSize = () => brushSizeRef.current;
    const getMCtx = () => getMaskCtx();
    switch (id) {
      case 'brush': return new BrushTool({ getMaskCtx: getMCtx, getBrushSize, color: '#000000' });
      case 'eraser': return new EraserTool({ getMaskCtx: getMCtx, getBrushSize });
      case 'lasso-freehand': return new FreehandLassoTool();
      case 'lasso-polygon': return new PolygonLassoTool();
      case 'selection-brush': return new SelectionBrushTool({ getBrushSize });
      case 'lasso-curve': return new CurveLassoTool();
      default: return null;
    }
  }, [getMaskCtx]);

  const clearPreview = useCallback(() => {
    const pctx = getPreviewCtx();
    const pc = previewCanvasRef.current;
    if (pctx && pc) pctx.clearRect(0, 0, pc.width, pc.height);
  }, [getPreviewCtx, previewCanvasRef]);

  const schedulePreviewRedraw = () => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const pctx = getPreviewCtx();
      const pc = previewCanvasRef.current;
      if (!pctx || !pc) return;
      pctx.clearRect(0, 0, pc.width, pc.height);
      activeToolRef.current?.renderPreview(pctx, viewportRef.current.viewport);
    });
  };

  const setActiveTool = useCallback((id: EditorToolId) => {
    activeToolRef.current?.cancel();
    activeToolRef.current?.dispose();
    activeToolRef.current = makeTool(id);
    if (id === 'selection-brush') {
      const ctx = getMaskCtx();
      if (ctx) (activeToolRef.current as SelectionBrushTool).initForMask(ctx);
    }
    if (gestureRef.current) gestureRef.current.panMode = (id === 'view-pan');
    setActiveToolState(id);
    clearPreview();
  }, [makeTool, getMaskCtx, clearPreview]);

  useEffect(() => {
    activeToolRef.current = makeTool('brush');
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const setEditMode = useCallback((mode: MaskEditMode) => {
    editModeRef.current = mode;
    setEditModeState(mode);
  }, []);

  /** Convert container-relative screen coordinates to mask pixel coordinates via viewport transform */
  const screenToMask = useCallback((e: { clientX: number; clientY: number }): Vec2 => {
    const container = canvasContainerRef.current;
    if (!container) return { x: 0, y: 0 };
    const rect = container.getBoundingClientRect();
    const vp = viewportRef.current.viewport;
    return {
      x: (e.clientX - rect.left - vp.offsetX) / vp.scale,
      y: (e.clientY - rect.top - vp.offsetY) / vp.scale,
    };
  }, [canvasContainerRef]);

  const pushBrushHistory = useCallback((tool: BrushTool) => {
    if (!tool._pendingDirty || !tool._pendingBefore || !tool._pendingAfter) return;
    const c = maskCanvasRef.current;
    if (!c) return;
    historyRef.current.push(
      { id: uuidv4(), tool: 'brush', mode: editModeRef.current, maskWidth: c.width, maskHeight: c.height, dirtyRect: tool._pendingDirty, createdAtMs: Date.now() },
      tool._pendingDirty, tool._pendingBefore, tool._pendingAfter
    );
    tool._pendingDirty = null;
    tool._pendingBefore = null;
    tool._pendingAfter = null;
    revalidate();
    onMaskChanged?.();
  }, [maskCanvasRef, revalidate, onMaskChanged]);

  const isNavigating = useCallback(() =>
    gestureRef.current?.isNavigating ?? false,
  []);

  const tryAutoCommit = useCallback(() => {
    const tool = activeToolRef.current;
    if (!tool || !tool.canCommit()) return;
    // BrushTool and SelectionBrushTool use different commit paths
    if (tool instanceof BrushTool || tool instanceof SelectionBrushTool) return;
    const ctx = getMaskCtx();
    if (!ctx) return;
    tool.commit(ctx, historyRef.current, editModeRef.current);
    clearPreview();
    revalidate();
    onMaskChanged?.();
  }, [getMaskCtx, clearPreview, revalidate, onMaskChanged]);

  const syncViewportScaleToTool = () => {
    const scale = viewportRef.current.viewport.scale;
    const tool = activeToolRef.current;
    if (tool instanceof PolygonLassoTool) tool.viewportScale = scale;
    if (tool instanceof CurveLassoTool) tool.viewportScale = scale;
  };

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    const nativeE = e.nativeEvent;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);

    if (gestureRef.current?.handlePointerDown(nativeE)) return;
    if (isNavigating()) return;

    syncViewportScaleToTool();
    const maskPt = screenToMask(e);
    activeToolRef.current?.onPointerDown(nativeE, maskPt);
    tryAutoCommit();
    schedulePreviewRedraw();
  }, [screenToMask, isNavigating, tryAutoCommit]); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    const nativeE = e.nativeEvent;
    if (gestureRef.current?.handlePointerMove(nativeE)) return;
    if (isNavigating()) return;

    syncViewportScaleToTool();
    const maskPt = screenToMask(e);
    activeToolRef.current?.onPointerMove(nativeE, maskPt);
    schedulePreviewRedraw();
  }, [screenToMask, isNavigating]); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    const nativeE = e.nativeEvent;
    if (gestureRef.current?.handlePointerUp(nativeE)) return;

    const maskPt = screenToMask(e);
    const tool = activeToolRef.current;
    tool?.onPointerUp(nativeE, maskPt);

    if (tool instanceof BrushTool) {
      pushBrushHistory(tool);
    } else {
      tryAutoCommit();
    }
    schedulePreviewRedraw();
    revalidate();
  }, [screenToMask, revalidate, pushBrushHistory, tryAutoCommit]); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePointerCancel = useCallback((e: React.PointerEvent) => {
    gestureRef.current?.handlePointerCancel(e.nativeEvent);
  }, []);

  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    if (isNavigating()) return;
    const maskPt = screenToMask(e);
    const tool = activeToolRef.current;
    if (tool instanceof PolygonLassoTool) tool.handleDoubleClick(maskPt);
    if (tool instanceof CurveLassoTool) tool.handleDoubleClick(maskPt);
    tryAutoCommit();
    schedulePreviewRedraw();
  }, [screenToMask, isNavigating, tryAutoCommit]); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePointerLeave = useCallback(() => {
    clearPreview();
  }, [clearPreview]);

  /** Non-passive wheel handler — attach via addEventListener with { passive: false } in the organism */
  const onWheelNative = useCallback((e: WheelEvent) => {
    e.preventDefault();
    const container = canvasContainerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;
    const delta = e.deltaY < 0 ? ZOOM_STEP : 1 / ZOOM_STEP;
    viewportRef.current.applyZoomAtScreenPoint(sx, sy, viewportRef.current.viewport.scale * delta);
  }, [canvasContainerRef]);

  // Global keyboard handler
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const tool = activeToolRef.current;
      tool?.onKeyDown(e);

      if (e.key === 'Escape') { tool?.cancel(); clearPreview(); return; }

      if ((e.key === 'Enter' || e.key === 'Return') && tool?.canCommit()) {
        const ctx = getMaskCtx();
        if (ctx) {
          tool.commit(ctx, historyRef.current, editModeRef.current);
          clearPreview();
          revalidate();
          onMaskChanged?.();
        }
        return;
      }

      const mod = e.ctrlKey || e.metaKey;
      if (mod && e.key === 'z' && !e.shiftKey) { undo(); return; }
      if (mod && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) { redo(); return; }

      if (e.key === 'x' || e.key === 'X') {
        setEditMode(editModeRef.current === 'add-black' ? 'subtract-white' : 'add-black');
        return;
      }
      if (e.key === 'l' || e.key === 'L') { setActiveTool('lasso-freehand'); return; }
      if (e.key === 'p' || e.key === 'P') { setActiveTool('lasso-polygon'); return; }
      if (e.key === 'c' || e.key === 'C') { setActiveTool('lasso-curve'); return; }
      if (e.key === 's' || e.key === 'S') { setActiveTool('selection-brush'); return; }
      if (e.key === 'b' || e.key === 'B') { setActiveTool('brush'); return; }
      if (e.key === 'e' || e.key === 'E') { setActiveTool('eraser'); return; }
    };

    const container = containerRef.current;
    container?.addEventListener('keydown', onKeyDown);
    return () => container?.removeEventListener('keydown', onKeyDown);
  }, [getMaskCtx, revalidate, onMaskChanged, setActiveTool, setEditMode, clearPreview]); // eslint-disable-line react-hooks/exhaustive-deps

  const undo = useCallback(() => {
    const ctx = getMaskCtx();
    if (!ctx) return;
    historyRef.current.undo(ctx);
    revalidate();
    onMaskChanged?.();
  }, [getMaskCtx, revalidate, onMaskChanged]);

  const redo = useCallback(() => {
    const ctx = getMaskCtx();
    if (!ctx) return;
    historyRef.current.redo(ctx);
    revalidate();
    onMaskChanged?.();
  }, [getMaskCtx, revalidate, onMaskChanged]);

  const invert = useCallback(() => {
    const ctx = getMaskCtx();
    const c = maskCanvasRef.current;
    if (!ctx || !c) return;
    const { width, height } = c;
    const dirty = { x: 0, y: 0, width, height };
    const before = historyRef.current.snapshot(ctx, dirty);
    const data = ctx.getImageData(0, 0, width, height);
    for (let i = 0; i < data.data.length; i += 4) {
      data.data[i] = 255 - data.data[i];
      data.data[i + 1] = 255 - data.data[i + 1];
      data.data[i + 2] = 255 - data.data[i + 2];
      data.data[i + 3] = 255;
    }
    ctx.putImageData(data, 0, 0);
    const after = historyRef.current.snapshot(ctx, dirty);
    historyRef.current.push(
      { id: uuidv4(), tool: 'brush', mode: 'add-black', maskWidth: width, maskHeight: height, dirtyRect: dirty, createdAtMs: Date.now() },
      dirty, before, after
    );
    revalidate();
    onMaskChanged?.();
  }, [getMaskCtx, maskCanvasRef, revalidate, onMaskChanged]);

  const getCanvasContainerSize = () => {
    const el = canvasContainerRef.current;
    return el ? { w: el.clientWidth, h: el.clientHeight } : { w: 600, h: 400 };
  };

  const getMaskSize = () => {
    const c = maskCanvasRef.current;
    return c ? { w: c.width, h: c.height } : { w: 600, h: 400 };
  };

  const fitToView = useCallback(() => {
    const { w: cw, h: ch } = getCanvasContainerSize();
    const { w: mw, h: mh } = getMaskSize();
    viewportRef.current.fitViewportToCanvas(cw, ch, mw, mh);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const actualSize = useCallback(() => {
    const { w: cw, h: ch } = getCanvasContainerSize();
    const { w: mw, h: mh } = getMaskSize();
    viewportRef.current.setActualSize(cw, ch, mw, mh);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const resetView = useCallback(() => {
    const { w: cw, h: ch } = getCanvasContainerSize();
    const { w: mw, h: mh } = getMaskSize();
    viewportRef.current.resetViewport(cw, ch, mw, mh);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const zoomIn = useCallback(() => {
    const { w: cw, h: ch } = getCanvasContainerSize();
    viewportRef.current.zoomStep(ZOOM_STEP, cw, ch);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const zoomOut = useCallback(() => {
    const { w: cw, h: ch } = getCanvasContainerSize();
    viewportRef.current.zoomStep(1 / ZOOM_STEP, cw, ch);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    activeTool, setActiveTool,
    editMode, setEditMode,
    interactionMode,
    canUndo, canRedo, undo, redo, invert,
    zoomPercent, viewportTransformCss,
    fitToView, actualSize, resetView, zoomIn, zoomOut,
    viewport: viewportRef.current,
    validation,
    handlePointerDown, handlePointerMove, handlePointerUp, handlePointerCancel,
    handlePointerLeave,
    handleDoubleClick,
    onWheelNative,
  };
}
