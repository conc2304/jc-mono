import { PaletteIcon } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

import { FileSystemItem, DefaultTileContent } from '@jc/file-system';
import { ThemeCustomizerPage } from '@jc/theme-components';

export const SettingsFileSystemItem: FileSystemItem<object, object> = {
  id: uuidv4(),
  name: 'Theme Picker',
  type: 'Site Color Themes',
  icon: <PaletteIcon />,
  dateModified: new Date('2024-01-25'),
  dateCreated: new Date('2025-08-29'),
  path: '',
  metadata: {
    tags: [
      'development',
      'settings',
      'color picker',
      'app themes',
      'site themes',
    ],
    favorite: false,
    thumbnail: {
      relativePath: 'ui-images/theme-selector-thumbnail.jpg',
      alt: 'Dynamic and blended abstract image representing a diverse collection of user interface themes. The composition features swirling, flowing colors and textures that transition seamlessly across distinct aesthetic styles: a neon purple and pink synthwave area, a section with warm, grainy sunset tones and palm trees, a texture suggestive of digital code and circuit patterns, and a background with a dark starry night sky.',
    },
    description:
      'Personalize your experience. Switch between different visual styles for the application, including cyberpunk, retro synthwave, minimal, and monochromatic aesthetics. Instantly apply a new color palette, typography, and background style to match your preferences.',
  },
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
