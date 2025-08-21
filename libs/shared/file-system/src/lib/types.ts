import { ComponentType, ReactNode } from 'react';
import { ImageMediaData, TileContentProps } from '@jc/ui-components';
import { Property } from 'csstype';

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
  metadata: FileSystemMetaData;

  tileRenderer?: TileRenderer<any, any>;
  tileData?: any; // Custom data for the tile
}

export interface FileSystemMetaData {
  description?: string;
  tags: string[];
  favorite: boolean;
  thumbnail?: ImageMediaData;
  customProperties?: Record<string, any>;
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

// Generic Desktop Tile Item
export interface TileConfig {
  size: 'small' | 'medium' | 'large'; // 1x1, 1x2, 2x2
  color:
    | 'primary'
    | 'secondary'
    | 'error'
    | 'warning'
    | 'info'
    | 'success'
    | Property.BackgroundColor;
  showLiveContent?: boolean;
  updateInterval?: number; // ms for content rotation
}

export interface TileRenderer<TData = {}, TProps = {}> {
  component: React.ComponentType<TileContentProps<TData> & TProps>;
  props?: TProps;
  config: TileConfig;
}
export interface DesktopTile<TData = {}, TProps = {}> {
  tileRenderer?: TileRenderer<TData, TProps>;
  tileData?: TData;
}
