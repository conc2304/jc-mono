import { BaseBeveledContainer } from '../base-beveled-container';
import { BevelConfig, GlowConfig } from '../types';

interface BeveledPanelProps {
  children: React.ReactNode;
  title?: string;
  variant?: 'modal' | 'card' | 'sidebar';
  bevelConfig?: BevelConfig;
  background?: string;
  stroke?: string;
  strokeWidth?: number;
  glow?: GlowConfig;
  className?: string;
  style?: React.CSSProperties;
  contentStyle?: React.CSSProperties;
  onClose?: () => void;
}

export const BeveledPanel: React.FC<BeveledPanelProps> = ({
  children,
  title,
  variant = 'card',
  bevelConfig,
  background,
  stroke,
  strokeWidth,
  glow,
  className,
  style,
  contentStyle,
  onClose,
}) => {
  const variants = {
    modal: {
      background: 'rgba(0, 0, 0, 0.95)',
      stroke: '#00ffff',
      strokeWidth: 2,
      glow: { color: '#00ffff', intensity: 4, spread: 2 },
    },
    card: {
      background: 'rgba(255, 255, 255, 0.95)',
      stroke: '#e5e7eb',
      strokeWidth: 1,
      glow: undefined,
    },
    sidebar: {
      background: 'linear-gradient(180deg, #1f2937, #111827)',
      stroke: '#374151',
      strokeWidth: 1,
      glow: undefined,
    },
    // custom: {}
  };

  const variantStyles = variants[variant];

  const defaultBevelConfig = bevelConfig || {
    topLeft: { bevelSize: 16, bevelAngle: 45 },
    topRight: { bevelSize: 16, bevelAngle: 45 },
    bottomRight: { bevelSize: 16, bevelAngle: 45 },
    bottomLeft: { bevelSize: 32, bevelAngle: 45 },
  };

  return (
    <BaseBeveledContainer
      bevelConfig={defaultBevelConfig}
      backgroundStyles={background || variantStyles.background}
      stroke={stroke || variantStyles.stroke}
      strokeWidth={strokeWidth ?? variantStyles.strokeWidth}
      glow={glow || variantStyles?.glow || undefined}
      className={className}
      style={style}
      contentStyle={{
        padding: '1.5rem',
        overflow: 'auto',
        ...contentStyle,
      }}
    >
      <div style={{ width: '100%', height: '100%' }}>
        {title && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem',
              paddingBottom: '0.5rem',
              borderBottom: '1px solid rgba(255,255,255,0.2)',
            }}
          >
            <h2
              style={{
                margin: 0,
                color: variant === 'card' ? '#1f2937' : 'white',
                fontSize: '1.25rem',
                fontWeight: 'bold',
              }}
            >
              {title}
            </h2>
            {onClose && (
              <button
                onClick={onClose}
                style={{
                  background: 'none',
                  border: 'none',
                  color: variant === 'card' ? '#6b7280' : 'white',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  padding: '0.25rem',
                }}
                aria-label="Close"
              >
                ×
              </button>
            )}
          </div>
        )}
        <div
          style={{
            color: variant === 'card' ? '#374151' : 'white',
          }}
        >
          {children}
        </div>
      </div>
    </BaseBeveledContainer>
  );
};
