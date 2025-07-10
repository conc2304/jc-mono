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
          const color = theme.palette[colorTheme || 'primary'];

          return {
            // Global Styles
            '&': {
              background:
                ownerState.variant === 'contained'
                  ? `linear-gradient(45deg, ${alpha(
                      color.main,
                      0.8
                    )} 0%, ${alpha(color.main, 0.5)} 100%)`
                  : alpha(color.main, 0.0),
              border: 'unset !important', // leave it to augmented ui
              position: 'relative',
              overflow: 'visible !important',
              borderRadius: 0,
              transition: theme.transitions.create(
                ['background-color', 'transform'],
                {
                  duration: theme.transitions.duration.standard,
                }
              ),
              ...theme.typography.button,
            },

            '&:hover': {
              background: `linear-gradient(90deg, ${
                colorTheme !== undefined ? lighten(color.main, 0.2) : 'inherit'
              } 0%, ${
                colorTheme !== undefined ? darken(color.main, 0.4) : 'inherit'
              } 100%)`,
              boxShadow: `0 0 20px ${
                colorTheme !== undefined ? color.light : 'inherit'
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
                colorTheme !== undefined ? color.light : 'inherit'
              }, transparent)`,
              transition: 'left 0.5s',
            },

            '&:hover::before': {
              left: '100%',
            },

            '&::after': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              filter: 'drop-shadow(0px 0px 4px #4444dd)',
            },

            '&:hover::after': {
              filter: 'drop-shadow(0px 0px 4px #4444dd)',
            },

            '.MuiTouchRipple-child': {
              backgroundColor: colorTheme ? color.contrastText : undefined,
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
                backgroundColor: colorTheme
                  ? alpha(color.main, 0.07)
                  : undefined,

                // '&:hover': {
                //   backgroundColor: 'red',
                // },

                '.MuiTouchRipple-child': {
                  backgroundColor: colorTheme ? color.main : undefined,
                },
              },
            }),

            // Text Variant Styles
            ...(ownerState.variant === 'text' && {
              '&&': {
                background: colorTheme ? alpha(color.main, 0.0) : undefined,
                color: ownerState.disabled ? actionDisabledText : undefined,

                '&:hover': {
                  backgroundColor: colorTheme
                    ? alpha(color.main, 0.05)
                    : undefined, // 5% opacity for Text Button
                },
                '.MuiTouchRipple-child': {
                  backgroundColor: colorTheme ? color.main : undefined,
                },
              },
            }),

            // Typography by Button Size
            ...(ownerState.size === 'large' && {
              '&.MuiButton-sizeLarge': {
                fontSize: pxToRem(16),
                lineHeight: pxToRem(28),
                letterSpacing: '0.46px',
              },
            }),
            ...(ownerState.size === 'medium' && {
              '&.MuiButton-sizeMedium': {
                fontSize: pxToRem(16),
                lineHeight: pxToRem(25),
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
