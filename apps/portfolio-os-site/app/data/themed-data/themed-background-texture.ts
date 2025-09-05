import { getImageUrl } from '@jc/utils';
import { CSSProperties } from '@mui/material';

// Themed character sets for text scrambling effects
const path = (fileName: string) => {
  const relativePath = `textures/themed/${fileName}`;
  const imgUrl = getImageUrl(relativePath, 'full');
  return imgUrl;
};
//
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
        opacity: 0.5,
        mixBlendMode: 'darken',
        filter: 'invert(1)',
      },
    },
    dark: {
      url: path('developer-terminal-bg.jpg'),
      style: {
        opacity: 0.35,
        mixBlendMode: 'screen',
      },
    },
  },

  'euclid-ci': {
    light: {
      url: path('euclid-bg-light.jpg'),
      style: {
        opacity: 0.25,
        mixBlendMode: 'multiply',
        backgroundSize: '100% 100%',
      },
    },
    dark: {
      url: path('euclid-bg.jpg'),
      style: {
        opacity: 0.08,
        mixBlendMode: 'screen',
        backgroundSize: 'contain',
      },
    },
  },

  marathon: {
    light: {
      url: path('marathon-bg.jpg'),
      style: {
        opacity: 0.28,
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
      url: path('neon-cyberpunk-bg-bw.jpg'),
      style: {
        opacity: 0.2,
        mixBlendMode: 'darken',
        filter: 'contrast(0.75) brightness(0.75)',
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
      url: path('synthwave-sunset-bg-dithered.jpg'), // todo
      style: {
        opacity: 0.25,
        mixBlendMode: 'hard-light',
      },
    },
    dark: {
      url: path('synthwave-sunset-bg-dithered.jpg'),
      style: {
        opacity: 0.15,
        mixBlendMode: 'lighten',
      },
    },
  },

  'blade-runner': {
    light: {
      url: path('blade-runner-bg-2.jpg'),
      style: {
        opacity: 0.16,
        filter: 'grayscale(1) invert(1)',
        mixBlendMode: 'hard-light',
      },
    },
    dark: {
      url: path('blade-runner-bg.jpg'),
      style: {
        opacity: 0.17,
        mixBlendMode: 'screen',
      },
    },
  },

  'sunset-gradient': {
    light: {
      url: path('sunset-gradient-bg.jpg'),
      style: {
        opacity: 0.5,
        mixBlendMode: 'hard-light',
      },
    },
    dark: {
      url: path('sunset-gradient-bg.jpg'),
      style: {
        opacity: 0.25,
        mixBlendMode: 'color-dodge',
      },
    },
  },

  'neon-synthwave': {
    light: {
      url: path('neon-synthwave-bg.jpg'),
      style: {
        opacity: 0.25,
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
        mixBlendMode: 'darken',
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
      url: path('tres-sendas-bg.jpg'),
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
      url: path('arasaka-bg-tech.jpg'),
      style: {
        opacity: 0.3,
        mixBlendMode: 'color-burn',
      },
    },
    dark: {
      url: path('arasaka-bg-tech.jpg'),
      style: {
        opacity: 0.27,
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
