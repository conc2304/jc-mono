import { Components, Theme, alpha } from '@mui/material/styles';

export default function ButtonIcon(theme: Theme): Components {
  return {
    MuiIconButton: {
      defaultProps: {
        // size: 'medium',
      },
      styleOverrides: {
        root: ({ ownerState: { color, size } }) => {
          const colorTheme =
            !!color && color !== 'inherit' && color !== 'default'
              ? color
              : undefined;

          const sizeMap = {
            small: 20,
            medium: 22,
            large: 26,
          };

          return {
            '&&[data-augmented-ui]': {
              width: 'initial',
              height: 'initial',
            },

            '&& svg ': {
              width: size ? sizeMap[size] : sizeMap.medium,
              height: size ? sizeMap[size] : sizeMap.medium,
              strokeWidth: size === 'small' ? 1 : 2,
              paddingBottom: size === 'small' ? '2px' : undefined,
            },

            '&&': {
              '&:hover': {
                backgroundColor: colorTheme
                  ? alpha(theme.palette[colorTheme].main, 0.1)
                  : undefined,
              },
            },

            '.MuiTouchRipple-root': {
              bottom: 'unset',
              right: 'unset',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '110%',
              height: '110%',
            },

            // Global Styles
            '.MuiTouchRipple-child': {
              width: '110%',
              height: '110%',
              backgroundColor: colorTheme
                ? alpha(theme.palette[colorTheme].main, 0.2)
                : undefined,
            },
          };
        },
      },
    },
  };
}
