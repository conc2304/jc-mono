import { createContext } from 'react';

import {
  ScrollAwareClickConfig,
  ViewMode,
  SortBy,
  SortOrder,
} from '@jc/ui-components';

import { BaseFileSystemItem } from '../../types';

export const FileSystemContext = createContext<{
  fs: BaseFileSystemItem[];
  items: BaseFileSystemItem[];
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
  scrollConfig?: ScrollAwareClickConfig;
} | null>(null);
