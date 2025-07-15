import {
  Download,
  FileText,
  FileTextIcon,
  Folder,
  Home,
  Image,
  ImageIcon,
  Star,
} from 'lucide-react';

import { FileSystemItem, QuickAccessItem } from '../../types';

export const mockFileSystem: FileSystemItem[] = [
  {
    id: '1',
    icon: <Folder />,
    name: 'Documents',
    type: 'folder',
    dateModified: new Date('2024-01-15'),
    dateCreated: new Date('2024-01-01'),
    path: '/Documents',
    permissions: { read: true, write: true, execute: true },
    metadata: { tags: [], favorite: true },
    children: [
      {
        id: '2',
        name: 'Resume.pdf',
        icon: <FileTextIcon fontSize={36} />,
        type: 'file',
        size: 245760,
        extension: 'pdf',
        mimeType: 'application/pdf',
        dateModified: new Date('2024-01-10'),
        dateCreated: new Date('2024-01-10'),
        path: '/Documents/Resume.pdf',
        parentId: '1',
        permissions: { read: true, write: true, execute: false },
        metadata: {
          tags: ['work', 'important'],
          favorite: true,
          description: 'Professional resume',
        },
      },
    ],
  },
  {
    id: '3',
    name: 'Pictures',
    icon: <ImageIcon fontSize={36} />,
    type: 'folder',
    dateModified: new Date('2024-01-20'),
    dateCreated: new Date('2024-01-01'),
    path: '/Pictures',
    permissions: { read: true, write: true, execute: true },
    metadata: { tags: [], favorite: false },
    children: [],
  },
  {
    id: '4',
    name: 'Projects',
    type: 'folder',
    icon: <Folder />,
    dateModified: new Date('2024-01-25'),
    dateCreated: new Date('2024-01-01'),
    path: '/Projects',
    permissions: { read: true, write: true, execute: true },
    metadata: { tags: ['development'], favorite: true },
    children: [],
  },
];

export const quickAccessItems: QuickAccessItem[] = [
  {
    id: 'home',
    name: 'Home',
    icon: <Home size={16} />,
    path: '/',
    type: 'folder',
  },
  {
    id: 'documents',
    name: 'Documents',
    icon: <FileText size={16} />,
    path: '/Documents',
    type: 'folder',
  },
  {
    id: 'pictures',
    name: 'Pictures',
    icon: <Image size={16} />,
    path: '/Pictures',
    type: 'folder',
  },
  {
    id: 'downloads',
    name: 'Downloads',
    icon: <Download size={16} />,
    path: '/Downloads',
    type: 'folder',
  },
  {
    id: 'favorites',
    name: 'Favorites',
    icon: <Star size={16} />,
    path: '/Favorites',
    type: 'folder',
  },
];
