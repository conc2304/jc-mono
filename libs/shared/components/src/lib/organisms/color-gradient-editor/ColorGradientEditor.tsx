import React, { useEffect } from 'react';
import { Box, Button, Typography, Paper } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import {
  useGradientStops,
  ColorStop as ColorStopType,
} from './hooks/useGradientStops';
import { GradientBar } from '../../atoms/gradient-bar';
import { ColorStopControls } from '../../atoms/color-stop-controls';
import { ColorStop } from './types';
import { AugmentedButton } from '../../atoms';

export interface GradientData {
  stops: ColorStop[];
  cssGradient: string;
}

interface GradientEditorProps {
  initialStops?: ColorStopType[];
  onGradientChange?: (gradientData: GradientData) => void;
  showTitle?: boolean;
}

export const ColorGradientEditor: React.FC<GradientEditorProps> = ({
  initialStops,
  onGradientChange,
  showTitle = true,
}) => {
  const {
    stops,
    selectedStop,
    setSelectedStop,
    addStop,
    removeStop,
    updateStopColor,
    updateStopPosition,
    navigateToPreviousStop,
    navigateToNextStop,
    generateGradient,
    interpolateColor,
    getSortedStops,
  } = useGradientStops(initialStops);

  // Notify parent of gradient changes
  useEffect(() => {
    if (onGradientChange) {
      const sortedStops = getSortedStops();
      onGradientChange({
        stops: sortedStops,
        cssGradient: generateGradient(),
      });
    }
  }, [stops, onGradientChange, getSortedStops, generateGradient]);

  return (
    <Box sx={{ width: '100%', maxWidth: 768, mx: 'auto', p: 0 }}>
      {showTitle && (
        <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
          Gradient Editor
        </Typography>
      )}

      {/* Gradient Preview */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="body2"
          fontWeight={600}
          color="text.primary"
          sx={{ mb: 1 }}
        >
          Preview
        </Typography>
        <Box
          sx={{
            width: '100%',
            height: 128,
            background: generateGradient(),
          }}
        />
      </Box>

      {/* Gradient Bar with Stops */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="body2"
          fontWeight={600}
          color="text.primary"
          sx={{ mb: 1 }}
        >
          Color Stops
        </Typography>
        <GradientBar
          stops={stops}
          selectedStop={selectedStop}
          gradient={generateGradient()}
          onStopSelect={setSelectedStop}
          onStopPositionChange={updateStopPosition}
          onAddStop={(position, color) => {
            addStop();
          }}
          interpolateColor={interpolateColor}
        />
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mt: 1, display: 'block' }}
        >
          Click on the gradient bar to add a new stop, or drag existing stops to
          reposition them
        </Typography>
      </Box>

      {/* Add Stop Button */}
      <Box sx={{ mb: 3 }}>
        <AugmentedButton
          fullWidth
          shape={'inlayButton'}
          variant="contained"
          onClick={addStop}
          startIcon={<AddIcon />}
        >
          Add Color Stop
        </AugmentedButton>
      </Box>

      {/* Selected Stop Controls */}
      <ColorStopControls
        stops={stops}
        selectedStop={selectedStop}
        onStopColorChange={updateStopColor}
        onStopPositionChange={updateStopPosition}
        onStopRemove={removeStop}
        onNavigatePrevious={navigateToPreviousStop}
        onNavigateNext={navigateToNextStop}
      />
    </Box>
  );
};
