import { v4 as uuidv4 } from 'uuid';
import { SportsEsports } from '@mui/icons-material';

import { DefaultTileContent, FileSystemItem } from '@jc/file-system';

import { ConnectFourFileSystemItem } from './connect-four-file-item';
import { GradientShaderScreenSaverFileSystemItem } from './gradient-shader-screen-saver-file-item';

export const MiscFileSystemItem: FileSystemItem = {
  id: uuidv4(),
  name: 'Misc',
  icon: <SportsEsports />,
  type: 'folder',
  dateModified: new Date('2025-06-15'),
  dateCreated: new Date('2025-06-15'),
  path: '/misc',
  metadata: {
    tags: ['fun', 'games'],
    favorite: false,
    description: 'Miscellaneous interactive experiences.',
  },
  children: [ConnectFourFileSystemItem, GradientShaderScreenSaverFileSystemItem],
  tileRenderer: {
    component: DefaultTileContent,
    config: {
      size: 'medium',
      color: 'secondary',
    },
  },
};
