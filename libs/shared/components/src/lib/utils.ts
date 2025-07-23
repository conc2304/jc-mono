import { FileSystemItem } from './types';

// Alternative version that also returns the path to the found item
export function findFileSystemItemByIdWithPath(
  items: FileSystemItem[],
  itemId: string,
  currentPath: FileSystemItem[] = []
): { item: FileSystemItem; path: FileSystemItem[] } | undefined {
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
}
