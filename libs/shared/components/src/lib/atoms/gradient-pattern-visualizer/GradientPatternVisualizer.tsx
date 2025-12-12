import React, { useMemo } from 'react';
import { Box } from '@mui/material';
import {
  ColorStop,
  GradientPatternType,
  InterpolationMode,
} from '../../organisms/color-gradient-editor/types';
import { Property } from 'csstype';

interface GradientPatternVisualizerProps {
  type: GradientPatternType;
  interpolation: InterpolationMode;
  stops?: ColorStop[];
  width?: Property.Width;
  height?: number;
}

export const GradientPatternVisualizer: React.FC<
  GradientPatternVisualizerProps
> = ({ type, interpolation, stops, width = 120, height = 48 }) => {
  // Use provided stops or default to black and white
  const gradientStops = useMemo(() => {
    if (stops && stops.length > 0) {
      return stops;
    }
    // Default black to white gradient
    return [
      { id: 1, color: '#000000', position: 0 },
      { id: 2, color: '#FFFFFF', position: 100 },
    ];
  }, [stops]);

  // Generate CSS gradient based on pattern type and interpolation
  const generateGradientCSS = useMemo(() => {
    const sortedStops = [...gradientStops].sort(
      (a, b) => a.position - b.position
    );

    let gradientString: string;

    if (interpolation === 'step') {
      // For step interpolation, we need to create hard color stops
      const stepStops: string[] = [];
      for (let i = 0; i < sortedStops.length - 1; i++) {
        const current = sortedStops[i];
        const next = sortedStops[i + 1];
        const midpoint = (current.position + next.position) / 2;

        stepStops.push(
          `${current.color} ${current.position}%`,
          `${current.color} ${midpoint}%`,
          `${next.color} ${midpoint}%`
        );
      }
      const last = sortedStops[sortedStops.length - 1];
      stepStops.push(`${last.color} ${last.position}%`, `${last.color} 100%`);

      gradientString = stepStops.join(', ');
    } else {
      // Linear interpolation
      gradientString = sortedStops
        .map((stop) => `${stop.color} ${stop.position}%`)
        .join(', ');
    }

    switch (type) {
      case 'vertical':
        return `linear-gradient(to bottom, ${gradientString})`;
      case 'horizontal':
        return `linear-gradient(to right, ${gradientString})`;
      case 'circular':
        // Circular gradient using conic-gradient
        return `conic-gradient(from 0deg, ${gradientString}, ${sortedStops[0].color})`;
      case 'radial':
        return `radial-gradient(circle, ${gradientString})`;
      default:
        return `linear-gradient(to right, ${gradientString})`;
    }
  }, [type, interpolation, gradientStops]);

  return (
    <Box
      sx={{
        width,
        height,
        background: generateGradientCSS,
        backgroundPosition: type === 'radial' ? 'center center' : undefined,
        overflow: 'hidden',
      }}
    />
  );
};
