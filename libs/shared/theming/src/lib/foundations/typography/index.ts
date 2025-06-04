import { fontFamilies, fontImports } from './fonts';
import {
  fontSizes,
  fontWeights,
  letterSpacings,
  lineHeights,
  semanticTypography,
} from './scales';

export * from './fonts';
export * from './scales';

// Consolidated typography export for easy theme consumption
export const typography = {
  fontFamilies,
  fontSizes,
  fontWeights,
  lineHeights,
  letterSpacings,
  semanticTypography,
  fontImports,
} as const;
