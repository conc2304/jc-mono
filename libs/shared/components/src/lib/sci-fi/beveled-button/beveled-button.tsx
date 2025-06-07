import { BaseBeveledContainer } from '../base-beveled-container';
import { BevelConfig, GlowConfig } from '../types';

interface BeveledButtonProps {
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  size?: 'small' | 'medium' | 'large';
  bevelConfig?: BevelConfig;
  background?: string;
  stroke?: string;
  strokeWidth?: number;
  glow?: GlowConfig;
  className?: string;
  style?: React.CSSProperties;
}

export const BeveledButton: React.FC<BeveledButtonProps> = ({
  children,
  onClick,
  disabled = false,
  variant = 'primary',
  size = 'medium',
  bevelConfig,
  background,
  stroke,
  strokeWidth,
  glow,
  className,
  style,
}) => {
  // Predefined variants
  const variants = {
    primary: {
      background: 'linear-gradient(45deg, #667eea, #764ba2)',
      stroke: '#ffffff',
      strokeWidth: 2,
      glow: { color: '#667eea', intensity: 3, spread: 1 },
    },
    secondary: {
      background: 'linear-gradient(45deg, #gray-500, #gray-600)',
      stroke: '#gray-300',
      strokeWidth: 2,
      glow: undefined,
    },
    success: {
      background: 'linear-gradient(45deg, #10b981, #059669)',
      stroke: '#ffffff',
      strokeWidth: 2,
      glow: { color: '#10b981', intensity: 3, spread: 1 },
    },
    danger: {
      background: 'linear-gradient(45deg, #ef4444, #dc2626)',
      stroke: '#ffffff',
      strokeWidth: 2,
      glow: { color: '#ef4444', intensity: 3, spread: 1 },
    },
  };

  // Size configurations
  const sizes = {
    small: {
      minHeight: '32px',
      padding: '0.25rem 0.75rem',
      fontSize: '0.875rem',
    },
    medium: {
      minHeight: '40px',
      padding: '0.5rem 1rem',
      fontSize: '1rem',
    },
    large: {
      minHeight: '48px',
      padding: '0.75rem 1.5rem',
      fontSize: '1.125rem',
    },
  };

  const variantStyles = variants[variant];
  const sizeStyles = sizes[size];

  const defaultBevelConfig = bevelConfig || {
    topLeft: { bevelSize: 8, bevelAngle: 45 },
    topRight: { bevelSize: 8, bevelAngle: 45 },
    bottomRight: { bevelSize: 8, bevelAngle: 45 },
    bottomLeft: { bevelSize: 8, bevelAngle: 45 },
  };

  return (
    <div style={{ minHeight: sizeStyles.minHeight, ...style }}>
      <BaseBeveledContainer
        bevelConfig={defaultBevelConfig}
        backgroundStyles={background || variantStyles.background}
        stroke={stroke || variantStyles.stroke}
        strokeWidth={strokeWidth ?? variantStyles.strokeWidth}
        glow={glow || variantStyles.glow}
        onClick={onClick}
        disabled={disabled}
        role="button"
        className={className}
        // contentStyle={{
        //   padding: sizeStyles.padding,
        //   fontSize: sizeStyles.fontSize,
        //   fontWeight: 'bold',
        //   color: 'white',
        //   textAlign: 'center',
        //   userSelect: 'none'
        // }}
      >
        {children}
      </BaseBeveledContainer>
    </div>
  );
};
