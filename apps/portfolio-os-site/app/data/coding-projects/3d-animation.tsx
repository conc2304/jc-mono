import { MdMovie } from 'react-icons/md';
import { v4 as uuidv4 } from 'uuid';

import { FileSystemItem } from '@jc/file-system';
import {
  BrutalistTemplate,
  BrutalistTemplateProps,
  dgmdE45AnimationProject,
  ProjectData,
} from '@jc/portfolio';

export const dgmdE45AnimationFileSystemItem: FileSystemItem<
  ProjectData,
  BrutalistTemplateProps
> = {
  id: uuidv4(),
  name: '3D-Animation.proj',
  icon: <MdMovie fontSize="large" />,
  type: 'file',
  size: 2458624, // ~2.35MB - multiple video files and rendered animation sequences
  mimeType: 'application/x-maya-project',
  dateModified: new Date('2023-05-13'), // End of course
  dateCreated: new Date('2023-01-25'), // Start of course
  path: '',
  parentId: '',
  metadata: {
    tags: [
      'school',
      'featured',
      '3d-animation',
      '3d-modeling',
      'character-animation',
      'rendering',
      'maya',
      'arnold',
      'harvard',
    ],
    favorite: false,
    thumbnail: dgmdE45AnimationProject.media.hero,
    description:
      'Comprehensive 3D animation coursework from Harvard Extension School featuring character performance animation, modeling, texturing, rigging, and rendering',
  },
  fileData: dgmdE45AnimationProject,
  renderer: {
    component: BrutalistTemplate,
    props: {},
  },
};
