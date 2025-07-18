// Desktop OS Utilities
import { ReactNode } from 'react';
import { IconPosition } from '@jc/ui-components';

export const snapToGrid = (x: number, y: number, gridSize = 20) => {
  return {
    x: Math.round(x / gridSize) * gridSize,
    y: Math.round(y / gridSize) * gridSize,
  };
};

export interface FileSystemItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  icon: ReactNode;
  size?: number;
  dateModified: Date;
  dateCreated: Date;
  extension?: string;
  mimeType?: string;
  path: string;
  parentId?: string;
  children?: FileSystemItem[];
  permissions: {
    read: boolean;
    write: boolean;
    execute: boolean;
  };
  metadata: {
    description?: string;
    tags: string[];
    favorite: boolean;
    thumbnail?: string;
    customProperties?: Record<string, any>;
  };
}

/**
 * Get a file/folder by ID from a flat array of FileSystemItems
 */
export const getFileSystemItemById = (
  id: string,
  items: FileSystemItem[]
): FileSystemItem | undefined => {
  return items.find((item) => item.id === id);
};

/**
 * Get a file/folder by ID with recursive search through children
 * Useful when you have nested folder structures
 */
export const getFileSystemItemByIdRecursive = (
  id: string,
  items: FileSystemItem[]
): FileSystemItem | undefined => {
  for (const item of items) {
    // Check current item
    if (item.id === id) {
      return item;
    }

    // Search in children if it's a folder
    if (item.type === 'folder' && item.children) {
      const found = getFileSystemItemByIdRecursive(id, item.children);
      if (found) {
        return found;
      }
    }
  }

  return undefined;
};

/**
 * Get multiple files/folders by an array of IDs
 */
export const getFileSystemItemsByIds = (
  ids: string[],
  items: FileSystemItem[]
): FileSystemItem[] => {
  return ids
    .map((id) => getFileSystemItemById(id, items))
    .filter((item): item is FileSystemItem => item !== undefined);
};

/**
 * Get multiple files/folders by IDs with recursive search
 */
export const getFileSystemItemsByIdsRecursive = (
  ids: string[],
  items: FileSystemItem[]
): FileSystemItem[] => {
  return ids
    .map((id) => getFileSystemItemByIdRecursive(id, items))
    .filter((item): item is FileSystemItem => item !== undefined);
};

/**
 * Create a Map for O(1) lookup performance
 * Useful when you need to do many lookups
 */
export const createFileSystemItemMap = (
  items: FileSystemItem[]
): Map<string, FileSystemItem> => {
  const map = new Map<string, FileSystemItem>();

  const addToMap = (itemList: FileSystemItem[]) => {
    for (const item of itemList) {
      map.set(item.id, item);

      // Add children recursively
      if (item.children) {
        addToMap(item.children);
      }
    }
  };

  addToMap(items);
  return map;
};

/**
 * Get item by ID using a pre-built map (fastest lookup)
 */
export const getFileSystemItemFromMap = (
  id: string,
  itemMap: Map<string, FileSystemItem>
): FileSystemItem | undefined => {
  return itemMap.get(id);
};

/**
 * Get multiple items by IDs using a map
 */
export const getFileSystemItemsFromMap = (
  ids: string[],
  itemMap: Map<string, FileSystemItem>
): FileSystemItem[] => {
  return ids
    .map((id) => itemMap.get(id))
    .filter((item): item is FileSystemItem => item !== undefined);
};

/**
 * Get all desktop icons (root level items) from the file system
 */
export const getDesktopIcons = (items: FileSystemItem[]): FileSystemItem[] => {
  return items.filter((item) => !item.parentId);
};

/**
 * Get children of a specific folder by ID
 */
export const getFolderChildren = (
  folderId: string,
  items: FileSystemItem[]
): FileSystemItem[] => {
  const folder = getFileSystemItemByIdRecursive(folderId, items);
  return folder?.children || [];
};

/**
 * Get parent folder of an item
 */
export const getParentFolder = (
  itemId: string,
  items: FileSystemItem[]
): FileSystemItem | undefined => {
  const item = getFileSystemItemByIdRecursive(itemId, items);
  if (!item?.parentId) return undefined;

  return getFileSystemItemByIdRecursive(item.parentId, items);
};

/**
 * Get all items in a specific path
 */
export const getItemsInPath = (
  path: string,
  items: FileSystemItem[]
): FileSystemItem[] => {
  return items.filter((item) => {
    const itemDir = item.path.substring(0, item.path.lastIndexOf('/')) || '/';
    return itemDir === path;
  });
};

/**
 * Search for items by name (case-insensitive)
 */
export const searchFileSystemItems = (
  query: string,
  items: FileSystemItem[]
): FileSystemItem[] => {
  const lowercaseQuery = query.toLowerCase();

  const searchRecursive = (itemList: FileSystemItem[]): FileSystemItem[] => {
    const results: FileSystemItem[] = [];

    for (const item of itemList) {
      if (item.name.toLowerCase().includes(lowercaseQuery)) {
        results.push(item);
      }

      if (item.children) {
        results.push(...searchRecursive(item.children));
      }
    }

    return results;
  };

  return searchRecursive(items);
};

// /**
//  * Hook for managing FileSystem operations with optimized lookups
//  */
// export const useFileSystemManager = (items: FileSystemItem[]) => {
//   // Create map once for O(1) lookups
//   const itemMap = useMemo(() => createFileSystemItemMap(items), [items]);

//   const getItemById = useCallback(
//     (id: string) => {
//       return getFileSystemItemFromMap(id, itemMap);
//     },
//     [itemMap]
//   );

//   const getItemsByIds = useCallback(
//     (ids: string[]) => {
//       return getFileSystemItemsFromMap(ids, itemMap);
//     },
//     [itemMap]
//   );

//   const searchItems = useCallback(
//     (query: string) => {
//       return searchFileSystemItems(query, items);
//     },
//     [items]
//   );

//   const getDesktopItems = useCallback(() => {
//     return getDesktopIcons(items);
//   }, [items]);

//   return {
//     getItemById,
//     getItemsByIds,
//     searchItems,
//     getDesktopItems,
//     itemMap,
//   };
// };

// // Usage examples:

// // 1. Simple lookup in flat array
// const item = getFileSystemItemById('file-123', mockFileSystem);

// // 2. Recursive lookup (searches nested folders)
// const item2 = getFileSystemItemByIdRecursive('nested-file', mockFileSystem);

// // 3. Performance-optimized lookup for many operations
// const itemMap = createFileSystemItemMap(mockFileSystem);
// const fastLookup = getFileSystemItemFromMap('file-123', itemMap);

// // 4. Multiple items at once
// const selectedItems = getFileSystemItemsByIds(
//   ['file-1', 'folder-2'],
//   mockFileSystem
// );

// // 5. Using the hook in a component
// export const OptimizedDesktop = ({
//   fileSystemItems,
// }: {
//   fileSystemItems: FileSystemItem[];
// }) => {
//   const { getItemById, getItemsByIds, getDesktopItems } =
//     useFileSystemManager(fileSystemItems);

//   const handleIconClick = (iconId: string) => {
//     const item = getItemById(iconId);
//     if (item) {
//       console.log('Clicked:', item.name);
//     }
//   };

//   const desktopIcons = getDesktopItems();

//   return (
//     <div className="desktop">
//       {desktopIcons.map((icon) => (
//         <OptimizedDesktopIcon
//           key={icon.id}
//           icon={icon}
//           position={iconPositions[icon.id]}
//           onMouseDown={(e) => handleIconMouseDown(e, icon.id)}
//           onClick={() => handleIconClick(icon.id)}
//         />
//       ))}
//     </div>
//   );
// };

// For your drag system integration:
export const getIconById = (
  id: string,
  fileSystemItems: FileSystemItem[]
): FileSystemItem | undefined => {
  return getFileSystemItemById(id, fileSystemItems);
};

// Or with the performance-optimized version:
export const createGetIconById = (fileSystemItems: FileSystemItem[]) => {
  const itemMap = createFileSystemItemMap(fileSystemItems);

  return (id: string): FileSystemItem | undefined => {
    return getFileSystemItemFromMap(id, itemMap);
  };
};

// Default position generator function
export const defaultPositionGenerator = (
  items: FileSystemItem[]
): Record<string, IconPosition> => {
  return items.reduce((acc, item, index) => {
    // Only create positions for root-level items (desktop icons)
    if (!item.parentId) {
      acc[item.id] = {
        x: 50,
        y: 50 + index * 100,
      };
    }
    return acc;
  }, {} as Record<string, IconPosition>);
};

export const gridPositionGenerator = (
  items: FileSystemItem[]
): Record<string, IconPosition> => {
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
  }, {} as Record<string, IconPosition>);
};

export const positionGenerators = {
  // Linear arrangement (your original)
  linear: (items: FileSystemItem[]): Record<string, IconPosition> => {
    return items.reduce((acc, item, index) => {
      if (!item.parentId) {
        acc[item.id] = { x: 50, y: 50 + index * 100 };
      }
      return acc;
    }, {} as Record<string, IconPosition>);
  },

  // Grid arrangement
  grid: gridPositionGenerator,

  // Circular arrangement
  circular: (items: FileSystemItem[]): Record<string, IconPosition> => {
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
    }, {} as Record<string, IconPosition>);
  },

  // Left edge arrangement
  leftEdge: (items: FileSystemItem[]): Record<string, IconPosition> => {
    return items.reduce((acc, item, index) => {
      if (!item.parentId) {
        const rootIndex = Object.keys(acc).length;
        acc[item.id] = { x: 20, y: 20 + rootIndex * 90 };
      }
      return acc;
    }, {} as Record<string, IconPosition>);
  },
};

// Helper to generate default icon positions
export const generateDefaultIconPositions = (
  fileSystem: FileSystemItem[],
  arrangement: 'linear' | 'grid' | 'circular' = 'linear'
): Record<string, IconPosition> => {
  const rootItems = fileSystem.filter((item) => !item.parentId);

  switch (arrangement) {
    case 'grid': {
      const ICON_SIZE = 80;
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
      }, {} as Record<string, IconPosition>);
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
      }, {} as Record<string, IconPosition>);
    }

    default: // linear (your original)
      return rootItems.reduce((acc, item, index) => {
        acc[item.id] = { x: 50, y: 50 + index * 100 };
        return acc;
      }, {} as Record<string, IconPosition>);
  }
};
