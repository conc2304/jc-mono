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
          const {
            color,
            variant,
            size,
            disabled,
            animateClick = false,
          } = ownerState;
          const shouldUseColorStyling =
            color !== undefined && color !== 'inherit';
          const colorTheme = shouldUseColorStyling ? color : undefined;
          const paletteColor =
            shouldUseColorStyling && colorTheme
              ? theme.palette[colorTheme]
              : undefined;

          const actionDisabledBackground = alpha(
            theme.palette.mode === 'light'
              ? theme.palette.common.black
              : theme.palette.common.white,
            0.12
          );
          const actionDisabledText = alpha(theme.palette.common.black, 0.38);

          //  commented out ones are other good options
          const bgImgMap = {
            primary:
              'https://media3.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3NmZ6bmU5eXExMDc4YmI5Y2xib2pvaDdqZGR3aDh5MWNrYzRta2puNyZlcD12MV9naWZzX3JlbGF0ZWQmY3Q9Zw/d1E2diIb2cktChLW/giphy.webp',
            // 'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExb3YwZ3R1cDRubnN3aDd6a251Z3RzeWo4OHY0d3Rjamh4Mjd6bTd6YiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/XWwYUsbW57BrGomT98/giphy.gif',
            secondary:
              'https://media1.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3Z3plNTlndWJwNHhsaXlrdDlsNGF0MWczMWtvemJtczBwZ3ZkbG90MSZlcD12MV9naWZzX3JlbGF0ZWQmY3Q9Zw/QAmzAMUA4rOIkG0Rdv/giphy.webp',
            // 'https://media0.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3d3VwaDQxNnNvYnZ4amNoZXMxZDZtcnVxMmdwZ29wYnRmM2s3dW03dyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/8Uu7Bt2vShW3g6uqLY/giphy.webp',
            // 'https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExZGdrcXBjaWl6NTM2bjB3M3Y4cHo4aHAyZTE0eTJ6bnR1d3JodmQ2NSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/u7CzwBdITKleMOhUK9/giphy.webp',
            error:
              'https://media3.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3MDFheWc4ZG8xcngwcmt2MTNsaWxwcnh6bXFhdWo4OWsyNTFuenVlNCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/LmNy9OYM7hni2iHKeO/giphy.webp',
            // 'https://media2.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3bDMzM3ZiaXV2Z3A5Z2JtdHF5dW5zcW01cm1veXU3dGQ5Z2p3ZXBxYiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/zhmIHStBa2ezu/200.webp',
            info: 'https://media0.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3dTdyMWptZHAzaXQ5aDIwMWF6bXpic21rdGp6MWZveG5xNTE0dHg4ZSZlcD12MV9naWZzX3JlbGF0ZWQmY3Q9Zw/7FrOU9tPbgAZtxV5mb/giphy.webp',
            // 'https://media4.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3cWNnNm41dGg5aTRwbG5weGRibHBoeDZqbHlrMjFlbmM1OW9pZTQ0biZlcD12MV9naWZzX3JlbGF0ZWQmY3Q9Zw/11UhXwm8Ipd9C/giphy.webp',
            warning:
              'https://media0.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3a2k0aTRwa2h5cHNqaDNoOHJkejNmeHNndXE1ZDV0NnIxbnhyZGJlaCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/EwyHisjzUbkTj2FPgB/giphy.webp',
            success:
              'https://media4.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3bTBiOGtqc3dhbDU5cXNzOGU3bGFraGY2a3pvc21uZm14czg5NHl2aSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/3oz8xF2tbONaIIy92M/giphy.webp',
            default: 'https://i.giphy.com/2aQS3AHfvvfIkSdbFM.webp',
          };

          const bgImage = bgImgMap[shouldUseColorStyling ? color : 'default'];

          return {
            // Global Styles
            '&': {
              minWidth: '2rem',
              background:
                ownerState.variant === 'contained'
                  ? shouldUseColorStyling && paletteColor
                    ? `linear-gradient(45deg, ${alpha(
                        paletteColor.main,
                        0.8
                      )} 0%, ${alpha(paletteColor.main, 0.5)} 100%)`
                    : 'inherit' // or transparent, or whatever inherit should look like
                  : shouldUseColorStyling && paletteColor
                  ? alpha(paletteColor.main, 0.0)
                  : 'inherit',
              border: 'unset !important', // leave it to augmented ui
              position: 'relative',
              overflow: 'clip !important',
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
                shouldUseColorStyling && paletteColor
                  ? lighten(paletteColor.main, 0.2)
                  : 'inherit'
              } 0%, ${
                shouldUseColorStyling && paletteColor
                  ? darken(paletteColor.main, 0.4)
                  : 'inherit'
              } 100%)`,

              transform: 'translateY(-2px)',
            },

            // if Inlay is present do not use hover effect
            ...(ownerState.inlayBg
              ? {}
              : {
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '100%',
                    height: '100%',
                    background: `linear-gradient(90deg, transparent, ${
                      shouldUseColorStyling && paletteColor
                        ? paletteColor.light
                        : 'inherit'
                    }, transparent)`,
                    transition: 'left 0.5s',
                  },

                  '&:hover::before': {
                    left: '100%',
                  },
                }),

            '&::after': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
            },

            '.MuiTouchRipple-child': {
              backgroundColor:
                shouldUseColorStyling && paletteColor
                  ? paletteColor.contrastText
                  : 'inherit',
              backgroundImage:
                variant !== 'text' && animateClick
                  ? `url("${bgImage}")`
                  : undefined,
              backgroundSize: '100% 100%',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center center',
            },

            // Disabled Styles
            ...(disabled && {
              '&&': {
                background: actionDisabledBackground,
                color: actionDisabledText,
              },
            }),

            // Outlined Variant Styles
            ...(variant === 'outlined' && {
              '&&': {
                backgroundColor:
                  shouldUseColorStyling && paletteColor
                    ? alpha(paletteColor.main, 0.07)
                    : 'inherit',

                '&:hover': {
                  background: `linear-gradient(90deg, ${
                    shouldUseColorStyling && paletteColor
                      ? alpha(lighten(paletteColor.main, 0.2), 0.2)
                      : 'inherit'
                  } 0%, ${
                    shouldUseColorStyling && paletteColor
                      ? alpha(paletteColor.main, 0.4)
                      : 'inherit'
                  } 100%)`,
                },

                '.MuiTouchRipple-child': {
                  backgroundColor:
                    shouldUseColorStyling && paletteColor
                      ? paletteColor.main
                      : 'inherit',
                },
              },
            }),

            // Text Variant Styles
            ...(variant === 'text' && {
              '&&': {
                background:
                  shouldUseColorStyling && paletteColor
                    ? alpha(paletteColor.main, 0.0)
                    : undefined,
                color: disabled ? actionDisabledText : undefined,

                '&:hover': {
                  backgroundColor:
                    shouldUseColorStyling && paletteColor
                      ? alpha(paletteColor.main, 0.05)
                      : 'inherit',
                },
                '.MuiTouchRipple-child': {
                  backgroundColor:
                    shouldUseColorStyling && paletteColor
                      ? paletteColor.main
                      : 'inherit',
                },
              },
            }),

            // Typography by Button Size
            ...(size === 'large' && {
              '&.MuiButton-sizeLarge': {
                fontSize: pxToRem(16),
                lineHeight: pxToRem(28),
                letterSpacing: '0.46px',
              },
            }),
            ...(size === 'medium' && {
              '&.MuiButton-sizeMedium': {
                fontSize: pxToRem(16),
                lineHeight: pxToRem(25),
                letterSpacing: '0.4px',
              },
            }),
            ...(size === 'small' && {
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
