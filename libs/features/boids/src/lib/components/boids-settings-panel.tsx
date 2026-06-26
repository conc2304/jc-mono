import AddIcon from '@mui/icons-material/Add';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import RemoveIcon from '@mui/icons-material/Remove';
import {
  Box,
  Checkbox,
  Collapse,
  FormControlLabel,
  IconButton,
  MenuItem,
  Popover,
  Select,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { useCallback, useEffect, useRef, useState } from 'react';

import type { BoidsApp } from '../core/boids-app';
import { BOID_PRESET_ORDER } from '../presets/assign-boid-mix';
import { SCENE_PRESET_LIST } from '../presets/scene-presets';
import type {
  AttractorFieldMode,
  AttractorMotionPreset,
  BoidBehaviorPreset,
  BoidMix,
  FlowFieldPreset,
  ScenePresetId,
} from '../presets/types';
import { BoidsSettingsSlider } from './boids-settings-slider';

type BoidsSettingsPanelProps = {
  app: BoidsApp | null;
};

const BOID_PRESET_LABELS: Record<BoidBehaviorPreset, string> = {
  default: 'Balanced flock',
  tight: 'Compact flock',
  murmuration: 'Wave murmuration',
  loose: 'Independent drift',
  scatter: 'Fast scatter',
  orbiter: 'Attractor chaser',
};

const FLOCK_MIX_HELP = [
  'Flock mix — blend personalities (weights normalize to 100%).',
  'Balanced flock — standard alignment and separation.',
  'Compact flock — sticky, dense groups with strong cohesion.',
  'Wave murmuration — wide turns, fluid swarm waves.',
  'Independent drift — low cohesion; boids wander on their own.',
  'Fast scatter — high speed, strong separation, avoids clustering.',
  'Attractor chaser — strongly pulled toward red target points.',
];

const SETTINGS_HELP = [
  'Scene preset — load a bundled setup. Choose Default to reset.',
  'Attractor motion — how target points move (noise, Lissajous, figure-8).',
  'Field mode — Points pulls boids to attractors; Flow uses an ambient field.',
  'Flow weight — blend toward the flow field when Flow mode is active.',
  'Attractor strength / speed — pull intensity and path speed.',
  'Attractor count — number of active target points (1 to pool max).',
  'Show attractors — reveal the red target spheres.',
  ...FLOCK_MIX_HELP,
  'Boid speed — global multiplier applied on top of each personality preset.',
  'Obstacles — enable aquarium-style collision objects.',
];

export function BoidsSettingsPanel({ app }: BoidsSettingsPanelProps) {
  const infoAnchorRef = useRef<HTMLButtonElement>(null);
  const [settingsExpanded, setSettingsExpanded] = useState(true);
  const [infoOpen, setInfoOpen] = useState(false);
  const [scenePreset, setScenePreset] = useState<ScenePresetId | ''>('');
  const [attractorMotion, setAttractorMotion] =
    useState<AttractorMotionPreset>('noise');
  const [fieldMode, setFieldMode] = useState<AttractorFieldMode>('points');
  const [flowFieldPreset, setFlowFieldPreset] =
    useState<FlowFieldPreset>('curlNoise');
  const [boidMix, setBoidMix] = useState<BoidMix>({ default: 1 });
  const [flowWeight, setFlowWeight] = useState(0);
  const [attractorStrength, setAttractorStrength] = useState(0.5);
  const [attractorSpeed, setAttractorSpeed] = useState(0.12);
  const [attractorCount, setAttractorCount] = useState(15);
  const [maxAttractorCount, setMaxAttractorCount] = useState(15);
  const [boidSpeedMultiplier, setBoidSpeedMultiplier] = useState(1);
  const [obstaclesEnabled, setObstaclesEnabled] = useState(false);
  const [attractorsVisible, setAttractorsVisible] = useState(false);

  const syncFromApp = useCallback(() => {
    if (!app) return;
    const state = app.getPresetState();
    setScenePreset(state.scenePresetId ?? '');
    setAttractorMotion(state.attractorMotion);
    setFieldMode(state.fieldMode);
    setFlowFieldPreset(state.flowFieldPreset);
    setBoidMix({ ...state.boidMix });
    setFlowWeight(state.flowWeight);
    setAttractorStrength(state.attractorStrength);
    setAttractorSpeed(state.attractorSpeed);
    setAttractorCount(state.attractorCount);
    setMaxAttractorCount(app.getMaxAttractorCount());
    setBoidSpeedMultiplier(state.boidSpeedMultiplier);
    setObstaclesEnabled(app.getObstaclesEnabled());
    setAttractorsVisible(app.getAttractorsVisible());
  }, [app]);

  useEffect(() => {
    syncFromApp();
    const interval = setInterval(syncFromApp, 500);
    return () => clearInterval(interval);
  }, [syncFromApp]);

  useEffect(() => {
    if (!settingsExpanded) {
      setInfoOpen(false);
    }
  }, [settingsExpanded]);

  const handleScenePreset = (id: ScenePresetId | '') => {
    setScenePreset(id);
    if (!app || !id) return;
    app.applyScenePreset(id);
    syncFromApp();
  };

  const handleAttractorMotion = (value: AttractorMotionPreset | null) => {
    if (!value || !app) return;
    setScenePreset('');
    setAttractorMotion(value);
    app.setAttractorMotion(value);
  };

  const handleFieldMode = (value: AttractorFieldMode | null) => {
    if (!value || !app) return;
    setScenePreset('');
    setFieldMode(value);
    app.setFieldMode(value);
    syncFromApp();
  };

  const handleFlowFieldPreset = (value: FlowFieldPreset | null) => {
    if (!value || !app) return;
    setScenePreset('');
    setFlowFieldPreset(value);
    app.setFlowFieldPreset(value);
  };

  const handleMixChange = (preset: BoidBehaviorPreset, value: number) => {
    if (!app) return;
    setScenePreset('');
    const next = { ...boidMix, [preset]: value };
    setBoidMix(next);
    app.setBoidMix(next);
  };

  const handleObstaclesToggle = (enabled: boolean) => {
    if (!app) return;
    setScenePreset('');
    setObstaclesEnabled(enabled);
    if (enabled && app.getObstaclePreset() === 'none') {
      app.setObstaclePreset('aquarium');
    }
    app.setObstaclesEnabled(enabled);
  };

  const handleAttractorsVisibleToggle = (visible: boolean) => {
    if (!app) return;
    setScenePreset('');
    setAttractorsVisible(visible);
    app.setAttractorsVisible(visible);
  };

  return (
    <Box
      data-boids-control
      sx={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 1,
        bgcolor: 'rgba(0, 0, 0, 0.72)',
        color: 'common.white',
        width: 280,
        maxWidth: 'calc(100% - 32px)',
        maxHeight: 'calc(100% - 32px)',
        overflow: 'hidden',
        boxSizing: 'border-box',
        pointerEvents: 'auto',
      }}
    >
      <Collapse in={settingsExpanded}>
        <Box
          data-boids-control
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            p: 1.5,
            pb: 0.5,
            minWidth: 0,
            maxHeight: 'calc(100% - 80px)',
            overflowX: 'hidden',
            overflowY: 'auto',
            boxSizing: 'border-box',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: -0.25,
            }}
          >
            <Typography
              variant="subtitle2"
              component="h2"
              sx={{ fontWeight: 600, m: 0 }}
            >
              Boids
            </Typography>
            <IconButton
              ref={infoAnchorRef}
              data-boids-control
              size="small"
              aria-label="Settings help"
              aria-expanded={infoOpen}
              onClick={() => setInfoOpen((prev) => !prev)}
              sx={{ color: 'common.white', p: 0.25 }}
            >
              <InfoOutlinedIcon fontSize="small" />
            </IconButton>
          </Box>

          <Typography variant="caption" sx={{ opacity: 0.8 }}>
            Scene preset
          </Typography>
          <Select
            data-boids-control
            size="small"
            fullWidth
            value={scenePreset}
            displayEmpty
            onChange={(e) =>
              handleScenePreset(e.target.value as ScenePresetId | '')
            }
            sx={{
              width: '100%',
              minWidth: 0,
              color: 'common.white',
              '.MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255,255,255,0.3)',
              },
              '.MuiSvgIcon-root': { color: 'common.white' },
            }}
          >
            <MenuItem value="">
              <em>Custom</em>
            </MenuItem>
            {SCENE_PRESET_LIST.map((scene) => (
              <MenuItem key={scene.id} value={scene.id}>
                {scene.label}
              </MenuItem>
            ))}
          </Select>

          <Typography variant="caption" sx={{ opacity: 0.8, mt: 0.5 }}>
            Attractor motion
          </Typography>
          <ToggleButtonGroup
            data-boids-control
            exclusive
            size="small"
            value={attractorMotion}
            onChange={(_, value) => handleAttractorMotion(value)}
            fullWidth
            sx={toggleSx}
          >
            <ToggleButton data-boids-control value="noise">
              Noise
            </ToggleButton>
            <ToggleButton data-boids-control value="lissajous">
              Lissajous
            </ToggleButton>
            <ToggleButton data-boids-control value="figure8">
              Figure 8
            </ToggleButton>
          </ToggleButtonGroup>

          <Typography variant="caption" sx={{ opacity: 0.8 }}>
            Field mode
          </Typography>
          <ToggleButtonGroup
            data-boids-control
            exclusive
            size="small"
            value={fieldMode}
            onChange={(_, value) => handleFieldMode(value)}
            fullWidth
            sx={toggleSx}
          >
            <ToggleButton data-boids-control value="points">
              Points
            </ToggleButton>
            <ToggleButton data-boids-control value="flow">
              Flow
            </ToggleButton>
          </ToggleButtonGroup>

          {fieldMode === 'flow' && (
            <>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                Flow field
              </Typography>
              <ToggleButtonGroup
                data-boids-control
                exclusive
                size="small"
                value={flowFieldPreset}
                onChange={(_, value) => handleFlowFieldPreset(value)}
                fullWidth
                sx={toggleSx}
              >
                <ToggleButton data-boids-control value="curlNoise">
                  Curl
                </ToggleButton>
                <ToggleButton data-boids-control value="vortex">
                  Vortex
                </ToggleButton>
              </ToggleButtonGroup>
              <BoidsSettingsSlider
                label="Flow weight"
                value={flowWeight}
                min={0}
                max={1}
                step={0.05}
                onChange={(value) => {
                  setScenePreset('');
                  setFlowWeight(value);
                  app?.setFlowWeight(value);
                }}
              />
            </>
          )}

          <BoidsSettingsSlider
            label="Attractor strength"
            value={attractorStrength}
            min={0.1}
            max={1.5}
            step={0.05}
            onChange={(value) => {
              setScenePreset('');
              setAttractorStrength(value);
              app?.setAttractorStrength(value);
            }}
          />

          <BoidsSettingsSlider
            label="Attractor speed"
            value={attractorSpeed}
            min={0.02}
            max={0.3}
            step={0.01}
            onChange={(value) => {
              setScenePreset('');
              setAttractorSpeed(value);
              app?.setAttractorSpeed(value);
            }}
          />

          <BoidsSettingsSlider
            label="Attractor count"
            value={attractorCount}
            min={1}
            max={maxAttractorCount}
            step={1}
            onChange={(value) => {
              setScenePreset('');
              setAttractorCount(value);
              app?.setAttractorCount(value);
            }}
          />

          <BoidsSettingsSlider
            label="Boid speed"
            value={boidSpeedMultiplier}
            min={0.25}
            max={3}
            step={0.05}
            onChange={(value) => {
              setScenePreset('');
              setBoidSpeedMultiplier(value);
              app?.setBoidSpeedMultiplier(value);
            }}
          />

          <FormControlLabel
            data-boids-control
            sx={{ m: 0, minWidth: 0, alignItems: 'flex-start' }}
            control={
              <Checkbox
                data-boids-control
                size="small"
                checked={attractorsVisible}
                onChange={(e) =>
                  handleAttractorsVisibleToggle(e.target.checked)
                }
                sx={{ color: 'common.white', pt: 0.25 }}
              />
            }
            label={
              <Typography variant="body2" sx={{ lineHeight: 1.4 }}>
                Show attractors
              </Typography>
            }
          />

          <Typography variant="caption" sx={{ opacity: 0.8, mt: 0.5 }}>
            Flock mix
          </Typography>
          {BOID_PRESET_ORDER.map((preset) => (
            <BoidsSettingsSlider
              key={preset}
              label={BOID_PRESET_LABELS[preset]}
              value={boidMix[preset] ?? 0}
              min={0}
              max={1}
              step={0.05}
              onChange={(value) => handleMixChange(preset, value)}
            />
          ))}

          <FormControlLabel
            data-boids-control
            sx={{ m: 0, minWidth: 0, alignItems: 'flex-start' }}
            control={
              <Checkbox
                data-boids-control
                size="small"
                checked={obstaclesEnabled}
                onChange={(e) => handleObstaclesToggle(e.target.checked)}
                sx={{ color: 'common.white', pt: 0.25 }}
              />
            }
            label={
              <Typography variant="body2" sx={{ lineHeight: 1.4 }}>
                Obstacles
              </Typography>
            }
          />
        </Box>
      </Collapse>

      <Box
        data-boids-control
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 0.5,
          px: 1.5,
          py: settingsExpanded ? 0.5 : 1,
          pb: settingsExpanded ? 0.5 : 1.5,
        }}
      >
        <Typography variant="caption" sx={{ opacity: 0.8 }}>
          Boids
        </Typography>
        <IconButton
          data-boids-control
          size="small"
          aria-label={
            settingsExpanded ? 'Collapse settings' : 'Expand settings'
          }
          aria-expanded={settingsExpanded}
          onClick={() => setSettingsExpanded((prev) => !prev)}
          sx={{ color: 'common.white', p: 0.25 }}
        >
          {settingsExpanded ? (
            <RemoveIcon fontSize="small" />
          ) : (
            <AddIcon fontSize="small" />
          )}
        </IconButton>
      </Box>

      <Popover
        open={infoOpen}
        anchorEl={infoAnchorRef.current}
        onClose={() => setInfoOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        slotProps={{
          paper: {
            'data-boids-control': true,
            sx: {
              p: 1.5,
              maxWidth: 280,
              bgcolor: 'rgba(18, 0, 31, 0.95)',
              color: 'common.white',
              border: '1px solid rgba(255,255,255,0.2)',
            },
          },
        }}
      >
        <Typography variant="subtitle2" sx={{ mb: 0.75 }}>
          Controls
        </Typography>
        <Box component="ul" sx={{ m: 0, pl: 2, opacity: 0.9 }}>
          {SETTINGS_HELP.map((line) => (
            <Typography
              key={line}
              component="li"
              variant="caption"
              sx={{ mb: 0.5, display: 'list-item' }}
            >
              {line}
            </Typography>
          ))}
        </Box>
      </Popover>
    </Box>
  );
}

const toggleSx = {
  width: '100%',
  minWidth: 0,
  '& .MuiToggleButtonGroup-grouped': {
    minWidth: 0,
  },
  '& .MuiToggleButton-root': {
    color: 'common.white',
    borderColor: 'rgba(255,255,255,0.3)',
    minWidth: 0,
    flex: 1,
    px: 0.75,
    py: 0.5,
    fontSize: '0.75rem',
    lineHeight: 1.2,
    whiteSpace: 'normal',
    textAlign: 'center',
    '&.Mui-selected': {
      bgcolor: 'primary.main',
      color: 'common.white',
    },
  },
};
