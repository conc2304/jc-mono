import {
  Box,
  FormControlLabel,
  Paper,
  Slider,
  Stack,
  Switch,
  Typography,
  useTheme,
} from '@mui/material';
import { useMemo } from 'react';
import {
  GradientPatternVisualizer,
  type Gradient,
  type GradientPatternConfig,
} from '@jc/ui-components';
import { hexToRgb, remapNumber, rgbToHsv } from '@jc/utils';
import { BrightnessHigh, BrightnessLow } from '@mui/icons-material';

type DisplayMode = 'solid-color' | 'gradient' | 'pattern' | 'image';

interface ActiveDisplayStateProps {
  displayMode: DisplayMode;
  activeColor: string | null;
  patternConfig: GradientPatternConfig | null;
  patternGradient: Gradient | null;
  brightness: number;
  onBrightnessChange: (value: number) => void;
}

export const ActiveDisplayState = ({
  displayMode,
  activeColor,
  patternConfig,
  patternGradient,
  brightness,
  onBrightnessChange,
}: ActiveDisplayStateProps) => {
  const theme = useTheme();

  // Calculate RGB and HSV values from the active color (for solid color mode)
  const colorValues = useMemo(() => {
    if (!activeColor) return null;

    const rgb = hexToRgb(activeColor);
    const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
    return { rgb, hsv };
  }, [activeColor]);

  const isNothingActive = !activeColor && !patternConfig;

  const handleBrightnessChange = (event: Event, value: number | number[]) => {
    if (typeof value === 'number') {
      remapNumber(value, 0, 100, 0, 2); // 0-2 in TouchDesigner API
      onBrightnessChange(value);
    }
  };

  return (
    <Paper
      data-augmented-ui="border tr-clip tl-clip"
      sx={(theme) => ({
        mb: 4,
        p: 2,
        br: 0,
        backgroundColor: theme.palette.background.default,
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
        Active Display Mode: {isNothingActive && 'Nothing Active'}
        {displayMode === 'solid-color' && !isNothingActive && 'Solid Color'}
        {displayMode === 'gradient' && 'Static Gradient'}
        {displayMode === 'pattern' && !isNothingActive && 'Gradient Pattern'}
        {displayMode === 'image' && 'Image/GIF'}
      </Typography>

      {displayMode === 'solid-color' && !!activeColor && !!colorValues && (
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
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
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
        </Box>
      )}

      {displayMode === 'pattern' && patternConfig !== null && (
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
              height={64}
            />
          </Box>
          <Typography variant="body2" color="text.primary">
            <b>Pattern:</b> {patternConfig.type} pattern
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <b>Interpolation:</b> {patternConfig.interpolation} | <b>Speed:</b>{' '}
            {patternConfig.speed === 0 ? 'Static' : `${patternConfig.speed}%`}
          </Typography>
        </Box>
      )}

      {displayMode === 'image' && (
        <Typography variant="body2" color="text.secondary">
          Image/GIF mode (Coming soon)
        </Typography>
      )}

      {isNothingActive && (
        <Typography variant="body2" color="text.secondary">
          Select a color or gradient pattern to get started
        </Typography>
      )}

      {/* Brightness Controller */}
      <Box>
        <Stack
          spacing={2}
          direction="row"
          sx={{ alignItems: 'center', my: 1, width: '100%' }}
        >
          <BrightnessLow />
          <Slider
            value={brightness}
            onChange={handleBrightnessChange}
            min={0}
            max={100}
            step={1}
            aria-label="LED Brightness"
            valueLabelDisplay="auto"
            aria-labelledby="brightness-slider"
          />
          <BrightnessHigh />
        </Stack>
      </Box>
    </Paper>
  );
};
