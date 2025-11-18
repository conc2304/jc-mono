import React, { useState, useRef, useEffect } from 'react';
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
  Add as AddIcon,
  Delete as DeleteIcon,
  NavigateBefore as NavigateBeforeIcon,
  NavigateNext as NavigateNextIcon,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { hexToRgb, rgbToHex } from '@jc/utils';

interface ColorStop {
  id: number;
  color: string;
  position: number;
}

interface GradientData {
  stops: ColorStop[];
  cssGradient: string;
}

interface GradientEditorProps {
  onGradientChange?: (gradientData: GradientData) => void;
}

export const ColorGradientEditor: React.FC<GradientEditorProps> = ({
  onGradientChange,
}) => {
  const theme = useTheme();
  const [stops, setStops] = useState<ColorStop[]>([
    { id: 1, color: '#ff0000', position: 0 },
    { id: 2, color: '#00ff00', position: 50 },
    { id: 3, color: '#0000ff', position: 100 },
  ]);
  const [selectedStop, setSelectedStop] = useState<number | null>(null);
  const [draggingStop, setDraggingStop] = useState<number | null>(null);
  const gradientBarRef = useRef<HTMLDivElement>(null);
  const [nextId, setNextId] = useState<number>(3);

  // Generate CSS gradient string
  const generateGradient = (): string => {
    const sortedStops = [...stops].sort((a, b) => a.position - b.position);
    const gradientString = sortedStops
      .map((stop) => `${stop.color} ${stop.position}%`)
      .join(', ');
    return `linear-gradient(to right, ${gradientString})`;
  };

  // Notify parent of gradient changes
  useEffect(() => {
    if (onGradientChange) {
      const sortedStops = [...stops].sort((a, b) => a.position - b.position);
      onGradientChange({
        stops: sortedStops,
        cssGradient: generateGradient(),
      });
    }
  }, [stops, onGradientChange]);

  // Helper functions for color conversion

  // Interpolate color between two stops
  const interpolateColor = (position: number): string => {
    const sortedStops = [...stops].sort((a, b) => a.position - b.position);

    // Find the two stops to interpolate between
    let leftStop = sortedStops[0];
    let rightStop = sortedStops[sortedStops.length - 1];

    for (let i = 0; i < sortedStops.length - 1; i++) {
      if (
        sortedStops[i].position <= position &&
        sortedStops[i + 1].position >= position
      ) {
        leftStop = sortedStops[i];
        rightStop = sortedStops[i + 1];
        break;
      }
    }

    // Calculate interpolation factor
    const range = rightStop.position - leftStop.position;
    const factor = range === 0 ? 0 : (position - leftStop.position) / range;

    // Convert hex to RGB for interpolation
    const leftRgb = hexToRgb(leftStop.color);
    const rightRgb = hexToRgb(rightStop.color);

    const r = Math.round(leftRgb.r + (rightRgb.r - leftRgb.r) * factor);
    const g = Math.round(leftRgb.g + (rightRgb.g - leftRgb.g) * factor);
    const b = Math.round(leftRgb.b + (rightRgb.b - leftRgb.b) * factor);

    return rgbToHex(r, g, b);
  };

  // Add a new stop
  const addStop = (): void => {
    // Find a good position for the new stop (middle of largest gap)
    const sortedStops = [...stops].sort((a, b) => a.position - b.position);
    let maxGap = 0;
    let maxGapPosition = 50;

    for (let i = 0; i < sortedStops.length - 1; i++) {
      const gap = sortedStops[i + 1].position - sortedStops[i].position;
      if (gap > maxGap) {
        maxGap = gap;
        maxGapPosition = sortedStops[i].position + gap / 2;
      }
    }

    // Interpolate color at this position
    const color = interpolateColor(maxGapPosition);

    const newStop: ColorStop = {
      id: nextId,
      color: color,
      position: maxGapPosition,
    };

    setStops([...stops, newStop]);
    setNextId(nextId + 1);
    setSelectedStop(newStop.id);
  };

  // Remove a stop
  const removeStop = (stopId: number): void => {
    if (stops.length <= 2) {
      alert('You must have at least 2 color stops');
      return;
    }
    setStops(stops.filter((stop) => stop.id !== stopId));
    if (selectedStop === stopId) {
      setSelectedStop(null);
    }
  };

  // Update stop color
  const updateStopColor = (stopId: number, newColor: string): void => {
    setStops(
      stops.map((stop) =>
        stop.id === stopId ? { ...stop, color: newColor } : stop
      )
    );
  };

  // Update stop position
  const updateStopPosition = (stopId: number, newPosition: number): void => {
    const clampedPosition = Math.max(0, Math.min(100, newPosition));
    setStops(
      stops.map((stop) =>
        stop.id === stopId ? { ...stop, position: clampedPosition } : stop
      )
    );
  };

  // Navigate to previous stop
  const navigateToPreviousStop = (): void => {
    if (selectedStop === null) {
      // If no stop selected, select the first stop by position
      const sortedStops = [...stops].sort((a, b) => a.position - b.position);
      setSelectedStop(sortedStops[0].id);
      return;
    }

    const sortedStops = [...stops].sort((a, b) => a.position - b.position);
    const currentIndex = sortedStops.findIndex(
      (stop) => stop.id === selectedStop
    );

    if (currentIndex === -1) return;

    // Loop around to the last stop if at the beginning
    const previousIndex =
      currentIndex === 0 ? sortedStops.length - 1 : currentIndex - 1;
    setSelectedStop(sortedStops[previousIndex].id);
  };

  // Navigate to next stop
  const navigateToNextStop = (): void => {
    if (selectedStop === null) {
      // If no stop selected, select the first stop by position
      const sortedStops = [...stops].sort((a, b) => a.position - b.position);
      setSelectedStop(sortedStops[0].id);
      return;
    }

    const sortedStops = [...stops].sort((a, b) => a.position - b.position);
    const currentIndex = sortedStops.findIndex(
      (stop) => stop.id === selectedStop
    );

    if (currentIndex === -1) return;

    // Loop around to the first stop if at the end
    const nextIndex =
      currentIndex === sortedStops.length - 1 ? 0 : currentIndex + 1;
    setSelectedStop(sortedStops[nextIndex].id);
  };

  // Handle mouse down on stop
  const handleStopMouseDown = (e: React.MouseEvent, stopId: number): void => {
    e.preventDefault();
    setDraggingStop(stopId);
    setSelectedStop(stopId);
  };

  // Handle mouse move for dragging
  const handleMouseMove = (e: MouseEvent): void => {
    if (draggingStop !== null && gradientBarRef.current) {
      const rect = gradientBarRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = (x / rect.width) * 100;
      updateStopPosition(draggingStop, percentage);
    }
  };

  // Handle mouse up to stop dragging
  const handleMouseUp = (): void => {
    setDraggingStop(null);
  };

  // Add event listeners for dragging
  useEffect(() => {
    if (draggingStop !== null) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [draggingStop, stops]);

  // Handle click on gradient bar to add stop
  const handleGradientBarClick = (
    e: React.MouseEvent<HTMLDivElement>
  ): void => {
    const target = e.target as HTMLElement;
    if (
      target === gradientBarRef.current ||
      target.classList.contains('gradient-background')
    ) {
      const rect = gradientBarRef.current!.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = (x / rect.width) * 100;
      const color = interpolateColor(percentage);

      const newStop: ColorStop = {
        id: nextId,
        color: color,
        position: percentage,
      };

      setStops([...stops, newStop]);
      setNextId(nextId + 1);
      setSelectedStop(newStop.id);
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 768, mx: 'auto', p: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
          Gradient Editor
        </Typography>

        {/* Gradient Preview */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="body2"
            fontWeight={600}
            color="text.primary"
            sx={{ mb: 1 }}
          >
            Preview
          </Typography>
          <Box
            sx={{
              width: '100%',
              height: 128,
              background: generateGradient(),
            }}
          />
        </Box>

        {/* Gradient Bar with Stops */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="body2"
            fontWeight={600}
            color="text.primary"
            sx={{ mb: 1 }}
          >
            Color Stops
          </Typography>
          <Box
            ref={gradientBarRef}
            onClick={handleGradientBarClick}
            sx={{
              position: 'relative',
              width: '100%',
              height: 48,
              cursor: 'crosshair',
              background:
                'repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%) 50% / 20px 20px',
            }}
          >
            {/* Gradient overlay */}
            <Box
              className="gradient-background"
              sx={{
                position: 'absolute',
                inset: 0,
                background: generateGradient(),
              }}
            />

            {/* Color stops */}
            {stops.map((stop) => (
              <Box
                key={stop.id}
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: `${stop.position}%`,
                  transform: 'translate(-50%, -50%)',
                  cursor: 'move',
                  zIndex: selectedStop === stop.id ? 20 : 10,
                }}
                onMouseDown={(e) => handleStopMouseDown(e, stop.id)}
              >
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    border: `3px solid ${
                      selectedStop === stop.id
                        ? theme.palette.primary.main
                        : theme.palette.common.white
                    }`,
                    boxShadow:
                      selectedStop === stop.id
                        ? `0 0 0 2px ${theme.palette.primary.light}`
                        : theme.shadows[4],
                    backgroundColor: stop.color,
                    transition: 'all 0.2s',
                    transform:
                      selectedStop === stop.id ? 'scale(1.25)' : 'scale(1)',
                    '&:hover': {
                      transform:
                        selectedStop === stop.id ? 'scale(1.25)' : 'scale(1.1)',
                    },
                  }}
                />
                {/* Position indicator */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 32,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    fontSize: '0.75rem',
                    fontFamily: 'monospace',
                    backgroundColor: theme.palette.grey[800],
                    color: theme.palette.common.white,
                    px: 0.5,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {Math.round(stop.position)}%
                </Box>
              </Box>
            ))}
          </Box>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 1, display: 'block' }}
          >
            Click on the gradient bar to add a new stop, or drag existing stops
            to reposition them
          </Typography>
        </Box>

        {/* Add Stop Button */}
        <Box sx={{ mb: 3 }}>
          <Button
            fullWidth
            variant="contained"
            onClick={addStop}
            startIcon={<AddIcon />}
          >
            Add Color Stop
          </Button>
        </Box>

        {/* Selected Stop Controls */}
        {selectedStop !== null && (
          <Box sx={{ mb: 3 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: 1,
              }}
            >
              <Typography
                variant="body2"
                fontWeight={600}
                color="text.primary"
              >
                Selected Stop (
                {(() => {
                  const sortedStops = [...stops].sort(
                    (a, b) => a.position - b.position
                  );
                  return (
                    sortedStops.findIndex((s) => s.id === selectedStop) + 1
                  );
                })()}{' '}
                of {stops.length})
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={navigateToPreviousStop}
                  startIcon={<NavigateBeforeIcon />}
                >
                  Previous
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={navigateToNextStop}
                  endIcon={<NavigateNextIcon />}
                >
                  Next
                </Button>
              </Box>
            </Box>
            {stops
              .filter((stop) => stop.id === selectedStop)
              .map((stop) => (
                <Paper
                  key={stop.id}
                  sx={{
                    p: 2,
                    border: `2px solid ${theme.palette.primary.main}`,
                    backgroundColor: theme.palette.primary.light + '20',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {/* Color Preview */}
                    <Box
                      sx={{
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
                          updateStopColor(stop.id, e.target.value)
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
                            updateStopColor(stop.id, hex);
                          }
                        }}
                      />
                    </Box>

                    {/* Position Input */}
                    <Box sx={{ width: 100 }}>
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
                          updateStopPosition(
                            stop.id,
                            parseFloat(e.target.value)
                          )
                        }
                      />
                    </Box>

                    {/* Remove Button */}
                    <IconButton
                      onClick={() => removeStop(stop.id)}
                      disabled={stops.length <= 2}
                      color="error"
                      sx={{
                        '&.Mui-disabled': {
                          color: theme.palette.action.disabled,
                        },
                      }}
                      title={
                        stops.length <= 2
                          ? 'Minimum 2 stops required'
                          : 'Remove stop'
                      }
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Paper>
              ))}
          </Box>
        )}

        {/* No stop selected message */}
        {selectedStop === null && (
          <Paper
            sx={{
              p: 2,
              border: `2px solid ${theme.palette.divider}`,
              textAlign: 'center',
              color: theme.palette.text.secondary,
            }}
          >
            Click on a color stop above to edit it
          </Paper>
        )}
      </Paper>
    </Box>
  );
};
