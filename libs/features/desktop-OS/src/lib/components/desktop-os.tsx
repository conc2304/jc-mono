import { ReactNode } from 'react';
import { WindowProvider } from '@jc/ui-components';

import { BaseFileSystemItem, NavigationGroup } from '@jc/file-system';
import { DesktopContent } from './desktop-content';

type DesktopOSProps = {
  fileSystem?: BaseFileSystemItem[];
  navigationGroups?: NavigationGroup[];
  footer?: ReactNode;
};

// Main component that provides the context
export const DesktopOS = ({
  fileSystem = [],
  navigationGroups = [],
  footer,
}: DesktopOSProps) => {

  return (
    <WindowProvider
      fileSystemItems={fileSystem}
      navigationGroups={navigationGroups}
      windowAnimationType="fade"
    >
      <DesktopContent footer={footer} />
    </WindowProvider>
  );
};
