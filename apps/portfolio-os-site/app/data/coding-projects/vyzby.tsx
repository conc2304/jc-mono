import {
  ProjectData,
  // ProjectTemplateProps,
  // ProjectTemplate,
  BrutalistTemplate,
  BrutalistTemplateProps,
} from '@jc/ui-components';
import { vyzbyProject } from '@jc/portfolio';
import { Tune } from '@mui/icons-material';
import { v4 as uuidv4 } from 'uuid';
import { FileSystemItem } from '@jc/file-system';

export const vyzbyFileSystemItem: FileSystemItem<
  ProjectData,
  BrutalistTemplateProps
> = {
  id: uuidv4(),
  name: 'VYZBY.proj',
  icon: <Tune fontSize="large" />,
  type: 'file',
  size: 1310720, // ~1.25MB - Vue.js framework with p5.js integration, API architecture, and multi-modal interaction
  mimeType: 'application/pdf',
  dateModified: new Date('2024-01-30'),
  dateCreated: new Date('2021-03-01'),
  path: '',
  parentId: '',
  permissions: { read: true, write: true, execute: false },
  metadata: {
    tags: [
      'personal',
      'featured',
      'framework',
      'creative-coding',
      'vue',
      'p5js',
      'developer-tools',
    ],
    favorite: true,
    thumbnail: vyzbyProject.media.thumbnail,
    description:
      'Interactive audio visualizer framework - real-time parameter control for creative coding workflows',
  },
  fileData: vyzbyProject,
  renderer: {
    component: BrutalistTemplate,
    props: {},
  },
};
