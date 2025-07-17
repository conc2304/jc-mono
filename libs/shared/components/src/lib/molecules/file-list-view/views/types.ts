import { FileSystemItem } from '../../../types';

export interface FileListViewProps {
  items: FileSystemItem[];
  onItemClick: (item: FileSystemItem, event: React.MouseEvent) => void;
  onItemDoubleClick: (item: FileSystemItem, event: React.MouseEvent) => void;
  onDragStart: (item: FileSystemItem) => void;
  onDragOver: (targetItem: FileSystemItem, e: React.DragEvent) => void;
  onDrop: (targetItem: FileSystemItem, e: React.DragEvent) => void;
}
