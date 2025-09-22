import {
  ProjectData,
  // ProjectTemplateProps,
  // ProjectTemplate,
  BrutalistTemplate,
  BrutalistTemplateProps,
} from '@jc/ui-components';
import { simplisafeJawaProject } from '@jc/portfolio';
import { Security } from '@mui/icons-material';
import { v4 as uuidv4 } from 'uuid';
import { FileSystemItem } from '@jc/file-system';

export const simplisafeJawaFileSystemItem: FileSystemItem<
  ProjectData,
  BrutalistTemplateProps
> = {
  id: uuidv4(),
  name: 'Simplisafe-Jawa.proj',
  icon: <Security fontSize="large" />,
  type: 'file',
  size: 2097152, // 2MB - comprehensive enterprise system with full-stack architecture
  mimeType: 'application/pdf',
  dateModified: new Date('2021-06-30'),
  dateCreated: new Date('2020-01-01'),
  path: '',
  parentId: '',
  metadata: {
    tags: [
      'work',
      'featured',
      'enterprise',
      'full-stack',
      'ux-research',
      'simplisafe',
      'iot',
    ],
    thumbnail: simplisafeJawaProject.media.hero,
    favorite: false,
    description:
      'SimpliSafe fulfillment system redesign - enterprise warehouse management with IoT device pairing',
  },

  fileData: simplisafeJawaProject,
  renderer: {
    component: BrutalistTemplate,
    props: {},
  },
};
