import { useRef, useState, useCallback, useEffect, useLayoutEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ViewportController } from '../navigation/ViewportController';
import { GestureController } from '../navigation/GestureController';
import type {
  SpawnConfig,
  SpawnRegion,
  SpawnInteraction,
  SpawnDrawMode,
  SpawnSaveStatus,
  SpawnActivateStatus,
  HandleId,
} from '../models/types';
import { loadSpawnConfigs, saveSpawnConfig, deleteSpawnConfig, activateSpawnConfig } from '../services/spawnConfigApi';
import { renderSpawnOverlay, hitTestSpawnRegions } from '../canvas/renderSpawnOverlay';
import { rectMaskToSim, SIM_W, SIM_H, clamp } from '../utils/coordinates';

const ZOOM_STEP = 1.25;
const MIN_REGION_SIM = 10; // minimum region size in sim-space units

export type UseSpawnEditorOptions = {
  canvasContainerRef: React.RefObject<HTMLDivElement | null>;
  overlayCanvasRef: React.RefObject<HTMLCanvasElement | null>;
  maskSize: { w: number; h: number };
  maskId?: string;
  baseUrl?: string;
};

export type UseSpawnEditorReturn = {
  // Viewport
  viewportCss: string;
  zoomPercent: number;
  fitToView: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  onWheelNative: (e: WheelEvent) => void;
  // Configs
  configs: SpawnConfig[];
  activeConfigId: string | null;
  activeConfig: SpawnConfig | null;
  setActiveConfigId: (id: string | null) => void;
  addConfig: () => void;
  deleteConfig: (id: string) => void;
  // Regions
  selectedRegionId: string | null;
  selectedRegion: SpawnRegion | null;
  deleteRegion: (id: string) => void;
  toggleRegion: (id: string) => void;
  updateRegion: (id: string, patch: Partial<SpawnRegion>) => void;
  // Draw mode
  drawMode: SpawnDrawMode;
  setDrawMode: (mode: SpawnDrawMode) => void;
  cancelDraw: () => void;
  // Status
  loading: boolean;
  error: string | null;
  saveStatus: SpawnSaveStatus;
  activateStatus: SpawnActivateStatus;
  // Activation
  activateConfig: (id: string) => void;
  // Pointer handlers
  handlePointerDown: (e: React.PointerEvent) => void;
  handlePointerMove: (e: React.PointerEvent) => void;
  handlePointerUp: (e: React.PointerEvent) => void;
  handlePointerCancel: (e: React.PointerEvent) => void;
};

export function useSpawnEditor(opts: UseSpawnEditorOptions): UseSpawnEditorReturn {
  const { canvasContainerRef, overlayCanvasRef, maskSize, maskId = 'current', baseUrl = '' } = opts;

  // ── Refs for event handlers (stale-closure-free) ───────────────────────
  const viewportRef = useRef(new ViewportController());
  const gestureRef = useRef<GestureController | null>(null);
  const interactionRef = useRef<SpawnInteraction>({ kind: 'idle' });
  const drawModeRef = useRef<SpawnDrawMode>('select');
  const activeConfigIdRef = useRef<string | null>(null);
  const regionsRef = useRef<SpawnRegion[]>([]);
  const selectedIdRef = useRef<string | null>(null);
  const maskSizeRef = useRef(maskSize);
  const rafRef = useRef<number | null>(null);
  const configsRef = useRef<SpawnConfig[]>([]);

  // ── React state (triggers re-renders) ──────────────────────────────────
  const [viewportCss, setViewportCss] = useState('translate(0px,0px) scale(1)');
  const [zoomPercent, setZoomPercent] = useState(100);
  const [configs, setConfigsState] = useState<SpawnConfig[]>([]);
  const [activeConfigId, setActiveConfigIdState] = useState<string | null>(null);
  const [selectedRegionId, setSelectedRegionIdState] = useState<string | null>(null);
  const [drawMode, setDrawModeState] = useState<SpawnDrawMode>('select');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<SpawnSaveStatus>('idle');
  const [activateStatus, setActivateStatus] = useState<SpawnActivateStatus>('idle');

  // ── Setters that keep refs in sync ─────────────────────────────────────
  const setConfigs = useCallback((next: SpawnConfig[] | ((prev: SpawnConfig[]) => SpawnConfig[])) => {
    setConfigsState(prev => {
      const value = typeof next === 'function' ? next(prev) : next;
      configsRef.current = value;
      const activeId = activeConfigIdRef.current;
      regionsRef.current = value.find(c => c.id === activeId)?.regions ?? [];
      return value;
    });
  }, []);

  const setActiveConfigId = useCallback((id: string | null) => {
    activeConfigIdRef.current = id;
    setActiveConfigIdState(id);
    regionsRef.current = configsRef.current.find(c => c.id === id)?.regions ?? [];
    scheduleRedraw();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setSelectedRegionId = useCallback((id: string | null) => {
    selectedIdRef.current = id;
    setSelectedRegionIdState(id);
  }, []);

  const setDrawMode = useCallback((mode: SpawnDrawMode) => {
    drawModeRef.current = mode;
    setDrawModeState(mode);
  }, []);

  // Keep maskSizeRef in sync
  useEffect(() => {
    maskSizeRef.current = maskSize;
    scheduleRedraw();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maskSize.w, maskSize.h]);

  // ── Viewport wiring ────────────────────────────────────────────────────
  useEffect(() => {
    viewportRef.current.onUpdate = () => {
      setZoomPercent(viewportRef.current.getZoomPercent());
      setViewportCss(viewportRef.current.getTransformCSS());
      scheduleRedraw();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    gestureRef.current = new GestureController({
      viewport: viewportRef.current,
      onInteractionModeChange: () => {},
      zoomStep: ZOOM_STEP,
    });
    return () => { gestureRef.current?.dispose(); };
  }, []);

  // ── Load configs on mount ──────────────────────────────────────────────
  useEffect(() => {
    setLoading(true);
    loadSpawnConfigs(maskId, baseUrl)
      .then(loaded => {
        setConfigs(loaded);
        if (loaded.length > 0) setActiveConfigId(loaded[0].id);
      })
      .catch(() => {
        // Non-fatal: backend endpoint not yet implemented or unreachable.
        // Start with empty config list so the tab is always usable.
      })
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maskId, baseUrl]);

  // ── Fit viewport when maskSize becomes available ───────────────────────
  useLayoutEffect(() => {
    if (!maskSize.w || !maskSize.h) return;
    const el = canvasContainerRef.current;
    if (!el) return;
    viewportRef.current.fitViewportToCanvas(el.clientWidth, el.clientHeight, maskSize.w, maskSize.h);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maskSize.w, maskSize.h]);

  // ── Canvas redraw (reads from refs, no stale closures) ─────────────────
  // Defined as a plain function (not useCallback) so we don't pay closure costs.
  // It's only ever called from inside this hook's other callbacks.
  function scheduleRedraw() {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const canvas = overlayCanvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      renderSpawnOverlay({
        ctx,
        maskW: maskSizeRef.current.w,
        maskH: maskSizeRef.current.h,
        regions: regionsRef.current,
        selectedRegionId: selectedIdRef.current,
        interaction: interactionRef.current,
        viewportScale: viewportRef.current.viewport.scale,
      });
    });
  }

  // Redraw whenever configs/activeConfig change
  useEffect(() => {
    scheduleRedraw();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [configs, activeConfigId, selectedRegionId]);

  // ── API helpers ────────────────────────────────────────────────────────
  const persistConfig = useCallback(async (config: SpawnConfig) => {
    setSaveStatus('saving');
    try {
      const saved = await saveSpawnConfig(maskId, { ...config, updatedAt: Date.now() }, baseUrl);
      setConfigs(prev => prev.map(c => c.id === saved.id ? saved : c));
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch {
      setSaveStatus('error');
    }
  }, [maskId, baseUrl, setConfigs]);

  // ── Config operations ──────────────────────────────────────────────────
  const addConfig = useCallback(() => {
    const now = Date.now();
    const newConfig: SpawnConfig = {
      id: uuidv4(),
      maskId,
      useDefaultTopSpawn: false,
      regions: [],
      createdAt: now,
      updatedAt: now,
    };
    setConfigs(prev => [...prev, newConfig]);
    setActiveConfigId(newConfig.id);
    persistConfig(newConfig);
  }, [maskId, setConfigs, setActiveConfigId, persistConfig]);

  const removeConfig = useCallback(async (id: string) => {
    try {
      await deleteSpawnConfig(maskId, id, baseUrl);
      setConfigs(prev => {
        const next = prev.filter(c => c.id !== id);
        if (activeConfigIdRef.current === id) {
          const newActive = next[0]?.id ?? null;
          setActiveConfigId(newActive);
        }
        return next;
      });
    } catch {
      setError('Failed to delete config');
    }
  }, [maskId, baseUrl, setConfigs, setActiveConfigId]);

  const activateConfigById = useCallback(async (id: string) => {
    setActivateStatus('activating');
    try {
      await activateSpawnConfig(maskId, id, baseUrl);
      setActivateStatus('done');
      setTimeout(() => setActivateStatus('idle'), 3000);
    } catch {
      setActivateStatus('error');
      setTimeout(() => setActivateStatus('idle'), 3000);
    }
  }, [maskId, baseUrl]);

  // ── Region operations ──────────────────────────────────────────────────
  const updateRegionInConfig = useCallback((regionId: string, updater: (r: SpawnRegion) => SpawnRegion) => {
    const activeId = activeConfigIdRef.current;
    setConfigs(prev => prev.map(cfg => {
      if (cfg.id !== activeId) return cfg;
      return { ...cfg, regions: cfg.regions.map(r => r.id === regionId ? updater(r) : r) };
    }));
    regionsRef.current = regionsRef.current.map(r => r.id === regionId ? updater(r) : r);
  }, [setConfigs]);

  const deleteRegion = useCallback((id: string) => {
    const activeId = activeConfigIdRef.current;
    setConfigs(prev => prev.map(cfg => {
      if (cfg.id !== activeId) return cfg;
      return { ...cfg, regions: cfg.regions.filter(r => r.id !== id) };
    }));
    regionsRef.current = regionsRef.current.filter(r => r.id !== id);
    if (selectedIdRef.current === id) setSelectedRegionId(null);

    const activeConfig = configsRef.current.find(c => c.id === activeId);
    if (activeConfig) persistConfig({ ...activeConfig, regions: activeConfig.regions.filter(r => r.id !== id) });
  }, [setConfigs, setSelectedRegionId, persistConfig]);

  const toggleRegion = useCallback((id: string) => {
    const activeId = activeConfigIdRef.current;
    let updatedConfig: SpawnConfig | null = null;
    setConfigs(prev => prev.map(cfg => {
      if (cfg.id !== activeId) return cfg;
      const next = { ...cfg, regions: cfg.regions.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r) };
      updatedConfig = next;
      return next;
    }));
    regionsRef.current = regionsRef.current.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r);
    scheduleRedraw();
    if (updatedConfig) persistConfig(updatedConfig);
  }, [setConfigs, persistConfig]);

  const updateRegion = useCallback((id: string, patch: Partial<SpawnRegion>) => {
    updateRegionInConfig(id, r => ({ ...r, ...patch }));
    const activeId = activeConfigIdRef.current;
    const activeConfig = configsRef.current.find(c => c.id === activeId);
    if (activeConfig) persistConfig(activeConfig);
    scheduleRedraw();
  }, [updateRegionInConfig, persistConfig]);

  const cancelDraw = useCallback(() => {
    interactionRef.current = { kind: 'idle' };
    setDrawMode('select');
    scheduleRedraw();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setDrawMode]);

  // ── Coordinate helper ──────────────────────────────────────────────────
  const screenToMaskPt = useCallback((e: { clientX: number; clientY: number }) => {
    const container = canvasContainerRef.current;
    if (!container) return { x: 0, y: 0 };
    const rect = container.getBoundingClientRect();
    const vp = viewportRef.current.viewport;
    return {
      x: (e.clientX - rect.left - vp.offsetX) / vp.scale,
      y: (e.clientY - rect.top - vp.offsetY) / vp.scale,
    };
  }, [canvasContainerRef]);

  // ── Pointer handlers ───────────────────────────────────────────────────
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);

    if (gestureRef.current?.handlePointerDown(e.nativeEvent)) return;
    if (gestureRef.current?.isNavigating) return;

    const { x: mx, y: my } = screenToMaskPt(e);
    const { w: maskW, h: maskH } = maskSizeRef.current;

    if (drawModeRef.current === 'draw') {
      interactionRef.current = { kind: 'drawing', startMx: mx, startMy: my, curMx: mx, curMy: my };
      scheduleRedraw();
      return;
    }

    const { regionId, handle } = hitTestSpawnRegions(
      mx, my, regionsRef.current, maskW, maskH,
      viewportRef.current.viewport.scale, selectedIdRef.current,
    );

    if (handle && regionId) {
      const region = regionsRef.current.find(r => r.id === regionId);
      if (region) {
        setSelectedRegionId(regionId);
        interactionRef.current = { kind: 'resizing', regionId, handle: handle as HandleId, startMx: mx, startMy: my, origRegion: { ...region } };
        scheduleRedraw();
      }
      return;
    }

    if (regionId) {
      const region = regionsRef.current.find(r => r.id === regionId);
      if (region) {
        setSelectedRegionId(regionId);
        interactionRef.current = { kind: 'moving', regionId, startMx: mx, startMy: my, origX: region.x, origY: region.y };
        scheduleRedraw();
      }
      return;
    }

    setSelectedRegionId(null);
    scheduleRedraw();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screenToMaskPt, setSelectedRegionId]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (gestureRef.current?.handlePointerMove(e.nativeEvent)) return;
    if (gestureRef.current?.isNavigating) return;

    const { x: mx, y: my } = screenToMaskPt(e);
    const { w: maskW, h: maskH } = maskSizeRef.current;
    const interaction = interactionRef.current;

    if (interaction.kind === 'drawing') {
      interactionRef.current = { ...interaction, curMx: mx, curMy: my };
      scheduleRedraw();
      return;
    }

    if (interaction.kind === 'moving') {
      const dx = mx - interaction.startMx;
      const dy = my - interaction.startMy;
      const origR = regionsRef.current.find(r => r.id === interaction.regionId);
      if (!origR) return;
      const dxSim = (dx / maskW) * SIM_W;
      const dySim = (dy / maskH) * SIM_H;
      const nx = clamp(interaction.origX + dxSim, 0, SIM_W - origR.width);
      const ny = clamp(interaction.origY + dySim, 0, SIM_H - origR.height);
      updateRegionInConfig(interaction.regionId, r => ({ ...r, x: nx, y: ny }));
      scheduleRedraw();
      return;
    }

    if (interaction.kind === 'resizing') {
      const dx = mx - interaction.startMx;
      const dy = my - interaction.startMy;
      const dxSim = (dx / maskW) * SIM_W;
      const dySim = (dy / maskH) * SIM_H;
      const { origRegion: orig, handle } = interaction;

      let x = orig.x, y = orig.y, w = orig.width, h = orig.height;
      switch (handle) {
        case 'nw': x += dxSim; y += dySim; w -= dxSim; h -= dySim; break;
        case 'ne': y += dySim; w += dxSim; h -= dySim; break;
        case 'se': w += dxSim; h += dySim; break;
        case 'sw': x += dxSim; w -= dxSim; h += dySim; break;
      }
      if (w < 0) { x += w; w = -w; }
      if (h < 0) { y += h; h = -h; }
      x = Math.max(0, x); y = Math.max(0, y);
      w = Math.min(w, SIM_W - x); h = Math.min(h, SIM_H - y);
      updateRegionInConfig(interaction.regionId, () => ({
        ...orig, x, y,
        width: Math.max(MIN_REGION_SIM, w),
        height: Math.max(MIN_REGION_SIM, h),
      }));
      scheduleRedraw();
      return;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screenToMaskPt, updateRegionInConfig]);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    if (gestureRef.current?.handlePointerUp(e.nativeEvent)) return;

    const { x: mx, y: my } = screenToMaskPt(e);
    const { w: maskW, h: maskH } = maskSizeRef.current;
    const interaction = interactionRef.current;

    if (interaction.kind === 'drawing') {
      const rx = Math.min(interaction.startMx, mx);
      const ry = Math.min(interaction.startMy, my);
      const rw = Math.abs(mx - interaction.startMx);
      const rh = Math.abs(my - interaction.startMy);

      if (rw > 4 && rh > 4) {
        const sim = rectMaskToSim(rx, ry, rw, rh, maskW, maskH);
        const newRegion: SpawnRegion = {
          id: uuidv4(),
          x: clamp(sim.x, 0, SIM_W - MIN_REGION_SIM),
          y: clamp(sim.y, 0, SIM_H - MIN_REGION_SIM),
          width: Math.max(MIN_REGION_SIM, Math.min(sim.width, SIM_W)),
          height: Math.max(MIN_REGION_SIM, Math.min(sim.height, SIM_H)),
          enabled: true,
        };
        const activeId = activeConfigIdRef.current;
        let updatedConfig: SpawnConfig | null = null;
        setConfigs(prev => prev.map(cfg => {
          if (cfg.id !== activeId) return cfg;
          const next = { ...cfg, regions: [...cfg.regions, newRegion] };
          updatedConfig = next;
          return next;
        }));
        regionsRef.current = [...regionsRef.current, newRegion];
        setSelectedRegionId(newRegion.id);
        setDrawMode('select');
        if (updatedConfig) persistConfig(updatedConfig);
      }

      interactionRef.current = { kind: 'idle' };
      scheduleRedraw();
      return;
    }

    if (interaction.kind === 'moving' || interaction.kind === 'resizing') {
      const activeId = activeConfigIdRef.current;
      const activeConfig = configsRef.current.find(c => c.id === activeId);
      if (activeConfig) persistConfig(activeConfig);
    }

    interactionRef.current = { kind: 'idle' };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screenToMaskPt, setConfigs, setSelectedRegionId, setDrawMode, persistConfig]);

  const handlePointerCancel = useCallback((e: React.PointerEvent) => {
    gestureRef.current?.handlePointerCancel(e.nativeEvent);
    interactionRef.current = { kind: 'idle' };
    scheduleRedraw();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Viewport controls ──────────────────────────────────────────────────
  const getContainerSize = () => {
    const el = canvasContainerRef.current;
    return el ? { w: el.clientWidth, h: el.clientHeight } : { w: 640, h: 360 };
  };

  const fitToView = useCallback(() => {
    const { w: cw, h: ch } = getContainerSize();
    const { w: mw, h: mh } = maskSizeRef.current;
    viewportRef.current.fitViewportToCanvas(cw, ch, mw, mh);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const zoomIn = useCallback(() => {
    const { w: cw, h: ch } = getContainerSize();
    viewportRef.current.zoomStep(ZOOM_STEP, cw, ch);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const zoomOut = useCallback(() => {
    const { w: cw, h: ch } = getContainerSize();
    viewportRef.current.zoomStep(1 / ZOOM_STEP, cw, ch);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  // ── Keyboard: Escape cancels draw mode ────────────────────────────────
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && drawModeRef.current === 'draw') {
        cancelDraw();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [cancelDraw]);

  // ── Derived values ─────────────────────────────────────────────────────
  const activeConfig = configs.find(c => c.id === activeConfigId) ?? null;
  const selectedRegion = (activeConfig?.regions ?? []).find(r => r.id === selectedRegionId) ?? null;

  return {
    viewportCss,
    zoomPercent,
    fitToView,
    zoomIn,
    zoomOut,
    onWheelNative,
    configs,
    activeConfigId,
    activeConfig,
    setActiveConfigId,
    addConfig,
    deleteConfig: removeConfig,
    selectedRegionId,
    selectedRegion,
    deleteRegion,
    toggleRegion,
    updateRegion,
    drawMode,
    setDrawMode,
    cancelDraw,
    loading,
    error,
    saveStatus,
    activateStatus,
    activateConfig: activateConfigById,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handlePointerCancel,
  };
}
