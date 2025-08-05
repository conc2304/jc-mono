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

// Renderer configuration
export interface FileRenderer<TData = {}, TProps = {}> {
  component: ComponentType<TData & TProps>;
  props?: TProps;
}

// Generic FileSystemItem
export interface FileSystemItem<TData = {}, TProps = {}>
  extends BaseFileSystemItem {
  // File-specific data (only for files, not folders)
  fileData?: TData;

  // Renderer configuration (only for files with data)
  renderer?: FileRenderer<TData, TProps>;
}
