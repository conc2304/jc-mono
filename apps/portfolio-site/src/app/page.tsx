'use client';

import { Box } from '@mui/material';
import { DesktopOS } from '@jc/desktop-OS';
import { DesktopIconMetaData } from '@jc/ui-components';
import {
  Folder,
  CalculatorIcon,
  SettingsIcon,
  FileTextIcon,
  ImageIcon,
} from 'lucide-react';

const desktopIcons: DesktopIconMetaData[] = [
  { id: 'folder', name: 'My Folder', icon: <Folder /> },
  {
    id: 'document',
    name: 'Document',
    icon: <FileTextIcon fontSize={36} />,
  },
  {
    id: 'settings',
    name: 'Settings',
    icon: <SettingsIcon fontSize={36} />,
  },
  {
    id: 'calculator',
    name: 'Calculator',
    icon: <CalculatorIcon fontSize={36} />,
  },
  {
    id: 'image',
    name: 'Images',
    icon: <ImageIcon fontSize={36} />,
  },
];

export default function Index() {
  return (
    <Box sx={{ p: 3, minHeight: '100vh', maxHeight: '100vh' }}>
      <DesktopOS desktopIcons={desktopIcons} />
    </Box>
  );
}
