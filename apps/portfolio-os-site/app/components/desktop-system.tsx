import { ReactNode } from 'react';
import { DesktopOS } from '@jc/desktop-OS';
import { ContactInfoWidget } from '@jc/portfolio';

import { PROJECT_NAVIGATION_GROUP } from '../data/coding-projects/project-files';
import { FileSystem } from '../data/file-system';

type DesktopSystemProps = {
  onOpenWindow?: (fsId: string) => void;
  onReplaceWindowContent?: (
    windowId: string,
    metadata?: Record<string, unknown>
  ) => void;
  sideEffects?: ReactNode;
};

const DesktopSystem = ({
  onOpenWindow,
  onReplaceWindowContent,
  sideEffects,
}: DesktopSystemProps) => {
  return (
    <DesktopOS
      fileSystem={FileSystem}
      navigationGroups={[PROJECT_NAVIGATION_GROUP]}
      footer={<ContactInfoWidget />}
      onOpenWindow={onOpenWindow}
      onReplaceWindowContent={onReplaceWindowContent}
      sideEffects={sideEffects}
    />
  );
};
export default DesktopSystem;
