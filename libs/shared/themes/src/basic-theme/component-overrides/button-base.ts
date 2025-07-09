import {
  Components,
  Theme,
  alpha,
  darken,
  lighten,
} from '@mui/material/styles';

export default function ButtonBase(theme: Theme): Components {
  const { pxToRem } = theme.typography;

  return {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: ({ ownerState }) => {
          const colorTheme =
            ownerState.color && ownerState.color !== 'inherit'
              ? ownerState.color
              : undefined;
          const actionDisabledBackground = alpha(
            theme.palette.common.black,
            0.12
          );
          const actionDisabledText = alpha(theme.palette.common.black, 0.38);

          const size = ownerState.size ? ownerState.size : undefined;

          const augmentationSizeMap = {
            small: '8px',
            medium: '10px',
            large: '16px',
            default: '10px',
          };

          const color = colorTheme
            ? theme.palette[colorTheme].contrastText
            : 'rgba(10,10,10, 0.3)';

          const stop1 = alpha(color, 0.3);
          const stop2 = alpha(darken(color, 0.3), 0.5);

          const auSize = augmentationSizeMap[size ?? 'default'];

          return {
            // Global Styles
            '&': {
              // background: 'linear-gradient(45deg, #001122 0%, #003344 100%)',
              position: 'relative',
              overflow: 'hidden',
              borderRadius: 0,
              transition: theme.transitions.create(
                ['background-color', 'transform'],
                {
                  duration: theme.transitions.duration.standard,
                }
              ),
              ...theme.typography.button,
            },

            // ...(ownerState.size && {
            //   '&[data-augmented-ui]': {
            //     '--aug-border-all': '1px',
            //     '--aug-border-bg': '#00ffff',
            //     '--aug-tl': auSize,
            //     '--aug-tr': auSize,
            //     '--aug-bl': auSize,
            //     '--aug-br': auSize,
            //   },
            // }),

            '&[data-augmented-ui]': {
              '--aug-border-all': '1px',
              '--aug-border-bg': '#00ffff',
              '--aug-tl': auSize,
              '--aug-tr': auSize,
              '--aug-bl': auSize,
              '--aug-br': auSize,
            },

            '&:hover': {
              background: `linear-gradient(90deg, ${
                colorTheme !== undefined
                  ? lighten(theme.palette[colorTheme].main, 0.2)
                  : 'inherit'
              } 0%, ${
                colorTheme !== undefined
                  ? darken(theme.palette[colorTheme].main, 0.4)
                  : 'inherit'
              } 100%)`,
              boxShadow: `0 0 20px ${
                colorTheme !== undefined
                  ? theme.palette[colorTheme].light
                  : 'inherit'
              }`,
              transform: 'translateY(-2px)',
            },

            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: '-100%',
              width: '100%',
              height: '100%',
              background: `linear-gradient(90deg, transparent, ${
                colorTheme !== undefined
                  ? theme.palette[colorTheme].light
                  : 'inherit'
              }, transparent)`,
              transition: 'left 0.5s',
            },

            '&:hover::before': {
              left: '100%',
            },

            '.MuiTouchRipple-child': {
              // backgroundColor: colorTheme
              //   ? theme.palette[colorTheme].contrastText
              //   : undefined,
              // // https://cdn.vectorstock.com/i/1000v/82/46/circuit-board-technology-background-vector-13208246.jpg
              backgroundImage: `url("https://cdn.vectorstock.com/i/1000v/82/46/circuit-board-technology-background-vector-13208246.jpg")`,
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
            },

            // Disabled Styles
            ...(ownerState.disabled && {
              '&&': {
                background: actionDisabledBackground,
                color: actionDisabledText,
              },
            }),

            // Outlined Variant Styles
            ...(ownerState.variant === 'outlined' && {
              '&&': {
                border: ownerState.disabled
                  ? undefined
                  : `1px solid ${
                      colorTheme ? theme.palette[colorTheme].main : 'inherit'
                    }`,
                backgroundColor: colorTheme
                  ? alpha(theme.palette[colorTheme].main, 0.0)
                  : undefined,
                '&:hover': {
                  backgroundColor: colorTheme
                    ? alpha(theme.palette[colorTheme].main, 0.04)
                    : undefined, // 4% opacity for Contained button
                },

                '.MuiTouchRipple-child': {
                  backgroundColor: colorTheme
                    ? theme.palette[colorTheme].main
                    : undefined,
                },
              },
            }),

            // Text Variant Styles
            ...(ownerState.variant === 'text' && {
              '&&': {
                background: colorTheme
                  ? alpha(theme.palette[colorTheme].main, 0.0)
                  : undefined,
                color: ownerState.disabled ? actionDisabledText : undefined,
                '&:hover': {
                  backgroundColor: colorTheme
                    ? alpha(theme.palette[colorTheme].main, 0.05)
                    : undefined, // 5% opacity for Text Button
                },
                '.MuiTouchRipple-child': {
                  backgroundColor: colorTheme
                    ? theme.palette[colorTheme].main
                    : undefined,
                },
              },
            }),

            // Typography by Button Size
            ...(ownerState.size === 'large' && {
              '&.MuiButton-sizeLarge': {
                fontSize: pxToRem(15),
                lineHeight: pxToRem(26),
                letterSpacing: '0.46px',
              },
            }),
            ...(ownerState.size === 'medium' && {
              '&.MuiButton-sizeMedium': {
                fontSize: pxToRem(14),
                lineHeight: pxToRem(24),
                letterSpacing: '0.4px',
              },
            }),
            ...(ownerState.size === 'small' && {
              '&.MuiButton-sizeSmall': {
                fontSize: pxToRem(13),
                lineHeight: pxToRem(23),
                letterSpacing: '0.46px',
              },
            }),
          };
        },
      },
    },
  };
}
