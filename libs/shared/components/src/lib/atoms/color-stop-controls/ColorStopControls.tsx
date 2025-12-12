import React from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  IconButton,
  InputAdornment,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  NavigateBefore as NavigateBeforeIcon,
  NavigateNext as NavigateNextIcon,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { ColorStop } from '../../organisms/color-gradient-editor/types';

interface ColorStopControlsProps {
  stops: ColorStop[];
  selectedStop: number | null;
  onStopColorChange: (stopId: number, color: string) => void;
  onStopPositionChange: (stopId: number, position: number) => void;
  onStopRemove: (stopId: number) => void;
  onNavigatePrevious: () => void;
  onNavigateNext: () => void;
}

export const ColorStopControls: React.FC<ColorStopControlsProps> = ({
  stops,
  selectedStop,
  onStopColorChange,
  onStopPositionChange,
  onStopRemove,
  onNavigatePrevious,
  onNavigateNext,
}) => {
  const theme = useTheme();

  if (selectedStop === null) {
    return (
      <Paper
        sx={{
          p: 2,
          border: `2px solid ${theme.palette.divider}`,
          textAlign: 'center',
          color: theme.palette.text.secondary,
          borderRadius: 0,
        }}
      >
        Click on a color stop above to edit it
      </Paper>
    );
  }

  const sortedStops = [...stops].sort((a, b) => a.position - b.position);
  const selectedStopIndex =
    sortedStops.findIndex((s) => s.id === selectedStop) + 1;
  const stop = stops.find((s) => s.id === selectedStop);

  if (!stop) return null;

  return (
    <Box sx={{ mb: 3 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 1,
          flexWrap: 'wrap',
        }}
      >
        <Typography
          variant="body2"
          fontWeight={600}
          color="text.primary"
          flexShrink={0}
        >
          Selected Stop ({selectedStopIndex} of {stops.length})
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            size="small"
            variant="outlined"
            onClick={onNavigatePrevious}
            startIcon={<NavigateBeforeIcon />}
          >
            Previous
          </Button>
          <Button
            size="small"
            variant="outlined"
            onClick={onNavigateNext}
            endIcon={<NavigateNextIcon />}
          >
            Next
          </Button>
        </Box>
      </Box>
      <Paper
        sx={{
          p: 2,
          border: `2px solid ${theme.palette.primary.main}`,
          backgroundColor: theme.palette.primary.light + '20',
          borderRadius: 0,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'end', gap: 2 }}>
          {/* Color Preview */}
          <Box
            sx={{
              display: { xs: 'none', sm: 'initial' },
              width: 48,
              height: 48,
              border: `2px solid ${theme.palette.divider}`,
              backgroundColor: stop.color,
              flexShrink: 0,
            }}
          />

          {/* Color Input */}
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mb: 0.5, display: 'block' }}
            >
              Color
            </Typography>
            <Box
              component="input"
              type="color"
              value={stop.color}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onStopColorChange(stop.id, e.target.value)
              }
              sx={{
                width: '100%',
                height: 40,
                cursor: 'pointer',
                border: `1px solid ${theme.palette.divider}`,
              }}
            />
          </Box>

          {/* Hex Input */}
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mb: 0.5, display: 'block' }}
            >
              Hex
            </Typography>
            <TextField
              fullWidth
              size="small"
              value={stop.color}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const hex = e.target.value.startsWith('#')
                  ? e.target.value
                  : '#' + e.target.value;
                if (/^#[0-9A-F]{6}$/i.test(hex)) {
                  onStopColorChange(stop.id, hex);
                }
              }}
              slotProps={{
                htmlInput: {
                  sx: { minWidth: '75px' },
                },
              }}
            />
          </Box>

          {/* Position Input */}
          <Box sx={{ width: { sm: '85px', md: 'initial' } }}>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mb: 0.5, display: 'block' }}
            >
              Position
            </Typography>
            <TextField
              fullWidth
              size="small"
              type="number"
              slotProps={{
                htmlInput: { min: 0, max: 100 },
                input: {
                  endAdornment: (
                    <InputAdornment position="end">%</InputAdornment>
                  ),
                },
              }}
              value={Math.round(stop.position)}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onStopPositionChange(stop.id, parseFloat(e.target.value))
              }
            />
          </Box>

          {/* Remove Button */}
          <IconButton
            onClick={() => onStopRemove(stop.id)}
            disabled={stops.length <= 2}
            color="error"
            sx={{
              '&.Mui-disabled': {
                color: theme.palette.action.disabled,
              },
            }}
            title={
              stops.length <= 2 ? 'Minimum 2 stops required' : 'Remove stop'
            }
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      </Paper>
    </Box>
  );
};
