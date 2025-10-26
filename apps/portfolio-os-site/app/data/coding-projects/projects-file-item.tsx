import { FileSystemItem } from '@jc/file-system';
import { Folder } from 'lucide-react'; // TODO replace with other icon library
import { v4 as uuidv4 } from 'uuid';

import { ProjectsTileContent } from '@jc/portfolio';
import { allPortfolioProjectFiles } from './project-files';

export const ProjectsFileSystemItem: FileSystemItem<{}, {}> = {
  id: uuidv4(),
  icon: <Folder />,
  name: 'Projects',
  type: 'folder',
  dateModified: new Date('2024-01-15'),
  dateCreated: new Date('2024-01-01'),
  path: '/Projects',
  metadata: {
    tags: [],
    favorite: true,
    thumbnail: allPortfolioProjectFiles[0].fileData?.media.hero,
    description:
      'A collection of professional and personal projects spanning from web development to creative technology.',
  },
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
  tileData: allPortfolioProjectFiles.map((projectData) => projectData.fileData),
};
