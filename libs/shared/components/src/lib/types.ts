import { ReactNode } from 'react';

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

export interface FileSystemItem {
  // TODO - replace DesktopIcon with this
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
  parentId?: string;
  children?: FileSystemItem[];
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
