import React, { useCallback, useContext, useMemo } from 'react';

import { IconsView, ListView, DetailsView } from './views';
import { FileSystemContext, useWindowActions } from '../../context';
import { BaseFileSystemItem } from '@jc/file-system';
import { useFileSystemItem } from '../../hooks/use-file-list-item';

export const FileListView = ({ items }: { items: BaseFileSystemItem[] }) => {
  const context = useContext(FileSystemContext);
  const { openWindow } = useWindowActions();

  // Your existing handlers remain the same
  const handleItemClick = useCallback(
    (item: BaseFileSystemItem, event: React.MouseEvent) => {
      event.preventDefault();
      if (event.button === 2) return;
      context?.selectItem(item.id, false); // TODO handle multi select
    },
    [context]
  );

  const handleItemDoubleClick = useCallback(
    (item: BaseFileSystemItem, event: React.MouseEvent | React.TouchEvent) => {
      if ('button' in event && event.button === 2) return;

      if (item.type === 'folder') {
        context?.navigateToPath(item.path);
      } else {
        openWindow(item.id);
      }
    },
    [context]
  );

  const handleDragStart = useCallback(
    (item: BaseFileSystemItem) => {
      context?.setDraggedItems([item.id]);
    },
    [context]
  );

  const handleDragOver = useCallback(
    (targetItem: BaseFileSystemItem, e: React.DragEvent) => {
      e.preventDefault();
      if (e.button === 2) return; // ignore right click
      // TODO
    },
    []
  );

  const handleDrop = useCallback(
    (targetItem: BaseFileSystemItem, e: React.DragEvent) => {
      e.preventDefault();
      if (e.button === 2) return; // ignore right click
      if (targetItem.type === 'folder' && context?.draggedItems) {
        context.moveItems(context.draggedItems, targetItem.path);
      }
    },
    [context]
  );

  // Create handlers object for the hook
  const handlers = useMemo(
    () => ({
      onItemClick: handleItemClick,
      onItemDoubleClick: handleItemDoubleClick,
      onDragStart: handleDragStart,
      onDragOver: handleDragOver,
      onDrop: handleDrop,
    }),
    [
      handleItemClick,
      handleItemDoubleClick,
      handleDragStart,
      handleDragOver,
      handleDrop,
    ]
  );

  if (context?.viewMode === 'details') {
    return (
      <DetailsView
        items={items}
        handlers={handlers} // Pass handlers object instead of individual props
        useFileSystemItem={useFileSystemItem} // Pass the hook
        viewConfig={{ touchAction: 'pan-y', threshold: 12 }} // Table-specific config
      />
    );
  }

  if (context?.viewMode === 'icons') {
    return (
      <IconsView
        items={items}
        handlers={handlers}
        useFileSystemItem={useFileSystemItem}
        viewConfig={{ touchAction: 'manipulation', threshold: 8 }} // Grid-specific config
      />
    );
  }

  return (
    <ListView
      items={items}
      handlers={handlers}
      useFileSystemItem={useFileSystemItem}
      viewConfig={{ touchAction: 'pan-y', threshold: 10 }} // List-specific config
    />
  );
};
