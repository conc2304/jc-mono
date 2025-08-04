import { FileSystemItem } from '@jc/ui-components';
import { Folder, ImageIcon } from 'lucide-react'; // TODO replace with other icon library
import { v4 as uuidv4 } from 'uuid';
import { resumeFile } from './resume-file';
import { allPortfolioProjectFiles } from './project-files';
import { setFileSystemHierarchy } from './utils';

const fontSize = '80px';

const unMappedFileSystem: FileSystemItem[] = [
  {
    id: uuidv4(),
    icon: <Folder fontSize={fontSize} />,
    name: 'Documents',
    type: 'folder',
    dateModified: new Date('2024-01-15'),
    dateCreated: new Date('2024-01-01'),
    path: '/Documents',
    permissions: { read: true, write: true, execute: true },
    metadata: { tags: [], favorite: true },
    children: [resumeFile, ...allPortfolioProjectFiles],
  },
  {
    id: uuidv4(),
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
    id: uuidv4(),
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

export const FileSystem = setFileSystemHierarchy(unMappedFileSystem);
