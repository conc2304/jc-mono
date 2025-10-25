import { ReactNode } from 'react';

export interface DesktopItemMetaData {
  id: string;
  name: string;
  icon: ReactNode;
}

export interface ItemPosition {
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
    | 'maximizing'
    | 'docking';
}

export interface QuickAccessItem {
  id: string;
  name: string;
  icon: ReactNode;
  path: string;
  type: 'folder' | 'application';
  category?: string;
}

export type ViewMode = 'list' | 'details' | 'icons' | 'cards';
export type SortBy = 'name' | 'date' | 'size' | 'type';
export type SortOrder = 'asc' | 'desc';
