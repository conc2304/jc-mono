import { Tooltip } from '@mui/material';
import { AugmentedButton } from '../button';

type SwatchSize = 'small' | 'medium' | 'large';

interface ColorSwatchProps {
  color?: string;
  gradient?: string;
  isActive?: boolean;
  onColorSelect?: (color: string) => void;
  onClick?: () => void;
  size?: SwatchSize;
  tooltip?: string;
}

const SIZE_MAP: Record<SwatchSize, { width: number; height: number }> = {
  small: { width: 48, height: 48 },
  medium: { width: 64, height: 64 },
  large: { width: 140, height: 64 },
};

export const ColorSwatch = ({
  color,
  gradient,
  onColorSelect,
  onClick,
  isActive = false,
  size = 'medium',
  tooltip,
}: ColorSwatchProps) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (onColorSelect && color) {
      onColorSelect(color);
    }
  };

  const dimensions = SIZE_MAP[size];
  const background = gradient || color;
  const displayTooltip = tooltip || color || 'Gradient';

  return (
    <Tooltip title={displayTooltip}>
      <AugmentedButton
        component="button"
        className="ColorSwatch--root"
        variant="contained"
        onClick={handleClick}
        color="secondary"
        inlayBg={background}
        inlayOffset={'4px'}
        sx={(theme) => ({
          width: dimensions.width,
          height: dimensions.height,
          p: 0,
          transition: 'all 0.2s ease-in-out',

          // Override augmented-ui button styles
          '&.ColorSwatch--root': {
            background: 'unset !important',

            '--aug-border-bg': isActive
              ? theme.palette.primary.main
              : theme.palette.secondary.main,
            '--aug-border-all': isActive ? '3px' : undefined,

            '&:hover': {
              '--aug-border-all': '4px',
              '--aug-border-bg': !isActive
                ? undefined
                : theme.palette.secondary.main,
              width: `calc(${dimensions.width} + 14px)`, // (4px + 3px) * 2 to keep the center of swatch the same size ish
              height: `calc(${dimensions.height} + 14px)`,
            },
          },
        })}
      />
    </Tooltip>
  );
};
