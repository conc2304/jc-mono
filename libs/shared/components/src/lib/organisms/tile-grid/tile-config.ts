import { ResponsiveTileConfig } from './types';

export const TILE_CONFIG: ResponsiveTileConfig = {
  mobile: {
    gridSize: 16,
    tilePadding: 4,
    containerPadding: 8,
    sizes: {
      small: { width: 140, height: 140, gridWidth: 9, gridHeight: 9 },
      medium: { width: 140, height: 200, gridWidth: 9, gridHeight: 13 },
      large: { width: 300, height: 160, gridWidth: 19, gridHeight: 10 },
    },
  },
  tablet: {
    gridSize: 18,
    tilePadding: 6,
    containerPadding: 16,
    sizes: {
      small: { width: 145, height: 145, gridWidth: 8, gridHeight: 8 },
      medium: { width: 220, height: 145, gridWidth: 12, gridHeight: 8 },
      large: { width: 300, height: 200, gridWidth: 17, gridHeight: 11 },
    },
  },
  desktop: {
    gridSize: 20,
    tilePadding: 8,
    containerPadding: 24,
    sizes: {
      small: { width: 150, height: 150, gridWidth: 8, gridHeight: 8 },
      medium: { width: 240, height: 150, gridWidth: 12, gridHeight: 8 },
      large: { width: 320, height: 240, gridWidth: 16, gridHeight: 12 },
    },
  },
};
