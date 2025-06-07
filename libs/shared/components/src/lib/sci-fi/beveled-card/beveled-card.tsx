import { useState } from 'react';

import { BaseBeveledContainer } from '../base-beveled-container';
import { BevelConfig, GlowConfig } from '../types';

interface BeveledCardProps {
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  image?: string;
  title?: string;
  description?: string;
  hoverable?: boolean;
  bevelConfig?: BevelConfig;
  background?: string;
  stroke?: string;
  strokeWidth?: number;
  glow?: GlowConfig;
  className?: string;
  style?: React.CSSProperties;
}

export const BeveledCard: React.FC<BeveledCardProps> = ({
  children,
  onClick,
  image,
  title,
  description,
  hoverable = true,
  bevelConfig,
  background,
  stroke,
  strokeWidth,
  glow,
  className,
  style,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const defaultBevelConfig = bevelConfig || {
    topLeft: { bevelSize: 12, bevelAngle: 45 },
    topRight: { bevelSize: 12, bevelAngle: 45 },
    bottomRight: { bevelSize: 12, bevelAngle: 45 },
    bottomLeft: { bevelSize: 12, bevelAngle: 45 },
  };

  const cardBackground =
    background ||
    (image
      ? `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.7)), url('${image}') center/cover`
      : 'linear-gradient(135deg, #667eea, #764ba2)');

  return (
    <div
      style={style}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <BaseBeveledContainer
        bevelConfig={defaultBevelConfig}
        background={cardBackground}
        stroke={stroke || '#ffffff'}
        strokeWidth={strokeWidth ?? 2}
        glow={
          glow ||
          (hoverable && isHovered
            ? {
                color: '#667eea',
                intensity: 4,
                spread: 2,
              }
            : undefined)
        }
        onClick={onClick}
        className={className}
        style={{
          transform: hoverable && isHovered ? 'translateY(-2px)' : 'none',
          transition: 'transform 0.2s ease',
        }}
        // contentStyle={{
        //   padding: '1.5rem',
        //   textAlign: 'center'
        // }}
      >
        <div style={{ color: 'white' }}>
          {title && (
            <h3
              style={{
                margin: '0 0 0.5rem 0',
                fontSize: '1.25rem',
                fontWeight: 'bold',
              }}
            >
              {title}
            </h3>
          )}
          {description && (
            <p
              style={{
                margin: '0 0 1rem 0',
                opacity: 0.9,
              }}
            >
              {description}
            </p>
          )}
          {children}
        </div>
      </BaseBeveledContainer>
    </div>
  );
};
