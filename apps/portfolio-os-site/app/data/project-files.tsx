import {
  ProjectData,
  // ProjectTemplateProps,
  // ProjectTemplate,
  BrutalistTemplateProps,
} from '@jc/ui-components';

import { FileSystemItem } from '@jc/file-system';
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
];
