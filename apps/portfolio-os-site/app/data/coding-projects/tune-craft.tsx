import {
  ProjectData,
  // ProjectTemplateProps,
  // ProjectTemplate,
  BrutalistTemplate,
  BrutalistTemplateProps,
} from '@jc/ui-components';
import { tunecraftProject } from '@jc/portfolio';
import { MusicNote } from '@mui/icons-material';
import { v4 as uuidv4 } from 'uuid';
import { FileSystemItem } from '@jc/file-system';

export const tunecraftFileSystemItem: FileSystemItem<
  ProjectData,
  BrutalistTemplateProps
> = {
  id: uuidv4(),
  name: 'Tune-Craft.proj',
  icon: <MusicNote fontSize="large" />,
  type: 'file',
  size: 1048576, // 1MB - computer vision + TouchDesigner + Ableton integration project
  mimeType: 'application/pdf',
  dateModified: new Date('2023-12-15'),
  dateCreated: new Date('2023-09-01'),
  path: '',
  parentId: '',
  permissions: { read: true, write: true, execute: false },
  metadata: {
    tags: [
      'graduate',
      'featured',
      'computer-vision',
      'touchdesigner',
      'audio-visual',
      'mediapipe',
      'harvard',
    ],
    favorite: true,
    thumbnail: tunecraftProject.media.thumbnail,

    description:
      '6D object tracking for real-time music control - computer vision meets interactive audio',
  },
  fileData: tunecraftProject,
  renderer: {
    component: BrutalistTemplate,
    props: {},
  },
};
