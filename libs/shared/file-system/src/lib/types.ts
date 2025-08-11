import { ComponentType, ReactNode } from 'react';

export interface BaseFileSystemItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  icon: ReactNode;
  size?: number;
  dateModified: Date;
  dateCreated: Date;
  extension?: string;
  mimeType?: string;
  path: string;
  parentId?: string | null;
  children?: BaseFileSystemItem[];
  permissions: {
    read: boolean;
    write: boolean;
    execute: boolean;
  };
  metadata: {
    description?: string;
    tags: string[];
    favorite: boolean;
    thumbnail?: string;
    customProperties?: Record<string, any>;
  };
}

// Navigation context interface that any file can implement
export interface NavigationInfo {
  currentIndex: number;
  totalItems: number;
  hasNext: boolean;
  hasPrevious: boolean;
  items: { id: string; name: string }[];
}
export interface NavigationContext {
  onNext?: () => void;
  onPrevious?: () => void;
  onSelectItem?: (id: string) => void;
  navigationInfo?: NavigationInfo;
}

// Renderer configuration
export interface FileRenderer<TData = {}, TProps = {}> {
  component: ComponentType<TData & TProps & NavigationContext>;
  props?: TProps;
  navigationGroup?: string; // ID of the navigation group this file belongs to
  shouldNavigate?: boolean;
}

// Generic FileSystemItem
export interface FileSystemItem<TData = {}, TProps = {}>
  extends BaseFileSystemItem {
  // File-specific data (only for files, not folders)
  fileData?: TData;

  // Renderer configuration (only for files with data)
  renderer?: FileRenderer<TData, TProps>;
}
