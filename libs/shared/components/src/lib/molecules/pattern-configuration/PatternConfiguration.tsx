import {
  Box,
  Paper,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  ArrowForward as ArrowForwardIcon,
  ArrowBack as ArrowBackIcon,
  CloseFullscreen,
  OpenInFull,
  Restore,
} from '@mui/icons-material';
import { alpha, useTheme } from '@mui/material/styles';
import { GradientPatternVisualizer } from '../../atoms/gradient-pattern-visualizer';
import {
  GradientPatternType,
  InterpolationMode,
  ColorStop,
  SpeedDirection,
} from '../../organisms/color-gradient-editor/types';
import { AugmentedSlider } from '../augmented-slider';
import { RabbitIcon, TurtleIcon } from 'lucide-react';

interface PatternConfigurationProps {
  patternType: GradientPatternType | null;
  interpolation: InterpolationMode;
  speed: number;
  direction?: SpeedDirection;
  period?: number;
  selectedGradientStops?: ColorStop[];
  onInterpolationChange: (
    event: React.MouseEvent<HTMLElement>,
    newInterpolation: InterpolationMode | null
  ) => void;
  onSpeedChange: (event: Event, newSpeed: number | number[]) => void;
  onStaticClick: () => void;
  onDirectionChange?: (direction: SpeedDirection) => void;
  onPeriodChange?: (event: Event, newPeriod: number | number[]) => void;
}

export const PatternConfiguration = ({
  patternType,
  interpolation,
  speed,
  direction = 'forward',
  period = 1,
  selectedGradientStops,
  onInterpolationChange,
  onSpeedChange,
  onStaticClick,
  onDirectionChange,
  onPeriodChange,
}: PatternConfigurationProps) => {
  const theme = useTheme();

  const handleDirectionToggle = () => {
    if (onDirectionChange) {
      const newDirection = direction === 'forward' ? 'backward' : 'forward';
      onDirectionChange(newDirection);
    }
  };

  const handleSpeedChange = (event: Event | null, value: number | number[]) => {
    onSpeedChange(event || ({} as Event), value);
  };

  // Scale function to map slider position (0-100) to period value (0.2-10)
  // Middle value (50) should map to 1
  const scalePeriod = (sliderValue: number): number => {
    if (sliderValue <= 50) {
      // Map 0-50 to 0.2-1 linearly
      return 0.2 + (sliderValue / 50) * 0.8;
    } else {
      // Map 50-100 to 1-10 linearly
      return 1 + ((sliderValue - 50) / 50) * 9;
    }
  };

  // Inverse scale function to map period value (0.2-10) to slider position (0-100)
  const inverseScalePeriod = (periodValue: number): number => {
    if (periodValue <= 1) {
      // Map 0.2-1 to 0-50 linearly
      return ((periodValue - 0.2) / 0.8) * 50;
    } else {
      // Map 1-10 to 50-100 linearly
      return 50 + ((periodValue - 1) / 9) * 50;
    }
  };

  const handlePeriodSliderChange = (
    event: Event | null,
    newValue: number | number[]
  ) => {
    if (onPeriodChange) {
      const sliderValue = Array.isArray(newValue) ? newValue[0] : newValue;
      const scaledPeriod = scalePeriod(sliderValue);
      onPeriodChange(event || ({} as Event), scaledPeriod);
    }
  };

  return (
    <Paper
      sx={{
        p: 2,
        backgroundColor: alpha(theme.palette.background.default, 0.7),
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 0,
        m: 1,
      }}
    >
      <Typography
        variant="body2"
        fontWeight={600}
        color="text.primary"
        sx={{ mb: 2 }}
      >
        Pattern Configuration
      </Typography>

      {/* Interpolation Mode */}
      <Box sx={{ mb: 2 }}>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mb: 1, display: 'block' }}
        >
          Interpolation Mode
        </Typography>
        <ToggleButtonGroup
          value={interpolation}
          exclusive
          onChange={onInterpolationChange}
          fullWidth
          color="primary"
          size="small"
          sx={{
            '& *': { borderRadius: 0 },
          }}
        >
          <ToggleButton value="linear" sx={{ borderRadius: 0 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" fontWeight={600}>
                Linear
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Smooth
              </Typography>
            </Box>
          </ToggleButton>
          <ToggleButton value="step" sx={{ borderRadius: 0 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" fontWeight={600}>
                Step
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Hard edges
              </Typography>
            </Box>
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Animation Speed with Static Button */}
      <Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 1,
          }}
        >
          <Typography variant="caption" color="text.secondary">
            Animation Speed
          </Typography>

          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontFamily: 'monospace' }}
            >
              {speed === 0 ? 'Static' : `${Math.abs(speed)}%`}
            </Typography>
            {speed !== 0 && onDirectionChange && (
              <Tooltip title={direction === 'forward' ? 'Forward' : 'Backward'}>
                <IconButton
                  size="small"
                  onClick={handleDirectionToggle}
                  color="primary"
                  sx={{
                    border: `1px solid ${theme.palette.primary.main}`,
                    width: 32,
                    height: 32,
                  }}
                >
                  {direction === 'forward' ? (
                    <ArrowForwardIcon fontSize="small" />
                  ) : (
                    <ArrowBackIcon fontSize="small" />
                  )}
                </IconButton>
              </Tooltip>
            )}
            {/* <Button
              variant={speed === 0 ? 'contained' : 'outlined'}
              size="small"
              onClick={onStaticClick}
              startIcon={<StopIcon />}
              sx={{ minWidth: 80 }}
            >
              Static
            </Button> */}
          </Box>
        </Box>

        <AugmentedSlider
          label=""
          value={speed}
          onChange={handleSpeedChange}
          min={0}
          max={100}
          resetValue={0}
          decrementIcon={<TurtleIcon />}
          incrementIcon={<RabbitIcon />}
          restoreIcon={<Restore />}
          ariaLabel="Animation Speed"
          restoreButtonSlotProps={{
            onClick: onStaticClick,
          }}
        />
      </Box>

      {/* Gradient Period */}
      {onPeriodChange && (
        <AugmentedSlider
          label=""
          value={inverseScalePeriod(period)}
          onChange={handlePeriodSliderChange}
          min={0}
          max={100}
          resetValue={50}
          decrementIcon={<CloseFullscreen />}
          incrementIcon={<OpenInFull />}
          restoreIcon={<Restore />}
          ariaLabel="Gradient Period"
          sliderSlotProps={{
            valueLabelFormat: () => period.toFixed(2),
          }}
        />
      )}

      {/* Live Preview */}
      <Box sx={{ mt: 2 }}>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mb: 1, display: 'block' }}
        >
          Preview
        </Typography>
        <Box
          sx={{
            border: `2px solid ${theme.palette.divider}`,
            overflow: 'hidden',
          }}
        >
          <GradientPatternVisualizer
            type={patternType || 'vertical'}
            interpolation={interpolation}
            stops={selectedGradientStops}
            width="100%"
            height={80}
          />
        </Box>
      </Box>
    </Paper>
  );
};
