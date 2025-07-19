'use client';

import { darken, useTheme } from '@mui/material';
import { DesktopOS } from '@jc/desktop-OS';
import { FileSystemItem, GradientShader } from '@jc/ui-components';
import { Folder, FileTextIcon, ImageIcon } from 'lucide-react';

// import { ColorShader } from './webgl/shader';

const fontSize = '40px';

const mockFileSystem: FileSystemItem[] = [
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
// background: (theme) =>
//   `linear-gradient(135deg, ${theme.palette.primary.main}20, ${theme.palette.secondary.main}20)`,

export default function Index() {
  const theme = useTheme();
  return (
    <>
      <GradientShader
        key={theme.palette.primary.main}
        colors={[
          theme.palette.background.default,
          darken(theme.palette.primary[theme.palette.mode], 0.5),
          darken(theme.palette.secondary.dark, 0.5),
          theme.palette.background.default,
        ]}
        resolution={0.1}
        scrollSpeed={0.02}
        scale={0.75}
        angle={135}
        width={window.innerWidth}
        height={window.innerHeight}
        isBackground
        autoResize
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: -1,
          opacity: 0.3,
        }}
      />
      <DesktopOS fileSystem={mockFileSystem} />
    </>
  );
}
