import { useMemo } from 'react';
import { useTheme } from '@mui/material';

import {
  InsertionZone,
  PlacedTile,
  ResponsiveBreakpointConfig,
  TileConfig,
  TilePlacementResult,
} from './types';
import { BaseFileSystemItem } from '../../types';

export const useTilePlacement = (
  tileItems: BaseFileSystemItem[],
  config: ResponsiveBreakpointConfig | null,
  containerWidth: number,
  tileOrder: string[] = []
): TilePlacementResult => {
  const theme = useTheme();

  return useMemo(() => {
    if (!containerWidth || !config || tileItems.length === 0) {
      return { placedTiles: [], gridHeight: 0, insertionZones: [] };
    }

    // Helper function to calculate visual dimensions from grid dimensions
    const calculateTileSize = (
      tileConfig: TileConfig,
      config: ResponsiveBreakpointConfig,
      containerWidth: number
    ): { width: number; height: number } => {
      // For full-width tiles (gridWidth 999), use full container width
      if (tileConfig.gridWidth >= 999) {
        return {
          width: containerWidth - config.containerPadding * 2,
          height: tileConfig.gridHeight * config.gridSize - config.tileGap,
        };
      }

      // Regular tiles - calculate from grid dimensions
      return {
        width: tileConfig.gridWidth * config.gridSize - config.tileGap,
        height: tileConfig.gridHeight * config.gridSize - config.tileGap,
      };
    };

    const gridColumns: number = Math.floor(
      (containerWidth - config.containerPadding * 2) / config.gridSize
    );
    const grid: boolean[][] = [];
    const placedTiles: PlacedTile[] = [];
    const insertionZones: InsertionZone[] = [];

    // Use custom order if provided, otherwise use original tile order
    const orderedTiles: BaseFileSystemItem[] =
      tileOrder.length > 0
        ? (tileOrder
            .map((id) => tileItems.find((tile) => tile.id === id))
            .filter(Boolean) as BaseFileSystemItem[])
        : tileItems;

    // Initialize grid
    const initGridRows: number = Math.ceil(orderedTiles.length * 2);
    for (let row = 0; row < initGridRows; row++) {
      grid[row] = new Array(gridColumns).fill(false);
    }

    const canPlaceTile = (
      startRow: number,
      startCol: number,
      tileConfig: TileConfig
    ): boolean => {
      const endRow: number = startRow + tileConfig.gridHeight;
      const endCol: number = startCol + tileConfig.gridWidth;

      if (endCol > gridColumns || startCol < 0 || startRow < 0) return false;

      while (endRow > grid.length) {
        grid.push(new Array(gridColumns).fill(false));
      }

      for (let row = startRow; row < endRow; row++) {
        for (let col = startCol; col < endCol; col++) {
          if (grid[row][col]) return false;
        }
      }
      return true;
    };

    const placeTile = (
      startRow: number,
      startCol: number,
      tileConfig: TileConfig
    ): void => {
      const endRow: number = startRow + tileConfig.gridHeight;
      const endCol: number = startCol + tileConfig.gridWidth;

      for (let row = startRow; row < endRow; row++) {
        for (let col = startCol; col < endCol; col++) {
          grid[row][col] = true;
        }
      }
    };
    const findPlacement = (
      tileConfig: TileConfig
    ): { row: number; col: number } => {
      // For full-width tiles (gridWidth 999), always place at column 0
      if (tileConfig.gridWidth >= 999) {
        for (let row = 0; row < grid.length + 10; row++) {
          if (canPlaceTile(row, 0, { ...tileConfig, gridWidth: gridColumns })) {
            return { row, col: 0 };
          }
        }

        // If no placement found, add to the end
        const row: number = grid.length;
        while (grid.length < row + tileConfig.gridHeight) {
          grid.push(new Array(gridColumns).fill(false));
        }
        return { row, col: 0 };
      }

      // Regular placement logic for non-full-width tiles
      for (let row = 0; row < grid.length + 10; row++) {
        for (let col = 0; col <= gridColumns - tileConfig.gridWidth; col++) {
          if (canPlaceTile(row, col, tileConfig)) {
            return { row, col };
          }
        }
      }

      const row: number = grid.length;
      while (grid.length < row + tileConfig.gridHeight) {
        grid.push(new Array(gridColumns).fill(false));
      }
      return { row, col: 0 };
    };

    // Place tiles in order
    orderedTiles.forEach((tile: BaseFileSystemItem, index: number) => {
      const tileConfig: TileConfig =
        config.sizes[tile.tileRenderer?.config.size || 'small'];
      const placement = findPlacement(tileConfig);

      const placementConfig =
        tileConfig.gridWidth >= 999
          ? { ...tileConfig, gridWidth: gridColumns }
          : tileConfig;

      placeTile(placement.row, placement.col, placementConfig);

      // Calculate actual width - if width is 0, use full container width (mobile full-width)
      const { width: actualWidth, height: actualHeight } = calculateTileSize(
        tileConfig,
        config,
        containerWidth
      );

      // For full-width tiles, always place at column 0
      const actualX =
        tileConfig.gridWidth >= 999
          ? config.containerPadding
          : placement.col * config.gridSize + config.containerPadding;

      const tileData: PlacedTile = {
        id: tile.id,
        fileData: tile,
        size: tile.tileRenderer?.config.size || 'small',
        color: tile.tileRenderer?.config.color || theme.palette.primary.main,
        x: actualX,
        y: placement.row * config.gridSize + config.containerPadding,
        width: actualWidth,
        height: actualHeight,
        orderIndex: index,
        gridRow: placement.row,
        gridCol: placement.col,
      };

      placedTiles.push(tileData);

      // Create insertion zones around each tile (4 sides)
      const zoneOffset = 8;
      const zoneThickness = 4;

      // For full-width tiles, only show top and bottom insertion zones
      if (tileConfig.gridWidth >= 999) {
        // Top insertion zone
        insertionZones.push({
          id: `top-${tile.id}`,
          x: tileData.x,
          y: tileData.y - zoneOffset,
          width: tileData.width,
          height: zoneThickness,
          insertIndex: index,
          type: 'horizontal',
          side: 'top',
        });

        // Bottom insertion zone
        insertionZones.push({
          id: `bottom-${tile.id}`,
          x: tileData.x,
          y: tileData.y + tileData.height + zoneOffset - zoneThickness,
          width: tileData.width,
          height: zoneThickness,
          insertIndex: index + 1,
          type: 'horizontal',
          side: 'bottom',
        });
      } else {
        // Regular tiles - all 4 sides
        // Top insertion zone
        insertionZones.push({
          id: `top-${tile.id}`,
          x: tileData.x,
          y: tileData.y - zoneOffset,
          width: tileData.width,
          height: zoneThickness,
          insertIndex: index,
          type: 'horizontal',
          side: 'top',
        });

        // Bottom insertion zone
        insertionZones.push({
          id: `bottom-${tile.id}`,
          x: tileData.x,
          y: tileData.y + tileData.height + zoneOffset - zoneThickness,
          width: tileData.width,
          height: zoneThickness,
          insertIndex: index + 1,
          type: 'horizontal',
          side: 'bottom',
        });

        // Left insertion zone
        insertionZones.push({
          id: `left-${tile.id}`,
          x: tileData.x - zoneOffset,
          y: tileData.y,
          width: zoneThickness,
          height: tileData.height,
          insertIndex: index,
          type: 'vertical',
          side: 'left',
        });

        // Right insertion zone
        insertionZones.push({
          id: `right-${tile.id}`,
          x: tileData.x + tileData.width + zoneOffset - zoneThickness,
          y: tileData.y,
          width: zoneThickness,
          height: tileData.height,
          insertIndex: index + 1,
          type: 'vertical',
          side: 'right',
        });
      }
    });

    // Add insertion zone at the very beginning (before first tile)
    if (placedTiles.length > 0) {
      const firstTile: PlacedTile = placedTiles[0];
      insertionZones.unshift({
        id: 'before-all',
        x: firstTile.x,
        y: firstTile.y - 20,
        width: firstTile.width,
        height: 4,
        insertIndex: 0,
        type: 'horizontal',
        side: 'before-all',
      });
    }

    // Add insertion zone at the very end (after last tile)
    if (placedTiles.length > 0) {
      const lastTile: PlacedTile = placedTiles[placedTiles.length - 1];
      insertionZones.push({
        id: 'after-all',
        x: lastTile.x,
        y: lastTile.y + lastTile.height + 20,
        width: lastTile.width,
        height: 4,
        insertIndex: placedTiles.length,
        type: 'horizontal',
        side: 'after-all',
      });
    }

    const gridHeight: number =
      grid.length * config.gridSize + config.containerPadding * 2;

    return { placedTiles, gridHeight, insertionZones };
  }, [tileItems, config, containerWidth, tileOrder, theme]);
};
