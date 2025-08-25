import { ReactNode, useCallback, useState } from 'react';
import { Box, useTheme } from '@mui/material';
import { Computer } from 'lucide-react';

import { FileSystemContext, useWindowContentActions } from '../../context';
import {
  BreadcrumbNavigation,
  FileListView,
  QuickAccessPanel,
} from '../../molecules';
import { ViewControls } from '../../molecules/file-view-controls';
import { PreviewPanel } from '../../molecules/preview-panel';
import { SortBy, SortOrder, ViewMode } from '../../types';
import { BaseFileSystemItem, useFileSystemManager } from '@jc/file-system';
import { useMediaQuery } from '@mui/system';

interface FileManagerProps {
  windowId?: string;
  initialPath: string;
  folderContents: BaseFileSystemItem[];
  fileSystemItems: BaseFileSystemItem[];
  hasQuickAccessPanel?: boolean;
  hasPreviewPanel?: boolean;
  updateWindowName: (name: string, icon: ReactNode) => void;
}

export const FileManager = ({
  windowId,
  fileSystemItems,
  initialPath,
  folderContents: folderContentsProp,
  hasQuickAccessPanel = false,
  hasPreviewPanel = true,
  updateWindowName,
}: FileManagerProps) => {
  const theme = useTheme();
  const isLg = useMediaQuery(theme.breakpoints.up('md'));
  const { getItemById } = useFileSystemManager(fileSystemItems);

  const [folderContents, setFolderContents] = useState(folderContentsProp);
  const [quickAccessCollapsed, setQuickAccessCollapsed] = useState(true);
  const [previewCollapsed, setPreviewCollapsed] = useState(!hasPreviewPanel);
  const [currentPath, setCurrentPath] = useState(initialPath);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [sortBy, setSortBy] = useState<SortBy>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [draggedItems, setDraggedItems] = useState<string[]>([]);

  const { replaceWindowContent } = useWindowContentActions();

  const navigateToPath = useCallback(
    (path: string) => {
      setCurrentPath(path);
      setSelectedItems([]);

      if (path === '/') {
        setFolderContents(fileSystemItems);
        if (windowId && replaceWindowContent) {
          replaceWindowContent(
            windowId,
            <FileManager
              windowId={windowId}
              initialPath="/"
              folderContents={fileSystemItems}
              fileSystemItems={fileSystemItems}
              hasQuickAccessPanel={hasQuickAccessPanel}
              hasPreviewPanel={hasPreviewPanel}
              updateWindowName={updateWindowName}
            />,
            'Home',
            <Computer fontSize={24} />,
            {
              addToHistory: true,
              metadata: {
                path: '/',
                type: 'folder',
              },
            }
          );
        } else {
          updateWindowName('Home', <Computer fontSize={24} />);
        }
      } else {
        const targetFolder = fileSystemItems.find(
          (item) => item.path === path && item.type === 'folder'
        );
        if (targetFolder && targetFolder.children) {
          setFolderContents(targetFolder.children);
          if (windowId && replaceWindowContent) {
            replaceWindowContent(
              windowId,
              <FileManager
                windowId={windowId}
                initialPath={path}
                folderContents={targetFolder.children}
                fileSystemItems={fileSystemItems}
                hasQuickAccessPanel={hasQuickAccessPanel}
                hasPreviewPanel={hasPreviewPanel}
                updateWindowName={updateWindowName}
              />,
              targetFolder.name,
              targetFolder.icon,
              {
                addToHistory: true,
                metadata: {
                  path: path,
                  type: 'folder',
                  folderId: targetFolder.id,
                },
              }
            );
          } else {
            updateWindowName(targetFolder.name, targetFolder.icon);
          }
        }
      }
    },
    [
      fileSystemItems,
      windowId,
      replaceWindowContent,
      updateWindowName,
      hasQuickAccessPanel,
      hasPreviewPanel,
    ]
  );

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
      // Check if items are favorites
      const aIsFavorite = a.metadata?.favorite === true;
      const bIsFavorite = b.metadata?.favorite === true;

      // If one is favorite and other is not, favorite comes first
      if (aIsFavorite && !bIsFavorite) return -1;
      if (!aIsFavorite && bIsFavorite) return 1;

      // Both are favorites or both are not favorites, sort by the selected criteria
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

  const folderItems = getFolderItems();

  const contextValue = {
    fs: fileSystemItems,
    items: folderItems,
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

  const selectedItem = getItemById(selectedItems[0]);
  return (
    <FileSystemContext.Provider value={contextValue}>
      <Box
        className="FileManager--root"
        sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
      >
        <BreadcrumbNavigation />
        <ViewControls />

        <Box sx={{ flex: 1, display: 'flex', minHeight: 0 }}>
          {hasQuickAccessPanel && isLg && (
            <QuickAccessPanel
              collapsed={quickAccessCollapsed}
              onToggle={() => setQuickAccessCollapsed(!quickAccessCollapsed)}
            />
          )}

          <Box sx={{ flex: 2, overflow: 'auto' }}>
            <FileListView items={folderItems} />
          </Box>

          {hasPreviewPanel && isLg && (
            <Box
              className="PreviewPanel--container"
              sx={{ flexShrink: 0, display: 'flex', minHeight: 0 }}
            >
              <PreviewPanel
                collapsed={previewCollapsed}
                onToggle={() => setPreviewCollapsed(!previewCollapsed)}
                selectedItem={selectedItem || null}
              />
            </Box>
          )}
        </Box>
      </Box>
    </FileSystemContext.Provider>
  );
};
