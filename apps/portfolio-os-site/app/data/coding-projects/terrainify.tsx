import {
  ProjectData,
  // ProjectTemplateProps,
  // ProjectTemplate,
  BrutalistTemplate,
  BrutalistTemplateProps,
} from '@jc/ui-components';
import { terrainifyProject } from '@jc/portfolio';
import { Terrain } from '@mui/icons-material';
import { v4 as uuidv4 } from 'uuid';
import { FileSystemItem } from '@jc/file-system';

export const terrainifyFileSystemItem: FileSystemItem<
  ProjectData,
  BrutalistTemplateProps
> = {
  id: uuidv4(),
  name: 'Terrainify.proj',
  icon: <Terrain fontSize="large" />,
  type: 'file',
  size: 786432, // ~768KB - Maya plugin with procedural generation and BPM systems
  mimeType: 'application/pdf',
  dateModified: new Date('2024-01-15'),
  dateCreated: new Date('2023-03-01'),
  path: '',
  parentId: '',
  permissions: { read: true, write: true, execute: false },
  metadata: {
    tags: [
      'personal',
      'featured',
      'maya-plugin',
      'procedural',
      'audio-visual',
      'creative-coding',
      'python',
    ],
    favorite: true,
    description:
      'Maya Python plugin for procedural terrain with BPM-synchronized animation and music visualization',
  },
  fileData: terrainifyProject,
  renderer: {
    component: BrutalistTemplate,
    props: {},
  },
};
