import {
  FileSystemItem,
  ProjectData,
  ProjectTemplateProps,
  ProjectTemplate,
  BrutalistTemplate,
  BrutalistTemplateProps,
} from '@jc/ui-components';
import {
  lightformWebControllerProject,
  atomicVisualizerProject,
  climateDataVizProject,
  gravityScavengerProject,
  simplisafeJawaProject,
  terrainifyProject,
  tunecraftProject,
  verdantiaProject,
  vyzbyProject,
} from '@jc/portfolio';
import {
  Compost,
  MovieFilter,
  MusicNote,
  RocketLaunch,
  Science,
  Security,
  Terrain,
  ThermostatAuto,
  Tune,
} from '@mui/icons-material';
import { v4 as uuidv4 } from 'uuid';

export const atomicVisualizerFileSystemItem: FileSystemItem<
  ProjectData,
  BrutalistTemplateProps
> = {
  id: uuidv4(),
  name: 'AtomicVisualizer.proj',
  icon: <Science fontSize="large" />,
  type: 'file',
  size: 342560, // ~335KB - substantial 3D web application
  mimeType: 'application/pdf',
  dateModified: new Date('2023-08-15'),
  dateCreated: new Date('2023-06-01'),
  path: '/Documents/Projects/AtomicVisualizer.proj',
  parentId: '1',
  permissions: { read: true, write: true, execute: false },
  metadata: {
    tags: [
      'school',
      'featured',
      '3d',
      'webgl',
      'react-three-fiber',
      'harvard-cs50',
    ],
    favorite: true,
    description:
      '3D WebGL periodic table explorer with animated atomic structures',
  },
  fileData: atomicVisualizerProject,
  renderer: {
    component: BrutalistTemplate,
    props: {
      hasNavigation: true,
    },
  },
};
export const gravityScavengerFileSystemItem: FileSystemItem<
  ProjectData,
  BrutalistTemplateProps
> = {
  id: uuidv4(),
  name: 'GravityScavenger.proj',
  icon: <RocketLaunch fontSize="large" />,
  type: 'file',
  size: 1572864, // ~1.5MB - comprehensive Unity game with physics, AI, and procedural systems
  mimeType: 'application/pdf',
  dateModified: new Date('2024-05-15'),
  dateCreated: new Date('2024-01-15'),
  path: '/Documents/Projects/GravityScavenger.proj',
  parentId: '1',
  permissions: { read: true, write: true, execute: false },
  metadata: {
    tags: [
      'school',
      'featured',
      'unity',
      'game-dev',
      'physics',
      'procedural',
      'harvard-gd50',
    ],
    favorite: true,
    description:
      'Physics-based Unity space game with procedural generation and real-time gravity simulation',
  },
  fileData: gravityScavengerProject,
  renderer: {
    component: BrutalistTemplate,
    props: {
      hasNavigation: true,
    },
  },
};

export const simplisafeJawaFileSystemItem: FileSystemItem<
  ProjectData,
  BrutalistTemplateProps
> = {
  id: uuidv4(),
  name: 'ProjectJawa.proj',
  icon: <Security fontSize="large" />,
  type: 'file',
  size: 2097152, // 2MB - comprehensive enterprise system with full-stack architecture
  mimeType: 'application/pdf',
  dateModified: new Date('2021-06-30'),
  dateCreated: new Date('2020-01-01'),
  path: '/Documents/Work/ProjectJawa.proj',
  parentId: '1',
  permissions: { read: true, write: true, execute: false },
  metadata: {
    tags: [
      'work',
      'featured',
      'enterprise',
      'full-stack',
      'ux-research',
      'simplisafe',
      'iot',
    ],
    favorite: true,
    description:
      'SimpliSafe fulfillment system redesign - enterprise warehouse management with IoT device pairing',
  },
  fileData: simplisafeJawaProject,
  renderer: {
    component: BrutalistTemplate,
    props: {
      hasNavigation: true,
    },
  },
};

export const lightformWebControllerFileSystemItem: FileSystemItem<
  ProjectData,
  BrutalistTemplateProps
> = {
  id: uuidv4(),
  name: 'LightformController.proj',
  icon: <MovieFilter fontSize="large" />,
  type: 'file',
  size: 1835008, // ~1.75MB - PWA with hardware integration, multiple apps, and creative coding
  mimeType: 'application/pdf',
  dateModified: new Date('2021-06-30'),
  dateCreated: new Date('2020-08-01'),
  path: '/Documents/Work/LightformController.proj',
  parentId: '1',
  permissions: { read: true, write: true, execute: false },
  metadata: {
    tags: [
      'work',
      'featured',
      'pwa',
      'hardware-integration',
      'projection-mapping',
      'lightform',
      'creative-coding',
    ],
    favorite: true,
    description:
      'PWA projection mapping controller with FTUX - AR hardware interface and creative coding',
  },
  fileData: lightformWebControllerProject,
  renderer: {
    component: BrutalistTemplate,
    props: {
      hasNavigation: true,
    },
  },
};
export const terrainifyFileSystemItem: FileSystemItem<
  ProjectData,
  BrutalistTemplateProps
> = {
  id: uuidv4(),
  name: 'Terrainify.proj',
  icon: <Terrain fontSize="large" />,
  type: 'file',
  size: 786432, // ~768KB - Maya plugin with procedural generation and BPM systems
  mimeType: 'application/pdf',
  dateModified: new Date('2024-01-15'),
  dateCreated: new Date('2023-03-01'),
  path: '/Documents/Personal/Terrainify.proj',
  parentId: '1',
  permissions: { read: true, write: true, execute: false },
  metadata: {
    tags: [
      'personal',
      'featured',
      'maya-plugin',
      'procedural',
      'audio-visual',
      'creative-coding',
      'python',
    ],
    favorite: true,
    description:
      'Maya Python plugin for procedural terrain with BPM-synchronized animation and music visualization',
  },
  fileData: terrainifyProject,
  renderer: {
    component: BrutalistTemplate,
    props: {
      hasNavigation: true,
    },
  },
};
export const tunecraftFileSystemItem: FileSystemItem<
  ProjectData,
  BrutalistTemplateProps
> = {
  id: uuidv4(),
  name: 'TuneCraft.proj',
  icon: <MusicNote fontSize="large" />,
  type: 'file',
  size: 1048576, // 1MB - computer vision + TouchDesigner + Ableton integration project
  mimeType: 'application/pdf',
  dateModified: new Date('2023-12-15'),
  dateCreated: new Date('2023-09-01'),
  path: '/Documents/Graduate/TuneCraft.proj',
  parentId: '1',
  permissions: { read: true, write: true, execute: false },
  metadata: {
    tags: [
      'graduate',
      'featured',
      'computer-vision',
      'touchdesigner',
      'audio-visual',
      'mediapipe',
      'harvard',
    ],
    favorite: true,
    description:
      '6D object tracking for real-time music control - computer vision meets interactive audio',
  },
  fileData: tunecraftProject,
  renderer: {
    component: BrutalistTemplate,
    props: {
      hasNavigation: true,
    },
  },
};
export const verdantiaFileSystemItem: FileSystemItem<
  ProjectData,
  BrutalistTemplateProps
> = {
  id: uuidv4(),
  name: 'Verdantia.proj',
  icon: <Compost fontSize="large" />,
  type: 'file',
  size: 2621440, // ~2.5MB - comprehensive Unity game with calculus, museum installation, and educational systems
  mimeType: 'application/pdf',
  dateModified: new Date('2024-05-15'),
  dateCreated: new Date('2023-09-01'),
  path: '/Documents/Graduate/Verdantia.proj',
  parentId: '1',
  permissions: { read: true, write: true, execute: false },
  metadata: {
    tags: [
      'graduate',
      'featured',
      'unity',
      'environmental',
      'calculus',
      'museum',
      'capstone',
      'harvard',
    ],
    favorite: true,
    description:
      'Unity city builder museum installation with real-time heat equation simulation and environmental education',
  },
  fileData: verdantiaProject,
  renderer: {
    component: BrutalistTemplate,
    props: {
      hasNavigation: true,
    },
  },
};
export const vyzbyFileSystemItem: FileSystemItem<
  ProjectData,
  BrutalistTemplateProps
> = {
  id: uuidv4(),
  name: 'VYZBY.proj',
  icon: <Tune fontSize="large" />,
  type: 'file',
  size: 1310720, // ~1.25MB - Vue.js framework with p5.js integration, API architecture, and multi-modal interaction
  mimeType: 'application/pdf',
  dateModified: new Date('2024-01-30'),
  dateCreated: new Date('2021-03-01'),
  path: '/Documents/Personal/VYZBY.proj',
  parentId: '1',
  permissions: { read: true, write: true, execute: false },
  metadata: {
    tags: [
      'personal',
      'featured',
      'framework',
      'creative-coding',
      'vue',
      'p5js',
      'developer-tools',
    ],
    favorite: true,
    description:
      'Interactive audio visualizer framework - real-time parameter control for creative coding workflows',
  },
  fileData: vyzbyProject,
  renderer: {
    component: BrutalistTemplate,
    props: {
      hasNavigation: true,
    },
  },
};

export const climateDataVizFileSystemItem: FileSystemItem<
  ProjectData,
  BrutalistTemplateProps
> = {
  id: uuidv4(),
  name: 'PlanetHabitability.proj',
  icon: <ThermostatAuto fontSize="large" />,
  type: 'file',
  size: 428800, // ~419KB - complex data visualization with multiple charts
  mimeType: 'application/pdf',
  dateModified: new Date('2023-12-15'),
  dateCreated: new Date('2023-09-01'),
  path: '/Documents/Projects/PlanetHabitability.proj',
  parentId: '1',
  permissions: { read: true, write: true, execute: false },
  metadata: {
    tags: [
      'school',
      'featured',
      'data-viz',
      'd3js',
      'climate-science',
      'harvard-cs171',
      'team-project',
    ],
    favorite: true,
    description:
      'Interactive climate impact visualization exploring temperature and weather correlations',
  },
  fileData: climateDataVizProject,
  renderer: {
    component: BrutalistTemplate,
    props: {
      hasNavigation: true,
    },
  },
};

export const allPortfolioProjectFiles: FileSystemItem<
  ProjectData,
  BrutalistTemplateProps
>[] = [
  atomicVisualizerFileSystemItem,
  gravityScavengerFileSystemItem,
  simplisafeJawaFileSystemItem,
  lightformWebControllerFileSystemItem,
  terrainifyFileSystemItem,
  tunecraftFileSystemItem,
  verdantiaFileSystemItem,
  vyzbyFileSystemItem,
  climateDataVizFileSystemItem,
];
