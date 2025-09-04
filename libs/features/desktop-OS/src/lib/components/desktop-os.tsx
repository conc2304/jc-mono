import { ReactNode, useMemo } from 'react';
import { ItemPosition, WindowProvider } from '@jc/ui-components';

import { generateDefaultDesktopItemPositions } from '../utils';
import { BaseFileSystemItem, NavigationGroup } from '@jc/file-system';
import { DesktopContent } from './desktop-content';

type DesktopOSProps = {
  fileSystem?: BaseFileSystemItem[];
  navigationGroups?: NavigationGroup[];
  iconArrangement?: 'linear' | 'grid' | 'circular';
  customDesktopItemPositions?: Record<string, ItemPosition>;
  footer?: ReactNode;
};

// Main component that provides the context
export const DesktopOS = ({
  fileSystem = [],
  navigationGroups = [],
  iconArrangement = 'linear',
  customDesktopItemPositions,
  footer,
}: DesktopOSProps) => {
  // Generate default icon positions
  const defaultDesktopItemPositions = useMemo(() => {
    if (customDesktopItemPositions) {
      return customDesktopItemPositions;
    }
    return generateDefaultDesktopItemPositions(fileSystem, iconArrangement);
  }, [fileSystem, iconArrangement, customDesktopItemPositions]);

  console.log('DesktopOS: About to render WindowProvider');

  return (
    <WindowProvider
      fileSystemItems={fileSystem}
      defaultDesktopItemPositions={defaultDesktopItemPositions}
      navigationGroups={navigationGroups}
    >
      {/* {console.log('DesktopOS: WindowProvider children rendering')} */}

      <DesktopContent footer={footer} />
    </WindowProvider>
  );
};
