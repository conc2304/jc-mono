import { FileSystemItem } from './types';

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
  return getFileSystemItemById(id, fileSystemItems);
};

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
