import { FileSystemItem } from '@jc/file-system';
import { ThemeCustomizerPage } from '@jc/themes';
import { SettingsSuggest } from '@mui/icons-material';
import { v4 as uuidv4 } from 'uuid';

export const SettingsFileSystem: FileSystemItem<{}, {}> = {
  id: uuidv4(),
  name: 'Settings',
  type: 'file',
  icon: <SettingsSuggest fontSize="large" />,
  dateModified: new Date('2024-01-25'),
  dateCreated: new Date('2024-01-01'),
  path: '/Settings',
  permissions: { read: true, write: true, execute: true },
  metadata: { tags: ['development'], favorite: true },
  children: [],
  fileData: {},
  renderer: {
    component: ThemeCustomizerPage,
    props: {},
  },
};
