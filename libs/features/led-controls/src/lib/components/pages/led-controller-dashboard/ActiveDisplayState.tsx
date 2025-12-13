import {
  alpha,
  Box,
  Paper,
  Slider,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import { useMemo } from 'react';
import {
  AugmentedButton,
  GradientPatternVisualizer,
  type Gradient,
  type GradientPatternConfig,
} from '@jc/ui-components';
import { hexToRgb, rgbToHsv } from '@jc/utils';
import {
  BrightnessHigh,
  BrightnessLow,
  ElectricBolt,
  InvertColors,
  InvertColorsOff,
  Palette,
  Restore,
} from '@mui/icons-material';

type DisplayMode = 'solid-color' | 'gradient' | 'pattern' | 'image';

interface ActiveDisplayStateProps {
  displayMode: DisplayMode;
  activeColor: string | null;
  patternConfig: GradientPatternConfig | null;
  patternGradient: Gradient | null;
  brightness: number;
  invert: number;
  hueRotationSpeed: number;
  onBrightnessChange?: (value: number) => void;
  onInvertChange?: (value: number) => void;
  onHueRotationSpeedChange?: (value: number) => void;
}

export const ActiveDisplayState = ({
  displayMode,
  activeColor,
  patternConfig,
  patternGradient,
  brightness,
  invert,
  hueRotationSpeed,
  onBrightnessChange,
  onInvertChange,
  onHueRotationSpeedChange,
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

  const handleBrightnessChange = (
    event: Event | null,
    value: number | number[]
  ) => {
    if (typeof value === 'number') {
      onBrightnessChange && onBrightnessChange(value);
    }
  };

  const handleInvertChange = (
    event: Event | null,
    value: number | number[]
  ) => {
    if (typeof value === 'number') {
      onInvertChange && onInvertChange(value);
    }
  };

  const handleHueRotationSpeedChange = (
    event: Event | null,
    value: number | number[]
  ) => {
    if (typeof value === 'number') {
      onHueRotationSpeedChange && onHueRotationSpeedChange(value);
    }
  };

  return (
    <Paper
      data-augmented-ui="border tr-clip tl-clip"
      sx={(theme) => ({
        mb: 4,
        mx: 1,
        p: 2,
        br: 0,
        bg: alpha(theme.palette.background.paper, 0.7),
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
              '--aug-borer-all': '2px',
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
      {onBrightnessChange && (
        <Box>
          <Stack
            spacing={2}
            direction="row"
            sx={{ alignItems: 'center', my: 1, width: '100%' }}
          >
            <Typography
              variant="caption"
              noWrap
              sx={{
                flexShrink: 0,
                width: '75px',
                display: { xs: 'none', sm: 'block' },
              }}
            >
              Brightness
            </Typography>
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
            <AugmentedButton
              size="small"
              color="warning"
              variant="outlined"
              onClick={() => handleBrightnessChange(null, 50)}
            >
              <Restore />
            </AugmentedButton>
          </Stack>
        </Box>
      )}

      {/* Invert Controller */}
      {onInvertChange && (
        <Box>
          <Stack
            spacing={2}
            direction="row"
            sx={{ alignItems: 'center', my: 1, width: '100%' }}
          >
            <Typography
              variant="caption"
              noWrap
              sx={{
                flexShrink: 0,
                width: '75px',
                display: { xs: 'none', sm: 'block' },
              }}
            >
              Invert
            </Typography>

            <InvertColorsOff />
            <Slider
              value={invert}
              onChange={handleInvertChange}
              min={0}
              max={100}
              step={1}
              aria-label="Color Inversion"
              valueLabelDisplay="auto"
              aria-labelledby="inversion-slider"
            />
            <InvertColors />
            <AugmentedButton
              size="small"
              color="warning"
              variant="outlined"
              onClick={() => handleInvertChange(null, 0)}
            >
              <Restore />
            </AugmentedButton>
          </Stack>
        </Box>
      )}

      {/* Hue Rotate Speed Controller */}
      {onHueRotationSpeedChange && (
        <Box>
          <Stack
            spacing={2}
            direction="row"
            sx={{ alignItems: 'center', my: 1, width: '100%' }}
          >
            <Typography
              variant="caption"
              noWrap
              sx={{
                flexShrink: 0,
                width: '75px',
                display: { xs: 'none', sm: 'block' },
              }}
            >
              Hue Rotate
            </Typography>

            <Palette />
            <Slider
              value={hueRotationSpeed}
              onChange={handleHueRotationSpeedChange}
              min={0}
              max={100}
              step={1}
              aria-label="Hue Rotate Speed"
              valueLabelDisplay="auto"
              aria-labelledby="hue-rotate-speed-slider"
            />
            <ElectricBolt />
            <AugmentedButton
              size="small"
              color="warning"
              variant="outlined"
              onClick={() => handleHueRotationSpeedChange(null, 0)}
            >
              <Restore />
            </AugmentedButton>
          </Stack>
        </Box>
      )}
    </Paper>
  );
};
