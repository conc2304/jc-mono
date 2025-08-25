import { FileSystemItem } from '@jc/file-system';
import { ThemeCustomizerPage } from '@jc/themes';
import { DefaultTileContent } from '@jc/ui-components';
import { Settings } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

export const SettingsFileSystem: FileSystemItem<{}, {}> = {
  id: uuidv4(),
  name: 'Settings',
  type: 'file',
  icon: <Settings />,
  dateModified: new Date('2024-01-25'),
  dateCreated: new Date('2024-01-01'),
  path: '/Settings',
  metadata: { tags: ['development'], favorite: false },
  children: [],
  fileData: {},
  tileRenderer: {
    component: DefaultTileContent,
    config: {
      size: 'small',
      color: 'info',
    },
  },
  renderer: {
    component: ThemeCustomizerPage,
    props: {},
  },
};
