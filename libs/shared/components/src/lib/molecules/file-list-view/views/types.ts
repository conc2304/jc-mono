import { BaseFileSystemItem } from '@jc/file-system';
import { useFileSystemItem } from '../../../hooks/use-file-list-item';
import { ScrollAwareClickConfig } from '../../../hooks';

export interface FileListViewProps {
  items: BaseFileSystemItem[];
  handlers: {
    onItemClick: (item: BaseFileSystemItem, e: React.MouseEvent) => void;
    onItemDoubleClick: (
      item: BaseFileSystemItem,
      e: React.MouseEvent | React.TouchEvent
    ) => void;
    onDragStart: (item: BaseFileSystemItem) => void;
    onDragOver: (item: BaseFileSystemItem, e: React.DragEvent) => void;
    onDrop: (item: BaseFileSystemItem, e: React.DragEvent) => void;
  };
  useFileSystemItem: typeof useFileSystemItem;
  viewConfig?: Partial<ScrollAwareClickConfig>;
}
