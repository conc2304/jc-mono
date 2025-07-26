// Enhanced themes with vibrant, colorful backgrounds
// Breaking away from traditional dark/light backgrounds to create immersive experiences

const vibrantBackgroundThemes = [
  // 1. Neon Synthwave with electric backgrounds
  {
    id: 'neon-synthwave',
    name: 'Neon Synthwave',
    description:
      'Electric synthwave theme with vibrant purple and pink backgrounds',
    category: 'synthwave',
    supportsLight: true,
    supportsDark: true,
    lightPalette: {
      mode: 'light',
      primary: {
        main: '#FF006E', // Hot pink for primary actions
        light: '#FF4081',
        dark: '#C2185B',
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: '#00D4FF', // Electric cyan
        light: '#29B6F6',
        dark: '#0277BD',
        contrastText: '#000000',
      },
      error: {
        main: '#FF1744',
        light: '#FF5983',
        dark: '#C51162',
      },
      warning: {
        main: '#FFD600',
        light: '#FFEB3B',
        dark: '#FFC107',
      },
      info: {
        main: '#00E676',
        light: '#4CAF50',
        dark: '#00C853',
      },
      success: {
        main: '#76FF03',
        light: '#8BC34A',
        dark: '#64DD17',
      },
      background: {
        default: '#FF69B4', // Hot pink background for immersive experience
        paper: '#FF1493', // Deeper pink for elevated surfaces
      },
      text: {
        primary: '#FFFFFF', // White text for contrast on vibrant background
        secondary: '#F5F5F5', // Off-white for secondary text
      },
      divider: '#FFFFFF40', // Semi-transparent white dividers
    },
    darkPalette: {
      mode: 'dark',
      primary: {
        main: '#39FF14', // Neon green
        light: '#7FFF00',
        dark: '#32CD32',
        contrastText: '#000000',
      },
      secondary: {
        main: '#FF006E', // Hot pink
        light: '#FF1493',
        dark: '#C71585',
        contrastText: '#FFFFFF',
      },
      error: {
        main: '#FF073A',
        light: '#FF1744',
        dark: '#D50000',
      },
      warning: {
        main: '#FFAB00',
        light: '#FFC107',
        dark: '#FF8F00',
      },
      info: {
        main: '#00D4FF',
        light: '#29B6F6',
        dark: '#0288D1',
      },
      success: {
        main: '#39FF14',
        light: '#7FFF00',
        dark: '#32CD32',
      },
      background: {
        default: '#4A148C', // Deep vibrant purple background
        paper: '#6A1B9A', // Lighter purple for elevated surfaces
      },
      text: {
        primary: '#39FF14', // Neon green text
        secondary: '#00D4FF', // Cyan for secondary text
      },
      divider: '#39FF1440', // Semi-transparent green dividers
    },
  },

  // 2. Ocean Depth with deep blue/teal backgrounds
  {
    id: 'ocean-depth',
    name: 'Ocean Depth',
    description:
      'Deep ocean theme with vibrant aquatic backgrounds and coral accents',
    category: 'minimal',
    supportsLight: true,
    supportsDark: true,
    lightPalette: {
      mode: 'light',
      primary: {
        main: '#FF5722', // Coral orange for primary
        light: '#FF8A65',
        dark: '#E64A19',
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: '#00BCD4', // Cyan
        light: '#4DD0E1',
        dark: '#0097A7',
        contrastText: '#000000',
      },
      error: {
        main: '#F44336',
        light: '#EF5350',
        dark: '#D32F2F',
      },
      warning: {
        main: '#FFC107',
        light: '#FFD54F',
        dark: '#FFA000',
      },
      info: {
        main: '#2196F3',
        light: '#42A5F5',
        dark: '#1976D2',
      },
      success: {
        main: '#4CAF50',
        light: '#66BB6A',
        dark: '#388E3C',
      },
      background: {
        default: '#00ACC1', // Vibrant teal background
        paper: '#26C6DA', // Lighter cyan for surfaces
      },
      text: {
        primary: '#FFFFFF', // White text on vibrant blue
        secondary: '#E0F2F1', // Very light teal
      },
      divider: '#FFFFFF50', // Semi-transparent white
    },
    darkPalette: {
      mode: 'dark',
      primary: {
        main: '#FF7043', // Warm coral
        light: '#FF8A65',
        dark: '#FF5722',
        contrastText: '#000000',
      },
      secondary: {
        main: '#40E0D0', // Turquoise
        light: '#4DD0E1',
        dark: '#00BCD4',
        contrastText: '#000000',
      },
      error: {
        main: '#FF6B6B',
        light: '#FF8A80',
        dark: '#F44336',
      },
      warning: {
        main: '#FFD93D',
        light: '#FFF59D',
        dark: '#FFC107',
      },
      info: {
        main: '#42A5F5',
        light: '#64B5F6',
        dark: '#2196F3',
      },
      success: {
        main: '#66BB6A',
        light: '#81C784',
        dark: '#4CAF50',
      },
      background: {
        default: '#006064', // Deep teal background
        paper: '#00838F', // Medium teal for elevated surfaces
      },
      text: {
        primary: '#E0F2F1', // Very light teal text
        secondary: '#B2DFDB', // Light teal for secondary
      },
      divider: '#4DB6AC50', // Semi-transparent teal
    },
  },

  // 3. Sunset Gradient with warm vibrant backgrounds
  {
    id: 'sunset-gradient',
    name: 'Sunset Gradient',
    description:
      'Warm sunset theme with vibrant orange and purple gradient backgrounds',
    category: 'retro',
    supportsLight: true,
    supportsDark: true,
    lightPalette: {
      mode: 'light',
      primary: {
        main: '#9C27B0', // Deep purple for contrast
        light: '#BA68C8',
        dark: '#7B1FA2',
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: '#FF6F00', // Deep orange
        light: '#FF8F00',
        dark: '#E65100',
        contrastText: '#FFFFFF',
      },
      error: {
        main: '#D32F2F',
        light: '#F44336',
        dark: '#C62828',
      },
      warning: {
        main: '#F57C00',
        light: '#FF9800',
        dark: '#E65100',
      },
      info: {
        main: '#1976D2',
        light: '#2196F3',
        dark: '#0D47A1',
      },
      success: {
        main: '#388E3C',
        light: '#4CAF50',
        dark: '#2E7D32',
      },
      background: {
        default: '#FF9800', // Vibrant orange background
        paper: '#FFB74D', // Lighter orange for surfaces
      },
      text: {
        primary: '#FFFFFF', // White text on orange
        secondary: '#FFF3E0', // Very light orange
      },
      divider: '#FFFFFF60', // Semi-transparent white
    },
    darkPalette: {
      mode: 'dark',
      primary: {
        main: '#FFD600', // Bright yellow for sunset feel
        light: '#FFEB3B',
        dark: '#FFC107',
        contrastText: '#000000',
      },
      secondary: {
        main: '#E91E63', // Pink accent
        light: '#F06292',
        dark: '#C2185B',
        contrastText: '#FFFFFF',
      },
      error: {
        main: '#FF5252',
        light: '#FF8A80',
        dark: '#F44336',
      },
      warning: {
        main: '#FFAB00',
        light: '#FFC107',
        dark: '#FF8F00',
      },
      info: {
        main: '#448AFF',
        light: '#82B1FF',
        dark: '#2962FF',
      },
      success: {
        main: '#69F0AE',
        light: '#B2FF59',
        dark: '#00E676',
      },
      background: {
        default: '#512DA8', // Deep purple background (sunset sky)
        paper: '#673AB7', // Medium purple for elevated surfaces
      },
      text: {
        primary: '#FFD600', // Golden yellow text
        secondary: '#FFECB3', // Light yellow for secondary
      },
      divider: '#FFD60060', // Semi-transparent yellow
    },
  },
];

// Design considerations for vibrant backgrounds
const vibrantBackgroundGuidelines = {
  designPrinciples: [
    'Ensure sufficient contrast between text and vibrant backgrounds',
    'Use semi-transparent overlays for better readability',
    'Choose complementary colors for primary/secondary elements',
    'Consider user fatigue with highly saturated backgrounds',
    'Provide accessibility options for reduced motion/color',
  ],

  contrastConsiderations: [
    'White text generally works best on vibrant backgrounds',
    'Use color temperature shifts (warm/cool) for hierarchy',
    'Semi-transparent elements help create depth without losing vibrancy',
    'Test with colorblind users for accessibility',
  ],

  useCases: {
    gaming: 'Immersive gaming interfaces and entertainment apps',
    creative: 'Design tools, art applications, creative portfolios',
    marketing: 'Landing pages, promotional content, brand experiences',
    youth: 'Apps targeting younger demographics who prefer bold aesthetics',
    events: 'Conference apps, festival interfaces, celebration themes',
  },

  implementationTips: [
    'Use CSS gradients or patterns for dynamic backgrounds',
    'Consider animation and transitions between color states',
    'Implement blur or overlay effects for content areas',
    'Provide theme intensity controls (subtle to bold)',
    'Test on various display types (OLED, LCD, etc.)',
  ],
};

export { vibrantBackgroundThemes };
