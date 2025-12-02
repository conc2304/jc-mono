import { DesktopOS } from '@jc/desktop-OS';
import { ContactInfoWidget } from '@jc/portfolio';

import { PROJECT_NAVIGATION_GROUP } from '../data/coding-projects/project-files';
import { FileSystem } from '../data/file-system';
import { useTheme } from '@mui/material';

const DesktopSystem = () => {
  const theme = useTheme();
  console.log(
    'DesktopOS theme:',
    theme.palette.background.paper,
    theme.palette.text.primary
  );
  return (
    <DesktopOS
      fileSystem={FileSystem}
      navigationGroups={[PROJECT_NAVIGATION_GROUP]}
      footer={<ContactInfoWidget />}
    />
  );
};
export default DesktopSystem;
