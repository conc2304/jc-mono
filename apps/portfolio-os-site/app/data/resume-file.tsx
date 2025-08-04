import {
  FileSystemItem,
  Resume,
  ResumeTemplate,
  ResumeComponentProps,
} from '@jc/ui-components';
import { ResumeData } from '@jc/portfolio';
import { FileTextIcon } from 'lucide-react'; // TODO replace with other icon library
import { v4 as uuidv4 } from 'uuid';

export const resumeFile: FileSystemItem<Resume, ResumeComponentProps> = {
  id: uuidv4(),
  name: 'Resume.pdf',
  icon: <FileTextIcon />,
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
