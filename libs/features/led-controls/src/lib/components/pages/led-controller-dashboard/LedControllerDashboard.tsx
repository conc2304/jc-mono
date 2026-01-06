import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';
import {
  AugmentedButton,
  ColorSwatchPicker,
  GradientPatternSelector,
  type Gradient,
  type GradientPatternConfig,
} from '@jc/ui-components';
import {
  usePersistentColors,
  usePersistentGradients,
  usePersistentScenes,
} from '../../../hooks';
import {
  ActiveDisplayState,
  SaveSceneDialog,
  SceneBank,
} from '../../organisms';
import { defaultColors, defaultGradients } from '../../../data';
import { DisplayMode, LedState } from '../../../data-fetching';
import { generateGradientId } from '@jc/utils';

interface LedControllerDashboardProps {
  LEDState: LedState | null;
  onUpdateSolidColor: (color: string) => void;
  onUpdateGradientPattern: ({
    colorStops,
    type,
    speed,
    interpolation,
    period,
  }: FrontendGradientRequestBody) => void;
  onUpdatePower: (value: boolean) => void;
  onUpdateBrightness: (value: number) => void;
  onUpdateInvert: (value: number) => void;
  onUpdateHueRotationSpeed: (value: number) => void;
}

type FrontendGradientRequestBody = GradientPatternConfig & {
  colorStops: Array<{ position: number; color: string }>; // hex format
};

export const LedControllerDashboard = ({
  LEDState,
  onUpdateSolidColor,
  onUpdateGradientPattern,
  onUpdateBrightness,
  onUpdatePower,
  onUpdateHueRotationSpeed,
}: LedControllerDashboardProps) => {
  // Persistent storage hooks
  const { savedColors, setSavedColors } = usePersistentColors();
  const { savedGradients } = usePersistentGradients();
  const { scenes, addScene, updateScene, removeScene } = usePersistentScenes();

  // Extract LED state with defaults
  const powerOn = LEDState?.power_on ?? false;
  const brightness = LEDState?.brightness ?? 0.5; // 0-1 range from backend
  const hueRotationSpeed = LEDState?.hue_rotation_speed ?? 0;

  // Convert 0-1 brightness to 0-100 for UI
  const brightnessPercentage = Math.round(brightness * 100);
  const hueRotationPercentage = Math.round(hueRotationSpeed * 100);

  // Derive display mode and active content from backend state
  const displayMode: DisplayMode =
    LEDState?.current_content_name ?? 'solid-color';

  // Extract active color (with hex) when in solid-color mode
  const activeColor: string | null =
    displayMode === 'solid-color' && LEDState?.current_solid_color
      ? (LEDState.current_solid_color as any).hex || null
      : null;

  // Extract active gradient pattern when in gradient/pattern mode
  const backendGradientPattern = LEDState?.current_gradient_pattern;
  const patternGradient: Gradient | null =
    displayMode === 'gradient' && backendGradientPattern
      ? {
          id: `backend-${displayMode}--TEMP`,
          stops: backendGradientPattern.colorStops.map(
            (stop: any, idx: number) => ({
              id: idx,
              color: stop.hex || '#000000',
              position: stop.position,
            })
          ),
        }
      : null;

  // Update gradient ID based on stops for matching
  if (patternGradient?.id) {
    patternGradient.id = generateGradientId(patternGradient.stops);
  }

  const patternConfig: GradientPatternConfig | null =
    (displayMode === 'gradient' || displayMode === 'pattern') &&
    backendGradientPattern
      ? {
          type: backendGradientPattern.type as any,
          interpolation: backendGradientPattern.interpolation as any,
          speed: backendGradientPattern.speed,
          period: backendGradientPattern.period,
          wave: backendGradientPattern.wave,
        }
      : null;

  const [saveSceneDialogOpen, setSaveSceneDialogOpen] = useState(false);

  // Update Handlers

  const handleColorSelect = (color: string) => {
    onUpdateSolidColor(color);
  };

  const handlePatternConfigChange = (
    config: GradientPatternConfig,
    gradient: Gradient | null
  ): void => {
    if (gradient === null) return;

    // Flip pattern types for TouchDesigner API
    // Pattern types are flipped in TouchDesigner API for "radial" vs "circular"
    let patternType = config.type;
    if (patternType === 'circular') {
      patternType = 'radial';
    } else if (patternType === 'radial') {
      patternType = 'circular';
    }

    // Pass hex colors directly - hook will handle conversion to backend format
    const colorStopsWithHex = gradient.stops.map((stop) => ({
      position: stop.position,
      color: stop.color, // Already in hex format
    }));

    onUpdateGradientPattern({
      colorStops: colorStopsWithHex,
      type: patternType,
      speed: config.speed,
      interpolation: config.interpolation,
      period: config.period || 1,
      direction: config.direction,
      wave: config.wave,
    });
  };

  const handlePowerChange = (value: boolean) => {
    onUpdatePower(value);
  };

  const handleBrightnessChange = (value: number) => {
    onUpdateBrightness(value);
  };

  const handleHueRotationSpeedChange = (value: number) => {
    onUpdateHueRotationSpeed(value);
  };

  const handleAddSavedColor = (colors: string[]) => {
    setSavedColors(colors);
  };

  // Scene management handlers
  const handleSaveScene = (name: string, description?: string) => {
    if (displayMode === 'solid-color' && activeColor) {
      addScene({
        name,
        description,
        type: 'solid-color',
        color: activeColor,
      });
    } else if (displayMode === 'pattern' && patternGradient && patternConfig) {
      addScene({
        name,
        description,
        type: 'gradient-pattern',
        gradient: patternGradient,
        patternConfig,
      });
    }
  };

  const handlePlayScene = (scene: (typeof scenes)[0]) => {
    if (scene.type === 'solid-color' && scene.color) {
      handleColorSelect(scene.color);
    } else if (
      scene.type === 'gradient-pattern' &&
      scene.gradient &&
      scene.patternConfig
    ) {
      handlePatternConfigChange(scene.patternConfig, scene.gradient);
    }
  };

  const canSaveScene = !!(
    (displayMode === 'solid-color' && activeColor) ||
    (displayMode === 'pattern' && patternGradient && patternConfig)
  );

  return (
    <Box
      sx={{
        height: '100%',
        overflowY: 'scroll',
        bg: 'background.paper',
        py: 4,
        px: [0, 0, 8, 12],
      }}
    >
      {/* Active Display State - Shows what's currently active */}
      <ActiveDisplayState
        displayMode={displayMode}
        activeColor={activeColor}
        patternConfig={patternConfig}
        patternGradient={patternGradient}
        brightness={brightnessPercentage}
        powerOn={powerOn}
        hueRotationSpeed={hueRotationPercentage}
        onBrightnessChange={handleBrightnessChange}
        onPowerChange={handlePowerChange}
        onHueRotationSpeedChange={handleHueRotationSpeedChange}
      />

      {/* Save Current State as Scene */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <AugmentedButton
          variant="outlined"
          color="secondary"
          startIcon={<SaveIcon />}
          onClick={() => setSaveSceneDialogOpen(true)}
          disabled={!canSaveScene}
          size="large"
        >
          Save as Scene
        </AugmentedButton>
        {!canSaveScene && (
          <Typography
            variant="caption"
            display="block"
            sx={{ mt: 1 }}
            color="text.secondary"
          >
            Select a color or pattern to save as a scene
          </Typography>
        )}
      </Box>

      {/* Solid Color Section */}
      <Typography
        variant="h5"
        fontWeight="bold"
        sx={{ mb: 2 }}
        textAlign={'center'}
      >
        Solid Colors
      </Typography>
      <ColorSwatchPicker
        colors={defaultColors}
        savedColors={savedColors}
        setSavedColors={handleAddSavedColor}
        onColorChange={handleColorSelect}
        activeColor={displayMode === 'solid-color' ? activeColor : null}
      />

      {/* Gradient & Pattern Section */}
      <Typography
        variant="h5"
        fontWeight="bold"
        sx={{ mb: 2, mt: 4 }}
        textAlign={'center'}
      >
        Gradient Patterns
      </Typography>
      <GradientPatternSelector
        gradients={[...defaultGradients, ...savedGradients]}
        onPatternConfigChange={handlePatternConfigChange}
        activeGradient={patternGradient}
        activePatternConfig={patternConfig}
      />

      {/* Scene Bank Section */}
      <Typography
        variant="h5"
        fontWeight="bold"
        sx={{ mb: 2, mt: 6 }}
        textAlign={'center'}
      >
        Saved Scenes
      </Typography>
      <SceneBank
        scenes={scenes}
        onPlayScene={handlePlayScene}
        onDeleteScene={removeScene}
        onUpdateScene={updateScene}
      />

      {/* Save Scene Dialog */}
      <SaveSceneDialog
        open={saveSceneDialogOpen}
        onClose={() => setSaveSceneDialogOpen(false)}
        onSave={handleSaveScene}
        sceneType={
          displayMode === 'solid-color' ? 'solid-color' : 'gradient-pattern'
        }
        color={activeColor}
        gradient={patternGradient}
        patternConfig={patternConfig}
      />
    </Box>
  );
};
