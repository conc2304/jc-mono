import { DesktopOS } from '@jc/desktop-OS';
import { ContactInfoWidget } from '@jc/portfolio';

import { PROJECT_NAVIGATION_GROUP } from '../data/coding-projects/project-files';
import { FileSystem } from '../data/file-system';

const DesktopSystem = () => {
  return (
    <DesktopOS
      fileSystem={FileSystem}
      navigationGroups={[PROJECT_NAVIGATION_GROUP]}
      footer={<ContactInfoWidget />}
    />
  );
};
export default DesktopSystem;
