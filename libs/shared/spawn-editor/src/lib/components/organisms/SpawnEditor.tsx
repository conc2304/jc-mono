import React, {
  useRef,
  useState,
  useCallback,
  useLayoutEffect,
  useEffect,
} from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import AddIcon from '@mui/icons-material/Add';
import { UnsavedChangesDialog } from '@jc/ui-components';
import { useSpawnEditor } from '../../hooks/useSpawnEditor';
import { SpawnToolbar } from '../molecules/SpawnToolbar';

interface Props {
  maskId?: string;
  baseUrl?: string;
  onRegisterUnsavedChanges?: (
    handler: {
      hasUnsavedChanges: boolean;
      save: () => Promise<void>;
      discard: () => void;
    } | null
  ) => void;
}

export const SpawnEditor: React.FC<Props> = ({
  maskId = 'current',
  baseUrl = '',
  onRegisterUnsavedChanges,
}) => {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);

  const [maskSize, setMaskSize] = useState({ w: 640, h: 360 });
  const [maskLoading, setMaskLoading] = useState(true);
  const [maskError, setMaskError] = useState(false);
  const [maskSrc] = useState(
    () => `${baseUrl}/api/mask/current.png?v=${Date.now()}`
  );

  const {
    viewportCss,
    zoomPercent,
    fitToView,
    onWheelNative,
    configs,
    activeConfigId,
    activeConfig,
    setActiveConfigId,
    addConfig,
    deleteConfig,
    selectedRegionId,
    selectedRegion,
    deleteRegion,
    toggleRegion,
    drawMode,
    setDrawMode,
    loading,
    error,
    saveStatus,
    activateStatus,
    activateConfig,
    hasUnsavedChanges,
    saveChanges,
    discardChanges,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handlePointerCancel,
  } = useSpawnEditor({
    canvasContainerRef,
    overlayCanvasRef,
    maskSize,
    maskId,
    baseUrl,
  });

  // Attach non-passive wheel listener
  useEffect(() => {
    const el = canvasContainerRef.current;
    if (!el) return;
    el.addEventListener('wheel', onWheelNative, { passive: false });
    return () => el.removeEventListener('wheel', onWheelNative);
  }, [onWheelNative]);

  // Fit viewport after container is measured
  useLayoutEffect(() => {
    fitToView();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleImageLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const img = e.currentTarget;
      setMaskSize({ w: img.naturalWidth, h: img.naturalHeight });
      setMaskLoading(false);
    },
    []
  );

  const handleImageError = useCallback(() => {
    setMaskLoading(false);
    setMaskError(true);
  }, []);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [confirmError, setConfirmError] = useState<string | null>(null);
  const [confirmSaving, setConfirmSaving] = useState(false);
  const pendingActionRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    onRegisterUnsavedChanges?.({
      hasUnsavedChanges,
      save: saveChanges,
      discard: discardChanges,
    });
    return () => onRegisterUnsavedChanges?.(null);
  }, [
    hasUnsavedChanges,
    saveChanges,
    discardChanges,
    onRegisterUnsavedChanges,
  ]);

  const confirmThenDo = useCallback(
    (action: () => void, message: string) => {
      if (!hasUnsavedChanges) {
        action();
        return;
      }

      pendingActionRef.current = action;
      setConfirmMessage(message);
      setConfirmError(null);
      setConfirmOpen(true);
    },
    [hasUnsavedChanges]
  );

  const handleConfirmSave = useCallback(async () => {
    if (!pendingActionRef.current) {
      setConfirmOpen(false);
      return;
    }
    setConfirmSaving(true);
    setConfirmError(null);
    try {
      await saveChanges();
      setConfirmOpen(false);
      pendingActionRef.current?.();
      pendingActionRef.current = null;
    } catch (error) {
      setConfirmError(error instanceof Error ? error.message : String(error));
    } finally {
      setConfirmSaving(false);
    }
  }, [saveChanges]);

  const handleConfirmDiscard = useCallback(() => {
    discardChanges();
    setConfirmOpen(false);
    pendingActionRef.current?.();
    pendingActionRef.current = null;
  }, [discardChanges]);

  const handleConfirmCancel = useCallback(() => {
    setConfirmOpen(false);
    pendingActionRef.current = null;
  }, []);

  const getCursor = () => {
    if (drawMode === 'draw') return 'crosshair';
    return 'default';
  };

  const handleSelectConfig = useCallback(
    (id: string | null) => {
      confirmThenDo(
        () => setActiveConfigId(id),
        'Switching configs will discard unsaved spawn edits.'
      );
    },
    [confirmThenDo, setActiveConfigId]
  );

  const handleAddConfig = useCallback(() => {
    confirmThenDo(
      addConfig,
      'Adding a new config will discard unsaved spawn edits.'
    );
  }, [addConfig, confirmThenDo]);

  const handleDeleteConfig = useCallback(
    (id: string) => {
      confirmThenDo(
        () => deleteConfig(id),
        'Deleting this config will discard unsaved spawn edits.'
      );
    },
    [confirmThenDo, deleteConfig]
  );

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        gap: 1,
        overflow: 'hidden',
      }}
    >
      {/* ── TOOLBAR (desktop / tablet) ────────────────────────────────── */}
      <Box sx={{ flexShrink: 0, display: { xs: 'none', sm: 'block' } }}>
        <SpawnToolbar
          configs={configs}
          activeConfigId={activeConfigId}
          onSelectConfig={handleSelectConfig}
          onAddConfig={handleAddConfig}
          onDeleteConfig={handleDeleteConfig}
          drawMode={drawMode}
          onDrawModeChange={setDrawMode}
          selectedRegion={selectedRegion}
          onDeleteRegion={() =>
            selectedRegionId && deleteRegion(selectedRegionId)
          }
          onToggleRegion={() =>
            selectedRegionId && toggleRegion(selectedRegionId)
          }
          onActivate={activateConfig}
          saveStatus={saveStatus}
          activateStatus={activateStatus}
          loading={loading}
        />
      </Box>

      {/* ── MOBILE header ────────────────────────────────────────────── */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ flexShrink: 0, display: { xs: 'flex', sm: 'none' } }}
      >
        <Typography variant="overline" sx={{ letterSpacing: 1 }}>
          Spawn Editor
        </Typography>
      </Stack>

      {/* ── CANVAS AREA ──────────────────────────────────────────────── */}
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
          cursor: getCursor(),
          touchAction: 'none',
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        onContextMenu={(e) => e.preventDefault()}
      >
        {/* Viewport-transformed layer */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            transformOrigin: '0 0',
            transform: viewportCss,
            willChange: 'transform',
          }}
        >
          {/* Mask image background */}
          <img
            src={maskSrc}
            alt="Mask"
            width={maskSize.w}
            height={maskSize.h}
            onLoad={handleImageLoad}
            onError={handleImageError}
            style={{
              display: 'block',
              width: maskSize.w,
              height: maskSize.h,
              imageRendering: 'pixelated',
              userSelect: 'none',
              pointerEvents: 'none',
            }}
          />
          {/* Spawn overlay canvas */}
          <canvas
            ref={overlayCanvasRef}
            width={maskSize.w}
            height={maskSize.h}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              pointerEvents: 'none',
              imageRendering: 'pixelated',
            }}
          />
        </Box>

        {/* Mask loading spinner */}
        {maskLoading && (
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
            <CircularProgress size={36} />
            <Typography variant="body2" color="text.secondary">
              Loading mask…
            </Typography>
          </Box>
        )}

        {/* No mask found */}
        {maskError && !maskLoading && (
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
              p: 3,
              textAlign: 'center',
            }}
          >
            <Typography variant="h6" color="text.secondary">
              No mask found
            </Typography>
            <Typography variant="body2" color="text.disabled">
              Capture and upload a mask from the Mask tab first.
            </Typography>
          </Box>
        )}

        {/* Empty config prompt (mask loaded but no configs yet) */}
        {!maskError && !maskLoading && configs.length === 0 && !loading && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 48,
              left: '50%',
              transform: 'translateX(-50%)',
            }}
          >
            <Button
              variant="outlined"
              size="small"
              startIcon={<AddIcon />}
              onClick={addConfig}
              sx={{ bgcolor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
            >
              Add spawn config to get started
            </Button>
          </Box>
        )}

        {/* Zoom badge */}
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

        {/* Region count badge for active config */}
        {activeConfig && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 8,
              left: 8,
              bgcolor: 'rgba(0,0,0,0.55)',
              color: 'rgba(255,180,0,0.9)',
              px: 1,
              py: 0.25,
              borderRadius: 1,
              fontSize: 11,
              pointerEvents: 'none',
              userSelect: 'none',
            }}
          >
            {activeConfig.regions.length} spawn{' '}
            {activeConfig.regions.length === 1 ? 'region' : 'regions'}
          </Box>
        )}
      </Box>

      {/* ── MOBILE TOOLBAR (bottom dock) ─────────────────────────────── */}
      <Box sx={{ flexShrink: 0, display: { xs: 'block', sm: 'none' } }}>
        <SpawnToolbar
          configs={configs}
          activeConfigId={activeConfigId}
          onSelectConfig={handleSelectConfig}
          onAddConfig={handleAddConfig}
          onDeleteConfig={handleDeleteConfig}
          drawMode={drawMode}
          onDrawModeChange={setDrawMode}
          selectedRegion={selectedRegion}
          onDeleteRegion={() =>
            selectedRegionId && deleteRegion(selectedRegionId)
          }
          onToggleRegion={() =>
            selectedRegionId && toggleRegion(selectedRegionId)
          }
          onActivate={activateConfig}
          saveStatus={saveStatus}
          activateStatus={activateStatus}
          loading={loading}
          compact
        />
      </Box>

      {/* ── ALERTS ───────────────────────────────────────────────────── */}
      {error && (
        <Alert severity="error" sx={{ flexShrink: 0 }}>
          {error}
        </Alert>
      )}
      {activateStatus === 'done' && (
        <Alert severity="success" sx={{ flexShrink: 0 }}>
          Spawn config activated — simulation updated.
        </Alert>
      )}
      {activateStatus === 'error' && (
        <Alert severity="error" sx={{ flexShrink: 0 }}>
          Failed to activate config. Is the fireplace connected?
        </Alert>
      )}

      <UnsavedChangesDialog
        open={confirmOpen}
        title="Unsaved spawn changes"
        description={confirmMessage}
        saving={confirmSaving}
        error={confirmError}
        onSave={handleConfirmSave}
        onDiscard={handleConfirmDiscard}
        onCancel={handleConfirmCancel}
      />
    </Box>
  );
};
