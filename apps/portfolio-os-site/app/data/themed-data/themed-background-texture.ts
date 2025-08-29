import { CSSProperties } from '@mui/material';

// Themed character sets for text scrambling effects
const path = (fileName: string) => `/textures/themed/${fileName}`;

interface ThemeTextureConfig {
  light: {
    url: string;
    style: CSSProperties;
  };
  dark: {
    url: string;
    style: CSSProperties;
  };
}

export const ThemedBgTexture: Record<string, ThemeTextureConfig> = {
  'developer-terminal': {
    light: {
      url: path('developer-terminal-bg.jpg'),
      style: {
        opacity: 0.18,
        mixBlendMode: 'difference',
      },
    },
    dark: {
      url: path('developer-terminal-bg.jpg'),
      style: {
        opacity: 0.15,
        mixBlendMode: 'screen',
      },
    },
  },

  'euclid-ci': {
    light: {
      url: path('euclid-bg-2.jpg'),
      style: {
        opacity: 0.25,
        mixBlendMode: 'multiply',
      },
    },
    dark: {
      url: path('euclid-bg.jpg'),
      style: {
        opacity: 0.08,
        mixBlendMode: 'screen',
      },
    },
  },

  marathon: {
    light: {
      url: path('marathon-bg.jpg'),
      style: {
        opacity: 0.15,
        filter: 'grayscale(1)',
        mixBlendMode: 'difference',
      },
    },
    dark: {
      url: path('marathon-bg-2.jpg'),
      style: {
        opacity: 0.05,
        mixBlendMode: 'screen',
      },
    },
  },

  'neon-cyberpunk': {
    light: {
      url: path('neon-cyberpunk-bg.jpg'),
      style: {
        opacity: 0.3,
        mixBlendMode: 'luminosity',
        filter: 'grayscale(1) invert(1)',
      },
    },
    dark: {
      url: path('neon-cyberpunk-bg.jpg'),
      style: {
        opacity: 0.25,
        mixBlendMode: 'screen',
      },
    },
  },

  synthwave: {
    light: {
      url: path('synthwave-sunset-bg-1.jpg'), // todo
      style: {
        opacity: 0.5,
        mixBlendMode: 'overlay',
      },
    },
    dark: {
      url: path('synthwave-sunset-bg-3.jpg'),
      style: {
        opacity: 0.1,
        mixBlendMode: 'hard-light',
        backgroundSize: 'cover',
      },
    },
  },

  'blade-runner': {
    light: {
      url: path('blade-runner-bg-2.jpg'),
      style: {
        opacity: 0.12,
        filter: 'grayscale(1) invert(1)',
        mixBlendMode: 'hard-light',
      },
    },
    dark: {
      url: path('blade-runner-bg.jpg'),
      style: {
        opacity: 0.1,
        mixBlendMode: 'screen',
      },
    },
  },

  'sunset-gradient': {
    light: {
      url: path('sunset-gradient-bg.jpg'),
      style: {
        opacity: 0.06,
        mixBlendMode: 'soft-light',
      },
    },
    dark: {
      url: path('sunset-gradient-bg.jpg'),
      style: {
        opacity: 0.25,
        mixBlendMode: 'color-burn',
      },
    },
  },

  'neon-synthwave': {
    light: {
      url: path('neon-synthwave-bg.jpg'),
      style: {
        opacity: 0.45,
        mixBlendMode: 'overlay',
      },
    },
    dark: {
      url: path('neon-synthwave-bg.jpg'),
      style: {
        opacity: 0.12,
        mixBlendMode: 'screen',
        backgroundPosition: 'center center',
      },
    },
  },

  'ocean-depth': {
    light: {
      url: path('ocean-depth-bg.jpg'),
      style: {
        opacity: 0.26,
        mixBlendMode: 'color-dodge',
      },
    },
    dark: {
      url: path('ocean-depth-bg.jpg'),
      style: {
        opacity: 0.28,
        mixBlendMode: 'screen',
      },
    },
  },

  'bubblegum-dream': {
    light: {
      url: path('bubblegum-dream-bg.jpg'),
      style: {
        opacity: 0.48,
        mixBlendMode: 'soft-light',
      },
    },
    dark: {
      url: path('bubblegum-dream-bg.jpg'),
      style: {
        opacity: 0.26,
        mixBlendMode: 'color-burn',
      },
    },
  },

  'tres-sendas': {
    light: {
      url: path('tres-sendas-bg-2.jpg'),
      style: {
        opacity: 0.25,
        mixBlendMode: 'soft-light',
      },
    },
    dark: {
      url: path('tres-sendas-bg.jpg'),
      style: {
        opacity: 0.05,
        mixBlendMode: 'luminosity',
      },
    },
  },

  arasaka: {
    light: {
      url: path('arasaka-bg.jpg'),
      style: {
        opacity: 0.38,
        mixBlendMode: 'color-dodge',
      },
    },
    dark: {
      url: path('arasaka-bg.jpg'),
      style: {
        opacity: 0.38,
        mixBlendMode: 'luminosity',
      },
    },
  },

  monochrome: {
    light: {
      url: path('monochrome-bg-light.jpg'),
      style: {
        opacity: 0.26,
        mixBlendMode: 'multiply',
      },
    },
    dark: {
      url: path('monochrome-bg-light.jpg'),
      style: {
        opacity: 0.29,
        filter: 'invert(1)',
        mixBlendMode: 'luminosity',
      },
    },
  },

  'liberty-city': {
    light: {
      url: path('liberty-city-bg.jpg'),
      style: {
        opacity: 0.12,
        mixBlendMode: 'hard-light',
      },
    },
    dark: {
      url: path('liberty-city-bg.jpg'),
      style: {
        opacity: 0.08,
        mixBlendMode: 'screen',
      },
    },
  },
};

export const DefaultBgTexture: ThemeTextureConfig = {
  light: {
    url: path('fallback-bg.jpg'),
    style: {
      opacity: 0.14,
      filter: 'invert(1)',
      mixBlendMode: 'luminosity',
    },
  },
  dark: {
    url: path('fallback-bg.jpg'),
    style: {
      opacity: 0.09,
      mixBlendMode: 'screen',
    },
  },
};

export const getThemedBgTexture = (
  themeId: string,
  mode: 'light' | 'dark'
): { url: string; style: CSSProperties } => {
  const themeConfig = ThemedBgTexture[themeId] || DefaultBgTexture;
  return themeConfig[mode];
};

// Helper function to get random marathon variant (if you want to keep the randomization)
export const getMarathonTexture = (
  mode: 'light' | 'dark'
): { url: string; style: CSSProperties } => {
  const useVariant = Math.random() > 0.5;
  const baseConfig = ThemedBgTexture.marathon[mode];

  if (mode === 'dark') {
    return {
      url: path(useVariant ? 'marathon-bg-2.jpg' : 'marathon-bg.jpg'),
      style: {
        opacity: useVariant ? 0.05 : 0.2,
        mixBlendMode: 'difference',
      },
    };
  }

  return baseConfig; // For light mode, use standard config
};
