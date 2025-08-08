import { Property } from 'csstype';
import { lighten, darken, getContrastRatio } from '@mui/material';

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
    let step = 0.1;

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
    console.error('Error in ensureContrast:', error);
    return {
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
