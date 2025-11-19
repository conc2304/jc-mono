import { useState, useMemo } from 'react';
import { Box, Container, Typography, Paper, useTheme } from '@mui/material';

import {
  ColorSwatchPicker,
  GradientPatternSelector,
  GradientPatternVisualizer,
  type Gradient,
  type GradientPatternConfig,
} from '@jc/ui-components';
import { hexToRgb, rgbToHsv } from '@jc/utils';

interface ColorPickerPageProps {
  onUpdate: (color: string) => void;
}

type DisplayMode = 'solid-color' | 'gradient' | 'pattern' | 'image';

const defaultColors = [
  '#f0f0f0',
  '#ff0000ff',
  '#ffbf00ff',
  '#fbff00ff',
  '#00ff00ff',
  '#6ff7f5ff',
  '#0000ffff',
  '#ff00ffff',
];

const defaultGradients: Gradient[] = [
  {
    id: 'sunset',
    stops: [
      { id: 1, color: '#FF0080', position: 0 },
      { id: 2, color: '#FF8C00', position: 50 },
      { id: 3, color: '#FFD700', position: 100 },
    ],
  },
  {
    id: 'ocean',
    stops: [
      { id: 1, color: '#00FFFF', position: 0 },
      { id: 2, color: '#0080FF', position: 50 },
      { id: 3, color: '#0000FF', position: 100 },
    ],
  },
  {
    id: 'forest',
    stops: [
      { id: 1, color: '#00FF00', position: 0 },
      { id: 2, color: '#00FF80', position: 50 },
      { id: 3, color: '#00FFFF', position: 100 },
    ],
  },
  {
    id: 'fire',
    stops: [
      { id: 1, color: '#000203ff', position: 0 },
      { id: 2, color: '#FF0000', position: 15 },
      { id: 3, color: '#FF8000', position: 60 },
      { id: 4, color: '#FFFF00', position: 80 },
      { id: 5, color: '#000203ff', position: 100 },
    ],
  },
  {
    id: 'purple-haze',
    stops: [
      { id: 1, color: '#8000FF', position: 0 },
      { id: 2, color: '#FF00FF', position: 100 },
    ],
  },
  {
    id: 'rainbow',
    stops: [
      { id: 1, color: '#FF0000', position: 0 },
      { id: 2, color: '#FFFF00', position: 25 },
      { id: 3, color: '#00FF00', position: 50 },
      { id: 4, color: '#00FFFF', position: 75 },
      { id: 5, color: '#0000FF', position: 100 },
    ],
  },
  {
    id: 'neon-pink',
    stops: [
      { id: 1, color: '#FF0080', position: 0 },
      { id: 2, color: '#FF00FF', position: 100 },
    ],
  },
  {
    id: 'electric',
    stops: [
      { id: 1, color: '#00FFFF', position: 0 },
      { id: 2, color: '#FF00FF', position: 50 },
      { id: 3, color: '#FFFF00', position: 100 },
    ],
  },
];

export const ColorPickerPage = ({ onUpdate }: ColorPickerPageProps) => {
  const theme = useTheme();
  const [savedColors, setSavedColors] = useState<string[]>([]);
  const [displayMode, setDisplayMode] = useState<DisplayMode>('solid-color');
  const [activeColor, setActiveColor] = useState<string>(defaultColors[0]);
  const [patternGradient, setPatternGradient] = useState<Gradient | null>(null);
  const [patternConfig, setPatternConfig] = useState<GradientPatternConfig>({
    type: 'horizontal',
    interpolation: 'linear',
    speed: 0,
  });

  const handleColorSelect = (color: string) => {
    console.log('Selected color:', color);
    setActiveColor(color);
    setDisplayMode('solid-color');
    onUpdate(color);
  };

  const handlePatternConfigChange = (
    config: GradientPatternConfig,
    gradient: Gradient | null
  ): void => {
    console.log('Pattern config changed:', config, gradient);
    setPatternConfig(config);
    setPatternGradient(gradient);
    setDisplayMode('pattern');
  };

  const handleAddSavedColor = (colors: string[]) => {
    setSavedColors(colors);
    // TODO - Persist the save colors
  };

  // Generate CSS gradient string from stops
  const generateGradientCSS = (gradient: Gradient): string => {
    const sortedStops = [...gradient.stops].sort(
      (a, b) => a.position - b.position
    );
    const gradientString = sortedStops
      .map((stop) => `${stop.color} ${stop.position}%`)
      .join(', ');
    return `linear-gradient(to right, ${gradientString})`;
  };

  // Calculate RGB and HSV values from the active color (for solid color mode)
  const colorValues = useMemo(() => {
    const rgb = hexToRgb(activeColor);
    const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
    return { rgb, hsv };
  }, [activeColor]);

  return (
    <Box
      sx={{
        height: '100%',
        overflowY: 'scroll',
        bg: 'background.paper',
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          fontWeight="bold"
          textAlign="center"
          sx={{ mb: 4 }}
        >
          LED Display Controller
        </Typography>

        {/* Active Display State - Shows what's currently active */}
        <Paper
          data-augmented-ui="border tr-clip tl-clip"
          sx={(theme) => ({
            mb: 4,
            p: 2,
            backgroundColor: 'background.default',
            '--aug-border-all': '2px',
            '--aug-border-bg': theme.palette.info.main,
            '--aug-tr': theme.spacing(1),
            '--aug-tl': theme.spacing(1),
          })}
        >
          <Typography
            variant="body2"
            fontWeight={600}
            color="text.primary"
            sx={{ mb: 1 }}
          >
            Active Display Mode:{' '}
            {displayMode === 'solid-color' && 'Solid Color'}
            {displayMode === 'gradient' && 'Static Gradient'}
            {displayMode === 'pattern' && 'Gradient Pattern'}
            {displayMode === 'image' && 'Image/GIF'}
          </Typography>

          {displayMode === 'solid-color' && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box
                data-augmented-ui="border tr-clip tl-clip br-clip bl-clip"
                sx={{
                  width: 64,
                  height: 64,
                  '--aug-tl': theme.spacing(1),
                  '--aug-tr': theme.spacing(1),
                  '--aug-bl': theme.spacing(1),
                  '--aug-br': theme.spacing(1),
                  '--aug-border-all': '2px',
                  '--aug-border-bg': theme.palette.info.main,
                  backgroundColor: activeColor,
                }}
              />
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: 0.5,
                  justifyContent: 'space-between',
                  flexGrow: 1,
                  flexShrink: 0,
                }}
              >
                <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>
                  <b>HEX:</b> {activeColor.toUpperCase()}
                </Typography>
                <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>
                  <b>RGB</b>: {colorValues.rgb.r}, {colorValues.rgb.g},{' '}
                  {colorValues.rgb.b}
                </Typography>
                <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>
                  <b>HSV</b>: {colorValues.hsv.h}°, {colorValues.hsv.s}%,{' '}
                  {colorValues.hsv.v}%
                </Typography>
              </Box>
            </Box>
          )}

          {displayMode === 'pattern' && (
            <Box>
              <Box
                sx={{
                  borderRadius: 1,
                  border: `2px solid ${theme.palette.divider}`,
                  overflow: 'hidden',
                  mb: 1,
                }}
              >
                <GradientPatternVisualizer
                  type={patternConfig.type}
                  interpolation={patternConfig.interpolation}
                  stops={patternGradient?.stops}
                  width="100%"
                  height={80}
                  animate={patternConfig.speed > 0}
                  speed={patternConfig.speed}
                />
              </Box>
              <Typography variant="body2" color="text.primary">
                <b>Pattern:</b> {patternConfig.type} pattern
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <b>Interpolation:</b> {patternConfig.interpolation} |{' '}
                <b>Speed:</b>{' '}
                {patternConfig.speed === 0
                  ? 'Static'
                  : `${patternConfig.speed}%`}
              </Typography>
            </Box>
          )}

          {displayMode === 'image' && (
            <Typography variant="body2" color="text.secondary">
              Image/GIF mode (Coming soon)
            </Typography>
          )}
        </Paper>

        {/* Solid Color Section */}
        <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
          Solid Colors
        </Typography>
        <ColorSwatchPicker
          colors={defaultColors}
          savedColors={savedColors}
          setSavedColors={handleAddSavedColor}
          onColorChange={handleColorSelect}
          activeColor={displayMode === 'solid-color' ? activeColor : undefined}
        />

        {/* Gradient & Pattern Section */}
        <Typography variant="h5" fontWeight="bold" sx={{ mb: 2, mt: 4 }}>
          Gradient Patterns
        </Typography>
        <GradientPatternSelector
          gradients={defaultGradients}
          onPatternConfigChange={handlePatternConfigChange}
          activeGradient={patternGradient}
          activePatternConfig={patternConfig}
        />
      </Container>
    </Box>
  );
};
