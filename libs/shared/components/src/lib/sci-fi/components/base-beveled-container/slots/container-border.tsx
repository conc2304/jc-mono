import React from 'react';

import { PathAsLines } from './svg-path-as-lines';
import { getStrokeWidthPixels } from '../bevel-augmentation';

interface ContainerBorderProps {
  dimensions: { width: number; height: number };
  shapeTransform: string;
  borderPath: string;
  style: React.CSSProperties;
}

export const ContainerBorder: React.FC<ContainerBorderProps> = ({
  dimensions,
  shapeTransform,
  borderPath,
  style,
}) => {
  const strokeWidth = getStrokeWidthPixels(style.strokeWidth);
  const stroke = style?.stroke;
  const strokePadding = Math.ceil(strokeWidth / 2);

  console.log({ style, stroke, strokeWidth });

  return (
    <svg
      className="base-beveled-container--svg-border"
      width="100%"
      height="100%"
      viewBox={`${-strokePadding} ${-strokePadding} ${
        dimensions.width + strokePadding * 2
      } ${dimensions.height + strokePadding * 2}`}
      style={{
        display: 'block',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 2,
        pointerEvents: 'none',
      }}
      preserveAspectRatio="none"
    >
      <g transform={shapeTransform}>
        {stroke && strokeWidth > 0 && (
          <PathAsLines
            pathString={borderPath}
            style={{
              ...style,
              stroke,
              strokeWidth,
            }}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </g>
    </svg>
  );
};
