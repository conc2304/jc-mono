import {
  atomicVisualizerProject,
  BrutalistTemplate,
  BrutalistTemplateProps,
  ProjectData,
} from '@jc/portfolio';
import { Science } from '@mui/icons-material';
import { v4 as uuidv4 } from 'uuid';
import { FileSystemItem } from '@jc/file-system';

export const atomicVisualizerFileSystemItem: FileSystemItem<
  ProjectData,
  BrutalistTemplateProps
> = {
  id: uuidv4(),
  name: 'Atomic-Visualizer.proj',
  icon: <Science fontSize="large" />,
  type: 'file',
  size: 342560, // ~335KB - substantial 3D web application
  mimeType: 'application/pdf',
  dateModified: new Date('2023-08-15'),
  dateCreated: new Date('2023-06-01'),
  path: '',
  parentId: '',
  metadata: {
    tags: [
      'school',
      'featured',
      '3d',
      'webgl',
      'react-three-fiber',
      'harvard-cs50',
    ],
    favorite: false,
    thumbnail: atomicVisualizerProject.media.hero,
    description:
      '3D WebGL periodic table explorer with animated atomic structures',
  },
  fileData: atomicVisualizerProject,
  renderer: {
    component: BrutalistTemplate,
    props: {},
  },
};
