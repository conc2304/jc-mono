import React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { EditorToolId } from '../../types';

const SIZE_TOOLS: EditorToolId[] = ['brush', 'eraser', 'selection-brush'];

export interface BrushOptionsProps {
  brushSize: number;
  onBrushSizeChange: (size: number) => void;
  opacity: number;
  onOpacityChange: (opacity: number) => void;
  /** When provided, brush size control is hidden for tools that don't use it */
  activeTool?: EditorToolId;
  /** Lay sliders side-by-side (desktop inline mode) */
  horizontal?: boolean;
}

export const BrushOptions: React.FC<BrushOptionsProps> = ({
  brushSize,
  onBrushSizeChange,
  opacity,
  onOpacityChange,
  activeTool,
  horizontal = false,
}) => {
  const showBrushSize = !activeTool || SIZE_TOOLS.includes(activeTool);

  const previewDiameter = Math.min(brushSize, 48);

  return (
    <Stack direction={horizontal ? 'row' : 'column'} spacing={horizontal ? 2 : 0.25} alignItems={horizontal ? 'flex-end' : undefined}>
      {showBrushSize && (
        <Box sx={{ flex: horizontal ? 1 : undefined, minWidth: horizontal ? 110 : undefined }}>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Brush size</span>
            <span>{brushSize}px</span>
          </Typography>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Slider
              size="small"
              min={4}
              max={80}
              value={brushSize}
              onChange={(_, v) => onBrushSizeChange(v as number)}
              sx={{ flex: 1 }}
            />
            <Box sx={{ width: 48, height: 48, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Box sx={{
                width: previewDiameter,
                height: previewDiameter,
                borderRadius: '50%',
                bgcolor: 'text.primary',
                opacity: 0.75,
                flexShrink: 0,
              }} />
            </Box>
          </Stack>
        </Box>
      )}
      <Box sx={{ flex: horizontal ? 1 : undefined, minWidth: horizontal ? 110 : undefined }}>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Overlay opacity</span>
          <span>{Math.round(opacity * 100)}%</span>
        </Typography>
        <Slider
          size="small"
          min={0.1}
          max={1}
          step={0.05}
          value={opacity}
          onChange={(_, v) => onOpacityChange(v as number)}
        />
      </Box>
    </Stack>
  );
};
