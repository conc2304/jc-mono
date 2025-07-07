import React from 'react';

interface ContainerBackgroundProps {
  innerRect: { x: number; y: number; width: number; height: number };
  fillPath: string;
  style: React.CSSProperties;
  className?: string;
}

export const ContainerBackground: React.FC<ContainerBackgroundProps> = ({
  innerRect,
  fillPath,
  style,
  className = '',
}) => (
  <div
    className={`base-beveled-container--background ${className}`}
    style={{
      // Default styles
      position: 'absolute',
      top: innerRect.y,
      left: innerRect.x,
      width: `${innerRect.width}px`,
      height: `${innerRect.height}px`,
      clipPath: `path('${fillPath}')`,
      zIndex: 0,
      pointerEvents: 'none',
      transition: 'all 0.1s ease',
      // Theme styles override defaults
      ...style,
    }}
  />
);
