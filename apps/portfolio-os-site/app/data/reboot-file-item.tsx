import { v4 as uuidv4 } from 'uuid';

import { FileSystemItem, DefaultTileContent } from '@jc/file-system';

import { RestartAlt } from '@mui/icons-material';

export const RebootFileSystemItem: FileSystemItem = {
  id: uuidv4(),
  name: 'Reboot',
  icon: <RestartAlt />,
  type: 'link',
  extension: 'sys',
  mimeType: 'application/x-system',
  dateModified: new Date('2025-06-15'),
  dateCreated: new Date('2025-06-15'),
  path: '',
  parentId: '',
  metadata: {
    tags: ['system'],
    favorite: false,
    description: 'Restart the boot sequence and return to the splash screen.',
    customProperties: {
      linkUrl: '/',
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
