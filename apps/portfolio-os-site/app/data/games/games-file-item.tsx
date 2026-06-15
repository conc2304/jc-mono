import { v4 as uuidv4 } from 'uuid';
import { SportsEsports } from '@mui/icons-material';

import { DefaultTileContent, FileSystemItem } from '@jc/file-system';

import { ConnectFourFileSystemItem } from './connect-four-file-item';

export const GamesFileSystemItem: FileSystemItem = {
  id: uuidv4(),
  name: 'Games',
  icon: <SportsEsports />,
  type: 'folder',
  dateModified: new Date('2025-06-15'),
  dateCreated: new Date('2025-06-15'),
  path: '/Games',
  metadata: {
    tags: ['fun', 'games'],
    favorite: false,
    description: 'Playable games and interactive experiences.',
  },
  children: [ConnectFourFileSystemItem],
  tileRenderer: {
    component: DefaultTileContent,
    config: {
      size: 'medium',
      color: 'primary',
    },
  },
};
