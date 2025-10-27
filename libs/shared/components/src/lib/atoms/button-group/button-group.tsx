import React from 'react';
import {
  Stack,
  IconButton,
  Tooltip,
  alpha,
  SxProps,
  Theme,
} from '@mui/material';

export interface ButtonGroupItem {
  key: string;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  isActive?: boolean;
  isResolved?: boolean;
  disabled?: boolean;
}

export interface AugmentedButtonGroupProps {
  items: ButtonGroupItem[];
  upperClip?: string;
  lowerClip?: string;
  spacing?: number;
  padding?: string;
  activeColor?: string;
  direction?: 'row' | 'column';
  sx?: SxProps<Theme>;
  buttonSx?: SxProps<Theme>;
}

const AugmentedButtonGroup: React.FC<AugmentedButtonGroupProps> = ({
  items,
  upperClip = '8px',
  lowerClip = '8px',
  spacing = 0,
  padding = '12px',
  activeColor = 'warning.main',
  direction = 'row',
  sx,
  buttonSx,
}) => {
  // Generate augmented UI data based on array length and direction
  const generateAugData = (index: number, total: number) => {
    if (total === 1) {
      // Single item gets all clips
      return {
        attr: 'bl-clip tl-clip br-clip tr-clip border',
        style: {
          '--aug-border-all': '1px',
          '--aug-tl': upperClip,
          '--aug-bl': lowerClip,
          '--aug-tr': upperClip,
          '--aug-br': lowerClip,
        },
      };
    }

    if (direction === 'row') {
      if (index === 0) {
        // First item - left clips
        return {
          attr: 'bl-clip tl-clip border',
          style: {
            '--aug-border-all': '1px',
            '--aug-tl': upperClip,
            '--aug-bl': lowerClip,
          },
        };
      } else if (index === total - 1) {
        // Last item - right clips
        return {
          attr: 'br-clip tr-clip border',
          style: {
            '--aug-border-all': '1px',
            '--aug-tr': upperClip,
            '--aug-br': lowerClip,
          },
        };
      }
    } else {
      // Column direction
      if (index === 0) {
        // First item - top clips
        return {
          attr: 'tl-clip tr-clip border',
          style: {
            '--aug-border-all': '1px',
            '--aug-tl': upperClip,
            '--aug-tr': upperClip,
          },
        };
      } else if (index === total - 1) {
        // Last item - bottom clips
        return {
          attr: 'bl-clip br-clip border',
          style: {
            '--aug-border-all': '1px',
            '--aug-bl': lowerClip,
            '--aug-br': lowerClip,
          },
        };
      }
    }

    // Middle items - no clips
    return {
      attr: 'none',
      style: {},
    };
  };

  // Generate container clips based on direction
  const getContainerClips = () => {
    return 'bl-clip br-clip tr-clip tl-clip border';
  };

  const getContainerStyle = (): Record<string, string> => {
    return {
      '--aug-tr': upperClip,
      '--aug-tl': upperClip,
      '--aug-br': lowerClip,
      '--aug-bl': lowerClip,
    };
  };

  const containerStyle = getContainerStyle();

  return (
    <Stack
      direction={direction}
      spacing={spacing}
      data-augmented-ui={getContainerClips()}
      sx={(theme) => {
        const baseStyles = {
          ...containerStyle,
          '--aug-border-all': '1px',
          '--aug-border-bg': theme.palette.action.focus,
          '&:hover': {
            '--aug-border-bg': theme.palette.action.hover,
          },
          p: '1px',
          bgcolor: alpha(theme.palette.background.paper, 0.5),
          backdropFilter: 'blur(4px)',
        };

        // Handle sx prop safely
        if (typeof sx === 'function') {
          const sxResult = sx(theme);
          return { ...baseStyles, ...sxResult };
        } else if (sx) {
          return { ...baseStyles, ...sx };
        }

        return baseStyles;
      }}
    >
      {items.map((item, index) => {
        const augData = generateAugData(index, items.length);

        return (
          <Tooltip key={item.key} title={item.label}>
            <IconButton
              data-augmented-ui={augData.attr}
              onClick={item.onClick}
              disabled={item.disabled}
              sx={(theme) => {
                // Helper function to safely get palette color
                const getColorFromPalette = (colorPath: string): string => {
                  const pathParts = colorPath.split('.');
                  if (pathParts.length === 2) {
                    const [palette] = pathParts;
                    const paletteColor =
                      theme.palette[palette as keyof typeof theme.palette];
                    if (
                      paletteColor &&
                      typeof paletteColor === 'object' &&
                      'main' in paletteColor
                    ) {
                      return paletteColor.main;
                    }
                  }
                  return theme.palette.warning.main; // fallback
                };

                const resolvedActiveColor = getColorFromPalette(activeColor);

                const baseStyles = {
                  ...augData.style,
                  '--aug-border-bg': item.isResolved
                    ? alpha(resolvedActiveColor, 0.5)
                    : 'transparent',
                  padding,
                  color: item.isActive
                    ? resolvedActiveColor
                    : theme.palette.text.secondary,
                  transition: 'all 0.3s ease',
                  backgroundColor: item.isActive
                    ? alpha(resolvedActiveColor, 0.075)
                    : 'transparent',
                  '&:hover': {
                    backgroundColor: alpha(resolvedActiveColor, 0.1),
                    borderColor: resolvedActiveColor,
                    transform: 'scale(1.05)',
                  },
                  '&:disabled': {
                    opacity: 0.5,
                    transform: 'none',
                  },
                };

                // Handle buttonSx prop safely
                if (typeof buttonSx === 'function') {
                  const buttonSxResult = buttonSx(theme);
                  return { ...baseStyles, ...buttonSxResult };
                } else if (buttonSx) {
                  return { ...baseStyles, ...buttonSx };
                }

                return baseStyles;
              }}
            >
              {item.icon}
            </IconButton>
          </Tooltip>
        );
      })}
    </Stack>
  );
};

export { AugmentedButtonGroup };
