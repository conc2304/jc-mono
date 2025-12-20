import {
  Box,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  Slider,
  Paper,
  Tooltip,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  ColorStop,
  GradientPatternType,
  InterpolationMode,
  GradientPatternConfig,
} from '../color-gradient-editor/types';
import { GradientPatternVisualizer } from '../../atoms/gradient-pattern-visualizer';

interface GradientPatternPickerProps {
  gradient?: ColorStop[];
  config: GradientPatternConfig;
  onConfigChange: (config: GradientPatternConfig) => void;
}

const patternTypes: Array<{
  value: GradientPatternType;
  label: string;
  description: string;
}> = [
  {
    value: 'horizontal',
    label: 'Horizontal',
    description: 'Left to right gradient',
  },
  {
    value: 'vertical',
    label: 'Vertical',
    description: 'Top to bottom gradient',
  },
  {
    value: 'radial',
    label: 'Radial',
    description: 'Center outward gradient',
  },
  {
    value: 'circular',
    label: 'Circular',
    description: 'Circular/conic gradient',
  },
];

export const GradientPatternPicker = ({
  gradient,
  config,
  onConfigChange,
}: GradientPatternPickerProps) => {
  const theme = useTheme();

  const handleTypeChange = (
    _event: React.MouseEvent<HTMLElement>,
    newType: GradientPatternType | null
  ) => {
    if (newType !== null) {
      onConfigChange({ ...config, type: newType });
    }
  };

  const handleInterpolationChange = (
    _event: React.MouseEvent<HTMLElement>,
    newInterpolation: InterpolationMode | null
  ) => {
    if (newInterpolation !== null) {
      onConfigChange({ ...config, interpolation: newInterpolation });
    }
  };

  const handleSpeedChange = (_event: Event, newSpeed: number | number[]) => {
    onConfigChange({ ...config, speed: newSpeed as number });
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* Pattern Type Selection */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="body2"
          fontWeight={600}
          color="text.primary"
          sx={{ mb: 1.5 }}
        >
          Pattern Type
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 1.5,
          }}
        >
          {patternTypes.map((pattern) => (
            <Tooltip key={pattern.value} title={pattern.description} arrow>
              <Paper
                onClick={() =>
                  onConfigChange({ ...config, type: pattern.value })
                }
                sx={{
                  p: 1.5,
                  cursor: 'pointer',
                  border: `2px solid ${
                    config.type === pattern.value
                      ? theme.palette.primary.main
                      : theme.palette.divider
                  }`,
                  backgroundColor:
                    config.type === pattern.value
                      ? theme.palette.action.selected
                      : 'background.paper',
                  transition: 'all 0.2s',
                  '&:hover': {
                    borderColor:
                      config.type === pattern.value
                        ? theme.palette.primary.main
                        : theme.palette.text.secondary,
                    transform: 'scale(1.02)',
                  },
                }}
              >
                <Typography
                  variant="body2"
                  fontWeight={600}
                  color="text.primary"
                  sx={{ mb: 1 }}
                >
                  {pattern.label}
                </Typography>
                <GradientPatternVisualizer
                  type={pattern.value}
                  interpolation={config.interpolation}
                  stops={gradient}
                  width="100%"
                  height={60}
                />
              </Paper>
            </Tooltip>
          ))}
        </Box>
      </Box>

      {/* Interpolation Mode */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="body2"
          fontWeight={600}
          color="text.primary"
          sx={{ mb: 1.5 }}
        >
          Interpolation Mode
        </Typography>
        <ToggleButtonGroup
          value={config.interpolation}
          exclusive
          onChange={handleInterpolationChange}
          fullWidth
          color="primary"
        >
          <ToggleButton value="linear">
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" fontWeight={600}>
                Linear
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Smooth transitions
              </Typography>
            </Box>
          </ToggleButton>
          <ToggleButton value="step">
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" fontWeight={600}>
                Step
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Hard color steps
              </Typography>
            </Box>
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Live Preview with Interpolation */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="body2"
          fontWeight={600}
          color="text.primary"
          sx={{ mb: 1.5 }}
        >
          Preview: {config.type} ({config.interpolation})
        </Typography>
        <Paper
          sx={{
            p: 2,
            backgroundColor: 'background.default',
            border: `2px solid ${theme.palette.divider}`,
          }}
        >
          <GradientPatternVisualizer
            type={config.type}
            interpolation={config.interpolation}
            stops={gradient}
            width="100%"
            height={100}
          />
        </Paper>
      </Box>

      {/* Animation Speed */}
      <Box sx={{ mb: 2 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 1,
          }}
        >
          <Typography variant="body2" fontWeight={600} color="text.primary">
            Animation Speed
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontFamily: 'monospace' }}
          >
            {config.speed === 0 ? 'Static' : `${config.speed}%`}
          </Typography>
        </Box>
        <Slider
          value={config.speed}
          onChange={handleSpeedChange}
          min={0}
          max={100}
          marks={[
            { value: 0, label: 'Static' },
            { value: 50, label: '50%' },
            { value: 100, label: 'Fast' },
          ]}
          valueLabelDisplay="auto"
          sx={{
            '& .MuiSlider-markLabel': {
              fontSize: '0.7rem',
            },
          }}
        />
      </Box>
    </Box>
  );
};
