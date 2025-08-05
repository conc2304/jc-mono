import { useCallback, useContext } from 'react';

import { IconsView, ListView, DetailsView } from './views';
import { FileSystemContext, useWindowActions } from '../../context';
import { BaseFileSystemItem } from '@jc/file-system';

export const FileListView = ({ items }: { items: BaseFileSystemItem[] }) => {
  const context = useContext(FileSystemContext);
  const { openWindow } = useWindowActions();

  const handleItemClick = useCallback(
    (item: BaseFileSystemItem, event: React.MouseEvent) => {
      event.preventDefault();
      if (event.button === 2) return;
      context?.selectItem(item.id, false); // TODO handle multi select
    },
    [context]
  );

  const handleItemDoubleClick = useCallback(
    (item: BaseFileSystemItem, event: React.MouseEvent) => {
      if (event.button === 2) return;

      if (item.type === 'folder') {
        context?.navigateToPath(item.path);
      } else {
        // TODO OPEN FILE
        console.log('OPEN FILE', { item });
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
  if (context?.viewMode === 'details')
    return (
      <DetailsView
        items={items}
        onItemClick={handleItemClick}
        onItemDoubleClick={handleItemDoubleClick}
        onDragOver={handleDragOver}
        onDragStart={handleDragStart}
        onDrop={handleDrop}
      />
    );

  if (context?.viewMode === 'icons') {
    return (
      <IconsView
        items={items}
        onItemClick={handleItemClick}
        onItemDoubleClick={handleItemDoubleClick}
        onDragOver={handleDragOver}
        onDragStart={handleDragStart}
        onDrop={handleDrop}
      />
    );
  }

  return (
    <ListView
      items={items}
      onItemClick={handleItemClick}
      onItemDoubleClick={handleItemDoubleClick}
      onDragOver={handleDragOver}
      onDragStart={handleDragStart}
      onDrop={handleDrop}
    />
  );
};
