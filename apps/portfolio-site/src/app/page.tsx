'use client';

import { Box, Typography, Card, CardContent } from '@mui/material';
import { DesktopOS } from '@jc/desktop-OS';
import { DesktopIcon, DesktopIconMetaData } from '@jc/ui-components';
import {
  Folder,
  FileText,
  Settings,
  Calculator,
  Image,
  Minimize2,
  Maximize2,
  X,
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
    // color: 'text-green-500',
  },
  {
    id: 'settings',
    name: 'Settings',
    icon: <SettingsIcon fontSize={36} />,
    // color: 'text-gray-500',
  },
  {
    id: 'calculator',
    name: 'Calculator',
    icon: <CalculatorIcon fontSize={36} />,
    // color: 'text-purple-500',
  },
  {
    id: 'image',
    name: 'Images',
    icon: <ImageIcon fontSize={36} />,
    // color: 'text-pink-500'
  },
];

export default function Index() {
  return (
    <Box sx={{ p: 3, minHeight: '100vh' }}>
      <Typography variant="h1">Site Home Page</Typography>

      <DesktopOS desktopIcons={desktopIcons} />
    </Box>
  );
}
