import { Folder, ListMusic } from 'lucide-react'; // TODO replace with other icon library
import { v4 as uuidv4 } from 'uuid';
import { resumeFile } from './resume-file';
import { allPortfolioProjectFiles } from './project-files';
import { setFileSystemHierarchy } from './utils';
import { BaseFileSystemItem } from '@jc/file-system';

import { SettingsFileSystem } from './settings-files';
import { iOSImageGallery } from './photo-gallery/iOS-Made-File-Item';
import { sculpturePortfolioFileSystemItem } from './sculpture/sculpture-file-item';
import { ProjectsTileContent } from '@jc/portfolio';
import { DefaultTileContent } from '@jc/ui-components';
import { vjSetsPortfolioFileSystemItem } from './vj-sets/vj-sets-file-item';

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
    metadata: { tags: [], favorite: true },
    children: [...allPortfolioProjectFiles],
    tileRenderer: {
      component: ProjectsTileContent,
      config: {
        size: 'large',
        color: 'primary',
        showLiveContent: true,
        updateInterval: 5000,
      },
    },
    tileData: allPortfolioProjectFiles.map(
      (projectData) => projectData.fileData
    ),
  },
  resumeFile,
  iOSImageGallery,
  SettingsFileSystem,
  sculpturePortfolioFileSystemItem,
  vjSetsPortfolioFileSystemItem,
];

export const FileSystem = setFileSystemHierarchy(unMappedFileSystem);
