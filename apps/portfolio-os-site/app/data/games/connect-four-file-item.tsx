import { v4 as uuidv4 } from 'uuid';
import { SportsEsports } from '@mui/icons-material';

import { DefaultTileContent, FileSystemItem } from '@jc/file-system';

import { ConnectFourThemed } from '../../components/games/connect-four-themed';

export const ConnectFourFileSystemItem: FileSystemItem = {
  id: uuidv4(),
  name: 'Connect Four',
  icon: <SportsEsports />,
  type: 'file',
  size: 524288,
  extension: 'c4',
  mimeType: 'application/x-game',
  dateModified: new Date('2025-06-15'),
  dateCreated: new Date('2025-06-15'),
  path: '',
  parentId: '',
  metadata: {
    tags: ['fun', 'games', 'connect-four'],
    favorite: false,
    description:
      'Classic Connect Four with human vs human or computer opponents.',
  },
  fileData: {},
  tileRenderer: {
    component: DefaultTileContent,
    config: {
      size: 'small',
      color: 'primary',
    },
  },
  renderer: {
    component: ConnectFourThemed,
    props: {},
  },
};
