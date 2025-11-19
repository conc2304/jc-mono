import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  IconButton,
  Modal,
  Tooltip,
  ToggleButtonGroup,
  ToggleButton,
  Slider,
} from '@mui/material';
import {
  Add as AddIcon,
  Close as CloseIcon,
  Stop as StopIcon,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import {
  ColorGradientEditor,
  ColorStop,
  GradientData,
} from './ColorGradientEditor';
import { AugmentedButton } from '../../atoms';
import { GradientPatternVisualizer } from './components/GradientPatternVisualizer';
import {
  Gradient,
  GradientPatternType,
  InterpolationMode,
  GradientPatternConfig,
} from './types';

interface GradientPatternSelectorProps {
  gradients?: Gradient[];
  onPatternConfigChange?: (
    config: GradientPatternConfig,
    gradient: Gradient | null
  ) => void;
  activeGradient?: Gradient | null;
  activePatternConfig?: GradientPatternConfig;
}

const PATTERN_TYPES: Array<{
  type: GradientPatternType;
  label: string;
  description: string;
}> = [
  { type: 'horizontal', label: 'Horizontal', description: 'Left to right' },
  { type: 'vertical', label: 'Vertical', description: 'Top to bottom' },
  { type: 'radial', label: 'Radial', description: 'Center outward' },
  { type: 'circular', label: 'Circular', description: 'Rotating conic' },
];

export const GradientPatternSelector: React.FC<
  GradientPatternSelectorProps
> = ({
  gradients = [],
  onPatternConfigChange,
  activeGradient,
  activePatternConfig,
}) => {
  const theme = useTheme();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [savedGradients, setSavedGradients] = useState<Gradient[]>([]);
  const [customGradientStops, setCustomGradientStops] = useState<ColorStop[]>([
    { id: 1, color: '#FF0000', position: 0 },
    { id: 2, color: '#0000FF', position: 100 },
  ]);

  // Local pattern config state - defaults
  const [patternType, setPatternType] = useState<GradientPatternType>(
    activePatternConfig?.type || 'horizontal'
  );
  const [interpolation, setInterpolation] = useState<InterpolationMode>(
    activePatternConfig?.interpolation || 'linear'
  );
  const [speed, setSpeed] = useState<number>(activePatternConfig?.speed || 0);
  const [selectedGradient, setSelectedGradient] = useState<Gradient | null>(
    activeGradient || null
  );

  // Generate CSS gradient string from stops
  const generateGradientCSS = (stops: ColorStop[]): string => {
    const sortedStops = [...stops].sort((a, b) => a.position - b.position);
    const gradientString = sortedStops
      .map((stop) => `${stop.color} ${stop.position}%`)
      .join(', ');
    return `linear-gradient(to right, ${gradientString})`;
  };

  // Notify parent when config changes
  const notifyConfigChange = (
    newType: GradientPatternType,
    newInterpolation: InterpolationMode,
    newSpeed: number,
    gradient: Gradient | null
  ) => {
    if (onPatternConfigChange) {
      onPatternConfigChange(
        {
          type: newType,
          interpolation: newInterpolation,
          speed: newSpeed,
        },
        gradient
      );
    }
  };

  const handlePatternTypeSelect = (type: GradientPatternType): void => {
    setPatternType(type);
    notifyConfigChange(type, interpolation, speed, selectedGradient);
  };

  const handleGradientSelect = (gradient: Gradient): void => {
    setSelectedGradient(gradient);
    notifyConfigChange(patternType, interpolation, speed, gradient);
  };

  const handleInterpolationChange = (
    _event: React.MouseEvent<HTMLElement>,
    newInterpolation: InterpolationMode | null
  ) => {
    if (newInterpolation !== null) {
      setInterpolation(newInterpolation);
      notifyConfigChange(
        patternType,
        newInterpolation,
        speed,
        selectedGradient
      );
    }
  };

  const handleSpeedChange = (_event: Event, newSpeed: number | number[]) => {
    const speedValue = newSpeed as number;
    setSpeed(speedValue);
    notifyConfigChange(
      patternType,
      interpolation,
      speedValue,
      selectedGradient
    );
  };

  const handleStaticClick = () => {
    setSpeed(0);
    notifyConfigChange(patternType, interpolation, 0, selectedGradient);
  };

  const handleSaveGradient = (): void => {
    const newGradient: Gradient = {
      id: `custom-${Date.now()}`,
      stops: customGradientStops,
    };

    if (
      !savedGradients.some(
        (g) => JSON.stringify(g.stops) === JSON.stringify(newGradient.stops)
      )
    ) {
      setSavedGradients([...savedGradients, newGradient]);
    }
    handleGradientSelect(newGradient);
    setIsModalOpen(false);
  };

  const handleRemoveSavedGradient = (gradientId: string): void => {
    setSavedGradients(savedGradients.filter((g) => g.id !== gradientId));
  };

  const handleGradientChange = (gradientData: GradientData): void => {
    setCustomGradientStops(gradientData.stops);
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 672, mx: 'auto', p: 2 }}>
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
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 1,
          }}
        >
          {PATTERN_TYPES.map((pattern) => (
            <Tooltip key={pattern.type} title={pattern.description} arrow>
              <Paper
                onClick={() => handlePatternTypeSelect(pattern.type)}
                sx={{
                  p: 1,
                  cursor: 'pointer',
                  border: `2px solid ${
                    patternType === pattern.type
                      ? theme.palette.primary.main
                      : theme.palette.divider
                  }`,
                  backgroundColor:
                    patternType === pattern.type
                      ? theme.palette.action.selected
                      : 'background.paper',
                  transition: 'all 0.2s',
                  '&:hover': {
                    borderColor:
                      patternType === pattern.type
                        ? theme.palette.primary.main
                        : theme.palette.text.secondary,
                    transform: 'scale(1.02)',
                  },
                }}
              >
                <Typography
                  variant="caption"
                  fontWeight={600}
                  color="text.primary"
                  sx={{ mb: 0.5, display: 'block', textAlign: 'center' }}
                >
                  {pattern.label}
                </Typography>
                <GradientPatternVisualizer
                  type={pattern.type}
                  interpolation={interpolation}
                  stops={selectedGradient?.stops}
                  width="100%"
                  height={48}
                  animate={false}
                />
              </Paper>
            </Tooltip>
          ))}
        </Box>
      </Box>

      {/* Saved Gradients Section */}
      {savedGradients.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="body2"
            fontWeight={600}
            color="text.primary"
            sx={{ mb: 1 }}
          >
            Saved Gradients
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {savedGradients.map((gradient) => (
              <Box
                key={gradient.id}
                sx={{
                  position: 'relative',
                  '&:hover .remove-btn': { opacity: 1 },
                }}
              >
                <Tooltip title="Click to apply gradient">
                  <Button
                    onClick={() => handleGradientSelect(gradient)}
                    sx={{
                      minWidth: 120,
                      width: 120,
                      height: 48,
                      p: 0,
                      background: generateGradientCSS(gradient.stops),

                      border:
                        selectedGradient?.id === gradient.id
                          ? `4px solid ${theme.palette.primary.main}`
                          : 'none',
                      transition: 'transform 0.2s',
                      '&:hover': {
                        background: generateGradientCSS(gradient.stops),
                        transform:
                          selectedGradient?.id === gradient.id
                            ? 'none'
                            : 'scale(1.05)',
                      },
                    }}
                  />
                </Tooltip>
                <IconButton
                  className="remove-btn"
                  size="small"
                  onClick={() => handleRemoveSavedGradient(gradient.id)}
                  sx={{
                    position: 'absolute',
                    top: -4,
                    right: -4,
                    width: 20,
                    height: 20,
                    backgroundColor: theme.palette.error.main,
                    color: theme.palette.error.contrastText,
                    opacity: 0,
                    transition: 'opacity 0.2s',
                    fontSize: '0.75rem',
                    '&:hover': {
                      backgroundColor: theme.palette.error.dark,
                    },
                  }}
                >
                  ×
                </IconButton>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {/* Gradient Swatches */}
      <Typography
        variant="body2"
        fontWeight={600}
        color="text.primary"
        sx={{ mb: 1 }}
      >
        Gradient Colors
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
        {/* Custom Gradient Button */}
        <AugmentedButton
          onClick={() => setIsModalOpen(true)}
          color="secondary"
          variant="outlined"
          sx={{
            minWidth: 48,
            width: 120,
            height: 48,
            p: 0,
            border: `2px dashed ${theme.palette.divider}`,

            transition: 'all 0.2s',
            '&:hover': {
              borderColor: theme.palette.text.secondary,
              transform: 'scale(1.05)',
            },
          }}
        >
          <AddIcon sx={{ color: theme.palette.text.secondary, fontSize: 32 }} />
        </AugmentedButton>

        {/* Gradient Swatches */}
        {gradients.map((gradient, index) => (
          <Tooltip key={gradient.id || index} title="Click to apply gradient">
            <AugmentedButton
              className="GradientSwatch--root"
              variant="contained"
              onClick={() => handleGradientSelect(gradient)}
              sx={{
                minWidth: 120,
                width: 120,
                height: 48,
                p: 0,
                background: generateGradientCSS(gradient.stops),

                '&.GradientSwatch--root': {
                  background: generateGradientCSS(gradient.stops),

                  '--aug-border-bg':
                    selectedGradient?.id === gradient.id
                      ? theme.palette.primary.main
                      : theme.palette.secondary.main,
                  '--aug-border-all':
                    selectedGradient?.id === gradient.id ? '3px' : undefined,

                  '&:hover': {
                    '--aug-border-all': '4px',
                    '--aug-border-bg': theme.palette.secondary.main,
                    background: generateGradientCSS(gradient.stops),
                  },
                },
              }}
            />
          </Tooltip>
        ))}
      </Box>

      {/* Pattern Configuration Controls */}
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
            onChange={handleInterpolationChange}
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
                {speed === 0 ? 'Static' : `${speed}%`}
              </Typography>
              <Button
                variant={speed === 0 ? 'contained' : 'outlined'}
                size="small"
                onClick={handleStaticClick}
                startIcon={<StopIcon />}
                sx={{ minWidth: 80 }}
              >
                Static
              </Button>
            </Box>
          </Box>
          <Slider
            value={speed}
            onChange={handleSpeedChange}
            min={0}
            max={100}
            step={1}
            marks={[
              { value: 0, label: '0' },
              { value: 50, label: '50' },
              { value: 100, label: '100' },
            ]}
            valueLabelDisplay="auto"
            sx={{
              '& .MuiSlider-markLabel': {
                fontSize: '0.65rem',
              },
            }}
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
              type={patternType}
              interpolation={interpolation}
              stops={selectedGradient?.stops}
              width="100%"
              height={80}
              animate={speed > 0}
              speed={speed}
            />
          </Box>
        </Box>
      </Paper>

      {/* Custom Gradient Modal - Only Gradient Editor */}
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Paper
          sx={{
            p: 3,
            maxWidth: 800,
            width: '100%',
            mx: 2,
            maxHeight: '90vh',
            overflow: 'auto',
            outline: 'none',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <Typography variant="h6" fontWeight="bold">
              Create Custom Gradient
            </Typography>
            <IconButton
              onClick={() => setIsModalOpen(false)}
              sx={{ color: theme.palette.text.secondary }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Only the Gradient Editor */}
          <ColorGradientEditor
            initialStops={customGradientStops}
            onGradientChange={handleGradientChange}
            showTitle={false}
          />

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
            <Button fullWidth variant="contained" onClick={handleSaveGradient}>
              Save & Apply Gradient
            </Button>
            <Button
              variant="outlined"
              onClick={() => setIsModalOpen(false)}
              sx={{ px: 2 }}
            >
              Cancel
            </Button>
          </Box>
        </Paper>
      </Modal>
    </Box>
  );
};
