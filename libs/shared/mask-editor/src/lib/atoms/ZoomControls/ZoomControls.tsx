import React from 'react';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import FitScreenIcon from '@mui/icons-material/FitScreen';
import OneKIcon from '@mui/icons-material/OneK';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import PanToolIcon from '@mui/icons-material/PanTool';
import { ToolButton } from '../ToolButton';
import type { EditorToolId } from '../../types';

export interface ZoomControlsProps {
  zoomPercent: number;
  activeTool: EditorToolId;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFit: () => void;
  onActualSize: () => void;
  onReset: () => void;
  onPanMode: () => void;
  size?: 'small' | 'medium';
}

export const ZoomControls: React.FC<ZoomControlsProps> = ({
  zoomPercent,
  activeTool,
  onZoomIn,
  onZoomOut,
  onFit,
  onActualSize,
  onReset,
  onPanMode,
  size = 'small',
}) => (
  <Stack direction="row" spacing={0} alignItems="center">
    <ToolButton label="Pan (H)" onClick={onPanMode} active={activeTool === 'view-pan'} size={size}>
      <PanToolIcon fontSize="small" />
    </ToolButton>
    <Divider orientation="vertical" flexItem sx={{ mx: 0.25 }} />
    <ToolButton label="Zoom out (Ctrl+−)" onClick={onZoomOut} size={size}>
      <ZoomOutIcon fontSize="small" />
    </ToolButton>
    <ToolButton label="Zoom in (Ctrl++)" onClick={onZoomIn} size={size}>
      <ZoomInIcon fontSize="small" />
    </ToolButton>
    <Divider orientation="vertical" flexItem sx={{ mx: 0.25 }} />
    <ToolButton label="Fit to view (Ctrl+0)" onClick={onFit} size={size}>
      <FitScreenIcon fontSize="small" />
    </ToolButton>
    <ToolButton label="Actual size (Ctrl+1)" onClick={onActualSize} size={size}>
      <OneKIcon fontSize="small" />
    </ToolButton>
    <ToolButton label="Reset view" onClick={onReset} size={size}>
      <RestartAltIcon fontSize="small" />
    </ToolButton>
  </Stack>
);
