import { ComponentType, ReactNode } from 'react';

export interface DesktopIconMetaData {
  id: string;
  name: string;
  icon: ReactNode;
}

export interface IconPosition {
  x: number;
  y: number;
}

export interface WindowMetaData {
  id: string;
  title: string;
  icon: ReactNode;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  minimized: boolean;
  maximized: boolean;
  windowContent: ReactNode;
  isActive: boolean;

  // Animation Props
  isOpening?: boolean;
  isClosing?: boolean;
  animationState?:
    | 'normal'
    | 'opening'
    | 'closing'
    | 'minimizing'
    | 'maximizing';
}

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

export interface QuickAccessItem {
  id: string;
  name: string;
  icon: ReactNode;
  path: string;
  type: 'folder' | 'application';
  category?: string;
}

export type ViewMode = 'list' | 'details' | 'icons';
export type SortBy = 'name' | 'date' | 'size' | 'type';
export type SortOrder = 'asc' | 'desc';
