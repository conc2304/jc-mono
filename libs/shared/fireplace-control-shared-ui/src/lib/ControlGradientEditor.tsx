import React, { useCallback, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Popover from '@mui/material/Popover';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import type { GradientStop } from '@jc/of-control-protocol';

// ── Color space conversions ──────────────────────────────────────────────────

function linearToSrgb(c: number): number {
  const x = Math.max(0, Math.min(1, c));
  return x <= 0.0031308 ? x * 12.92 : 1.055 * Math.pow(x, 1 / 2.4) - 0.055;
}

function srgbToLinear(c: number): number {
  const x = Math.max(0, Math.min(1, c));
  return x <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
}

function stopToCss(stop: GradientStop): string {
  return `rgb(${Math.round(linearToSrgb(stop.r) * 255)},${Math.round(linearToSrgb(stop.g) * 255)},${Math.round(linearToSrgb(stop.b) * 255)})`;
}

function stopToHex(stop: GradientStop): string {
  const ch = (v: number) => Math.round(linearToSrgb(v) * 255).toString(16).padStart(2, '0');
  return `#${ch(stop.r)}${ch(stop.g)}${ch(stop.b)}`;
}

function hexToLinear(hex: string): Pick<GradientStop, 'r' | 'g' | 'b'> {
  return {
    r: srgbToLinear(parseInt(hex.slice(1, 3), 16) / 255),
    g: srgbToLinear(parseInt(hex.slice(3, 5), 16) / 255),
    b: srgbToLinear(parseInt(hex.slice(5, 7), 16) / 255),
  };
}

function buildCssGradient(stops: GradientStop[]): string {
  if (stops.length === 0) return 'linear-gradient(to right, #1a1a1a, #444)';
  if (stops.length === 1) return stopToCss(stops[0]);
  const parts = stops.map(s => `${stopToCss(s)} ${(s.t * 100).toFixed(1)}%`);
  return `linear-gradient(to right, ${parts.join(', ')})`;
}

function interpolateAt(stops: GradientStop[], t: number): GradientStop {
  if (stops.length === 0) return { t, r: 1, g: 1, b: 1, a: 1 };
  if (stops.length === 1) return { ...stops[0], t };
  const before = stops.filter(s => s.t <= t).pop() ?? stops[0];
  const after = stops.find(s => s.t > t) ?? stops[stops.length - 1];
  if (before === after) return { ...before, t };
  const span = after.t - before.t;
  const f = span === 0 ? 0 : (t - before.t) / span;
  return {
    t,
    r: before.r + (after.r - before.r) * f,
    g: before.g + (after.g - before.g) * f,
    b: before.b + (after.b - before.b) * f,
    a: before.a + (after.a - before.a) * f,
  };
}

// ── Component ────────────────────────────────────────────────────────────────

export interface ControlGradientEditorProps {
  id: string;
  label?: string;
  value: GradientStop[];
  description?: string;
  disabled?: boolean;
  onChange: (id: string, value: GradientStop[]) => void;
}

const BAR_HEIGHT = 28;
const HANDLE_SIZE = 20;
const HANDLE_OVERLAP = 6;

export const ControlGradientEditor: React.FC<ControlGradientEditorProps> = ({
  id,
  label,
  value,
  description,
  disabled = false,
  onChange,
}) => {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [pickerAnchor, setPickerAnchor] = useState<HTMLElement | null>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);

  // Keep stops sorted for rendering and index-based operations
  const sorted = [...value].sort((a, b) => a.t - b.t);

  const getT = useCallback((clientX: number): number => {
    if (!barRef.current) return 0;
    const rect = barRef.current.getBoundingClientRect();
    return Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
  }, []);

  const emit = useCallback((stops: GradientStop[]) => {
    onChange(id, [...stops].sort((a, b) => a.t - b.t));
  }, [id, onChange]);

  // Click on gradient bar → add a new stop at that position
  const handleBarClick = useCallback((e: React.MouseEvent) => {
    if (disabled || isDraggingRef.current) return;
    const t = getT(e.clientX);
    const newStop = interpolateAt(sorted, t);
    const newStops = [...sorted, newStop];
    const newSorted = newStops.slice().sort((a, b) => a.t - b.t);
    setSelectedIdx(newSorted.indexOf(newStop));
    emit(newStops);
  }, [disabled, getT, sorted, emit]);

  // Drag a stop handle — clamped between its neighbours to prevent crossover
  const handleStopPointerDown = useCallback((e: React.PointerEvent, idx: number) => {
    if (disabled) return;
    e.stopPropagation();
    e.preventDefault();
    isDraggingRef.current = true;
    setSelectedIdx(idx);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }, [disabled]);

  const handleStopPointerMove = useCallback((e: React.PointerEvent, idx: number) => {
    if (!isDraggingRef.current) return;
    const minT = sorted[idx - 1]?.t ?? 0;
    const maxT = sorted[idx + 1]?.t ?? 1;
    const t = Math.max(minT + 0.001, Math.min(maxT - 0.001, getT(e.clientX)));
    emit(sorted.map((s, i) => (i === idx ? { ...s, t } : s)));
  }, [isDraggingRef, sorted, getT, emit]);

  const handleStopPointerUp = useCallback((e: React.PointerEvent) => {
    isDraggingRef.current = false;
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
  }, []);

  // Color change via native color picker
  const handleColorChange = useCallback((hex: string) => {
    if (selectedIdx === null) return;
    const { r, g, b } = hexToLinear(hex);
    emit(sorted.map((s, i) => (i === selectedIdx ? { ...s, r, g, b } : s)));
  }, [selectedIdx, sorted, emit]);

  // Remove selected stop (at least 2 stops must remain)
  const handleRemoveStop = useCallback(() => {
    if (selectedIdx === null || sorted.length <= 2) return;
    setSelectedIdx(null);
    setPickerAnchor(null);
    emit(sorted.filter((_, i) => i !== selectedIdx));
  }, [selectedIdx, sorted, emit]);

  const selectedStop = selectedIdx !== null ? (sorted[selectedIdx] ?? null) : null;
  const pickerOpen = Boolean(pickerAnchor);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75, py: 0.5 }}>
      {label && (
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
          {label}
        </Typography>
      )}

      {/* Gradient bar + handles */}
      <Box
        sx={{
          position: 'relative',
          height: BAR_HEIGHT,
          mb: `${HANDLE_SIZE - HANDLE_OVERLAP}px`,
          overflow: 'visible',
        }}
      >
        {/* Clickable gradient preview */}
        <Box
          ref={barRef}
          onClick={handleBarClick}
          sx={{
            position: 'absolute',
            inset: 0,
            borderRadius: 1,
            background: buildCssGradient(sorted),
            cursor: disabled ? 'default' : 'crosshair',
            border: '1px solid',
            borderColor: 'divider',
          }}
        />

        {/* Stop handles — sit at the bottom edge of the bar */}
        {sorted.map((stop, idx) => (
          <Box
            key={idx}
            onPointerDown={(e) => handleStopPointerDown(e, idx)}
            onPointerMove={(e) => handleStopPointerMove(e, idx)}
            onPointerUp={(e) => handleStopPointerUp(e)}
            sx={{
              position: 'absolute',
              top: BAR_HEIGHT - HANDLE_OVERLAP,
              left: `${stop.t * 100}%`,
              transform: 'translateX(-50%)',
              width: HANDLE_SIZE,
              height: HANDLE_SIZE,
              borderRadius: '50%',
              background: stopToCss(stop),
              border: '2px solid',
              borderColor: selectedIdx === idx ? 'primary.main' : 'rgba(255,255,255,0.65)',
              boxShadow:
                selectedIdx === idx
                  ? '0 0 0 2px rgba(255,120,0,0.35), 0 2px 5px rgba(0,0,0,0.5)'
                  : '0 1px 4px rgba(0,0,0,0.45)',
              cursor: disabled ? 'default' : 'grab',
              touchAction: 'none',
              userSelect: 'none',
              zIndex: selectedIdx === idx ? 2 : 1,
              transition: 'border-color 0.1s, box-shadow 0.1s',
            }}
          />
        ))}
      </Box>

      {/* Controls row: position label + color swatch + remove button */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minHeight: 28 }}>
        {selectedStop !== null ? (
          <>
            <Typography variant="caption" color="text.secondary" sx={{ flex: 1 }}>
              Position {(selectedStop.t * 100).toFixed(0)}%
            </Typography>

            <Tooltip title="Edit stop color">
              <Box
                onClick={(e) => !disabled && setPickerAnchor(e.currentTarget)}
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: 0.5,
                  background: stopToCss(selectedStop),
                  border: '2px solid',
                  borderColor: 'primary.main',
                  cursor: disabled ? 'default' : 'pointer',
                  flexShrink: 0,
                }}
              />
            </Tooltip>

            <Popover
              open={pickerOpen}
              anchorEl={pickerAnchor}
              onClose={() => setPickerAnchor(null)}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <Box sx={{ p: 1.5 }}>
                <input
                  type="color"
                  value={stopToHex(selectedStop)}
                  onChange={(e) => handleColorChange(e.target.value)}
                  style={{ width: 140, height: 140, border: 'none', cursor: 'pointer', background: 'none' }}
                  aria-label="Stop color"
                />
              </Box>
            </Popover>

            <Tooltip title={sorted.length <= 2 ? 'Need at least 2 stops' : 'Remove stop'}>
              <Box
                component="button"
                onClick={handleRemoveStop}
                disabled={sorted.length <= 2}
                sx={{
                  width: 28,
                  height: 28,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 0.5,
                  background: 'none',
                  color: sorted.length <= 2 ? 'text.disabled' : 'error.main',
                  cursor: sorted.length <= 2 ? 'default' : 'pointer',
                  fontSize: 18,
                  lineHeight: 1,
                  p: 0,
                  flexShrink: 0,
                  '&:not([disabled]):hover': {
                    bgcolor: 'error.main',
                    color: 'error.contrastText',
                    borderColor: 'error.main',
                  },
                }}
              >
                ×
              </Box>
            </Tooltip>
          </>
        ) : (
          <Typography variant="caption" color="text.secondary" sx={{ opacity: 0.55 }}>
            Tap gradient to add a stop · Tap handle to select
          </Typography>
        )}
      </Box>

      {description && (
        <Typography variant="caption" color="text.secondary" sx={{ opacity: 0.6 }}>
          {description}
        </Typography>
      )}
    </Box>
  );
};
