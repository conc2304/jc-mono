import React from 'react';

interface ContainerBackgroundProps {
  innerRect: { x: number; y: number; width: number; height: number };
  fillPath: string;
  style: React.CSSProperties;
}

export const ContainerBackground: React.FC<ContainerBackgroundProps> = ({
  innerRect,
  fillPath,
  style,
}) => (
  <div
    className="base-beveled-container--background"
    style={{
      ...style,
      position: 'absolute',
      top: innerRect.y,
      left: innerRect.x,
      width: `${innerRect.width}px`,
      height: `${innerRect.height}px`,
      clipPath: `path('${fillPath}')`,
      zIndex: 0,
      pointerEvents: 'none',
      transition: 'all 0.1s ease',
    }}
  />
);
