import { useMemo } from 'react';
import {
  InsertionZone,
  PlacedTile,
  ResponsiveBreakpointConfig,
  Tile,
  TileConfig,
  TilePlacementResult,
} from './types';

export const useTilePlacement = (
  tiles: Tile[],
  config: ResponsiveBreakpointConfig | null,
  containerWidth: number,
  tileOrder: number[] = []
): TilePlacementResult => {
  return useMemo(() => {
    if (!containerWidth || !config || tiles.length === 0) {
      return { placedTiles: [], gridHeight: 0, insertionZones: [] };
    }

    const gridColumns: number = Math.floor(
      (containerWidth - config.containerPadding * 2) / config.gridSize
    );
    const grid: boolean[][] = [];
    const placedTiles: PlacedTile[] = [];
    const insertionZones: InsertionZone[] = [];

    // Use custom order if provided, otherwise use original tile order
    const orderedTiles: Tile[] =
      tileOrder.length > 0
        ? (tileOrder
            .map((id) => tiles.find((tile) => tile.id === id))
            .filter(Boolean) as Tile[])
        : tiles;

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
    orderedTiles.forEach((tile: Tile, index: number) => {
      const tileConfig: TileConfig = config.sizes[tile.size];
      const placement = findPlacement(tileConfig);

      placeTile(placement.row, placement.col, tileConfig);

      const tileData: PlacedTile = {
        ...tile,
        x: placement.col * config.gridSize + config.containerPadding,
        y: placement.row * config.gridSize + config.containerPadding,
        width: tileConfig.width,
        height: tileConfig.height,
        orderIndex: index,
        gridRow: placement.row,
        gridCol: placement.col,
      };

      placedTiles.push(tileData);

      // Create insertion zones around each tile (4 sides)
      const zoneOffset: number = 8;
      const zoneThickness: number = 4;

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
  }, [tiles, config, containerWidth, tileOrder]);
};
