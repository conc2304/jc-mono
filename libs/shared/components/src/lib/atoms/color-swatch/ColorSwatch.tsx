import { Tooltip } from '@mui/material';
import { AugmentedButton } from '../button';

interface ColorSwatchProps {
  color: string;
  isActive?: boolean;
  onColorSelect: (color: string) => void;
}

export const ColorSwatch = ({
  color,
  onColorSelect,
  isActive = false,
}: ColorSwatchProps) => {
  return (
    <Tooltip title={color}>
      <AugmentedButton
        component="button"
        className="ColorSwatch--root"
        variant="contained"
        data-color={color}
        onClick={() => onColorSelect(color)}
        color="inherit"
        sx={(theme) => ({
          minWidth: 64,
          width: 64,
          height: 64,
          p: 0,

          '&.ColorSwatch--root': {
            backgroundColor: color,

            '--aug-border-bg': isActive
              ? theme.palette.primary.main
              : theme.palette.secondary.main,
            '--aug-border-all': isActive ? '3px' : undefined,

            '&:hover': {
              '--aug-border-all': '4px',
              '--aug-border-bg': theme.palette.secondary.main,
            },
          },
        })}
      />
    </Tooltip>
  );
};
