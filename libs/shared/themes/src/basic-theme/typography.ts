import { TypographyVariantsOptions } from '@mui/material/styles';

interface FontOptions {
  primary: string;
  secondary?: string;
  display?: string;
}

const TypographyTheme = (
  fonts: string | FontOptions
): TypographyVariantsOptions => {
  // Handle backward compatibility - if string is passed, use it as primary
  const fontConfig = typeof fonts === 'string' ? { primary: fonts } : fonts;

  const {
    primary,
    secondary = primary, // Fallback to primary if not provided
    display = primary, // Fallback to primary if not provided
  } = fontConfig;

  return {
    htmlFontSize: 16,
    fontFamily: primary,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 600,
    display: {
      fontFamily: display,
      fontWeight: 700,
      fontSize: '3.5rem',
      lineHeight: 1.14,
      letterSpacing: '-0.02em',
    },
    h1: {
      fontFamily: display,
      fontWeight: 600,
      fontSize: '2.375rem',
      lineHeight: 1.21,
    },
    h2: {
      fontFamily: display,
      fontWeight: 600,
      fontSize: '1.875rem',
      lineHeight: 1.27,
    },
    h3: {
      fontFamily: secondary,
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.33,
    },
    h4: {
      fontFamily: secondary,
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.39,
    },
    h5: {
      fontFamily: secondary,
      fontWeight: 600,
      fontSize: '1rem',
      lineHeight: 1.46,
    },
    h6: {
      fontFamily: primary,
      fontWeight: 400,
      fontSize: '0.875rem',
      lineHeight: 1.52,
    },
    body1: {
      fontFamily: primary,
      fontWeight: 400,
      fontSize: '1rem',
      lineHeight: 1.5,
      letterSpacing: '0.00938em',
    },
    body2: {
      fontFamily: primary,
      fontWeight: 400,
      fontSize: '0.875rem',
      lineHeight: 1.43,
      letterSpacing: '0.01071em',
    },
    subtitle1: {
      fontFamily: secondary,
      fontWeight: 400,
      fontSize: '1rem',
      lineHeight: 1.75,
      letterSpacing: '0.00938em',
    },
    subtitle2: {
      fontFamily: secondary,
      fontWeight: 500,
      fontSize: '0.875rem',
      lineHeight: 1.57,
      letterSpacing: '0.00714em',
    },
    caption: {
      fontFamily: primary,
      fontWeight: 400,
      fontSize: '0.75rem',
      lineHeight: 1.66,
      letterSpacing: '0.03333em',
    },
    overline: {
      fontFamily: secondary,
      fontWeight: 400,
      fontSize: '0.75rem',
      lineHeight: 2.66,
      letterSpacing: '0.08333em',
      textTransform: 'uppercase',
    },
    button: {
      fontFamily: secondary,
      fontWeight: 500,
      fontSize: '0.875rem',
      lineHeight: 1.75,
      letterSpacing: '0.02857em',
      textTransform: 'uppercase',
    },
  };
};

export default TypographyTheme;
