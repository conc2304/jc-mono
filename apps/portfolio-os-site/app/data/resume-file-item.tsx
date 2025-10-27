import { FileTextIcon } from 'lucide-react'; // TODO replace with other icon library
import { v4 as uuidv4 } from 'uuid';

import { FileSystemItem, DefaultTileContent } from '@jc/file-system';
import {
  ResumeComponentProps,
  ResumeData,
  ResumeFields,
  ResumeTemplate,
} from '@jc/portfolio';

export const ResumeFileSystemItem: FileSystemItem<
  ResumeFields,
  ResumeComponentProps
> = {
  id: uuidv4(),
  name: 'Resume',
  icon: <FileTextIcon />,
  type: 'file',
  size: 245760,
  extension: 'pdf',
  mimeType: 'application/pdf',
  dateModified: new Date('2024-01-10'),
  dateCreated: new Date('2024-01-10'),
  path: '',
  parentId: '',
  metadata: {
    tags: ['work', 'important'],
    favorite: true,
    description: 'Professional resume',
    thumbnail: {
      relativePath: 'ui-images/resume-thumbnail.jpg',
      alt: 'Abstract and modern glass-effect icon representing professional experience, full-stack development, and creative technology. The image features layers of translucent geometric shapes and glowing icons related to web development and creative tech, including symbols for React, Node.js, code brackets, 3D modeling, and design tools, subtly arranged over a dark, technical background.',
    },
  },
  tileRenderer: {
    component: DefaultTileContent,
    config: {
      size: 'small',
      color: 'secondary',
    },
  },
  fileData: ResumeData,
  renderer: {
    component: ResumeTemplate,
    props: {
      variant: 'sm',
    },
  },
};
