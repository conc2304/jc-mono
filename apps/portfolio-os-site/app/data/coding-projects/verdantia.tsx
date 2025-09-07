import {
  ProjectData,
  // ProjectTemplateProps,
  // ProjectTemplate,
  BrutalistTemplate,
  BrutalistTemplateProps,
} from '@jc/ui-components';
import { verdantiaProject } from '@jc/portfolio';
import { Compost } from '@mui/icons-material';
import { v4 as uuidv4 } from 'uuid';
import { FileSystemItem } from '@jc/file-system';

export const verdantiaFileSystemItem: FileSystemItem<
  ProjectData,
  BrutalistTemplateProps
> = {
  id: uuidv4(),
  name: 'Verdantia.proj',
  icon: <Compost fontSize="large" />,
  type: 'file',
  size: 2621440, // ~2.5MB - comprehensive Unity game with calculus, museum installation, and educational systems
  mimeType: 'application/pdf',
  dateModified: new Date('2024-05-15'),
  dateCreated: new Date('2023-09-01'),
  path: '',
  parentId: '',
  metadata: {
    tags: [
      'graduate',
      'featured',
      'unity',
      'environmental',
      'calculus',
      'museum',
      'capstone',
      'harvard',
    ],
    favorite: true,
    thumbnail: verdantiaProject.media.thumbnail,
    description:
      'Unity city builder museum installation with real-time heat equation simulation and environmental education',
  },
  fileData: verdantiaProject,
  renderer: {
    component: BrutalistTemplate,
    props: {},
  },
};
