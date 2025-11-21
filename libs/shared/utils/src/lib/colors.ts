import { lighten, darken, getContrastRatio } from '@mui/material';
import { Property } from 'csstype';

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface HSV {
  h: number;
  s: number;
  v: number;
}

export interface ColorInput extends RGB, HSV {
  hex: string;
}

export const ensureContrast = (
  foregroundColor: Property.Color,
  backgroundColor: Property.Color,
  threshold = 4.5
) => {
  try {
    // Calculate initial contrast ratio
    const initialContrast = getContrastRatio(foregroundColor, backgroundColor);

    // If contrast is sufficient, return original color
    if (initialContrast >= threshold) {
      return {
        color: foregroundColor,
        contrastRatio: initialContrast,
        wasAdjusted: false,
      };
    }

    // Determine if we should lighten or darken based on background
    const bgLuminance = getLuminance(backgroundColor);
    const shouldLighten = bgLuminance < 0.5;

    let adjustedColor = foregroundColor;
    let bestContrast = initialContrast;
    const step = 0.1;

    // Try to adjust the color to meet contrast requirements
    for (let i = 1; i <= 10; i++) {
      const testColor = shouldLighten
        ? lighten(foregroundColor, step * i)
        : darken(foregroundColor, step * i);

      const testContrast = getContrastRatio(testColor, backgroundColor);

      if (testContrast >= threshold) {
        return {
          color: testColor,
          contrastRatio: testContrast,
          wasAdjusted: true,
        };
      }

      if (testContrast > bestContrast) {
        adjustedColor = testColor;
        bestContrast = testContrast;
      }
    }

    // If we still can't meet threshold, try the opposite direction
    const oppositeColor = shouldLighten
      ? darken(foregroundColor, 0.5)
      : lighten(foregroundColor, 0.5);

    const oppositeContrast = getContrastRatio(oppositeColor, backgroundColor);

    if (oppositeContrast > bestContrast) {
      adjustedColor = oppositeColor;
      bestContrast = oppositeContrast;
    }

    return {
      color: adjustedColor,
      contrastRatio: bestContrast,
      wasAdjusted: true,
    };
  } catch (error) {
    return {
      error,
      color: foregroundColor,
      contrastRatio: 1,
      wasAdjusted: false,
    };
  }
};

// Helper function to calculate luminance (simplified version)
export const getLuminance = (color: Property.Color) => {
  try {
    // Convert hex to RGB
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;

    // Calculate relative luminance
    const rsRGB = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
    const gsRGB = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
    const bsRGB = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);

    return 0.2126 * rsRGB + 0.7152 * gsRGB + 0.0722 * bsRGB;
  } catch {
    return 0.5; // fallback
  }
};

// Convert hex to RGB
export const hexToRgb = (
  hex: string,
  normalize = true,
  roundToNearestDecimal = 2
): RGB => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

  if (!result) {
    return { r: 0, g: 0, b: 0 };
  }

  const roundValue = (value: number): number => {
    if (roundToNearestDecimal !== undefined && roundToNearestDecimal >= 0) {
      const multiplier = Math.pow(10, roundToNearestDecimal);
      return Math.round(value * multiplier) / multiplier;
    }
    return value;
  };

  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);

  return {
    r: roundValue(!normalize ? r : r / 255),
    g: roundValue(!normalize ? g : g / 255),
    b: roundValue(!normalize ? b : b / 255),
  };
};

// Convert RGB to hex
export const rgbToHex = (r: number, g: number, b: number): string => {
  return (
    '#' +
    [r, g, b]
      .map((x) => {
        const hex = Math.max(0, Math.min(255, Math.round(x))).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      })
      .join('')
  );
};

// Convert RGB to HSV
export const rgbToHsv = (r: number, g: number, b: number): HSV => {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let h = 0;
  if (delta !== 0) {
    if (max === r) h = ((g - b) / delta) % 6;
    else if (max === g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;
    h = Math.round(h * 60);
    if (h < 0) h += 360;
  }

  const s = max === 0 ? 0 : Math.round((delta / max) * 100);
  const v = Math.round(max * 100);

  return { h, s, v };
};

// Convert HSV to RGB
export const hsvToRgb = (h: number, s: number, v: number): RGB => {
  s /= 100;
  v /= 100;
  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;

  let r = 0,
    g = 0,
    b = 0;
  if (h >= 0 && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (h >= 60 && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (h >= 180 && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (h >= 240 && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (h >= 300 && h < 360) {
    r = c;
    g = 0;
    b = x;
  }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
};
