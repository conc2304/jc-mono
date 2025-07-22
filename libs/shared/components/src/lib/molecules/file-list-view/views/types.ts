import { BaseFileSystemItem } from '../../../types';

export interface FileListViewProps {
  items: BaseFileSystemItem[];
  onItemClick: (item: BaseFileSystemItem, event: React.MouseEvent) => void;
  onItemDoubleClick: (
    item: BaseFileSystemItem,
    event: React.MouseEvent
  ) => void;
  onDragStart: (item: BaseFileSystemItem) => void;
  onDragOver: (targetItem: BaseFileSystemItem, e: React.DragEvent) => void;
  onDrop: (targetItem: BaseFileSystemItem, e: React.DragEvent) => void;
}
