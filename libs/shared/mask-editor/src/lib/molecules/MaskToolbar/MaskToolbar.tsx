import React from 'react';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import BrushIcon from '@mui/icons-material/Brush';
import GestureIcon from '@mui/icons-material/Gesture';
import PolylineIcon from '@mui/icons-material/Polyline';
import TimelineIcon from '@mui/icons-material/Timeline';
import SelectAllIcon from '@mui/icons-material/SelectAll';
import InvertColorsIcon from '@mui/icons-material/InvertColors';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { ToolButton } from '../../atoms/ToolButton';
import { ModeToggle } from '../../atoms/ModeToggle';
import { ZoomControls } from '../../atoms/ZoomControls';
import type { EditorToolId, MaskEditMode } from '../../types';

export interface MaskToolbarProps {
  activeTool: EditorToolId;
  onSetTool: (tool: EditorToolId) => void;
  editMode: MaskEditMode;
  onSetMode: (mode: MaskEditMode) => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onInvert: () => void;
  maskView: boolean;
  onToggleMaskView: () => void;
  zoomPercent: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFit: () => void;
  onActualSize: () => void;
  onReset: () => void;
  /** compact=true collapses to a two-row mobile dock with larger touch targets */
  compact?: boolean;
}

const MASK_TOOLS: { id: EditorToolId; label: string; icon: React.ReactNode }[] = [
  { id: 'brush',           label: 'Brush (B)',           icon: <BrushIcon fontSize="small" /> },
  { id: 'lasso-freehand',  label: 'Freehand Lasso (L)',  icon: <GestureIcon fontSize="small" /> },
  { id: 'lasso-polygon',   label: 'Polygon Lasso (P)',   icon: <PolylineIcon fontSize="small" /> },
  { id: 'lasso-curve',     label: 'Curve Lasso (C)',     icon: <TimelineIcon fontSize="small" /> },
  { id: 'selection-brush', label: 'Selection Brush (S)', icon: <SelectAllIcon fontSize="small" /> },
];

export const MaskToolbar: React.FC<MaskToolbarProps> = ({
  activeTool,
  onSetTool,
  editMode,
  onSetMode,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onInvert,
  maskView,
  onToggleMaskView,
  zoomPercent,
  onZoomIn,
  onZoomOut,
  onFit,
  onActualSize,
  onReset,
  compact = false,
}) => {
  const btnSize = compact ? 'medium' : 'small';
  const panMode = () => onSetTool(activeTool === 'view-pan' ? 'brush' : 'view-pan');

  const toolGroup = (
    <Stack direction="row" spacing={0}>
      {MASK_TOOLS.map(({ id, label, icon }) => (
        <ToolButton key={id} label={label} onClick={() => onSetTool(id)} active={activeTool === id} size={btnSize}>
          {icon}
        </ToolButton>
      ))}
    </Stack>
  );

  const historyGroup = (
    <Stack direction="row" spacing={0}>
      <ToolButton label="Undo (⌘Z)" onClick={onUndo} disabled={!canUndo} size={btnSize}>
        <UndoIcon fontSize="small" />
      </ToolButton>
      <ToolButton label="Redo (⌘⇧Z)" onClick={onRedo} disabled={!canRedo} size={btnSize}>
        <RedoIcon fontSize="small" />
      </ToolButton>
      <ToolButton label="Invert mask" onClick={onInvert} size={btnSize}>
        <InvertColorsIcon fontSize="small" />
      </ToolButton>
      <ToolButton
        label={maskView ? 'Show source image' : 'Preview mask only'}
        onClick={onToggleMaskView}
        active={maskView}
        size={btnSize}
      >
        {maskView ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
      </ToolButton>
    </Stack>
  );

  if (compact) {
    return (
      <Stack direction="column" spacing={0.5}>
        {/* Row 1 — tools · operation · history */}
        <Stack direction="row" spacing={0.5} alignItems="center" useFlexGap sx={{ overflowX: 'auto' }}>
          {toolGroup}
          <Divider orientation="vertical" flexItem />
          <ModeToggle mode={editMode} onChange={onSetMode} size="medium" />
          <Divider orientation="vertical" flexItem />
          {historyGroup}
        </Stack>
        {/* Row 2 — viewport navigation */}
        <Stack direction="row" alignItems="center">
          <ZoomControls
            zoomPercent={zoomPercent}
            activeTool={activeTool}
            onZoomIn={onZoomIn}
            onZoomOut={onZoomOut}
            onFit={onFit}
            onActualSize={onActualSize}
            onReset={onReset}
            onPanMode={panMode}
            size="medium"
          />
        </Stack>
      </Stack>
    );
  }

  return (
    <Stack direction="row" spacing={0.5} alignItems="center" useFlexGap flexWrap="wrap">
      {/* Group 1 — mask tools (brush, lasso variants, selection brush) */}
      {toolGroup}

      <Divider orientation="vertical" flexItem />

      {/* Group 2 — operation mode (add / subtract) */}
      <ModeToggle mode={editMode} onChange={onSetMode} />

      <Divider orientation="vertical" flexItem />

      {/* Group 3 — history + preview */}
      {historyGroup}

      <Divider orientation="vertical" flexItem />

      {/* Group 4 — viewport navigation */}
      <ZoomControls
        zoomPercent={zoomPercent}
        activeTool={activeTool}
        onZoomIn={onZoomIn}
        onZoomOut={onZoomOut}
        onFit={onFit}
        onActualSize={onActualSize}
        onReset={onReset}
        onPanMode={panMode}
      />
    </Stack>
  );
};
