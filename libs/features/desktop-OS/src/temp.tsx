import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  Folder,
  FileText,
  Settings,
  Image,
  Code,
  ChevronRight,
  Star,
} from 'lucide-react';

// Responsive breakpoints
const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1200,
};

// Device type detection
type DeviceType = 'mobile' | 'tablet' | 'desktop';

const getDeviceType = (width: number): DeviceType => {
  if (width < BREAKPOINTS.mobile) return 'mobile';
  if (width < BREAKPOINTS.tablet) return 'tablet';
  return 'desktop';
};

// Responsive grid configuration
const RESPONSIVE_CONFIG = {
  mobile: {
    gridSize: 16, // Smaller grid for mobile
    tilePadding: 4,
    containerPadding: 8,
    sizes: {
      small: { width: 140, height: 140, gridWidth: 9, gridHeight: 9 },
      medium: { width: 140, height: 200, gridWidth: 9, gridHeight: 13 }, // Tall on mobile
      large: { width: 300, height: 160, gridWidth: 19, gridHeight: 10 }, // Wide but short on mobile
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

// Hook for responsive configuration
const useResponsiveConfig = () => {
  const [config, setConfig] = useState(RESPONSIVE_CONFIG.desktop);
  const [deviceType, setDeviceType] = useState<DeviceType>('desktop');

  useEffect(() => {
    const updateConfig = () => {
      const width = window.innerWidth;
      const newDeviceType = getDeviceType(width);
      setDeviceType(newDeviceType);
      setConfig(RESPONSIVE_CONFIG[newDeviceType]);
    };

    updateConfig();
    window.addEventListener('resize', updateConfig);
    return () => window.removeEventListener('resize', updateConfig);
  }, []);

  return { config, deviceType };
};

// Grid position type
interface GridPosition {
  x: number;
  y: number;
}

// Pixel position type
interface PixelPosition {
  x: number;
  y: number;
}

// Tile configuration
interface TileConfig {
  size: 'small' | 'medium' | 'large';
  gradient: { from: string; to: string };
  showLiveContent?: boolean;
  updateInterval?: number;
}

// Tile data interface
interface TileData {
  id: string;
  name: string;
  icon: React.ReactNode;
  config: TileConfig;
  gridPosition: GridPosition;
  children?: any[];
  metadata?: {
    favorite?: boolean;
    description?: string;
  };
  dateModified?: Date;
}

// Responsive Grid Manager
class ResponsiveGridManager {
  private gridWidth: number;
  private gridHeight: number;
  private occupiedCells: Set<string> = new Set();
  private config: typeof RESPONSIVE_CONFIG.desktop;

  constructor(
    containerWidth: number,
    containerHeight: number,
    config: typeof RESPONSIVE_CONFIG.desktop
  ) {
    this.config = config;
    this.gridWidth = Math.floor(
      (containerWidth - config.containerPadding * 2) / config.gridSize
    );
    this.gridHeight = Math.floor(
      (containerHeight - config.containerPadding * 2) / config.gridSize
    );
  }

  pixelToGrid(pixel: PixelPosition): GridPosition {
    return {
      x: Math.round(
        (pixel.x - this.config.containerPadding) / this.config.gridSize
      ),
      y: Math.round(
        (pixel.y - this.config.containerPadding) / this.config.gridSize
      ),
    };
  }

  gridToPixel(grid: GridPosition): PixelPosition {
    return {
      x: grid.x * this.config.gridSize + this.config.containerPadding,
      y: grid.y * this.config.gridSize + this.config.containerPadding,
    };
  }

  getTileSize(tileSize: 'small' | 'medium' | 'large') {
    return this.config.sizes[tileSize];
  }

  canPlaceTile(
    position: GridPosition,
    tileSize: 'small' | 'medium' | 'large',
    excludeTileId?: string
  ): boolean {
    const { gridWidth, gridHeight } = this.getTileSize(tileSize);

    if (
      position.x < 0 ||
      position.y < 0 ||
      position.x + gridWidth > this.gridWidth ||
      position.y + gridHeight > this.gridHeight
    ) {
      return false;
    }

    for (let x = position.x; x < position.x + gridWidth; x++) {
      for (let y = position.y; y < position.y + gridHeight; y++) {
        const cellKey = `${x},${y}`;
        const occupiedBy = this.getCellOccupant(cellKey);
        if (occupiedBy && occupiedBy !== excludeTileId) {
          return false;
        }
      }
    }

    return true;
  }

  findNearestValidPosition(
    targetPosition: GridPosition,
    tileSize: 'small' | 'medium' | 'large',
    excludeTileId?: string
  ): GridPosition {
    if (this.canPlaceTile(targetPosition, tileSize, excludeTileId)) {
      return targetPosition;
    }

    const maxDistance = Math.max(this.gridWidth, this.gridHeight);

    for (let distance = 1; distance <= maxDistance; distance++) {
      for (let dx = -distance; dx <= distance; dx++) {
        for (let dy = -distance; dy <= distance; dy++) {
          if (Math.abs(dx) !== distance && Math.abs(dy) !== distance) continue;

          const candidatePosition = {
            x: targetPosition.x + dx,
            y: targetPosition.y + dy,
          };

          if (this.canPlaceTile(candidatePosition, tileSize, excludeTileId)) {
            return candidatePosition;
          }
        }
      }
    }

    return targetPosition;
  }

  occupyCells(
    position: GridPosition,
    tileSize: 'small' | 'medium' | 'large',
    tileId: string
  ) {
    const { gridWidth, gridHeight } = this.getTileSize(tileSize);

    for (let x = position.x; x < position.x + gridWidth; x++) {
      for (let y = position.y; y < position.y + gridHeight; y++) {
        this.occupiedCells.add(`${x},${y}:${tileId}`);
      }
    }
  }

  freeCells(tileId: string) {
    const cellsToRemove = Array.from(this.occupiedCells).filter((cell) =>
      cell.endsWith(`:${tileId}`)
    );
    cellsToRemove.forEach((cell) => this.occupiedCells.delete(cell));
  }

  private getCellOccupant(cellKey: string): string | null {
    const occupant = Array.from(this.occupiedCells).find((cell) =>
      cell.startsWith(cellKey + ':')
    );
    return occupant ? occupant.split(':')[1] : null;
  }

  updateTilePosition(
    tileId: string,
    newPosition: GridPosition,
    tileSize: 'small' | 'medium' | 'large'
  ) {
    this.freeCells(tileId);
    const validPosition = this.findNearestValidPosition(
      newPosition,
      tileSize,
      tileId
    );
    this.occupyCells(validPosition, tileSize, tileId);
    return validPosition;
  }

  // Convert positions when switching between device types
  convertPositionForDevice(
    position: GridPosition,
    fromConfig: typeof RESPONSIVE_CONFIG.desktop,
    toConfig: typeof RESPONSIVE_CONFIG.desktop
  ): GridPosition {
    // Convert to pixel position with old config
    const pixelPos = {
      x: position.x * fromConfig.gridSize + fromConfig.containerPadding,
      y: position.y * fromConfig.gridSize + fromConfig.containerPadding,
    };

    // Convert back to grid position with new config
    return {
      x: Math.round(
        (pixelPos.x - toConfig.containerPadding) / toConfig.gridSize
      ),
      y: Math.round(
        (pixelPos.y - toConfig.containerPadding) / toConfig.gridSize
      ),
    };
  }
}

// Responsive Tile Component
const ResponsiveTile: React.FC<{
  tile: TileData;
  onDragStart: (tileId: string, startPos: PixelPosition) => void;
  onDragEnd: (tileId: string, endPos: PixelPosition) => void;
  isDragging: boolean;
  dragOffset?: PixelPosition;
  config: typeof RESPONSIVE_CONFIG.desktop;
  deviceType: DeviceType;
}> = ({
  tile,
  onDragStart,
  onDragEnd,
  isDragging,
  dragOffset,
  config,
  deviceType,
}) => {
  const tileRef = useRef<HTMLDivElement>(null);
  const [dragStartPos, setDragStartPos] = useState<PixelPosition | null>(null);

  const tileSize = config.sizes[tile.config.size];
  const pixelPosition = {
    x: tile.gridPosition.x * config.gridSize + config.containerPadding,
    y: tile.gridPosition.y * config.gridSize + config.containerPadding,
  };

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      const rect = tileRef.current?.getBoundingClientRect();
      if (rect) {
        const startPos = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        };
        setDragStartPos(startPos);
        onDragStart(tile.id, startPos);
      }
    },
    [tile.id, onDragStart]
  );

  // Touch support for mobile
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();
      const rect = tileRef.current?.getBoundingClientRect();
      if (rect && e.touches[0]) {
        const startPos = {
          x: e.touches[0].clientX - rect.left,
          y: e.touches[0].clientY - rect.top,
        };
        setDragStartPos(startPos);
        onDragStart(tile.id, startPos);
      }
    },
    [tile.id, onDragStart]
  );

  const handleMouseUp = useCallback(
    (e: React.MouseEvent) => {
      if (dragStartPos) {
        const endPos = {
          x: e.clientX - dragStartPos.x,
          y: e.clientY - dragStartPos.y,
        };
        onDragEnd(tile.id, endPos);
        setDragStartPos(null);
      }
    },
    [tile.id, onDragEnd, dragStartPos]
  );

  const displayPosition = isDragging && dragOffset ? dragOffset : pixelPosition;

  // Responsive font sizes and spacing
  const isLarge = tile.config.size === 'large';
  const isMobile = deviceType === 'mobile';

  const fontSize = {
    title: isMobile
      ? isLarge
        ? '0.875rem'
        : '0.75rem'
      : isLarge
      ? '1rem'
      : '0.75rem',
    subtitle: isMobile ? '0.625rem' : '0.75rem',
    caption: '0.625rem',
  };

  const iconSize = isMobile ? (isLarge ? 20 : 16) : isLarge ? 24 : 20;
  const iconContainerSize = isMobile ? (isLarge ? 32 : 24) : isLarge ? 40 : 32;

  return (
    <div
      ref={tileRef}
      className="absolute cursor-pointer rounded-2xl overflow-hidden transition-all duration-200"
      style={{
        left: displayPosition.x,
        top: displayPosition.y,
        width: tileSize.width,
        height: tileSize.height,
        background: `linear-gradient(135deg, ${tile.config.gradient.from}, ${tile.config.gradient.to})`,
        transform: isDragging ? 'scale(1.05) rotate(2deg)' : 'scale(1)',
        boxShadow: isDragging
          ? '0 20px 40px rgba(0, 0, 0, 0.3)'
          : '0 8px 24px rgba(0, 0, 0, 0.15)',
        transition: isDragging ? 'none' : 'transform 0.2s, box-shadow 0.2s',
        zIndex: isDragging ? 1000 : 1,
        borderRadius: isMobile ? '12px' : '24px',
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onMouseUp={handleMouseUp}
    >
      <div
        className="h-full text-white relative"
        style={{ padding: isMobile ? '12px' : '16px' }}
      >
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute top-0 right-0 bg-white/20 rounded-full"
            style={{
              width: isMobile ? '80px' : '128px',
              height: isMobile ? '80px' : '128px',
              transform: isMobile
                ? 'translate(40px, -40px)'
                : 'translate(64px, -64px)',
            }}
          />
        </div>

        <div className="relative z-10 h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div
                className="bg-white/20 rounded-lg flex items-center justify-center"
                style={{
                  width: iconContainerSize,
                  height: iconContainerSize,
                }}
              >
                {React.isValidElement(tile.icon) &&
                  React.cloneElement(tile.icon as React.ReactElement, {
                    size: iconSize,
                  })}
              </div>
              {(isLarge || !isMobile) && (
                <div>
                  <h3
                    style={{
                      fontSize: fontSize.title,
                      fontWeight: 'bold',
                      margin: 0,
                    }}
                  >
                    {tile.name}
                  </h3>
                  {!isMobile && (
                    <p
                      style={{
                        fontSize: fontSize.subtitle,
                        opacity: 0.8,
                        margin: 0,
                      }}
                    >
                      {tile.children?.length || 0} items
                    </p>
                  )}
                </div>
              )}
            </div>
            <ChevronRight size={isMobile ? 12 : 16} className="opacity-60" />
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col justify-center">
            {(!isLarge || isMobile) && (
              <div className="text-center">
                <h3
                  style={{
                    fontSize: fontSize.title,
                    fontWeight: 'bold',
                    margin: 0,
                    marginBottom: '4px',
                  }}
                >
                  {tile.name}
                </h3>
                <p
                  style={{
                    fontSize: fontSize.caption,
                    opacity: 0.8,
                    margin: 0,
                  }}
                >
                  {tile.children?.length
                    ? `${tile.children.length} items`
                    : 'File'}
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center">
            <span style={{ fontSize: fontSize.caption, opacity: 0.7 }}>
              {isMobile
                ? 'Recent'
                : tile.dateModified?.toLocaleDateString() || 'Recent'}
            </span>
            {tile.metadata?.favorite && (
              <Star
                size={isMobile ? 10 : 12}
                className="text-yellow-300"
                fill="currentColor"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Responsive Grid Desktop Component
const ResponsiveGridDesktop: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { config, deviceType } = useResponsiveConfig();
  const [gridManager, setGridManager] = useState<ResponsiveGridManager | null>(
    null
  );
  const [draggedTile, setDraggedTile] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<PixelPosition>({ x: 0, y: 0 });
  const [prevConfig, setPrevConfig] = useState(config);

  // Sample tiles data with mobile-optimized positions
  const [tiles, setTiles] = useState<TileData[]>([
    {
      id: 'projects',
      name: 'Projects',
      icon: <Code />,
      config: {
        size: 'large',
        gradient: { from: '#2563eb', to: '#0891b2' },
        showLiveContent: true,
      },
      gridPosition: { x: 1, y: 1 },
      children: [{ name: 'React App' }, { name: 'Vue Project' }],
      dateModified: new Date('2024-01-15'),
      metadata: { favorite: true },
    },
    {
      id: 'resume',
      name: 'Resume.pdf',
      icon: <FileText />,
      config: {
        size: 'small',
        gradient: { from: '#10b981', to: '#059669' },
      },
      gridPosition: { x: 12, y: 1 },
      dateModified: new Date('2024-01-10'),
    },
    {
      id: 'gallery',
      name: 'Gallery',
      icon: <Image />,
      config: {
        size: 'small',
        gradient: { from: '#8b5cf6', to: '#ec4899' },
      },
      gridPosition: { x: 1, y: 12 },
      children: [{ name: 'photo1.jpg' }, { name: 'photo2.jpg' }],
      dateModified: new Date('2024-01-20'),
      metadata: { favorite: true },
    },
    {
      id: 'settings',
      name: 'Settings',
      icon: <Settings />,
      config: {
        size: 'small',
        gradient: { from: '#4b5563', to: '#1f2937' },
      },
      gridPosition: { x: 12, y: 12 },
      dateModified: new Date('2024-01-22'),
    },
  ]);

  // Initialize/update grid manager when config changes
  useEffect(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const manager = new ResponsiveGridManager(
        rect.width,
        rect.height,
        config
      );

      // Convert tile positions if device type changed
      if (prevConfig !== config) {
        setTiles((prevTiles) =>
          prevTiles.map((tile) => ({
            ...tile,
            gridPosition: manager.convertPositionForDevice(
              tile.gridPosition,
              prevConfig,
              config
            ),
          }))
        );
        setPrevConfig(config);
      }

      // Initialize grid with current tile positions
      tiles.forEach((tile) => {
        manager.occupyCells(tile.gridPosition, tile.config.size, tile.id);
      });

      setGridManager(manager);
    }
  }, [config, prevConfig]);

  const handleDragStart = useCallback(
    (tileId: string, startPos: PixelPosition) => {
      setDraggedTile(tileId);

      const handleMouseMove = (e: MouseEvent) => {
        setDragOffset({
          x: e.clientX - startPos.x,
          y: e.clientY - startPos.y,
        });
      };

      const handleTouchMove = (e: TouchEvent) => {
        if (e.touches[0]) {
          setDragOffset({
            x: e.touches[0].clientX - startPos.x,
            y: e.touches[0].clientY - startPos.y,
          });
        }
      };

      const handleEnd = () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleEnd);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleEnd);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleEnd);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleEnd);
    },
    []
  );

  const handleDragEnd = useCallback(
    (tileId: string, endPos: PixelPosition) => {
      if (!gridManager) return;

      const tile = tiles.find((t) => t.id === tileId);
      if (!tile) return;

      const targetGridPos = gridManager.pixelToGrid(endPos);
      const newGridPos = gridManager.updateTilePosition(
        tileId,
        targetGridPos,
        tile.config.size
      );

      setTiles((prevTiles) =>
        prevTiles.map((t) =>
          t.id === tileId ? { ...t, gridPosition: newGridPos } : t
        )
      );

      setDraggedTile(null);
      setDragOffset({ x: 0, y: 0 });
    },
    [gridManager, tiles]
  );

  return (
    <div
      ref={containerRef}
      className="w-full h-screen relative overflow-hidden"
      style={{
        background:
          'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
        padding: config.containerPadding,
      }}
    >
      {/* Device indicator */}
      <div className="absolute top-4 left-4 bg-black/20 text-white px-3 py-1 rounded-lg text-sm z-50">
        {deviceType} - {config.gridSize}px grid
      </div>

      {/* Grid visualization for development */}
      {process.env.NODE_ENV === 'development' && (
        <div
          className="absolute opacity-5 pointer-events-none"
          style={{
            left: config.containerPadding,
            top: config.containerPadding,
            right: config.containerPadding,
            bottom: config.containerPadding,
            backgroundImage: `
              linear-gradient(to right, #fff 1px, transparent 1px),
              linear-gradient(to bottom, #fff 1px, transparent 1px)
            `,
            backgroundSize: `${config.gridSize}px ${config.gridSize}px`,
          }}
        />
      )}

      {/* Render tiles */}
      {tiles.map((tile) => (
        <ResponsiveTile
          key={tile.id}
          tile={tile}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          isDragging={draggedTile === tile.id}
          dragOffset={draggedTile === tile.id ? dragOffset : undefined}
          config={config}
          deviceType={deviceType}
        />
      ))}
    </div>
  );
};

export default ResponsiveGridDesktop;
