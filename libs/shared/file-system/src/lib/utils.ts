import { FileSystemItem } from './types';

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
 * Recursively search through file system items using a filter callback function
 * Works similar to Array.filter() but searches through the entire nested structure
 */
export const searchFileSystemRecursive = (
  items: FileSystemItem[],
  filterCallback: (item: FileSystemItem) => boolean
): FileSystemItem[] => {
  const results: FileSystemItem[] = [];

  const searchRecursive = (itemList: FileSystemItem[]): void => {
    for (const item of itemList) {
      // Test the current item against the filter
      if (filterCallback(item)) {
        results.push(item);
      }

      // Continue searching in children if it's a folder
      if (item.type === 'folder' && item.children) {
        searchRecursive(item.children);
      }
    }
  };

  searchRecursive(items);
  return results;
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

// Performance-optimized version:
export const createGetIconById = (fileSystemItems: FileSystemItem[]) => {
  const itemMap = createFileSystemItemMap(fileSystemItems);

  return (id: string): FileSystemItem | undefined => {
    return getFileSystemItemFromMap(id, itemMap);
  };
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

// For your drag system integration:
export const getIconById = (
  id: string,
  fileSystemItems: FileSystemItem[]
): FileSystemItem | undefined => {
  return getFileSystemItemByIdRecursive(id, fileSystemItems);
};

// Alternative version that also returns the path to the found item
export const findFileSystemItemByIdWithPath = (
  items: FileSystemItem[],
  itemId: string,
  currentPath: FileSystemItem[] = []
): { item: FileSystemItem; path: FileSystemItem[] } | undefined => {
  for (const item of items) {
    const newPath = [...currentPath, item];

    // Check if this is the item we're looking for
    if (item.id === itemId) {
      return { item, path: newPath };
    }

    // If this item has children, recursively search them
    if (item.children && item.children.length > 0) {
      const found = findFileSystemItemByIdWithPath(
        item.children,
        itemId,
        newPath
      );
      if (found) {
        return found;
      }
    }
  }

  // Item not found in this branch
  return undefined;
};
