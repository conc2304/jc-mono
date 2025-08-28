import { Property } from 'csstype';
// Themed character sets for text scrambling effects
const path = (fileName: string) => `/gifs/themed/${fileName}`;
export const ThemedGifUrl: Record<
  string,
  { url: string; backgroundPositionY: Property.BackgroundPositionY }
> = {
  'developer-terminal': {
    url: (() => {
      const gifMap = {
        // Couldn't decide on one
        default: path('developer-terminal--default-programer.gif'),
        it: path('developer-terminal--it-crowd-fire.gif'),
        jc: path('developer-terminal--jim-carey-typing.gif'),
      };

      const probMap = {
        default: 0.7,
        jc: 0.15,
        it: 0.15,
      };

      const r = Math.random();

      if (r < probMap.default) {
        return gifMap.default;
      } else if (r < probMap.default + probMap.jc) {
        return gifMap.jc;
      } else {
        return gifMap.it;
      }
    })(),
    backgroundPositionY: 'center',
  },
  'euclid-ci': {
    url: path('euclid-ci-ui-target-tracking.gif'),
    backgroundPositionY: 'center',
  },

  marathon: {
    url: path('marathon-nyan-cat.gif'),
    backgroundPositionY: 'center',
  },

  'neon-cyberpunk': {
    url: path('neon-cyberpunk-rainy-japanese-neon-signs.gif'),
    backgroundPositionY: 'center',
  },

  synthwave: {
    url: path('synthwave-ambient-tropical-sunset.gif'),
    backgroundPositionY: 'center',
  },

  'blade-runner': {
    url: path('blade-runner--raining-neon-lights.gif'),
    backgroundPositionY: 'bottom',
  },

  'sunset-gradient': {
    url: path('sunset-gradient-soft-waves-at-sunset.gif'),
    backgroundPositionY: 'center',
  },

  'neon-synthwave': {
    url: path('neon-synthwave-electric-grid-gaming.gif'),
    backgroundPositionY: 'center',
  },

  'ocean-depth': {
    url: path('ocean-depth-underwater-bubbles.gif'),
    backgroundPositionY: 'center',
  },

  'bubblegum-dream': {
    url: path('bubblegum-dream-cherry-blossom-sakura.gif'),
    backgroundPositionY: 'center',
  },

  'tres-sendas': {
    url: path('tres-sendas-pine-tree-loop.gif'),
    backgroundPositionY: 'initial',
  },

  arasaka: {
    url: path('arasaka-big-brother-dystopia.gif'),
    backgroundPositionY: 'center',
  },

  monochrome: {
    url: path('monochrome-8-bit-factory.gif'),
    backgroundPositionY: 'center',
  },

  'liberty-city': {
    url: 'https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExN2pteTZpanJuazBrenh0MmMzc2Fpcjhxa255d3QzZ3AyajZ6ZHk1dSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/V51e4FFL6r2DYB2DHZ/giphy.gif',
    backgroundPositionY: 'center',
  },
};

// Default fallback character set
export const DefaultThemedGif: {
  url: string;
  backgroundPositionY: Property.BackgroundPositionY;
} = {
  url: '/gifs/ambient-vintage-clouds.gif',
  backgroundPositionY: 'center',
};

// Helper function to get themed characters
export const getThemedGifUrl = (
  themeId: string
): { url: string; backgroundPositionY: Property.BackgroundPositionY } => {
  return ThemedGifUrl[themeId] || DefaultThemedGif;
};
