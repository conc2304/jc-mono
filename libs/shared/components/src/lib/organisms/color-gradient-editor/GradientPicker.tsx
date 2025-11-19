import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  IconButton,
  Modal,
  Tooltip,
} from '@mui/material';
import { Add as AddIcon, Close as CloseIcon } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import {
  ColorGradientEditor,
  ColorStop,
  GradientData,
} from './ColorGradientEditor';
import { AugmentedButton } from '../../atoms';

interface Gradient {
  id: string;
  stops: ColorStop[];
}

interface GradientPickerProps {
  gradients?: Gradient[];
  onGradientChange?: (gradient: Gradient) => void;
  activeGradient?: Gradient | null;
}

export const GradientPicker: React.FC<GradientPickerProps> = ({
  gradients = [],
  onGradientChange,
  activeGradient,
}) => {
  const theme = useTheme();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [savedGradients, setSavedGradients] = useState<Gradient[]>([]);
  const [customGradientStops, setCustomGradientStops] = useState<ColorStop[]>([
    { id: 1, color: '#FF0000', position: 0 },
    { id: 2, color: '#0000FF', position: 100 },
  ]);

  // Generate CSS gradient string from stops
  const generateGradientCSS = (stops: ColorStop[]): string => {
    const sortedStops = [...stops].sort((a, b) => a.position - b.position);
    const gradientString = sortedStops
      .map((stop) => `${stop.color} ${stop.position}%`)
      .join(', ');
    return `linear-gradient(to right, ${gradientString})`;
  };

  const handleGradientSelect = (gradient: Gradient): void => {
    if (onGradientChange) onGradientChange(gradient);
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
                <Tooltip title="Click to select">
                  <Button
                    onClick={() => handleGradientSelect(gradient)}
                    sx={{
                      minWidth: 120,
                      width: 120,
                      height: 48,
                      p: 0,
                      background: generateGradientCSS(gradient.stops),
                      borderRadius: 1,
                      border:
                        activeGradient?.id === gradient.id
                          ? `4px solid ${theme.palette.primary.main}`
                          : 'none',
                      transition: 'transform 0.2s',
                      '&:hover': {
                        background: generateGradientCSS(gradient.stops),
                        transform:
                          activeGradient?.id === gradient.id
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
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
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
            borderRadius: 1,
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
          <Tooltip key={gradient.id || index} title="Click to select">
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
                    activeGradient?.id === gradient.id
                      ? theme.palette.primary.main
                      : theme.palette.secondary.main,
                  '--aug-border-all':
                    activeGradient?.id === gradient.id ? '3px' : undefined,

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

      {/* Custom Gradient Modal */}
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

          {/* Use the ColorGradientEditor component */}
          <ColorGradientEditor
            initialStops={customGradientStops}
            onGradientChange={handleGradientChange}
            showTitle={false}
          />

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
            <Button fullWidth variant="contained" onClick={handleSaveGradient}>
              Save & Apply
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
