import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Slider,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useTheme,
} from '@mui/material';

import { GradientShader } from './gradient-shader';
import {
  getThemePaletteColors,
  resolveThemeColor,
} from './get-theme-palette-colors';
import { PointerPattern, useSyntheticPointer } from './use-synthetic-pointer';
import { useScreenSaver } from './use-screen-saver';

type GradientShaderScreenSaverProps = Omit<
  React.ComponentProps<typeof GradientShader>,
  'pointerPositionsRef' | 'onInternalDimensionsChange' | 'colors'
> & {
  colors?: string[];
  idleTimeoutMs?: number;
  defaultPattern?: PointerPattern;
  defaultMirrorX?: boolean;
  defaultMirrorY?: boolean;
  useThemeColors?: boolean;
  defaultColorKeys?: [string, string];
  defaultPointerSpeed?: number;
  defaultBrightness?: number;
  defaultScrollSpeed?: number;
  defaultScale?: number;
};

type ActiveColorStop = 'a' | 'b';

const controlSliderSx = {
  color: 'common.white',
  '& .MuiSlider-thumb': { width: 14, height: 14 },
  '& .MuiSlider-rail': { opacity: 0.3 },
};

function ScreenSaverSlider({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}) {
  return (
    <Box data-screen-saver-control>
      <Typography variant="caption" sx={{ opacity: 0.8 }}>
        {label}: {value.toFixed(step < 0.1 ? 2 : 1)}
      </Typography>
      <Slider
        data-screen-saver-control
        size="small"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(_, next) => onChange(next as number)}
        sx={controlSliderSx}
      />
    </Box>
  );
}

export const GradientShaderScreenSaver = ({
  colors: colorsProp,
  idleTimeoutMs = 60_000,
  defaultPattern = 'perlin',
  defaultMirrorX = false,
  defaultMirrorY = false,
  useThemeColors = false,
  defaultColorKeys = ['primary.main', 'secondary.main'],
  defaultPointerSpeed = 1,
  defaultBrightness = 1,
  defaultScrollSpeed = 0.04,
  defaultScale = 0.75,
  width = 400,
  height = 400,
  autoResize = false,
  isBackground = false,
  resolution = 1,
  scrollSpeed: scrollSpeedProp,
  scale: scaleProp,
  brightness: brightnessProp,
  ...gradientProps
}: GradientShaderScreenSaverProps) => {
  const theme = useTheme();
  const themeColorOptions = useMemo(
    () => getThemePaletteColors(theme),
    [theme]
  );

  const [pattern, setPattern] = useState<PointerPattern>(defaultPattern);
  const [mirrorX, setMirrorX] = useState(defaultMirrorX);
  const [mirrorY, setMirrorY] = useState(defaultMirrorY);
  const [activeColorStop, setActiveColorStop] =
    useState<ActiveColorStop>('a');
  const [colorKeyA, setColorKeyA] = useState(defaultColorKeys[0]);
  const [colorKeyB, setColorKeyB] = useState(defaultColorKeys[1]);
  const [pointerSpeed, setPointerSpeed] = useState(defaultPointerSpeed);
  const [brightness, setBrightness] = useState(
    brightnessProp ?? defaultBrightness
  );
  const [scrollSpeed, setScrollSpeed] = useState(
    scrollSpeedProp ?? defaultScrollSpeed
  );
  const [scale, setScale] = useState(scaleProp ?? defaultScale);
  const [internalDimensions, setInternalDimensions] = useState({
    width: Math.max(1, Math.floor(width * resolution)),
    height: Math.max(1, Math.floor(height * resolution)),
  });

  const pointerSpeedRef = useRef(pointerSpeed);
  pointerSpeedRef.current = pointerSpeed;

  const themeColors = useMemo(() => {
    const fallback = theme.palette.primary.main;
    return [
      resolveThemeColor(themeColorOptions, colorKeyA, fallback),
      resolveThemeColor(themeColorOptions, colorKeyB, fallback),
    ];
  }, [colorKeyA, colorKeyB, theme.palette.primary.main, themeColorOptions]);

  const colors = useThemeColors ? themeColors : colorsProp ?? themeColors;

  const { isActive, enter, exit } = useScreenSaver({ idleTimeoutMs });

  const handleInternalDimensionsChange = useCallback(
    (internalWidth: number, internalHeight: number) => {
      setInternalDimensions({ width: internalWidth, height: internalHeight });
    },
    []
  );

  const { positionsRef } = useSyntheticPointer({
    width: internalDimensions.width,
    height: internalDimensions.height,
    pattern,
    mirrorX,
    mirrorY,
    enabled: isActive,
    speedRef: pointerSpeedRef,
  });

  const handleThemeColorSelect = useCallback(
    (key: string) => {
      if (activeColorStop === 'a') {
        setColorKeyA(key);
      } else {
        setColorKeyB(key);
      }
    },
    [activeColorStop]
  );

  const controls = useMemo(
    () => (
      <Box
        data-screen-saver-control
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          p: 1.5,
          borderRadius: 1,
          bgcolor: 'rgba(0, 0, 0, 0.72)',
          color: 'common.white',
          minWidth: 240,
          maxHeight: 'calc(100vh - 32px)',
          overflowY: 'auto',
          pointerEvents: 'auto',
        }}
      >
        <Typography variant="caption" sx={{ opacity: 0.8 }}>
          Screen Saver
        </Typography>

        <Button
          data-screen-saver-control
          variant="contained"
          size="small"
          color={isActive ? 'warning' : 'primary'}
          onClick={isActive ? exit : enter}
        >
          {isActive ? 'Exit Screen Saver' : 'Enter Screen Saver'}
        </Button>

        <ToggleButtonGroup
          data-screen-saver-control
          exclusive
          size="small"
          value={pattern}
          onChange={(_, value: PointerPattern | null) => {
            if (value) setPattern(value);
          }}
          fullWidth
          sx={{
            '& .MuiToggleButton-root': {
              color: 'common.white',
              borderColor: 'rgba(255,255,255,0.3)',
              '&.Mui-selected': {
                bgcolor: 'primary.main',
                color: 'common.white',
              },
            },
          }}
        >
          <ToggleButton data-screen-saver-control value="perlin">
            Perlin
          </ToggleButton>
          <ToggleButton data-screen-saver-control value="dvd-bounce">
            DVD
          </ToggleButton>
        </ToggleButtonGroup>

        <ScreenSaverSlider
          label="Pointer speed"
          value={pointerSpeed}
          min={0.25}
          max={3}
          step={0.05}
          onChange={setPointerSpeed}
        />

        <ScreenSaverSlider
          label="Brightness"
          value={brightness}
          min={0.2}
          max={1.5}
          step={0.05}
          onChange={setBrightness}
        />

        <ScreenSaverSlider
          label="Band speed"
          value={scrollSpeed}
          min={0.01}
          max={0.2}
          step={0.005}
          onChange={setScrollSpeed}
        />

        <ScreenSaverSlider
          label="Band width"
          value={scale}
          min={0.25}
          max={2}
          step={0.05}
          onChange={setScale}
        />

        {useThemeColors && (
          <Box data-screen-saver-control>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              Gradient colors
            </Typography>
            <Stack direction="row" spacing={0.5} sx={{ mt: 0.5, mb: 0.5 }}>
              <ToggleButton
                data-screen-saver-control
                value="a"
                selected={activeColorStop === 'a'}
                onChange={() => setActiveColorStop('a')}
                size="small"
                sx={{
                  flex: 1,
                  color: 'common.white',
                  borderColor: 'rgba(255,255,255,0.3)',
                  '&.Mui-selected': { bgcolor: 'primary.main' },
                }}
              >
                A
              </ToggleButton>
              <ToggleButton
                data-screen-saver-control
                value="b"
                selected={activeColorStop === 'b'}
                onChange={() => setActiveColorStop('b')}
                size="small"
                sx={{
                  flex: 1,
                  color: 'common.white',
                  borderColor: 'rgba(255,255,255,0.3)',
                  '&.Mui-selected': { bgcolor: 'primary.main' },
                }}
              >
                B
              </ToggleButton>
            </Stack>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 0.5,
              }}
            >
              {themeColorOptions.map((option) => {
                const isSelected =
                  (activeColorStop === 'a' && colorKeyA === option.key) ||
                  (activeColorStop === 'b' && colorKeyB === option.key);

                return (
                  <Box
                    key={option.key}
                    data-screen-saver-control
                    component="button"
                    type="button"
                    aria-label={option.label}
                    onClick={() => handleThemeColorSelect(option.key)}
                    sx={{
                      width: '100%',
                      aspectRatio: '1',
                      borderRadius: 0.5,
                      border: '2px solid',
                      borderColor: isSelected
                        ? 'primary.main'
                        : 'rgba(255,255,255,0.25)',
                      bgcolor: option.value,
                      cursor: 'pointer',
                      p: 0,
                    }}
                  />
                );
              })}
            </Box>
          </Box>
        )}

        <FormControlLabel
          data-screen-saver-control
          control={
            <Checkbox
              data-screen-saver-control
              size="small"
              checked={mirrorX}
              onChange={(e) => setMirrorX(e.target.checked)}
              sx={{ color: 'common.white' }}
            />
          }
          label={<Typography variant="body2">Mirror X</Typography>}
        />
        <FormControlLabel
          data-screen-saver-control
          control={
            <Checkbox
              data-screen-saver-control
              size="small"
              checked={mirrorY}
              onChange={(e) => setMirrorY(e.target.checked)}
              sx={{ color: 'common.white' }}
            />
          }
          label={<Typography variant="body2">Mirror Y</Typography>}
        />
      </Box>
    ),
    [
      activeColorStop,
      brightness,
      colorKeyA,
      colorKeyB,
      enter,
      exit,
      handleThemeColorSelect,
      isActive,
      mirrorX,
      mirrorY,
      pattern,
      pointerSpeed,
      scale,
      scrollSpeed,
      themeColorOptions,
      useThemeColors,
    ]
  );

  return (
    <>
      <GradientShader
        {...gradientProps}
        colors={colors}
        width={width}
        height={height}
        resolution={resolution}
        scrollSpeed={scrollSpeed}
        scale={scale}
        brightness={brightness}
        autoResize={autoResize}
        isBackground={isBackground}
        pointerPositionsRef={isActive ? positionsRef : undefined}
        onInternalDimensionsChange={handleInternalDimensionsChange}
      />
      {controls}
    </>
  );
};
