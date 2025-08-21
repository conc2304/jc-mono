import React, { ReactNode } from 'react';
import { Box } from '@mui/material';

// Type definitions
type Direction =
  | 'horizontal'
  | 'vertical'
  | 'diagonal'
  | 'diagonal-alt'
  | 'cross';

interface DiagonalLinesProps {
  lineThickness?: number;
  spacing?: number;
  width?: string | number;
  height?: string | number;
  direction?: Direction;
  color?: string;
  opacity?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const DiagonalLines = ({
  lineThickness = 2,
  spacing = 20,
  width = 400,
  height = 300,
  direction = 'horizontal',
  color = '#333333',
  opacity = 1,
  className,
  style,
}: DiagonalLinesProps) => {
  // Convert CSS units to pixels for SVG calculations
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = React.useState({
    width: 400,
    height: 300,
  });

  React.useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({
          width: rect.width || 400,
          height: rect.height || 300,
        });
      }
    };

    // Initial measurement
    updateDimensions();

    // Set up resize observer for dynamic updates
    const resizeObserver = new ResizeObserver(updateDimensions);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [width, height]);

  const generateLines = (): ReactNode[] => {
    const lines: ReactNode[] = [];
    const { width: actualWidth, height: actualHeight } = dimensions;

    if (direction === 'horizontal') {
      // Generate horizontal lines
      for (let i = 0; i < actualHeight; i += spacing) {
        lines.push(
          <line
            key={`h-${i}`}
            x1={0}
            y1={i}
            x2={actualWidth}
            y2={i}
            stroke={color}
            strokeWidth={lineThickness}
            opacity={opacity}
          />
        );
      }
    } else if (direction === 'vertical') {
      // Generate vertical lines
      for (let i = 0; i < actualWidth; i += spacing) {
        lines.push(
          <line
            key={`v-${i}`}
            x1={i}
            y1={0}
            x2={i}
            y2={actualHeight}
            stroke={color}
            strokeWidth={lineThickness}
            opacity={opacity}
          />
        );
      }
    } else if (direction === 'diagonal') {
      // Generate diagonal lines (top-left to bottom-right)
      const maxDimension = Math.max(actualWidth, actualHeight);
      const diagonal = Math.sqrt(
        actualWidth * actualWidth + actualHeight * actualHeight
      );

      // Calculate extension needed for thick lines
      // For 45-degree diagonals, extend by half thickness divided by sqrt(2)
      const extension = lineThickness / (2 * Math.sqrt(2));

      for (let i = -maxDimension; i < diagonal; i += spacing) {
        lines.push(
          <line
            key={`d-${i}`}
            x1={i - extension}
            y1={-extension}
            x2={i + actualHeight + extension}
            y2={actualHeight + extension}
            stroke={color}
            strokeWidth={lineThickness}
            opacity={opacity}
          />
        );
      }
    } else if (direction === 'diagonal-alt') {
      // Generate diagonal lines (top-right to bottom-left)
      const maxDimension = Math.max(actualWidth, actualHeight);
      const diagonal = Math.sqrt(
        actualWidth * actualWidth + actualHeight * actualHeight
      );

      // Calculate extension needed for thick lines
      const extension = lineThickness / (2 * Math.sqrt(2));

      for (let i = -maxDimension; i < diagonal; i += spacing) {
        lines.push(
          <line
            key={`da-${i}`}
            x1={actualWidth - i + extension}
            y1={-extension}
            x2={actualWidth - i - actualHeight - extension}
            y2={actualHeight + extension}
            stroke={color}
            strokeWidth={lineThickness}
            opacity={opacity}
          />
        );
      }
    } else if (direction === 'cross') {
      // Generate both horizontal and vertical lines
      // Horizontal lines
      for (let i = 0; i < actualHeight; i += spacing) {
        lines.push(
          <line
            key={`h-${i}`}
            x1={0}
            y1={i}
            x2={actualWidth}
            y2={i}
            stroke={color}
            strokeWidth={lineThickness}
            opacity={opacity}
          />
        );
      }
      // Vertical lines
      for (let i = 0; i < actualWidth; i += spacing) {
        lines.push(
          <line
            key={`v-${i}`}
            x1={i}
            y1={0}
            x2={i}
            y2={actualHeight}
            stroke={color}
            strokeWidth={lineThickness}
            opacity={opacity}
          />
        );
      }
    }

    return lines;
  };

  return (
    <Box
      ref={containerRef}
      display="inline-block"
      width={width}
      height={height}
      className={className}
      style={style}
    >
      <svg
        width="100%"
        height="100%"
        style={{
          display: 'block',
          // border: '1px solid #e0e0e0',
        }}
      >
        {generateLines()}
      </svg>
    </Box>
  );
};
