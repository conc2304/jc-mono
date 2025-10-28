import { ScrollAwareClickConfig } from '@jc/ui-components';

import { BaseFileSystemItem } from '../../../types';

interface FileListHandlers {
  onItemClick: (item: BaseFileSystemItem, e: React.MouseEvent) => void;
  onItemDoubleClick: (
    item: BaseFileSystemItem,
    e: React.MouseEvent | React.TouchEvent
  ) => void;
  onDragStart: (item: BaseFileSystemItem) => void;
  onDragOver: (item: BaseFileSystemItem, e: React.DragEvent) => void;
  onDrop: (item: BaseFileSystemItem, e: React.DragEvent) => void;
}

export interface FileListViewProps {
  items: BaseFileSystemItem[];
  handlers: FileListHandlers;
  viewConfig?: Partial<ScrollAwareClickConfig>;
}

export interface FileListItemProps {
  item: BaseFileSystemItem;
  handlers: FileListHandlers;
  viewConfig?: Partial<ScrollAwareClickConfig>;
}
