import { useCallback, useMemo } from 'react';

import { FileSystemItem } from './types';
import {
  createFileSystemItemMap,
  getDesktopIcons,
  getFileSystemItemFromMap,
  getFileSystemItemsFromMap,
  searchFileSystemItems,
} from './utils';

/**
 * Hook for managing FileSystem operations with optimized lookups
 */
export const useFileSystemManager = (items: FileSystemItem[]) => {
  // Create map once for O(1) lookups
  const itemMap = useMemo(() => createFileSystemItemMap(items), [items]);

  const getItemById = useCallback(
    (id: string) => {
      return getFileSystemItemFromMap(id, itemMap);
    },
    [itemMap]
  );

  const getItemsByIds = useCallback(
    (ids: string[]) => {
      return getFileSystemItemsFromMap(ids, itemMap);
    },
    [itemMap]
  );

  const searchItems = useCallback(
    (query: string) => {
      return searchFileSystemItems(query, items);
    },
    [items]
  );

  const getDesktopItems = useCallback(() => {
    return getDesktopIcons(items);
  }, [items]);

  return {
    getItemById,
    getItemsByIds,
    searchItems,
    getDesktopItems,
    itemMap,
  };
};
