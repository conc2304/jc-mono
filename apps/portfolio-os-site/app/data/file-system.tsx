import {
  FileSystemItem,
  Resume,
  ResumeTemplate,
  ResumeComponentProps,
  ProjectData,
  ProjectTemplateProps,
  ProjectTemplate,
  BrutalistTemplate,
  BrutalistTemplateProps,
} from '@jc/ui-components';
import { lightformWebControllerProject, ResumeData } from '@jc/portfolio';
import { Folder, FileTextIcon, ImageIcon } from 'lucide-react'; // TODO replace with other icon library
import { ImportantDevices } from '@mui/icons-material';
import { v4 as uuidv4 } from 'uuid';

const fontSize = '80px';

const resumeFile: FileSystemItem<Resume, ResumeComponentProps> = {
  id: uuidv4(),
  name: 'Resume.pdf',
  icon: <FileTextIcon fontSize={fontSize} />,
  type: 'file',
  size: 245760,
  extension: 'pdf',
  mimeType: 'application/pdf',
  dateModified: new Date('2024-01-10'),
  dateCreated: new Date('2024-01-10'),
  path: '/Documents/Resume.pdf',
  parentId: '1',
  permissions: { read: true, write: true, execute: false },
  metadata: {
    tags: ['work', 'important'],
    favorite: true,
    description: 'Professional resume',
  },
  fileData: ResumeData,
  renderer: {
    component: ResumeTemplate,
    props: {
      variant: 'sm',
    },
  },
};

// const lightformProject: FileSystemItem<ProjectData, ProjectTemplateProps> = {
const lightformProject: FileSystemItem<ProjectData, BrutalistTemplateProps> = {
  id: uuidv4(),
  name: 'Lightform.proj',
  icon: <ImportantDevices fontSize="large" />,
  type: 'file',
  size: 245760, // TODO
  mimeType: 'application/pdf',
  dateModified: new Date('2024-01-10'),
  dateCreated: new Date('2024-01-10'),
  path: '/Documents/Lightform.proj',
  parentId: '1',
  permissions: { read: true, write: true, execute: false },
  metadata: {
    tags: ['work', 'important'],
    favorite: true,
    description: 'Professional resume',
  },
  fileData: lightformWebControllerProject,
  renderer: {
    component: BrutalistTemplate,
    props: {
      hasNavigation: false,
    },
  },
};

export const mockFileSystem: FileSystemItem[] = [
  {
    id: '1',
    icon: <Folder fontSize={fontSize} />,
    name: 'Documents',
    type: 'folder',
    dateModified: new Date('2024-01-15'),
    dateCreated: new Date('2024-01-01'),
    path: '/Documents',
    permissions: { read: true, write: true, execute: true },
    metadata: { tags: [], favorite: true },
    children: [resumeFile, lightformProject],
  },
  {
    id: '3',
    name: 'Pictures',
    icon: <ImageIcon fontSize={fontSize} />,
    type: 'folder',
    dateModified: new Date('2024-01-20'),
    dateCreated: new Date('2024-01-01'),
    path: '/Pictures',
    permissions: { read: true, write: true, execute: true },
    metadata: { tags: [], favorite: false },
    children: [],
  },
  {
    id: '4',
    name: 'Projects And More Stuff For A Long Folder Name',
    type: 'folder',
    icon: <Folder fontSize={fontSize} />,
    dateModified: new Date('2024-01-25'),
    dateCreated: new Date('2024-01-01'),
    path: '/Projects',
    permissions: { read: true, write: true, execute: true },
    metadata: { tags: ['development'], favorite: true },
    children: [],
  },
];
