import { globalCss } from './config';
import { typography } from '../foundations';

export const createGlobalStyles = (
  themeName: 'cyberpunk' | 'corporate' = 'cyberpunk'
) => {
  const fontImports = typography.fontImports[themeName] || [];

  return globalCss({
    // Import fonts
    '@import': fontImports,

    // Reset and base styles
    '*': {
      boxSizing: 'border-box',
      margin: 0,
      padding: 0,
    },

    'html, body': {
      fontFamily: themeName === 'cyberpunk' ? '$cyberpunk' : '$corporate',
      fontSize: '$base',
      lineHeight: '$normal',
      backgroundColor: '$background',
      color: '$textPrimary',
      minHeight: '100vh',
    },

    // Cyberpunk-specific global styles
    ...(themeName === 'cyberpunk' && {
      body: {
        background: `
          linear-gradient(135deg, $background 0%, $backgroundSecondary 50%, $surface 100%),
          radial-gradient(circle at 20% 80%, $primary 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, $secondary 0%, transparent 50%)
        `,
        backgroundAttachment: 'fixed',
      },

      // Custom scrollbar for cyberpunk
      '::-webkit-scrollbar': {
        width: '8px',
      },
      '::-webkit-scrollbar-track': {
        background: '$surface',
      },
      '::-webkit-scrollbar-thumb': {
        background: '$primary',
        borderRadius: '4px',
        '&:hover': {
          background: '$primaryHover',
        },
      },

      '::selection': {
        backgroundColor: '$secondary',
        color: '$background',
      },
    }),

    // Corporate-specific global styles
    ...(themeName === 'corporate' && {
      body: {
        backgroundColor: '$background',
        color: '$textPrimary',
      },

      '::-webkit-scrollbar': {
        width: '12px',
      },
      '::-webkit-scrollbar-track': {
        background: '$backgroundSecondary',
      },
      '::-webkit-scrollbar-thumb': {
        background: '$border',
        borderRadius: '6px',
        '&:hover': {
          background: '$borderSecondary',
        },
      },
    }),

    // Typography elements
    'h1, h2, h3, h4, h5, h6': {
      fontWeight: '$semibold',
      lineHeight: '$tight',
    },

    h1: { fontSize: '$5xl' },
    h2: { fontSize: '$4xl' },
    h3: { fontSize: '$3xl' },
    h4: { fontSize: '$2xl' },
    h5: { fontSize: '$xl' },
    h6: { fontSize: '$lg' },

    p: {
      lineHeight: '$normal',
      marginBottom: '$4',
    },

    a: {
      color: '$primary',
      textDecoration: 'none',
      '&:hover': {
        color: '$primaryHover',
        textDecoration: 'underline',
      },
    },

    code: {
      fontFamily: '$mono',
      fontSize: '$sm',
      backgroundColor: '$surface',
      padding: '$1 $2',
      borderRadius: '$sm',
    },

    pre: {
      fontFamily: '$mono',
      fontSize: '$sm',
      backgroundColor: '$surface',
      padding: '$4',
      borderRadius: '$md',
      overflow: 'auto',
    },
  });
};
