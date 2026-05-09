import { ReactNode } from 'react';

import {
  BaseFileSystemItem,
  NavigationGroup,
  WindowProvider,
} from '@jc/file-system';
import { DesktopContent } from './desktop-content';

type DesktopOSProps = {
  fileSystem?: BaseFileSystemItem[];
  navigationGroups?: NavigationGroup[];
  footer?: ReactNode;
  onOpenWindow?: (fsId: string) => void;
  onReplaceWindowContent?: (
    windowId: string,
    metadata?: Record<string, unknown>
  ) => void;
  /** Rendered inside WindowProvider — use to mount context-dependent hooks. */
  sideEffects?: ReactNode;
};

export const DesktopOS = ({
  fileSystem = [],
  navigationGroups = [],
  footer,
  onOpenWindow,
  onReplaceWindowContent,
  sideEffects,
}: DesktopOSProps) => {
  return (
    <WindowProvider
      fileSystemItems={fileSystem}
      navigationGroups={navigationGroups}
      windowAnimationType="fade"
      onOpenWindow={onOpenWindow}
      onReplaceWindowContent={onReplaceWindowContent}
    >
      {sideEffects}
      <DesktopContent footer={footer} />
    </WindowProvider>
  );
};
