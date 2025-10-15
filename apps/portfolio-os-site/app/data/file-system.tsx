import { ResumeFileSystemItem } from './resume-file-item';
import { setFileSystemHierarchy } from './utils';
import { BaseFileSystemItem } from '@jc/file-system';

import { SettingsFileSystemItem } from './settings-file-item';
import { iOSImageGalleryFileSystemItem } from './photo-gallery/iOS-Made-File-Item';
import { SculpturePortfolioFileSystemItem } from './sculpture/sculpture-file-item';
import { VJSetsPortfolioFileSystemItem } from './vj-sets/vj-sets-file-item';
import { ProjectsFileSystemItem } from './coding-projects/projects-file-item';

const unMappedFileSystem: BaseFileSystemItem[] = [
  ProjectsFileSystemItem,
  ResumeFileSystemItem,
  iOSImageGalleryFileSystemItem,
  SettingsFileSystemItem,
  SculpturePortfolioFileSystemItem,
  VJSetsPortfolioFileSystemItem,
];

export const FileSystem = setFileSystemHierarchy(unMappedFileSystem);
