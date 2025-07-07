import { getStrokeWidthPixels } from '../utils';
import { PathAsLines } from './svg-path-as-lines';

interface ContainerBorderProps {
  dimensions: { width: number; height: number };
  shapeTransform: string;
  borderPath: string;
  style: React.CSSProperties;
  className?: string;
}

export const ContainerBorder: React.FC<ContainerBorderProps> = ({
  dimensions,
  shapeTransform,
  borderPath,
  style,
  className = '',
}) => {
  // Extract stroke properties from style, with fallbacks
  const strokeWidth = getStrokeWidthPixels(style.strokeWidth || 1);
  const stroke = style.stroke || 'transparent';
  const strokePadding = Math.ceil(strokeWidth / 2);

  console.log({ ContainerBorderStyle: style, stroke, strokeWidth });

  // Don't render if no stroke
  // if (!stroke || stroke === 'transparent' || strokeWidth <= 0) {
  //   return null;
  // }

  return (
    <svg
      className={`base-beveled-container--svg-border ${className}`}
      width="100%"
      height="100%"
      viewBox={`${-strokePadding} ${-strokePadding} ${
        dimensions.width + strokePadding * 2
      } ${dimensions.height + strokePadding * 2}`}
      style={{
        // Default styles
        display: 'block',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 2,
        pointerEvents: 'none',
        // Theme styles can override positioning if needed
        ...Object.fromEntries(
          Object.entries(style).filter(
            ([key]) =>
              ![
                'stroke',
                'strokeWidth',
                'strokeLinecap',
                'strokeLinejoin',
              ].includes(key)
          )
        ),
      }}
      preserveAspectRatio="none"
    >
      <g transform={shapeTransform}>
        <PathAsLines
          pathString={borderPath}
          style={{
            stroke,
            strokeWidth,
            strokeLinecap: style.strokeLinecap || 'round',
            strokeLinejoin: style.strokeLinejoin || 'round',
            // Include any other stroke-related styles from theme
            ...Object.fromEntries(
              Object.entries(style).filter(
                ([key]) => key.startsWith('stroke') || key === 'transition'
              )
            ),
          }}
        />
      </g>
    </svg>
  );
};
