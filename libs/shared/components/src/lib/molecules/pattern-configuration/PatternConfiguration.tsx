import {
  Box,
  Paper,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  Slider,
  Button,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Stop as StopIcon, ArrowForward as ArrowForwardIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { GradientPatternVisualizer } from '../../atoms/gradient-pattern-visualizer';
import { GradientPatternType, InterpolationMode, ColorStop, SpeedDirection } from '../../organisms/color-gradient-editor/types';

interface PatternConfigurationProps {
  patternType: GradientPatternType | null;
  interpolation: InterpolationMode;
  speed: number;
  direction?: SpeedDirection;
  selectedGradientStops?: ColorStop[];
  onInterpolationChange: (
    event: React.MouseEvent<HTMLElement>,
    newInterpolation: InterpolationMode | null
  ) => void;
  onSpeedChange: (event: Event, newSpeed: number | number[]) => void;
  onStaticClick: () => void;
  onDirectionChange?: (direction: SpeedDirection) => void;
}

export const PatternConfiguration = ({
  patternType,
  interpolation,
  speed,
  direction = 'forward',
  selectedGradientStops,
  onInterpolationChange,
  onSpeedChange,
  onStaticClick,
  onDirectionChange,
}: PatternConfigurationProps) => {
  const theme = useTheme();

  const handleDirectionToggle = () => {
    if (onDirectionChange) {
      const newDirection = direction === 'forward' ? 'backward' : 'forward';
      onDirectionChange(newDirection);
    }
  };

  return (
    <Paper
      sx={{
        p: 2,
        backgroundColor: theme.palette.background.default,
        border: `1px solid ${theme.palette.divider}`,
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
        >
          <ToggleButton value="linear">
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" fontWeight={600}>
                Linear
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Smooth
              </Typography>
            </Box>
          </ToggleButton>
          <ToggleButton value="step">
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
            <Button
              variant={speed === 0 ? 'contained' : 'outlined'}
              size="small"
              onClick={onStaticClick}
              startIcon={<StopIcon />}
              sx={{ minWidth: 80 }}
            >
              Static
            </Button>
          </Box>
        </Box>
        <Slider
          value={speed}
          onChange={onSpeedChange}
          min={0}
          max={100}
          step={1}
          marks={[
            { value: 0, label: '0' },
            { value: 50, label: '50' },
            { value: 100, label: '100' },
          ]}
          valueLabelDisplay="auto"
        />
      </Box>

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
