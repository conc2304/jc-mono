import React, { useState, useEffect, useMemo, useCallback } from 'react';

// Type definitions
type TileSize = 'small' | 'medium' | 'large';
type Breakpoint = 'mobile' | 'tablet' | 'desktop';
type InsertionSide =
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'before-all'
  | 'after-all';
type InsertionType = 'horizontal' | 'vertical';

interface TileConfig {
  gridWidth: number;
  gridHeight: number;
}

interface ResponsiveBreakpointConfig {
  gridSize: number;
  tilePadding: number;
  containerPadding: number;
  tileGap: number; // Visual gap between tiles
  sizes: Record<TileSize, TileConfig>;
}

interface ResponsiveConfig {
  mobile: ResponsiveBreakpointConfig;
  tablet: ResponsiveBreakpointConfig;
  desktop: ResponsiveBreakpointConfig;
}

interface Tile {
  id: number;
  size: TileSize;
  color: string;
  title: string;
  content: string;
}

interface PlacedTile extends Tile {
  x: number;
  y: number;
  width: number;
  height: number;
  orderIndex: number;
  gridRow: number;
  gridCol: number;
}

interface InsertionZone {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  insertIndex: number;
  type: InsertionType;
  side: InsertionSide;
}

interface DragState {
  isDragging: boolean;
  draggedTile: Tile | null;
  hoveredInsertionIndex: number | null;
  hoveredZoneSide: InsertionSide | null;
}

interface WindowSize {
  width: number;
  height: number;
}

interface TilePlacementResult {
  placedTiles: PlacedTile[];
  gridHeight: number;
  insertionZones: InsertionZone[];
}

// Configuration
const RESPONSIVE_CONFIG: ResponsiveConfig = {
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

// Sample tile data
const SAMPLE_TILES: Tile[] = [
  { id: 1, size: 'large', color: '#e74c3c', title: 'Weather', content: '72°F' },
  {
    id: 2,
    size: 'medium',
    color: '#3498db',
    title: 'Calendar',
    content: '5 events',
  },
  { id: 3, size: 'small', color: '#2ecc71', title: 'Messages', content: '12' },
  { id: 4, size: 'small', color: '#f39c12', title: 'Photos', content: '128' },
  {
    id: 5,
    size: 'medium',
    color: '#9b59b6',
    title: 'Music',
    content: 'Now Playing',
  },
  { id: 6, size: 'small', color: '#1abc9c', title: 'Settings', content: '' },
  {
    id: 7,
    size: 'large',
    color: '#34495e',
    title: 'News',
    content: 'Breaking',
  },
  { id: 8, size: 'small', color: '#e67e22', title: 'Store', content: '' },
  { id: 9, size: 'medium', color: '#95a5a6', title: 'Mail', content: '3 new' },
  { id: 10, size: 'small', color: '#c0392b', title: 'Games', content: '' },
];

// Custom hooks
const useResponsiveConfig = () => {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
  });

  useEffect(() => {
    const handleResize = (): void => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const breakpoint: Breakpoint = useMemo(() => {
    if (windowSize.width < 768) return 'mobile';
    if (windowSize.width < 1024) return 'tablet';
    return 'desktop';
  }, [windowSize.width]);

  return {
    config: RESPONSIVE_CONFIG[breakpoint],
    breakpoint,
    windowSize,
  };
};

const useTilePlacement = (
  tiles: Tile[],
  config: ResponsiveBreakpointConfig | null,
  containerWidth: number,
  tileOrder: number[] = []
): TilePlacementResult => {
  return useMemo(() => {
    if (!containerWidth || !config || tiles.length === 0) {
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
    orderedTiles.forEach((tile: Tile, index: number) => {
      const tileConfig: TileConfig = config.sizes[tile.size];
      const placement = findPlacement(tileConfig);

      // Use modified config for placement marking (full-width tiles mark entire row)
      const placementConfig =
        tileConfig.gridWidth >= 999
          ? { ...tileConfig, gridWidth: gridColumns }
          : tileConfig;

      placeTile(placement.row, placement.col, placementConfig);

      // Calculate actual dimensions from grid dimensions
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
        ...tile,
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
      const zoneOffset: number = 8;
      const zoneThickness: number = 4;

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
  }, [tiles, config, containerWidth, tileOrder]);
};

// Component interfaces
interface TileComponentProps {
  tile: PlacedTile;
  config: ResponsiveBreakpointConfig;
  onDragStart: (tile: Tile) => void;
  onDragEnd: () => void;
  isDragging: boolean;
  isBeingReordered: boolean;
}

interface InsertionZoneProps {
  zone: InsertionZone;
  isActive: boolean;
  onDrop: (insertIndex: number) => void;
  onHover: (insertIndex: number, zoneSide: InsertionSide) => void;
}

// Components
const TileComponent: React.FC<TileComponentProps> = ({
  tile,
  config,
  onDragStart,
  onDragEnd,
  isDragging,
  isBeingReordered,
}) => {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>): void => {
    const rect = e.currentTarget.getBoundingClientRect();
    const offsetX: number = e.clientX - rect.left;
    const offsetY: number = e.clientY - rect.top;

    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', tile.id.toString());

    // Create a custom drag image
    const dragImage = e.currentTarget.cloneNode(true) as HTMLElement;
    dragImage.style.opacity = '0.8';
    dragImage.style.transform = 'rotate(3deg)';
    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, offsetX, offsetY);

    setTimeout(() => {
      document.body.removeChild(dragImage);
    }, 0);

    onDragStart(tile);
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
      className={`absolute transition-all duration-300 ease-in-out cursor-grab active:cursor-grabbing select-none
        ${isDragging ? 'opacity-30 z-50' : 'hover:scale-105 hover:z-10'}
        ${isBeingReordered ? 'z-40' : ''}
      `}
      style={{
        left: tile.x,
        top: tile.y,
        width: tile.width,
        height: tile.height,
        backgroundColor: tile.color,
        padding: config.tilePadding,
        borderRadius: '8px',
        boxShadow: isDragging
          ? '0 8px 32px rgba(0,0,0,0.3)'
          : '0 2px 8px rgba(0,0,0,0.1)',
        transform: isBeingReordered ? 'scale(0.95)' : 'scale(1)',
      }}
    >
      <div className="w-full h-full flex flex-col justify-between text-white pointer-events-none">
        <div className="font-bold text-lg">{tile.title}</div>
        <div className="text-xl font-light">{tile.content}</div>
        <div className="absolute top-1 right-1 text-xs bg-black/30 px-1 rounded">
          {tile.orderIndex + 1}
        </div>
      </div>
    </div>
  );
};

const InsertionZone: React.FC<InsertionZoneProps> = ({
  zone,
  isActive,
  onDrop,
  onHover,
}) => {
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    onHover(zone.insertIndex, zone.side);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    onDrop(zone.insertIndex);
  };

  const getZoneColor = (): string => {
    switch (zone.side) {
      case 'top':
      case 'before-all':
        return isActive
          ? 'bg-green-500 shadow-lg shadow-green-500/50'
          : 'bg-green-300/50 hover:bg-green-400/70';
      case 'bottom':
      case 'after-all':
        return isActive
          ? 'bg-blue-500 shadow-lg shadow-blue-500/50'
          : 'bg-blue-300/50 hover:bg-blue-400/70';
      case 'left':
        return isActive
          ? 'bg-purple-500 shadow-lg shadow-purple-500/50'
          : 'bg-purple-300/50 hover:bg-purple-400/70';
      case 'right':
        return isActive
          ? 'bg-orange-500 shadow-lg shadow-orange-500/50'
          : 'bg-orange-300/50 hover:bg-orange-400/70';
      default:
        return isActive
          ? 'bg-blue-500 shadow-lg shadow-blue-500/50'
          : 'bg-blue-300/50 hover:bg-blue-400/70';
    }
  };

  return (
    <div
      className={`absolute transition-all duration-200 pointer-events-auto rounded-sm
        ${getZoneColor()}
      `}
      style={{
        left: zone.x,
        top: zone.y,
        width: zone.width,
        height: zone.height,
        zIndex: isActive ? 60 : 30,
      }}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDrop={handleDrop}
      title={`Insert ${
        zone.side === 'left' ||
        zone.side === 'top' ||
        zone.side === 'before-all'
          ? 'before'
          : 'after'
      } tile`}
    />
  );
};

// Main component
const MetroTileGrid: React.FC = () => {
  const { config, breakpoint } = useResponsiveConfig();
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [tiles, setTiles] = useState<Tile[]>(SAMPLE_TILES);
  const [tileOrder, setTileOrder] = useState<number[]>(
    SAMPLE_TILES.map((tile) => tile.id)
  );
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    draggedTile: null,
    hoveredInsertionIndex: null,
    hoveredZoneSide: null,
  });

  const containerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const updateWidth = (): void => {
        if (containerRef.current) {
          setContainerWidth(containerRef.current.offsetWidth);
        }
      };

      updateWidth();

      const resizeObserver = new ResizeObserver(updateWidth);
      resizeObserver.observe(containerRef.current);

      return () => resizeObserver.disconnect();
    }
  }, []);

  // Update tile order when tiles change (add/remove)
  useEffect(() => {
    const currentIds: number[] = tiles.map((tile) => tile.id);
    const newOrder: number[] = tileOrder.filter((id) =>
      currentIds.includes(id)
    );

    // Add any new tiles to the end
    currentIds.forEach((id) => {
      if (!newOrder.includes(id)) {
        newOrder.push(id);
      }
    });

    // Only update if the order actually changed (to avoid infinite loops)
    if (
      newOrder.length !== tileOrder.length ||
      !newOrder.every((id, index) => id === tileOrder[index])
    ) {
      setTileOrder(newOrder);
    }
  }, [tiles]); // Removed tileOrder from dependencies to prevent shuffle resets

  const { placedTiles, gridHeight, insertionZones } = useTilePlacement(
    tiles,
    config,
    containerWidth,
    tileOrder
  );

  const handleDragStart = (tile: Tile): void => {
    setDragState({
      isDragging: true,
      draggedTile: tile,
      hoveredInsertionIndex: null,
      hoveredZoneSide: null,
    });
  };

  const handleDragEnd = (): void => {
    setDragState({
      isDragging: false,
      draggedTile: null,
      hoveredInsertionIndex: null,
      hoveredZoneSide: null,
    });
  };

  const handleInsertionZoneHover = (
    insertIndex: number,
    zoneSide: InsertionSide
  ): void => {
    setDragState((prev) => ({
      ...prev,
      hoveredInsertionIndex: insertIndex,
      hoveredZoneSide: zoneSide,
    }));
  };

  const handleInsertionDrop = (insertIndex: number): void => {
    if (!dragState.draggedTile) return;

    const draggedId: number = dragState.draggedTile.id;
    const currentIndex: number = tileOrder.indexOf(draggedId);

    if (currentIndex === -1) return;

    const newOrder: number[] = [...tileOrder];

    // Remove the dragged tile from its current position
    newOrder.splice(currentIndex, 1);

    // Adjust insert index if we removed an item before it
    const adjustedInsertIndex: number =
      insertIndex > currentIndex ? insertIndex - 1 : insertIndex;

    // Insert the tile at the new position
    newOrder.splice(adjustedInsertIndex, 0, draggedId);

    setTileOrder(newOrder);
    handleDragEnd();
  };

  const addRandomTile = (): void => {
    const colors: string[] = [
      '#e74c3c',
      '#3498db',
      '#2ecc71',
      '#f39c12',
      '#9b59b6',
      '#1abc9c',
    ];
    const sizes: TileSize[] = ['small', 'medium', 'large'];
    const newTile: Tile = {
      id: Date.now(),
      size: sizes[Math.floor(Math.random() * sizes.length)],
      color: colors[Math.floor(Math.random() * colors.length)],
      title: `Tile ${tiles.length + 1}`,
      content: Math.floor(Math.random() * 100).toString(),
    };
    setTiles((prev) => [...prev, newTile]);
  };

  const removeTile = (id: number): void => {
    setTiles((prev) => prev.filter((tile) => tile.id !== id));
    setTileOrder((prev) => prev.filter((tileId) => tileId !== id));
  };

  const resetTiles = (): void => {
    setTiles(SAMPLE_TILES);
    setTileOrder(SAMPLE_TILES.map((tile) => tile.id));
  };

  const shuffleTiles = (): void => {
    const shuffled: number[] = [...tileOrder].sort(() => Math.random() - 0.5);
    setTileOrder(shuffled);
  };

  return (
    <div className="w-full min-h-screen bg-gray-900 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-white mb-4">
            Metro UI Tile Grid - Grid-Based Sizing (TypeScript)
          </h1>
          <p className="text-gray-300 mb-4">
            Current breakpoint:{' '}
            <span className="font-semibold text-blue-400">{breakpoint}</span>
          </p>
          <div className="space-x-4">
            <button
              onClick={addRandomTile}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Add Tile
            </button>
            <button
              onClick={shuffleTiles}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
            >
              Shuffle
            </button>
            <button
              onClick={resetTiles}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        <div
          ref={containerRef}
          className="relative w-full bg-gray-800 rounded-lg"
          style={{ height: gridHeight }}
        >
          {/* Insertion zones */}
          {dragState.isDragging &&
            insertionZones.map((zone) => (
              <InsertionZone
                key={zone.id}
                zone={zone}
                isActive={
                  dragState.hoveredInsertionIndex === zone.insertIndex &&
                  dragState.hoveredZoneSide === zone.side
                }
                onDrop={handleInsertionDrop}
                onHover={handleInsertionZoneHover}
              />
            ))}

          {/* Tiles */}
          {placedTiles.map((tile) => (
            <div key={tile.id} onDoubleClick={() => removeTile(tile.id)}>
              <TileComponent
                tile={tile}
                config={config}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                isDragging={
                  dragState.isDragging && dragState.draggedTile?.id === tile.id
                }
                isBeingReordered={
                  dragState.isDragging && dragState.draggedTile?.id !== tile.id
                }
              />
            </div>
          ))}
        </div>

        <div className="mt-6 text-sm text-gray-400 text-center">
          <div>
            Drag tiles to the colored insertion zones around each tile to
            reorder them.
          </div>
          <div>
            🟢 Green (top) • 🔵 Blue (bottom) • 🟣 Purple (left) • 🟠 Orange
            (right)
          </div>
          <div>
            On mobile: tiles span full width with fixed heights • On
            tablet/desktop: mixed sizes
          </div>
          <div>Numbers show current order. Double-click to remove tiles.</div>
        </div>
      </div>
    </div>
  );
};

export default MetroTileGrid;
