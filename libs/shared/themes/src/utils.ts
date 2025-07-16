import { ThemeOption } from './basic-theme';

// Safe localStorage access for Next.js
export const getStoredTheme = (
  key: string,
  themes: ThemeOption[],
  defaultId: string
): string => {
  if (typeof window === 'undefined') return defaultId;

  try {
    const stored = localStorage.getItem(key);
    if (stored && themes.find((t) => t.id === stored)) {
      return stored;
    }
  } catch (error) {
    console.warn('Failed to read theme from localStorage:', error);
  }

  return defaultId;
};

// Color Helpers
// Color utility functions for muting colors without opacity
// Better than simple lighten/darken for inactive windows

/**
 * Converts hex color to HSL
 */
function hexToHsl(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h: number, s: number;
  const l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
      default:
        h = 0;
    }
    h /= 6;
  }

  return [h * 360, s * 100, l * 100];
}

/**
 * Converts HSL to hex color
 */
function hslToHex(h: number, s: number, l: number): string {
  h /= 360;
  s /= 100;
  l /= 100;

  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  let r: number, g: number, b: number;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  const toHex = (c: number) => {
    const hex = Math.round(c * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Mutes a color by reducing saturation and adjusting lightness
 * This creates a more natural "inactive" appearance than simple opacity
 */
export function muteColor(
  color: string,
  options: {
    saturationReduction?: number; // 0-100, how much to reduce saturation
    lightnessAdjustment?: number; // -50 to 50, negative darkens, positive lightens
    grayBlend?: number; // 0-100, how much to blend with gray
  } = {}
): string {
  const {
    saturationReduction = 40,
    lightnessAdjustment = 10,
    grayBlend = 20,
  } = options;

  const [h, s, l] = hexToHsl(color);

  // Reduce saturation to make it less vibrant
  const newSaturation = Math.max(0, s - saturationReduction);

  // Adjust lightness (usually lighten for inactive windows)
  const newLightness = Math.min(100, Math.max(0, l + lightnessAdjustment));

  // Blend with gray for more muted appearance
  const grayL = 50; // Mid-gray lightness
  const blendedLightness =
    newLightness + (grayL - newLightness) * (grayBlend / 100);
  const blendedSaturation = newSaturation * (1 - grayBlend / 100);

  return hslToHex(h, blendedSaturation, blendedLightness);
}

/**
 * Alternative: Desaturate and shift towards neutral
 * Good for making colors appear "inactive" or "background"
 */
export function desaturateColor(
  color: string,
  amount = 0.5 // 0-1, how much to desaturate
): string {
  const [h, s, l] = hexToHsl(color);
  const newSaturation = s * (1 - amount);
  return hslToHex(h, newSaturation, l);
}

/**
 * Mix a color with a neutral color (like gray or beige)
 * Creates a more sophisticated muted effect
 */
export function mixWithNeutral(
  color: string,
  neutralColor = '#8b8b8b', // Default neutral gray
  mixRatio = 0.3 // 0-1, how much neutral to mix in
): string {
  const [h1, s1, l1] = hexToHsl(color);
  const [h2, s2, l2] = hexToHsl(neutralColor);

  // Mix the colors
  const mixedH = h1; // Keep original hue
  const mixedS = s1 * (1 - mixRatio) + s2 * mixRatio;
  const mixedL = l1 * (1 - mixRatio) + l2 * mixRatio;

  return hslToHex(mixedH, mixedS, mixedL);
}

/**
 * Create an inactive window color scheme
 * Returns both muted background and content colors
 */
export function createInactiveColorScheme(
  activeColor: string,
  options: {
    backgroundMuting?: number; // 0-1
    contentMuting?: number; // 0-1
    useWarmGray?: boolean; // Use warm gray instead of cool gray
  } = {}
): {
  background: string;
  content: string;
  border: string;
} {
  const {
    backgroundMuting = 0.6,
    contentMuting = 0.4,
    useWarmGray = true,
  } = options;

  const neutralGray = useWarmGray ? '#9ca3af' : '#6b7280'; // Warm vs cool gray

  return {
    background: muteColor(activeColor, {
      saturationReduction: backgroundMuting * 50,
      lightnessAdjustment: backgroundMuting * 15,
      grayBlend: backgroundMuting * 30,
    }),
    content: muteColor(activeColor, {
      saturationReduction: contentMuting * 30,
      lightnessAdjustment: contentMuting * 10,
      grayBlend: contentMuting * 20,
    }),
    border: mixWithNeutral(activeColor, neutralGray, backgroundMuting),
  };
}

// Usage examples and demonstrations
export const colorMutingExamples = {
  // Original active colors
  active: {
    primary: '#3b82f6', // Blue
    secondary: '#8b5cf6', // Purple
    success: '#10b981', // Green
    warning: '#f59e0b', // Yellow
    error: '#ef4444', // Red
  },

  // Muted versions for inactive windows
  getMutedColors() {
    const muted: Record<string, any> = {};

    Object.entries(this.active).forEach(([key, color]) => {
      muted[key] = {
        // Different muting strategies
        light: muteColor(color, {
          saturationReduction: 30,
          lightnessAdjustment: 20,
        }),
        medium: muteColor(color, {
          saturationReduction: 40,
          lightnessAdjustment: 10,
        }),
        heavy: muteColor(color, {
          saturationReduction: 60,
          lightnessAdjustment: 5,
        }),

        // Alternative approaches
        desaturated: desaturateColor(color, 0.5),
        neutralMixed: mixWithNeutral(color, '#9ca3af', 0.3),

        // Complete scheme
        scheme: createInactiveColorScheme(color),
      };
    });

    return muted;
  },
};

// React hook for window state colors
export function useWindowColors(isActive: boolean, baseColor: string) {
  if (isActive) {
    return {
      background: baseColor,
      content: '#ffffff',
      border: baseColor,
    };
  }

  return createInactiveColorScheme(baseColor, {
    backgroundMuting: 0.5,
    contentMuting: 0.3,
    useWarmGray: true,
  });
}

export const remToPixels = (rem: string) => {
  return (
    parseFloat(rem) *
    parseFloat(getComputedStyle(document.documentElement).fontSize)
  );
};

// Custom Cursor Logic
// TODO get Cursor Files
export const CURSOR_PATHS = {
  default: '/assets/cursors/default.cur',
  pointer: '/assets/cursors/pointer.cur',
  text: '/assets/cursors/text.cur',
  grab: '/assets/cursors/grab.cur',
  grabbing: '/assets/cursors/grabbing.cur',
  resizeHorizontal: '/assets/cursors/resize-horizontal.cur',
  resizeVertical: '/assets/cursors/resize-vertical.cur',
  notAllowed: '/assets/cursors/not-allowed.cur',
  crosshair: '/assets/cursors/crosshair.cur',
  move: '/assets/cursors/move.cur',
  help: '/assets/cursors/help.cur',
  wait: '/assets/cursors/wait.cur',
} as const;

export type CursorType = keyof typeof CURSOR_PATHS;

export const getCursorUrl = (cursorType: CursorType, fallback = 'auto') => {
  return `url('${CURSOR_PATHS[cursorType]}'), ${fallback}`;
};
