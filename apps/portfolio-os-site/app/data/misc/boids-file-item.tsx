import { v4 as uuidv4 } from 'uuid';
import { ThreeDRotation } from '@mui/icons-material';

import { DefaultTileContent, FileSystemItem } from '@jc/file-system';

import { BoidsThemed } from '../../components/misc/boids-themed';

export const BoidsFileSystemItem: FileSystemItem = {
  id: uuidv4(),
  name: '3D Boids',
  icon: <ThreeDRotation />,
  type: 'file',
  size: 1048576,
  extension: 'sim',
  mimeType: 'application/x-simulation',
  dateModified: new Date('2025-06-18'),
  dateCreated: new Date('2025-06-18'),
  path: '',
  parentId: '',
  metadata: {
    tags: ['fun', 'visual', 'threejs', 'simulation'],
    favorite: false,
    description:
      'Three.js flocking simulation with alignment, separation, and noise-driven attractors.',
  },
  fileData: {},
  tileRenderer: {
    component: DefaultTileContent,
    config: {
      size: 'small',
      color: 'warning',
    },
  },
  renderer: {
    component: BoidsThemed,
    props: {},
  },
};
