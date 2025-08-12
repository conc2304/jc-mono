import {
  ProjectData,
  // ProjectTemplateProps,
  // ProjectTemplate,
  BrutalistTemplate,
  BrutalistTemplateProps,
} from '@jc/ui-components';
import { gravityScavengerProject } from '@jc/portfolio';
import { RocketLaunch } from '@mui/icons-material';
import { v4 as uuidv4 } from 'uuid';
import { FileSystemItem } from '@jc/file-system';

export const gravityScavengerFileSystemItem: FileSystemItem<
  ProjectData,
  BrutalistTemplateProps
> = {
  id: uuidv4(),
  name: 'Gravity-Scavenger.proj',
  icon: <RocketLaunch fontSize="large" />,
  type: 'file',
  size: 1572864, // ~1.5MB - comprehensive Unity game with physics, AI, and procedural systems
  mimeType: 'application/pdf',
  dateModified: new Date('2024-05-15'),
  dateCreated: new Date('2024-01-15'),
  path: '',
  parentId: '',
  permissions: { read: true, write: true, execute: false },
  metadata: {
    tags: [
      'school',
      'featured',
      'unity',
      'game-dev',
      'physics',
      'procedural',
      'harvard-gd50',
    ],
    favorite: true,
    thumbnail: gravityScavengerProject.media.thumbnail,

    description:
      'Physics-based Unity space game with procedural generation and real-time gravity simulation',
  },
  fileData: gravityScavengerProject,
  renderer: {
    component: BrutalistTemplate,
    props: {},
  },
};
