import React, { useMemo } from 'react';
import { Box } from '@mui/material';
import { ColorStop, GradientPatternType, InterpolationMode } from '../types';
import { Property } from 'csstype';

interface GradientPatternVisualizerProps {
  type: GradientPatternType;
  interpolation: InterpolationMode;
  stops?: ColorStop[];
  width?: Property.Width;
  height?: number;
  animate?: boolean;
  speed?: number; // 0-100
}

export const GradientPatternVisualizer: React.FC<
  GradientPatternVisualizerProps
> = ({
  type,
  interpolation,
  stops,
  width = 120,
  height = 48,
  animate = false,
  speed = 0,
}) => {
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

  // Calculate animation duration based on speed (0 = no animation, 100 = fastest)
  const animationDuration = useMemo(() => {
    if (!animate || speed === 0) return 'none';
    // Speed 100 = 2s, Speed 1 = 20s, logarithmic scale
    const duration = 20 - (speed / 100) * 18;
    return `${duration}s`;
  }, [animate, speed]);

  // Animation keyframes based on pattern type
  const getAnimationName = () => {
    if (!animate || speed === 0) return undefined;
    switch (type) {
      case 'circular':
        return 'rotate-gradient';
      case 'vertical':
        return 'slide-vertical';
      case 'horizontal':
        return 'slide-horizontal';
      case 'radial':
        return 'pulse-radial';
      default:
        return undefined;
    }
  };

  return (
    <>
      <style>
        {`
          @keyframes rotate-gradient {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }

          @keyframes slide-vertical {
            0% {
              background-position: 0% 0%;
            }
            100% {
              background-position: 0% 100%;
            }
          }

          @keyframes slide-horizontal {
            0% {
              background-position: 0% 0%;
            }
            100% {
              background-position: 100% 0%;
            }
          }

          @keyframes pulse-radial {
            0%, 100% {
              background-size: 100% 100%;
            }
            50% {
              background-size: 150% 150%;
            }
          }
        `}
      </style>
      <Box
        sx={{
          width,
          height,
          background: generateGradientCSS,
          // backgroundSize: type === 'circular' ? 'cover' : '200% 200%',
          backgroundPosition: type === 'radial' ? 'center center' : undefined,
          animation:
            animate && speed > 0
              ? `${getAnimationName()} ${animationDuration} linear infinite`
              : 'none',
          overflow: 'hidden',
        }}
      />
    </>
  );
};
