import { convertPathToLines } from '../utils';

interface PathAsLinesProps {
  pathString: string;
  stroke?: string;
  strokeWidth?: number;
  strokeLinecap?: 'butt' | 'round' | 'square';
  strokeLinejoin?: 'miter' | 'round' | 'bevel';
  className?: string;
  style?: React.CSSProperties;
}

export const PathAsLines: React.FC<PathAsLinesProps> = ({
  pathString,
  stroke = 'currentColor',
  strokeWidth = 1,
  strokeLinecap = 'round',
  strokeLinejoin = 'round',
  className,
  style,
  ...otherProps
}) => {
  const lines = convertPathToLines(pathString);

  return (
    <g className={className} style={style}>
      {lines.map((line) => (
        <line
          key={line.key}
          x1={line.x1}
          y1={line.y1}
          x2={line.x2}
          y2={line.y2}
          strokeLinecap={strokeLinecap}
          strokeLinejoin={strokeLinejoin}
          {...otherProps}
        />
      ))}
    </g>
  );
};
