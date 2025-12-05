import { v4 as uuidv4 } from 'uuid';

import { FileSystemItem, DefaultTileContent } from '@jc/file-system';

import { LightbulbCircle } from '@mui/icons-material';

export const LEDControllerFileItem: FileSystemItem = {
  id: uuidv4(),
  name: 'LED Controller',
  icon: <LightbulbCircle />,
  type: 'link',
  extension: 'led',
  mimeType: 'application/tox',
  dateModified: new Date('2025-11-24'),
  dateCreated: new Date('2025-12-10'),
  path: '',
  parentId: '',
  metadata: {
    tags: ['fun', 'led', 'touchdesigner'],
    favorite: false,
    description:
      'UI interface to control my led lights at home through Touchdesigner.',
    // thumbnail: {
    //   relativePath: 'ui-images/resume-thumbnail.jpg',
    //   alt: 'Abstract and modern glass-effect icon representing professional experience, full-stack development, and creative technology. The image features layers of translucent geometric shapes and glowing icons related to web development and creative tech, including symbols for React, Node.js, code brackets, 3D modeling, and design tools, subtly arranged over a dark, technical background.',
    // },
    customProperties: {
      linkUrl: '/led-controller',
    },
  },
  tileRenderer: {
    component: DefaultTileContent,
    config: {
      size: 'small',
      color: 'warning',
    },
  },
};
