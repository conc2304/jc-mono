import { ReactNode } from 'react';

export type InsertionSide =
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'before-all'
  | 'after-all';
export type InsertionType = 'horizontal' | 'vertical';

export interface InsertionZone {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  insertIndex: number;
  type: InsertionType;
  side: InsertionSide;
}

export interface TileConfig {
  width: number;
  height: number;
  gridWidth: number;
  gridHeight: number;
}

export type TileSize = 'small' | 'medium' | 'large';
export type Breakpoint = 'mobile' | 'tablet' | 'desktop';

export interface ResponsiveBreakpointConfig {
  gridSize: number;
  tilePadding: number;
  containerPadding: number;
  sizes: Record<TileSize, TileConfig>;
}

export interface ResponsiveTileConfig {
  mobile: ResponsiveBreakpointConfig;
  tablet: ResponsiveBreakpointConfig;
  desktop: ResponsiveBreakpointConfig;
}

export interface Tile {
  id: number;
  size: TileSize;
  color: string;
  title: string;
  content: ReactNode;
}

export interface PlacedTile extends Tile {
  x: number;
  y: number;
  width: number;
  height: number;
  orderIndex: number;
  gridRow: number;
  gridCol: number;
}

export interface DragState {
  isDragging: boolean;
  draggedTile: Tile | null;
  hoveredInsertionIndex: number | null;
  hoveredZoneSide: InsertionSide | null;
}

export interface WindowSize {
  width: number;
  height: number;
}

export interface TilePlacementResult {
  placedTiles: PlacedTile[];
  gridHeight: number;
  insertionZones: InsertionZone[];
}
