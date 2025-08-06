import { Folder, ImageIcon } from 'lucide-react'; // TODO replace with other icon library
import { v4 as uuidv4 } from 'uuid';
import { resumeFile } from './resume-file';
import { allPortfolioProjectFiles } from './project-files';
import { setFileSystemHierarchy } from './utils';
import { SettingsSuggest } from '@mui/icons-material';
import { FileSystemItem } from '@jc/file-system';
import {
  EnhancedThemeSwitcher,
  EnhancedThemeSwitcherProps,
  EnhancedThemeSwitcherWithTheme,
} from '@jc/themes';
import { SettingsFileSystem } from './settings-files';

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
  SettingsFileSystem,
  // {
  //   id: uuidv4(),
  //   name: 'Settings',
  //   type: 'file',
  //   icon: <SettingsSuggest fontSize='large' />,
  //   dateModified: new Date('2024-01-25'),
  //   dateCreated: new Date('2024-01-01'),
  //   path: '/Settings',
  //   permissions: { read: true, write: true, execute: true },
  //   metadata: { tags: ['development'], favorite: true },
  //   children: [],
  //   renderer: {
  //     component: EnhancedThemeSwitcher
  //   }
  // },
];

export const FileSystem = setFileSystemHierarchy(unMappedFileSystem);
