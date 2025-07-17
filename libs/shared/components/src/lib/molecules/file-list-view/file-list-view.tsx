import { useCallback, useContext } from 'react';

import { IconsView, ListView, DetailsView } from './views';
import { FileSystemContext } from '../../context';
import { FileSystemItem } from '../../types';

export const FileListView = ({ items }: { items: FileSystemItem[] }) => {
  const context = useContext(FileSystemContext);

  const handleItemClick = useCallback(
    (item: FileSystemItem, event: React.MouseEvent) => {
      event.preventDefault();
      if (event.button === 2) return;
      context?.selectItem(item.id, true);
    },
    [context]
  );

  const handleItemDoubleClick = useCallback(
    (item: FileSystemItem, event: React.MouseEvent) => {
      if (event.button === 2) return;

      if (item.type === 'folder') {
        context?.navigateToPath(item.path);
      } else {
        // TODO OPEN FILE
        console.log('OPEN FILE', { item });
      }
    },
    [context]
  );

  const handleDragStart = useCallback(
    (item: FileSystemItem) => {
      context?.setDraggedItems([item.id]);
    },
    [context]
  );
  const handleDragOver = useCallback(
    (targetItem: FileSystemItem, e: React.DragEvent) => {
      e.preventDefault();
      if (e.button === 2) return; // ignore right click
      // TODO
    },
    []
  );
  const handleDrop = useCallback(
    (targetItem: FileSystemItem, e: React.DragEvent) => {
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
