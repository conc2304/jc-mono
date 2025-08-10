import { Folder, ImageIcon } from 'lucide-react'; // TODO replace with other icon library
import { v4 as uuidv4 } from 'uuid';
import { resumeFile } from './resume-file';
import { allPortfolioProjectFiles } from './project-files';
import { setFileSystemHierarchy } from './utils';
import { BaseFileSystemItem } from '@jc/file-system';

import { SettingsFileSystem } from './settings-files';

const fontSize = '80px';

const unMappedFileSystem: BaseFileSystemItem[] = [
  {
    id: uuidv4(),
    icon: <Folder fontSize={fontSize} />,
    name: 'Projects',
    type: 'folder',
    dateModified: new Date('2024-01-15'),
    dateCreated: new Date('2024-01-01'),
    path: '/Projects',
    permissions: { read: true, write: true, execute: true },
    metadata: { tags: [], favorite: true },
    children: [...allPortfolioProjectFiles],
  },
  resumeFile,
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
  SettingsFileSystem,
];

export const FileSystem = setFileSystemHierarchy(unMappedFileSystem);
