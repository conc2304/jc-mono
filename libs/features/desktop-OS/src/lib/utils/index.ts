// Desktop OS Utilities
import { ItemPosition } from '@jc/ui-components';
import { FileSystemItem } from '@jc/file-system';

export const snapToGrid = (x: number, y: number, gridSize = 20) => {
  return {
    x: Math.round(x / gridSize) * gridSize,
    y: Math.round(y / gridSize) * gridSize,
  };
};

// Default position generator function
export const defaultPositionGenerator = (
  items: FileSystemItem[]
): Record<string, ItemPosition> => {
  return items.reduce((acc, item, index) => {
    // Only create positions for root-level items (desktop icons)
    if (!item.parentId) {
      acc[item.id] = {
        x: 50,
        y: 50 + index * 100,
      };
    }
    return acc;
  }, {} as Record<string, ItemPosition>);
};

export const gridPositionGenerator = (
  items: FileSystemItem[]
): Record<string, ItemPosition> => {
  const ICON_SIZE = 80; // Icon width + margin
  const GRID_MARGIN = 20;
  const ICONS_PER_COLUMN = Math.floor((window.innerHeight - 100) / ICON_SIZE); // Account for taskbar

  return items.reduce((acc, item, index) => {
    if (!item.parentId) {
      const rootIndex = Object.keys(acc).length; // Only count root items
      const col = Math.floor(rootIndex / ICONS_PER_COLUMN);
      const row = rootIndex % ICONS_PER_COLUMN;

      acc[item.id] = {
        x: GRID_MARGIN + col * ICON_SIZE,
        y: GRID_MARGIN + row * ICON_SIZE,
      };
    }
    return acc;
  }, {} as Record<string, ItemPosition>);
};

export const positionGenerators = {
  // Linear arrangement (your original)
  linear: (items: FileSystemItem[]): Record<string, ItemPosition> => {
    return items.reduce((acc, item, index) => {
      if (!item.parentId) {
        acc[item.id] = { x: 50, y: 50 + index * 100 };
      }
      return acc;
    }, {} as Record<string, ItemPosition>);
  },

  // Grid arrangement
  grid: gridPositionGenerator,

  // Circular arrangement
  circular: (items: FileSystemItem[]): Record<string, ItemPosition> => {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const radius = 200;

    return items.reduce((acc, item, index) => {
      if (!item.parentId) {
        const rootIndex = Object.keys(acc).length;
        const angle =
          (rootIndex / items.filter((i) => !i.parentId).length) * 2 * Math.PI;

        acc[item.id] = {
          x: centerX + Math.cos(angle) * radius - 40, // -40 for icon center
          y: centerY + Math.sin(angle) * radius - 40,
        };
      }
      return acc;
    }, {} as Record<string, ItemPosition>);
  },

  // Left edge arrangement
  leftEdge: (items: FileSystemItem[]): Record<string, ItemPosition> => {
    return items.reduce((acc, item, index) => {
      if (!item.parentId) {
        const rootIndex = Object.keys(acc).length;
        acc[item.id] = { x: 20, y: 20 + rootIndex * 90 };
      }
      return acc;
    }, {} as Record<string, ItemPosition>);
  },
};

// Helper to generate default icon positions
export const generateDefaultDesktopItemPositions = (
  fileSystem: FileSystemItem[],
  arrangement: 'linear' | 'grid' | 'circular' = 'linear'
): Record<string, ItemPosition> => {
  const rootItems = fileSystem.filter((item) => !item.parentId);

  switch (arrangement) {
    case 'grid': {
      const ICON_SIZE = 100;
      const GRID_MARGIN = 20;
      const ICONS_PER_COLUMN = Math.floor(
        (window.innerHeight - 100) / ICON_SIZE
      );

      return rootItems.reduce((acc, item, index) => {
        const col = Math.floor(index / ICONS_PER_COLUMN);
        const row = index % ICONS_PER_COLUMN;

        acc[item.id] = {
          x: GRID_MARGIN + col * ICON_SIZE,
          y: GRID_MARGIN + row * ICON_SIZE,
        };
        return acc;
      }, {} as Record<string, ItemPosition>);
    }

    case 'circular': {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const radius = 200;

      return rootItems.reduce((acc, item, index) => {
        const angle = (index / rootItems.length) * 2 * Math.PI;
        acc[item.id] = {
          x: centerX + Math.cos(angle) * radius - 40,
          y: centerY + Math.sin(angle) * radius - 40,
        };
        return acc;
      }, {} as Record<string, ItemPosition>);
    }

    default: // linear (your original)
      return rootItems.reduce((acc, item, index) => {
        acc[item.id] = { x: 50, y: 50 + index * 100 };
        return acc;
      }, {} as Record<string, ItemPosition>);
  }
};
