import { ResponsiveTileConfig } from './types';

export const TILE_CONFIG: ResponsiveTileConfig = {
  mobile: {
    gridSize: 32,
    tilePadding: 8,
    containerPadding: 16,
    tileGap: 8, // 8px visual gap between tiles
    sizes: {
      small: { gridWidth: 999, gridHeight: 7 }, // Full width × 224px (7×32)
      medium: { gridWidth: 999, gridHeight: 9 }, // Full width × 288px (9×32)
      large: { gridWidth: 999, gridHeight: 12 }, // Full width × 384px (12×32)
    },
  },
  tablet: {
    gridSize: 36,
    tilePadding: 12,
    containerPadding: 32,
    tileGap: 12, // 12px visual gap between tiles
    sizes: {
      small: { gridWidth: 8, gridHeight: 8 }, // 288×288px (8×36)
      medium: { gridWidth: 12, gridHeight: 8 }, // 432×288px (12×36, 8×36)
      large: { gridWidth: 17, gridHeight: 11 }, // 612×396px (17×36, 11×36)
    },
  },
  desktop: {
    gridSize: 40,
    tilePadding: 16,
    containerPadding: 48,
    tileGap: 16, // 16px visual gap between tiles
    sizes: {
      small: { gridWidth: 8, gridHeight: 8 }, // 320×320px (8×40)
      medium: { gridWidth: 12, gridHeight: 8 }, // 480×320px (12×40, 8×40)
      large: { gridWidth: 16, gridHeight: 12 }, // 640×480px (16×40, 12×40)
    },
  },
};
