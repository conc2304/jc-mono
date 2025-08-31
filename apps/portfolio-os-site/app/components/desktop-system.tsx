import { DesktopOS } from '@jc/desktop-OS';
import { FileSystem } from '../data/file-system';
import { PROJECT_NAVIGATION_GROUP } from '../data/project-files';

const DesktopSystem = () => {
  return (
    <DesktopOS
      fileSystem={FileSystem}
      navigationGroups={[PROJECT_NAVIGATION_GROUP]}
    />
  );
};
export default DesktopSystem;
