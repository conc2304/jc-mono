import { useState } from 'react';
import { Box, Container, Typography, Button, Stack } from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';

import {
  ColorSwatchPicker,
  GradientPatternSelector,
  type Gradient,
  type GradientPatternConfig,
} from '@jc/ui-components';
import { ActiveDisplayState } from './ActiveDisplayState';
import { hexToRgb } from '@jc/utils';
import { SceneBank } from '../../organisms/scene-bank';
import { SaveSceneDialog } from '../../organisms/save-scene-dialog';
import {
  usePersistentColors,
  usePersistentGradients,
  usePersistentScenes,
} from '../../../hooks/usePersistentStorage';

interface LedControllerDashboardProps {
  onUpdateSolidColor: (color: string) => void;
  onUpdateGradientPattern: ({
    colorStops,
    type,
    speed,
    interpolation,
  }: GradientApiRequestBody) => void;
}

type DisplayMode = 'solid-color' | 'gradient' | 'pattern' | 'image';
type GradientApiRequestBody = GradientPatternConfig & {
  colorStops: Array<{ position: number; r: number; g: number; b: number }>;
};

const defaultColors = [
  '#000000',
  '#ffffff',
  '#ff0000',
  '#ff8900',
  '#fbff00',
  '#5CFF00',
  '#006d5b',
  '#00FFB8',
  '#00B8FF',
  '#002eff',
  '#5900ff',
  '#e600ff',
  '#ff008c',
];

const defaultGradients: Gradient[] = [
  {
    id: 'neon-strobe',
    stops: [
      { id: 1, color: '#FF0000', position: 0 }, // Red
      { id: 2, color: '#000000', position: 25 }, // Black band
      { id: 3, color: '#00FF00', position: 50 }, // Green
      { id: 4, color: '#000000', position: 75 }, // Black band
      { id: 5, color: '#0000FF', position: 100 }, // Blue
    ],
  },
  {
    id: 'midnight-city',
    stops: [
      { id: 1, color: '#000000', position: 0 }, // Black
      { id: 2, color: '#0080FF', position: 30 }, // Deep blue
      { id: 3, color: '#FF00FF', position: 60 }, // Magenta
      { id: 4, color: '#FF0080', position: 80 }, // Hot pink
      { id: 5, color: '#000000', position: 100 }, // Black
    ],
  },
  {
    id: 'toxic-waste',
    stops: [
      { id: 1, color: '#00FF00', position: 0 }, // Bright green
      { id: 2, color: '#000000', position: 33 }, // Black
      { id: 3, color: '#FFFF00', position: 50 }, // Yellow
      { id: 4, color: '#000000', position: 67 }, // Black
      { id: 5, color: '#00FF00', position: 100 }, // Bright green
    ],
  },
  {
    id: 'sunset-blaze',
    stops: [
      { id: 1, color: '#8000FF', position: 0 }, // Deep purple
      { id: 2, color: '#FF0080', position: 25 }, // Hot pink
      { id: 3, color: '#FF4500', position: 50 }, // Orange-red
      { id: 4, color: '#FFD700', position: 75 }, // Gold
      { id: 5, color: '#FFFF00', position: 100 }, // Yellow
    ],
  },
  {
    id: 'electric-pulse',
    stops: [
      { id: 1, color: '#00FFFF', position: 0 }, // Cyan
      { id: 2, color: '#000000', position: 20 }, // Black
      { id: 3, color: '#FFFFFF', position: 40 }, // White flash
      { id: 4, color: '#000000', position: 60 }, // Black
      { id: 5, color: '#00FFFF', position: 80 }, // Cyan
      { id: 6, color: '#000000', position: 100 }, // Black
    ],
  },
  {
    id: 'lava-flow',
    stops: [
      { id: 1, color: '#000000', position: 0 }, // Black (cooled)
      { id: 2, color: '#8B0000', position: 25 }, // Dark red
      { id: 3, color: '#FF0000', position: 50 }, // Bright red
      { id: 4, color: '#FF8C00', position: 75 }, // Orange
      { id: 5, color: '#FFFF00', position: 100 }, // Yellow (hottest)
    ],
  },
  {
    id: 'aurora-borealis',
    stops: [
      { id: 1, color: '#000080', position: 0 }, // Navy
      { id: 2, color: '#0080FF', position: 20 }, // Blue
      { id: 3, color: '#00FF80', position: 40 }, // Spring green
      { id: 4, color: '#80FF00', position: 60 }, // Lime
      { id: 5, color: '#FF00FF', position: 80 }, // Magenta
      { id: 6, color: '#000080', position: 100 }, // Navy
    ],
  },
  {
    id: 'digital-glitch',
    stops: [
      { id: 1, color: '#FF0000', position: 0 }, // Red
      { id: 2, color: '#000000', position: 16 }, // Black
      { id: 3, color: '#00FF00', position: 33 }, // Green
      { id: 4, color: '#000000', position: 50 }, // Black
      { id: 5, color: '#0000FF', position: 67 }, // Blue
      { id: 6, color: '#000000', position: 84 }, // Black
      { id: 7, color: '#FFFFFF', position: 100 }, // White
    ],
  },
  {
    id: 'ocean-depth',
    stops: [
      { id: 1, color: '#00FFFF', position: 0 }, // Cyan (surface)
      { id: 2, color: '#0080FF', position: 30 }, // Blue
      { id: 3, color: '#0000FF', position: 60 }, // Deep blue
      { id: 4, color: '#000080', position: 80 }, // Navy
      { id: 5, color: '#000000', position: 100 }, // Black (abyss)
    ],
  },
  {
    id: 'candy-crush',
    stops: [
      { id: 1, color: '#FF00FF', position: 0 }, // Magenta
      { id: 2, color: '#FF0080', position: 25 }, // Hot pink
      { id: 3, color: '#FFFF00', position: 50 }, // Yellow
      { id: 4, color: '#00FFFF', position: 75 }, // Cyan
      { id: 5, color: '#FF00FF', position: 100 }, // Magenta
    ],
  },
];

export const LedControllerDashboard = ({
  onUpdateSolidColor,
  onUpdateGradientPattern,
}: LedControllerDashboardProps) => {
  // Persistent storage hooks
  const { savedColors, setSavedColors } = usePersistentColors();
  const { savedGradients, addGradient, removeGradient } =
    usePersistentGradients();
  const { scenes, addScene, updateScene, removeScene } = usePersistentScenes();

  // UI state
  const [displayMode, setDisplayMode] = useState<DisplayMode>('solid-color');
  const [activeColor, setActiveColor] = useState<string | null>(null);
  const [patternGradient, setPatternGradient] = useState<Gradient | null>(null);
  const [patternConfig, setPatternConfig] =
    useState<GradientPatternConfig | null>(null);
  const [brightness, setBrightness] = useState<number>(100);
  const [systemOn, setSystemOn] = useState<boolean>(true);
  const [saveSceneDialogOpen, setSaveSceneDialogOpen] = useState(false);

  // Mode handlers
  // Modes are mutually exclusive - setting one unsets the others
  const handleColorSelect = (color: string) => {
    console.log('Selected color:', color);
    unsetActiveModes();

    setActiveColor(color);
    setDisplayMode('solid-color');
    onUpdateSolidColor(color);
  };

  const handlePatternConfigChange = (
    config: GradientPatternConfig,
    gradient: Gradient | null
  ): void => {
    if (gradient === null) return;

    console.log('Pattern config changed:', config, gradient);

    const colorStopsForApi = gradient.stops.map((stop) => {
      const rgb = hexToRgb(stop.color);
      return { position: stop.position, r: rgb.r, g: rgb.g, b: rgb.b };
    });

    unsetActiveModes();

    setPatternConfig(config);
    setPatternGradient(gradient);
    setDisplayMode('pattern');

    // Flip after setting state
    // Pattern types are flipped in TouchDesigner API for "radial" vs "circular"
    let patternType = config.type;
    if (patternType === 'circular') {
      patternType = 'radial';
    } else if (patternType === 'radial') {
      patternType = 'circular';
    }

    onUpdateGradientPattern({
      colorStops: colorStopsForApi,
      type: patternType,
      speed: config.speed,
      interpolation: config.interpolation,
    });
  };

  // Generate handlers for brightness and system toggle
  const handleBrightnessChange = (value: number) => {
    // TODO - Send brightness update to LED controller
    setBrightness(value);
  };

  const unsetActiveModes = () => {
    setActiveColor(null);
    setPatternConfig(null);
    setPatternGradient(null);
    setDisplayMode('solid-color');
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
        brightness={brightness}
        onBrightnessChange={handleBrightnessChange}
      />

      {/* Save Current State as Scene */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<SaveIcon />}
          onClick={() => setSaveSceneDialogOpen(true)}
          disabled={!canSaveScene}
          size="large"
        >
          Save as Scene
        </Button>
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
      {/* <Uifra */}
    </Box>
  );
};
