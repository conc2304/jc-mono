import { v4 as uuidv4 } from 'uuid';

import { FileSystemItem, DefaultTileContent } from '@jc/file-system';

import { ErrorOutline } from '@mui/icons-material';

export const NotFound404FileSystemItem: FileSystemItem = {
  id: uuidv4(),
  name: '404',
  icon: <ErrorOutline />,
  type: 'link',
  extension: 'err',
  mimeType: 'application/x-error',
  dateModified: new Date('2025-06-15'),
  dateCreated: new Date('2025-06-15'),
  path: '',
  parentId: '',
  metadata: {
    tags: ['system'],
    favorite: false,
    description: 'Navigate to the page not found experience.',
    customProperties: {
      linkUrl: '/nope',
    },
  },
  tileRenderer: {
    component: DefaultTileContent,
    config: {
      size: 'small',
      color: 'error',
    },
  },
};
