import {
  ProjectData,
  // ProjectTemplateProps,
  // ProjectTemplate,
  BrutalistTemplate,
  BrutalistTemplateProps,
} from '@jc/ui-components';
import { lightformWebControllerProject } from '@jc/portfolio';
import { MovieFilter } from '@mui/icons-material';
import { v4 as uuidv4 } from 'uuid';
import { FileSystemItem } from '@jc/file-system';

export const lightformWebControllerFileSystemItem: FileSystemItem<
  ProjectData,
  BrutalistTemplateProps
> = {
  id: uuidv4(),
  name: 'Lightform-Controller.proj',
  icon: <MovieFilter fontSize="large" />,
  type: 'file',
  size: 1835008, // ~1.75MB - PWA with hardware integration, multiple apps, and creative coding
  mimeType: 'application/pdf',
  dateModified: new Date('2021-06-30'),
  dateCreated: new Date('2020-08-01'),
  path: '',
  parentId: '',
  permissions: { read: true, write: true, execute: false },
  metadata: {
    tags: [
      'work',
      'featured',
      'pwa',
      'hardware-integration',
      'projection-mapping',
      'lightform',
      'creative-coding',
    ],
    favorite: true,
    description:
      'PWA projection mapping controller with FTUX - AR hardware interface and creative coding',
  },
  fileData: lightformWebControllerProject,
  renderer: {
    component: BrutalistTemplate,
    props: {},
    navigationGroup: 'projects', // This makes it part of the projects navigation group
    shouldNavigate: true,
  },
};
