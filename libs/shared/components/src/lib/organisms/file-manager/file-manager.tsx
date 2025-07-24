import { ReactNode, useState } from 'react';
import { Box } from '@mui/material';
import { Computer } from 'lucide-react';

import { FileSystemContext } from '../../context';
import {
  BreadcrumbNavigation,
  FileListView,
  QuickAccessPanel,
} from '../../molecules';
import { ViewControls } from '../../molecules/file-view-controls';
import { PreviewPanel } from '../../molecules/preview-panel';
import { BaseFileSystemItem, SortBy, SortOrder, ViewMode } from '../../types';

interface FileManagerProps {
  initialPath: string;
  folderContents: BaseFileSystemItem[];
  fileSystemItems: BaseFileSystemItem[];
  updateWindowName: (name: string, icon: ReactNode) => void;
}
export const FileManager = ({
  fileSystemItems,
  initialPath,
  folderContents: folderContentsProp,
  updateWindowName,
}: FileManagerProps) => {
  const [folderContents, setFolderContents] = useState(folderContentsProp);
  const [quickAccessCollapsed, setQuickAccessCollapsed] = useState(true);
  const [previewCollapsed, setPreviewCollapsed] = useState(true);
  const [currentPath, setCurrentPath] = useState(initialPath);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [sortBy, setSortBy] = useState<SortBy>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [draggedItems, setDraggedItems] = useState<string[]>([]);

  const navigateToPath = (path: string) => {
    setCurrentPath(path);
    setSelectedItems([]);
    if (path === '/') {
      setFolderContents(fileSystemItems);
      updateWindowName('Home', <Computer fontSize={24} />);
    } else {
      const targetFolder = fileSystemItems.find(
        (item) => item.path === path && item.type === 'folder'
      );
      if (targetFolder && targetFolder.children) {
        setFolderContents(targetFolder.children);
        updateWindowName(targetFolder.name, targetFolder.icon);
        // TODO On navigation update the Windows that are open.
      }
    }
  };

  const selectItem = (id: string, multi = false) => {
    if (multi) {
      setSelectedItems((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
      );
    } else {
      setSelectedItems([id]);
    }
  };

  const setSorting = (newSortBy: SortBy, newSortOrder: SortOrder) => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
  };

  const moveItems = (itemIds: string[], targetPath: string) => {
    console.log('Moving items:', itemIds, 'to:', targetPath);
    // Implementation would update the file system state
    setDraggedItems([]);
  };

  // Get current directory items
  const getFolderItems = () => {
    // Filter items based on current path and sort them
    const items = folderContents.filter((item) => {
      if (currentPath === '/') {
        return !item.parentId; // Root level items
      }
      return item.path.startsWith(currentPath) && item.path !== currentPath;
    });

    // Sort items
    items.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'date':
          comparison = a.dateModified.getTime() - b.dateModified.getTime();
          break;
        case 'size':
          comparison = (a.size || 0) - (b.size || 0);
          break;
        case 'type':
          comparison = a.type.localeCompare(b.type);
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return items;
  };

  const contextValue = {
    fs: fileSystemItems,
    items: getFolderItems(),
    currentPath,
    selectedItems,
    viewMode,
    sortBy,
    sortOrder,
    navigateToPath,
    selectItem,
    setViewMode,
    setSorting,
    moveItems,
    draggedItems,
    setDraggedItems,
  };

  return (
    <FileSystemContext.Provider value={contextValue}>
      <Box
        className="FileManager--root"
        sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
      >
        <BreadcrumbNavigation />
        <ViewControls />

        <Box sx={{ flex: 1, display: 'flex', minHeight: 0 }}>
          <QuickAccessPanel
            collapsed={quickAccessCollapsed}
            onToggle={() => setQuickAccessCollapsed(!quickAccessCollapsed)}
          />

          <Box sx={{ flex: 2, overflow: 'auto' }}>
            <FileListView items={getFolderItems()} />
          </Box>

          <Box
            className="PreviewPanel--container"
            sx={{ flexShrink: 0, display: 'flex', minHeight: 0 }}
          >
            <PreviewPanel
              collapsed={previewCollapsed}
              onToggle={() => setPreviewCollapsed(!previewCollapsed)}
            />
          </Box>
        </Box>
      </Box>
    </FileSystemContext.Provider>
  );
};
