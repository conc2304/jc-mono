import React, { useRef, useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { ColorStop } from '../hooks/useGradientStops';

interface GradientBarProps {
  stops: ColorStop[];
  selectedStop: number | null;
  gradient: string;
  onStopSelect: (stopId: number) => void;
  onStopPositionChange: (stopId: number, position: number) => void;
  onAddStop?: (position: number, color: string) => void;
  interpolateColor: (position: number) => string;
}

export const GradientBar: React.FC<GradientBarProps> = ({
  stops,
  selectedStop,
  gradient,
  onStopSelect,
  onStopPositionChange,
  onAddStop,
  interpolateColor,
}) => {
  const theme = useTheme();
  const [draggingStop, setDraggingStop] = useState<number | null>(null);
  const gradientBarRef = useRef<HTMLDivElement>(null);

  const handleStopMouseDown = (e: React.MouseEvent, stopId: number): void => {
    e.preventDefault();
    setDraggingStop(stopId);
    onStopSelect(stopId);
  };

  const handleMouseMove = (e: MouseEvent): void => {
    if (draggingStop !== null && gradientBarRef.current) {
      const rect = gradientBarRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = (x / rect.width) * 100;
      onStopPositionChange(draggingStop, percentage);
    }
  };

  const handleMouseUp = (): void => {
    setDraggingStop(null);
  };

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

  const handleGradientBarClick = (
    e: React.MouseEvent<HTMLDivElement>
  ): void => {
    if (!onAddStop) return;

    const target = e.target as HTMLElement;
    if (
      target === gradientBarRef.current ||
      target.classList.contains('gradient-background')
    ) {
      const rect = gradientBarRef.current!.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = (x / rect.width) * 100;
      const color = interpolateColor(percentage);
      onAddStop(percentage, color);
    }
  };

  return (
    <Box
      ref={gradientBarRef}
      onClick={handleGradientBarClick}
      sx={{
        position: 'relative',
        width: '100%',
        height: 48,
        cursor: onAddStop ? 'crosshair' : 'default',
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
          background: gradient,
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
              transform: selectedStop === stop.id ? 'scale(1.25)' : 'scale(1)',
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
  );
};
