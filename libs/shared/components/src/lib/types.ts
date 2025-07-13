import { ReactNode } from 'react';

export interface DesktopIconMetaData {
  id: string;
  name: string;
  icon: ReactNode;
}

export interface WindowMetaData {
  id: string;
  title: string;
  icon: ReactNode;
  // color: icon.color,
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  minimized: boolean;
  maximized: boolean;
  windowContent: ReactNode;
}
