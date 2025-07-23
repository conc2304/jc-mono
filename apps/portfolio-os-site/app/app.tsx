import { darken, rgbToHex, useTheme } from '@mui/material';
import { DesktopOS } from '@jc/desktop-OS';
import {
  BaseFileSystemItem,
  CursorTrail,
  CursorTrailConfig,
  GradientShader,
} from '@jc/ui-components';
import { Folder, FileTextIcon, ImageIcon } from 'lucide-react';
import { remToPixels } from '@jc/themes';

// import { ColorShader } from './webgl/shader';

const fontSize = '40px';

const mockFileSystem: BaseFileSystemItem[] = [
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

export function App() {
  const theme = useTheme();

  const bgColors = [
    theme.palette.background.default,
    rgbToHex(darken(theme.palette.primary[theme.palette.mode], 0.3)),
    rgbToHex(darken(theme.palette.secondary.dark, 0.3)),
    theme.palette.background.default,
    rgbToHex(darken(theme.palette.getInvertedMode('primary'), 0.6)),
  ];

  const key = bgColors.reduce((prev, curr) => `${prev}-${curr}`, '');
  const taskbarHeight = remToPixels(theme.mixins.taskbar.height as string);

  const cursorConfig: CursorTrailConfig = {
    floorHeight: taskbarHeight - 10,
    trailLength: 10,
    trailDecayRate: 0,
    wallBounce: 0.5,
    groundBounce: 0.3,
    returnDuration: 300,
    returnGlowColor: theme.palette.primary.main,
    cursorColor: theme.palette.primary.main,
    returnTintColor: theme.palette.primary[theme.palette.getInvertedMode()],
  };

  return (
    <>
      <CursorTrail {...cursorConfig} />
      <DesktopOS fileSystem={mockFileSystem} />
      <GradientShader
        className={key}
        key={key}
        colors={bgColors}
        resolution={0.25}
        scrollSpeed={0.04}
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
    </>
  );
}

export default App;
