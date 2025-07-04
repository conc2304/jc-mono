import React from 'react';

import { PathAsLines } from './svg-path-as-lines';
import { StateStyles } from '../../types';

interface ContainerBorderProps {
  dimensions: { width: number; height: number };
  strokeWidth: number;
  shapeTransform: string;
  borderPath: string;
  stroke?: string;
  borderStyles: React.CSSProperties;
  svgProps: React.SVGProps<SVGSVGElement>;
}

export const ContainerBorder: React.FC<ContainerBorderProps> = ({
  dimensions,
  strokeWidth,
  shapeTransform,
  borderPath,
  stroke,
  borderStyles,
  svgProps,
}) => {
  const strokePadding = Math.ceil(strokeWidth / 2);

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
        ...borderStyles,
      }}
      preserveAspectRatio="none"
      {...svgProps}
    >
      <g transform={shapeTransform}>
        {stroke && strokeWidth > 0 && (
          <PathAsLines
            pathString={borderPath}
            stroke={borderStyles.stroke || stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </g>
    </svg>
  );
};
