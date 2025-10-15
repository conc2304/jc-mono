import { createNavigationGroup, FileSystemItem } from '@jc/file-system';
import {
  atomicVisualizerFileSystemItem,
  climateDataVizFileSystemItem,
  gravityScavengerFileSystemItem,
  lightformWebControllerFileSystemItem,
  simplisafeJawaFileSystemItem,
  terrainifyFileSystemItem,
  tunecraftFileSystemItem,
  verdantiaFileSystemItem,
  vyzbyFileSystemItem,
} from './coding-projects';
import { NAVIGATION_GROUPS } from './constants';
import {
  BrutalistTemplateProps,
  ProjectData,
  BrutalistTemplate,
} from '@jc/portfolio';

export const allPortfolioProjectFiles: FileSystemItem<
  ProjectData,
  BrutalistTemplateProps
>[] = [
  lightformWebControllerFileSystemItem,
  climateDataVizFileSystemItem,
  gravityScavengerFileSystemItem,
  verdantiaFileSystemItem,
  tunecraftFileSystemItem,
  vyzbyFileSystemItem,
  atomicVisualizerFileSystemItem,
  terrainifyFileSystemItem,
  simplisafeJawaFileSystemItem,
].map(
  (projectFileItem): FileSystemItem<ProjectData, BrutalistTemplateProps> => ({
    ...projectFileItem,

    renderer: projectFileItem.renderer
      ? {
          ...projectFileItem.renderer,
          navigationGroup: NAVIGATION_GROUPS.Projects,
          shouldNavigate: true,
        }
      : undefined,
  })
);

export const PROJECT_NAVIGATION_GROUP = createNavigationGroup(
  NAVIGATION_GROUPS.Projects,
  'Portfolio Projects',
  (item) => item.name.endsWith('.proj') && item.type === 'file',
  {
    sortBy: (a, b) => {
      // Sort by favorite first, then by date modified
      const aFavorite = a.metadata.favorite ? 1 : 0;
      const bFavorite = b.metadata.favorite ? 1 : 0;

      if (aFavorite !== bFavorite) {
        return bFavorite - aFavorite; // Favorites first
      }

      return b.dateModified.getTime() - a.dateModified.getTime(); // Newest first
    },
  }
);
