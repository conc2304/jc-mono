import { v4 as uuidv4 } from 'uuid';
import { Wallpaper } from '@mui/icons-material';

import { DefaultTileContent, FileSystemItem } from '@jc/file-system';

import { GradientShaderScreenSaverThemed } from '../../components/misc/gradient-shader-screen-saver-themed';

export const GradientShaderScreenSaverFileSystemItem: FileSystemItem = {
  id: uuidv4(),
  name: 'Gradient Screen Saver',
  icon: <Wallpaper />,
  type: 'file',
  size: 1048576,
  extension: 'scr',
  mimeType: 'application/x-screensaver',
  dateModified: new Date('2025-06-16'),
  dateCreated: new Date('2025-06-16'),
  path: '',
  parentId: '',
  metadata: {
    tags: ['fun', 'visual', 'screensaver', 'gradient'],
    favorite: false,
    description:
      'Procedural gradient screen saver with Perlin wander, DVD bounce, and mirrored displacement.',
  },
  fileData: {},
  tileRenderer: {
    component: DefaultTileContent,
    config: {
      size: 'small',
      color: 'info',
    },
  },
  renderer: {
    component: GradientShaderScreenSaverThemed,
    props: {},
  },
};
