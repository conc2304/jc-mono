import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  useLayoutEffect,
} from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import CircularProgress from '@mui/material/CircularProgress';
import ListItemIcon from '@mui/material/ListItemIcon';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import DownloadIcon from '@mui/icons-material/Download';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import RestoreIcon from '@mui/icons-material/Restore';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import CropSquareIcon from '@mui/icons-material/CropSquare';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { uploadMask } from '@jc/shared/of-control-client';
import { MaskToolbar } from '../../molecules/MaskToolbar';
import { BrushOptions } from '../../molecules/BrushOptions';
import { MaskValidationPanel } from '../../molecules/MaskValidationPanel';
import { UnsavedChangesDialog } from '@jc/ui-components';
import { useMaskEditor } from '../../hooks/useMaskEditor';
import type { EditorToolId } from '../../types';

const ACCEPTED = 'image/png,image/jpeg,image/webp';
const DEFAULT_W = 800;
const DEFAULT_H = 500;

const ReferenceCanvas = styled('canvas')({
  display: 'block',
  position: 'absolute',
  top: 0,
  left: 0,
  pointerEvents: 'none',
  imageRendering: 'pixelated',
});

const MaskCanvas = styled('canvas')({
  display: 'block',
  imageRendering: 'pixelated',
});

const PreviewCanvas = styled('canvas')({
  display: 'block',
  position: 'absolute',
  top: 0,
  left: 0,
  pointerEvents: 'none',
  imageRendering: 'pixelated',
});

type MaskLoadState = 'idle' | 'loading' | 'loaded' | 'empty';
type MaskSource = 'existing' | 'blank' | 'camera' | 'file' | 'reference';

interface Props {
  maskVersion?: number;
  baseUrl?: string;
  referenceFile?: File | null;
  onUploadSuccess?: () => void;
  onCancel?: () => void;
  onRegisterUnsavedChanges?: (
    handler: {
      hasUnsavedChanges: boolean;
      save?: () => Promise<void>;
      discard: () => void;
    } | null
  ) => void;
}

export const MaskEditor: React.FC<Props> = ({
  maskVersion,
  baseUrl = '',
  referenceFile = null,
  onUploadSuccess,
  onCancel,
  onRegisterUnsavedChanges,
}) => {
  const referenceCanvasRef = useRef<HTMLCanvasElement>(null);
  const maskCanvasRef = useRef<HTMLCanvasElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const savedPixelsRef = useRef<ImageData | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const pendingActionRef = useRef<(() => void) | null>(null);

  const [brushSize, setBrushSize] = useState(20);
  const [opacity, setOpacity] = useState(0.6);
  const [maskView, setMaskView] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [canvasSize, setCanvasSize] = useState({ w: DEFAULT_W, h: DEFAULT_H });
  const [maskLoadState, setMaskLoadState] = useState<MaskLoadState>('idle');
  const [maskSource, setMaskSource] = useState<MaskSource | null>(null);
  const [referenceOpacity, setReferenceOpacity] = useState(0.35);
  const [showReference, setShowReference] = useState(true);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [newMaskAnchorEl, setNewMaskAnchorEl] = useState<null | HTMLElement>(
    null
  );
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [guardDialogOpen, setGuardDialogOpen] = useState(false);
  const [guardError, setGuardError] = useState<string | null>(null);
  const pendingLeaveActionRef = useRef<(() => void) | null>(null);

  const {
    activeTool,
    setActiveTool,
    editMode,
    setEditMode,
    canUndo,
    canRedo,
    undo,
    redo,
    invert,
    zoomPercent,
    viewportTransformCss,
    fitToView,
    actualSize,
    resetView,
    zoomIn,
    zoomOut,
    validation,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handlePointerCancel,
    handlePointerLeave,
    handleDoubleClick,
    onWheelNative,
  } = useMaskEditor({
    maskCanvasRef,
    previewCanvasRef,
    canvasContainerRef,
    containerRef,
    brushSize,
    onMaskChanged: () => setHasUnsavedChanges(true),
  });

  useEffect(() => {
    const el = canvasContainerRef.current;
    if (!el) return;
    el.addEventListener('wheel', onWheelNative, { passive: false });
    return () => el.removeEventListener('wheel', onWheelNative);
  }, [onWheelNative]);

  const captureSnapshot = useCallback(() => {
    const c = maskCanvasRef.current;
    if (!c) return;
    savedPixelsRef.current = c
      .getContext('2d')!
      .getImageData(0, 0, c.width, c.height);
  }, []);

  const clearReferenceCanvas = useCallback(() => {
    const rc = referenceCanvasRef.current;
    if (!rc) return;
    const ctx = rc.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, rc.width, rc.height);
  }, []);

  const initCanvasFromImage = useCallback(
    (img: HTMLImageElement, source: MaskSource) => {
      const aspect = img.width / img.height;
      const w = Math.min(img.width, DEFAULT_W);
      const h = Math.round(w / aspect);
      setCanvasSize({ w, h });
      requestAnimationFrame(() => {
        const mc = maskCanvasRef.current;
        const pc = previewCanvasRef.current;
        const rc = referenceCanvasRef.current;
        if (!mc) return;
        mc.width = w;
        mc.height = h;
        if (pc) {
          pc.width = w;
          pc.height = h;
        }
        if (rc) {
          rc.width = w;
          rc.height = h;
        }
        const ctx = mc.getContext('2d')!;
        ctx.clearRect(0, 0, w, h);

        if (source === 'reference') {
          const rctx = referenceCanvasRef.current?.getContext('2d');
          if (rctx) {
            rctx.clearRect(0, 0, w, h);
            rctx.drawImage(img, 0, 0, w, h);
          }
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, w, h);
        } else {
          if (rc) {
            const rctx = rc.getContext('2d');
            if (rctx) rctx.clearRect(0, 0, w, h);
          }
          ctx.drawImage(img, 0, 0, w, h);
        }

        captureSnapshot();
        setMaskSource(source);
        setMaskLoadState('loaded');
        setHasUnsavedChanges(false);
        fitToView();
      });
    },
    [captureSnapshot, fitToView]
  );

  const loadExistingMask = useCallback(() => {
    setMaskLoadState('loading');
    clearReferenceCanvas();
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => initCanvasFromImage(img, 'existing');
    img.onerror = () => {
      setMaskLoadState('empty');
      fitToView();
    };
    img.src = `${baseUrl}/api/mask/current.png?v=${maskVersion ?? Date.now()}`;
  }, [
    baseUrl,
    maskVersion,
    captureSnapshot,
    clearReferenceCanvas,
    fitToView,
    initCanvasFromImage,
  ]);

  useEffect(() => {
    if (referenceFile) {
      startFromImage(referenceFile, 'reference');
    } else {
      loadExistingMask();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [referenceFile]);

  useLayoutEffect(() => {
    fitToView();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startBlankMask = useCallback(() => {
    const mc = maskCanvasRef.current;
    const pc = previewCanvasRef.current;
    if (!mc) return;
    mc.width = DEFAULT_W;
    mc.height = DEFAULT_H;
    if (pc) {
      pc.width = DEFAULT_W;
      pc.height = DEFAULT_H;
    }
    const rc = referenceCanvasRef.current;
    if (rc) {
      rc.width = DEFAULT_W;
      rc.height = DEFAULT_H;
    }
    setCanvasSize({ w: DEFAULT_W, h: DEFAULT_H });
    const ctx = mc.getContext('2d')!;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, DEFAULT_W, DEFAULT_H);
    if (rc) {
      const rctx = rc.getContext('2d');
      if (rctx) rctx.clearRect(0, 0, DEFAULT_W, DEFAULT_H);
    }
    captureSnapshot();
    setMaskSource('blank');
    setMaskLoadState('loaded');
    setHasUnsavedChanges(false);
    fitToView();
  }, [captureSnapshot, fitToView]);

  const startFromImage = useCallback(
    (file: File, source: MaskSource) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        initCanvasFromImage(img, source);
        URL.revokeObjectURL(url);
      };
      img.src = url;
    },
    [initCanvasFromImage]
  );

  const revertToSnapshot = useCallback(() => {
    const c = maskCanvasRef.current;
    if (!c || !savedPixelsRef.current) return;
    c.getContext('2d')!.putImageData(savedPixelsRef.current, 0, 0);
    setHasUnsavedChanges(false);
  }, []);

  const discardChanges = useCallback(() => {
    revertToSnapshot();
    setUploadError(null);
  }, [revertToSnapshot]);

  useEffect(() => {
    onRegisterUnsavedChanges?.({
      hasUnsavedChanges,
      discard: discardChanges,
    });
    return () => onRegisterUnsavedChanges?.(null);
  }, [hasUnsavedChanges, discardChanges, onRegisterUnsavedChanges]);

  const confirmThenDo = useCallback(
    (action: () => void) => {
      if (hasUnsavedChanges) {
        pendingActionRef.current = action;
        setConfirmOpen(true);
      } else {
        action();
      }
    },
    [hasUnsavedChanges]
  );

  const handleConfirmReplace = () => {
    setConfirmOpen(false);
    pendingActionRef.current?.();
    pendingActionRef.current = null;
  };

  const handleCancelConfirm = () => {
    setConfirmOpen(false);
    pendingActionRef.current = null;
  };

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, source: MaskSource) => {
      const f = e.target.files?.[0];
      if (!f) return;
      e.target.value = '';
      if (source !== 'reference') {
        clearReferenceCanvas();
      }
      startFromImage(f, source);
    },
    [clearReferenceCanvas, startFromImage]
  );

  const getCursor = (tool: EditorToolId): string => {
    if (tool === 'view-pan') return 'grab';
    return 'crosshair';
  };

  const handleDownload = () => {
    const c = maskCanvasRef.current;
    if (!c) return;
    const off = document.createElement('canvas');
    off.width = c.width;
    off.height = c.height;
    const ctx = off.getContext('2d')!;
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, off.width, off.height);
    ctx.drawImage(c, 0, 0);
    off.toBlob(
      (blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'mask.jpg';
        a.click();
        URL.revokeObjectURL(url);
      },
      'image/jpeg',
      0.92
    );
  };

  const hasPaintedStrokes = () => {
    const c = maskCanvasRef.current;
    if (!c) return false;
    const data = c.getContext('2d')!.getImageData(0, 0, c.width, c.height).data;
    for (let i = 0; i < data.length; i += 4) {
      if (data[i] !== 255 || data[i + 1] !== 255 || data[i + 2] !== 255) {
        return true;
      }
    }
    return false;
  };

  const handleUpload = async () => {
    const c = maskCanvasRef.current;
    if (!c) return;
    if (maskSource === 'reference' && !hasPaintedStrokes()) {
      setUploadError(
        'No strokes detected — the exported mask would be fully white. Paint the grout areas or cancel.'
      );
      return;
    }
    setUploading(true);
    setUploadError(null);
    const off = document.createElement('canvas');
    off.width = c.width;
    off.height = c.height;
    const ctx = off.getContext('2d')!;
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, off.width, off.height);
    ctx.drawImage(c, 0, 0);
    off.toBlob(
      async (blob) => {
        if (!blob) {
          setUploading(false);
          return;
        }
        const file = new File([blob], 'mask.jpg', { type: 'image/jpeg' });
        try {
          await uploadMask(file, baseUrl);
          captureSnapshot();
          setHasUnsavedChanges(false);
          setUploadSuccess(true);
          onUploadSuccess?.();
        } catch (err) {
          setUploadError(err instanceof Error ? err.message : 'Upload failed');
        } finally {
          setUploading(false);
        }
      },
      'image/jpeg',
      0.92
    );
  };

  const isEditing = maskLoadState === 'loaded';
  const isLoading = maskLoadState === 'idle' || maskLoadState === 'loading';
  const isEmpty = maskLoadState === 'empty';

  const toolbarProps = {
    activeTool,
    onSetTool: setActiveTool,
    editMode,
    onSetMode: setEditMode,
    canUndo,
    canRedo,
    onUndo: undo,
    onRedo: redo,
    onInvert: invert,
    maskView,
    onToggleMaskView: () => setMaskView((v) => !v),
    zoomPercent,
    onZoomIn: zoomIn,
    onZoomOut: zoomOut,
    onFit: fitToView,
    onActualSize: actualSize,
    onReset: resetView,
  };

  const brushOptionsProps = {
    brushSize,
    onBrushSizeChange: setBrushSize,
    opacity,
    onOpacityChange: setOpacity,
    activeTool,
  };

  const statusChip = isLoading
    ? null
    : isEmpty
    ? { label: 'No mask', color: 'default' as const }
    : maskSource === 'existing'
    ? { label: 'Existing mask', color: 'success' as const }
    : maskSource === 'blank'
    ? { label: 'New blank', color: 'default' as const }
    : maskSource === 'camera'
    ? { label: 'From camera', color: 'info' as const }
    : maskSource === 'reference'
    ? { label: 'Reference mode', color: 'info' as const }
    : { label: 'From file', color: 'info' as const };

  return (
    <Box
      ref={containerRef}
      tabIndex={0}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        gap: 1,
        outline: 'none',
        overflow: 'hidden',
      }}
    >
      {/*
       * ── DESKTOP / TABLET ──────────────────────────────────────────────────
       * Hidden on xs (<600px). Toolbar + New Mask button in one row.
       * Desktop (md+): toolbar row + inline sliders.
       * Tablet (sm–md): toolbar row + sliders row below it.
       */}
      <Box sx={{ flexShrink: 0, display: { xs: 'none', sm: 'block' } }}>
        <Stack
          direction={{ sm: 'column', md: 'row' }}
          spacing={1}
          alignItems={{ md: 'center' }}
        >
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <MaskToolbar {...toolbarProps} />
              </Box>
              <Button
                size="small"
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={(e) => setNewMaskAnchorEl(e.currentTarget)}
                sx={{ flexShrink: 0 }}
              >
                New Mask
              </Button>
              {statusChip && (
                <Chip
                  size="small"
                  label={statusChip.label}
                  color={statusChip.color}
                  sx={{ flexShrink: 0, fontSize: '0.65rem' }}
                />
              )}
              {hasUnsavedChanges && (
                <Chip
                  size="small"
                  label="Unsaved"
                  color="warning"
                  sx={{ flexShrink: 0, fontSize: '0.65rem' }}
                />
              )}
            </Stack>
          </Box>
          <Box
            sx={{
              flexShrink: 0,
              minWidth: 260,
              display: { sm: 'none', md: 'block' },
            }}
          >
            <BrushOptions {...brushOptionsProps} horizontal />
          </Box>
        </Stack>
        <Box sx={{ display: { sm: 'block', md: 'none' }, mt: 0.5 }}>
          <BrushOptions {...brushOptionsProps} horizontal />
        </Box>
      </Box>

      {/*
       * ── MOBILE ─────────────────────────────────────────────────────────────
       * Compact title header with status badges — visible on xs only.
       */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ flexShrink: 0, display: { xs: 'flex', sm: 'none' } }}
      >
        <Typography variant="overline" sx={{ letterSpacing: 1 }}>
          Mask Editor
        </Typography>
        <Stack direction="row" spacing={0.5} alignItems="center">
          {statusChip && (
            <Chip
              size="small"
              label={statusChip.label}
              color={statusChip.color}
              sx={{ fontSize: '0.6rem' }}
            />
          )}
          {hasUnsavedChanges && (
            <Chip
              size="small"
              label="Unsaved"
              color="warning"
              sx={{ fontSize: '0.6rem' }}
            />
          )}
        </Stack>
      </Stack>

      {maskSource === 'reference' && (
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1,
            alignItems: 'center',
            py: 1,
            px: 1.25,
            backgroundColor: 'rgba(255,255,255,0.04)',
            borderRadius: 1,
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ minWidth: 160 }}
          >
            Reference image shown underneath. Paint black where grout should be;
            unpainted areas become white in the final mask.
          </Typography>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              minWidth: 240,
            }}
          >
            <Typography variant="caption" color="text.secondary">
              Opacity
            </Typography>
            <Slider
              value={referenceOpacity}
              onChange={(_, value) => setReferenceOpacity(value as number)}
              min={0}
              max={1}
              step={0.05}
              sx={{ width: 140 }}
            />
          </Box>
          <Button
            size="small"
            variant="outlined"
            onClick={() => setShowReference((v) => !v)}
          >
            {showReference ? 'Hide reference' : 'Show reference'}
          </Button>
        </Box>
      )}

      {/* ── CANVAS ─────────────────────────────────────────────────────────── */}
      <Box
        ref={canvasContainerRef}
        data-mask-container
        sx={{
          flex: 1,
          minHeight: 0,
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: '#111',
          borderRadius: 1,
          cursor: isEditing ? getCursor(activeTool) : 'default',
          touchAction: 'none',
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        onPointerLeave={handlePointerLeave}
        onDoubleClick={handleDoubleClick}
        onContextMenu={(e) => e.preventDefault()}
      >
        {/* Viewport transform wrapper */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            transformOrigin: '0 0',
            transform: viewportTransformCss,
            willChange: 'transform',
          }}
        >
          {/* Canvas stack: reference (bottom) → mask (anchor) → preview (top) */}
          <Box sx={{ position: 'relative', display: 'inline-block' }}>
            <MaskCanvas
              ref={maskCanvasRef}
              width={canvasSize.w}
              height={canvasSize.h}
              sx={{ visibility: maskView ? 'hidden' : 'visible' }}
            />
            {/* Important: referenceCanvas is visual-only and must never be included in mask export. */}
            <ReferenceCanvas
              ref={referenceCanvasRef}
              width={canvasSize.w}
              height={canvasSize.h}
              sx={{ opacity: showReference ? referenceOpacity : 0 }}
            />
            <PreviewCanvas
              ref={previewCanvasRef}
              width={canvasSize.w}
              height={canvasSize.h}
              sx={{ opacity: maskView ? 1 : opacity }}
            />
          </Box>
        </Box>

        {/* Loading overlay */}
        {isLoading && (
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
            }}
          >
            <CircularProgress size={40} />
            <Typography variant="body2" color="text.secondary">
              Loading mask…
            </Typography>
          </Box>
        )}

        {/* Empty state — stop pointer events from reaching the canvas tools */}
        {isEmpty && (
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 3,
              p: 3,
            }}
            onPointerDown={(e) => e.stopPropagation()}
            onPointerMove={(e) => e.stopPropagation()}
            onPointerUp={(e) => e.stopPropagation()}
          >
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 0.5 }}>
                No mask found
              </Typography>
              <Typography variant="body2" color="text.disabled">
                Choose how to start your mask
              </Typography>
            </Box>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
              <Button
                variant="outlined"
                startIcon={<CropSquareIcon />}
                onClick={startBlankMask}
                sx={{ minWidth: 130 }}
              >
                Start Blank
              </Button>
              <Button
                variant="outlined"
                startIcon={<CameraAltIcon />}
                onClick={() => cameraInputRef.current?.click()}
                sx={{ minWidth: 130 }}
              >
                Camera
              </Button>
              <Button
                variant="outlined"
                startIcon={<FileUploadIcon />}
                onClick={() => fileInputRef.current?.click()}
                sx={{ minWidth: 130 }}
              >
                Upload File
              </Button>
            </Stack>
          </Box>
        )}

        {/* Pan mode badge */}
        {isEditing && activeTool === 'view-pan' && (
          <Box
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              bgcolor: 'rgba(0,0,0,0.65)',
              color: 'white',
              px: 1,
              py: 0.25,
              borderRadius: 1,
              fontSize: 11,
              pointerEvents: 'none',
              userSelect: 'none',
            }}
          >
            PAN
          </Box>
        )}

        {/* Zoom level — always visible in canvas corner */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 8,
            right: 8,
            bgcolor: 'rgba(0,0,0,0.55)',
            color: 'rgba(255,255,255,0.8)',
            px: 1,
            py: 0.25,
            borderRadius: 1,
            fontSize: 11,
            pointerEvents: 'none',
            userSelect: 'none',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {zoomPercent}%
        </Box>
      </Box>

      {/*
       * ── MOBILE BOTTOM DOCK ─────────────────────────────────────────────────
       * Visible on xs only. Sliders above the compact toolbar.
       */}
      <Box sx={{ flexShrink: 0, display: { xs: 'block', sm: 'none' } }}>
        <BrushOptions {...brushOptionsProps} />
      </Box>
      <Box sx={{ flexShrink: 0, display: { xs: 'block', sm: 'none' } }}>
        <MaskToolbar {...toolbarProps} compact />
      </Box>

      {/* ── VALIDATION ─────────────────────────────────────────────────────── */}
      <MaskValidationPanel validation={validation} />

      <Divider sx={{ flexShrink: 0 }} />

      {/* ── ACTIONS ────────────────────────────────────────────────────────── */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ flexShrink: 0 }}
        gap={1}
      >
        {/* Left side: secondary actions */}
        <Stack direction="row" spacing={1}>
          {/* Mobile: compact New Mask trigger (desktop has it in toolbar row) */}
          <Button
            size="small"
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={(e) => setNewMaskAnchorEl(e.currentTarget)}
            sx={{ display: { xs: 'inline-flex', sm: 'none' } }}
          >
            New
          </Button>
          {/* Desktop: Download */}
          <Button
            size="small"
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={handleDownload}
            disabled={!isEditing}
            sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
          >
            Download
          </Button>
          <Button
            size="small"
            variant="outlined"
            startIcon={<RestoreIcon />}
            onClick={revertToSnapshot}
            disabled={!hasUnsavedChanges}
            color="warning"
          >
            Revert
          </Button>
        </Stack>

        {/* Right side: primary actions */}
        <Stack direction="row" spacing={1}>
          {onCancel && (
            <Button
              size="small"
              variant="text"
              onClick={() => {
                if (hasUnsavedChanges) {
                  pendingLeaveActionRef.current = onCancel;
                  setGuardError(null);
                  setGuardDialogOpen(true);
                } else {
                  onCancel();
                }
              }}
              color="inherit"
            >
              Cancel
            </Button>
          )}
          <Button
            size="small"
            variant="contained"
            startIcon={<CloudUploadIcon />}
            onClick={handleUpload}
            disabled={uploading || !isEditing}
          >
            {uploading ? 'Uploading…' : 'Upload to OF'}
          </Button>
        </Stack>
      </Stack>

      {uploadSuccess && (
        <Alert severity="success" sx={{ flexShrink: 0 }}>
          Mask uploaded to Fireplace
        </Alert>
      )}
      {uploadError && (
        <Alert severity="error" sx={{ flexShrink: 0 }}>
          {uploadError}
        </Alert>
      )}

      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED}
        hidden
        onChange={(e) => handleFileChange(e, 'file')}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept={ACCEPTED}
        capture="environment"
        hidden
        onChange={(e) => handleFileChange(e, 'camera')}
      />

      {/* New Mask dropdown menu */}
      <Menu
        anchorEl={newMaskAnchorEl}
        open={Boolean(newMaskAnchorEl)}
        onClose={() => setNewMaskAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <MenuItem
          onClick={() => {
            setNewMaskAnchorEl(null);
            confirmThenDo(startBlankMask);
          }}
        >
          <ListItemIcon>
            <CropSquareIcon fontSize="small" />
          </ListItemIcon>
          Blank Canvas
        </MenuItem>
        <MenuItem
          onClick={() => {
            setNewMaskAnchorEl(null);
            confirmThenDo(() => cameraInputRef.current?.click());
          }}
        >
          <ListItemIcon>
            <CameraAltIcon fontSize="small" />
          </ListItemIcon>
          Camera
        </MenuItem>
        <MenuItem
          onClick={() => {
            setNewMaskAnchorEl(null);
            confirmThenDo(() => fileInputRef.current?.click());
          }}
        >
          <ListItemIcon>
            <FileUploadIcon fontSize="small" />
          </ListItemIcon>
          File Upload
        </MenuItem>
      </Menu>

      {/* Discard-edits confirmation dialog */}
      <Dialog open={confirmOpen} onClose={handleCancelConfirm}>
        <DialogTitle>Replace current mask?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You have unsaved edits. Creating a new mask will discard them.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelConfirm}>Keep editing</Button>
          <Button onClick={handleConfirmReplace} color="error">
            Discard &amp; continue
          </Button>
        </DialogActions>
      </Dialog>

      <UnsavedChangesDialog
        open={guardDialogOpen}
        title="Discard unsaved mask edits?"
        description="Canceling will discard the current mask changes and return to the previous screen."
        error={guardError}
        showSave={false}
        onDiscard={() => {
          discardChanges();
          setGuardDialogOpen(false);
          pendingLeaveActionRef.current?.();
          pendingLeaveActionRef.current = null;
        }}
        onCancel={() => {
          setGuardDialogOpen(false);
          pendingLeaveActionRef.current = null;
        }}
      />
    </Box>
  );
};
