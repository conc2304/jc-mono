import { createContext } from 'react';

import { FileSystemItem, SortBy, SortOrder, ViewMode } from '../types';

export const FileSystemContext = createContext<{
  fs: FileSystemItem[];
  items: FileSystemItem[];
  currentPath: string;
  selectedItems: string[];
  viewMode: ViewMode;
  sortBy: SortBy;
  sortOrder: SortOrder;
  navigateToPath: (path: string) => void;
  selectItem: (id: string, multi?: boolean) => void;
  setViewMode: (mode: ViewMode) => void;
  setSorting: (sortBy: SortBy, order: SortOrder) => void;
  moveItems: (itemIds: string[], targetPath: string) => void;
  draggedItems: string[];
  setDraggedItems: (items: string[]) => void;
} | null>(null);
