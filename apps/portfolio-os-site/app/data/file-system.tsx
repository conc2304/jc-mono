import { BaseFileSystemItem } from '@jc/file-system';

import { ProjectsFileSystemItem } from './coding-projects/projects-file-item';
import { iOSImageGalleryFileSystemItem } from './photo-gallery/iOS-Made-File-Item';
import { ResumeFileSystemItem } from './resume-file-item';
import { SculpturePortfolioFileSystemItem } from './sculpture/sculpture-file-item';
import { SettingsFileSystemItem } from './settings-file-item';
import { setFileSystemHierarchy } from './utils';
import { VJSetsPortfolioFileSystemItem } from './vj-sets/vj-sets-file-item';

const unMappedFileSystem: BaseFileSystemItem[] = [
  ProjectsFileSystemItem,
  ResumeFileSystemItem,
  iOSImageGalleryFileSystemItem,
  SettingsFileSystemItem,
  SculpturePortfolioFileSystemItem,
  VJSetsPortfolioFileSystemItem,
];

export const FileSystem = setFileSystemHierarchy(unMappedFileSystem);
