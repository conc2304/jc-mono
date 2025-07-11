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

          const bgImage =
            'https://media3.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3NmZ6bmU5eXExMDc4YmI5Y2xib2pvaDdqZGR3aDh5MWNrYzRta2puNyZlcD12MV9naWZzX3JlbGF0ZWQmY3Q9Zw/w13kLaPYchsxKrHcQ2/giphy.webp'; // hex tunnel
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
              backgroundSize: '100% 100%',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center center',
              backgroundImage: `url(${bgImage})`,
            },
          };
        },
      },
    },
  };
}
