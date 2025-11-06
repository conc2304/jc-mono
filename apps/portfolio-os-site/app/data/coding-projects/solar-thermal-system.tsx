import { MdSolarPower } from 'react-icons/md';
import { v4 as uuidv4 } from 'uuid';

import { FileSystemItem } from '@jc/file-system';
import {
  BrutalistTemplate,
  BrutalistTemplateProps,
  ProjectData,
  solarThermalSimulationProject,
} from '@jc/portfolio';

export const solarThermalFileSystemItem: FileSystemItem<
  ProjectData,
  BrutalistTemplateProps
> = {
  id: uuidv4(),
  name: 'SolarThermalSim.proj',
  icon: <MdSolarPower fontSize="large" />,
  type: 'file',
  size: 1835008, // ~1.75MB - interactive 3D physics simulation with thermodynamics engine
  mimeType: 'application/pdf',
  dateModified: new Date('2025-11-06'),
  dateCreated: new Date('2024-08-01'),
  path: '',
  parentId: '',
  metadata: {
    tags: [
      'personal',
      'featured',
      'three-js',
      'physics-simulation',
      'thermodynamics',
      'educational',
      'web',
      'react',
    ],
    favorite: true,
    thumbnail: solarThermalSimulationProject.media.hero,
    description:
      'Interactive 3D web application simulating solar thermal heating systems with real-time thermodynamic physics and visualization',
  },
  fileData: solarThermalSimulationProject,
  renderer: {
    component: BrutalistTemplate,
    props: {},
  },
};
