import { BaseFileSystemItem } from '@jc/ui-components';
import { Folder, FileTextIcon, ImageIcon } from 'lucide-react'; // TODO replace with other icon library

const fontSize = '40px';

export const mockFileSystem: BaseFileSystemItem[] = [
  {
    id: '1',
    icon: <Folder fontSize={fontSize} />,
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
        icon: <FileTextIcon fontSize={fontSize} />,
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
    icon: <ImageIcon fontSize={fontSize} />,
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
    name: 'Projects And More Stuff For A Long Folder Name',
    type: 'folder',
    icon: <Folder fontSize={fontSize} />,
    dateModified: new Date('2024-01-25'),
    dateCreated: new Date('2024-01-01'),
    path: '/Projects',
    permissions: { read: true, write: true, execute: true },
    metadata: { tags: ['development'], favorite: true },
    children: [],
  },
];
