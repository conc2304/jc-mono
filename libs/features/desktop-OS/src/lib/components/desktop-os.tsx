import { useMemo } from 'react';
import { IconPosition, WindowProvider } from '@jc/ui-components';

import { generateDefaultIconPositions } from '../utils';
import { BaseFileSystemItem, NavigationGroup } from '@jc/file-system';
import { DesktopContent } from './desktop-content';

type DesktopOSProps = {
  fileSystem?: BaseFileSystemItem[];
  navigationGroups?: NavigationGroup[];
  iconArrangement?: 'linear' | 'grid' | 'circular';
  customIconPositions?: Record<string, IconPosition>;
};

// Main component that provides the context
export const DesktopOS = ({
  fileSystem = [],
  navigationGroups = [],
  iconArrangement = 'linear',
  customIconPositions,
}: DesktopOSProps) => {
  // Generate default icon positions
  const defaultIconPositions = useMemo(() => {
    if (customIconPositions) {
      return customIconPositions;
    }
    return generateDefaultIconPositions(fileSystem, iconArrangement);
  }, [fileSystem, iconArrangement, customIconPositions]);

  return (
    <WindowProvider
      fileSystemItems={fileSystem}
      defaultIconPositions={defaultIconPositions}
      navigationGroups={navigationGroups}
    >
      <DesktopContent />
    </WindowProvider>
  );
};
