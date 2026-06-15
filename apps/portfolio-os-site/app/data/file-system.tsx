import { BaseFileSystemItem } from '@jc/file-system';

import { ProjectsFileSystemItem } from './coding-projects/projects-file-item';
import { iOSImageGalleryFileSystemItem } from './photo-gallery/iOS-Made-File-Item';
import { ResumeFileSystemItem } from './resume-file-item';
import { SculpturePortfolioFileSystemItem } from './sculpture/sculpture-file-item';
import { SettingsFileSystemItem } from './settings-file-item';
import { setFileSystemHierarchy } from './utils';
import { VJSetsPortfolioFileSystemItem } from './vj-sets/vj-sets-file-item';
import { NotFound404FileSystemItem } from './404-file-item';
import { LEDControllerFileItem } from './led-controller-file-item';
import { RebootFileSystemItem } from './reboot-file-item';
import { GamesFileSystemItem } from './games/games-file-item';

const unMappedFileSystem: BaseFileSystemItem[] = [
  ProjectsFileSystemItem,
  ResumeFileSystemItem,
  iOSImageGalleryFileSystemItem,
  SettingsFileSystemItem,
  SculpturePortfolioFileSystemItem,
  VJSetsPortfolioFileSystemItem,
  GamesFileSystemItem,
  LEDControllerFileItem,
  RebootFileSystemItem,
  NotFound404FileSystemItem,
];

export const FileSystem = setFileSystemHierarchy(unMappedFileSystem);
