import { ThermostatAuto } from '@mui/icons-material';
import { v4 as uuidv4 } from 'uuid';

import { FileSystemItem } from '@jc/file-system';
import {
  climateDataVizProject,
  BrutalistTemplate,
  BrutalistTemplateProps,
  ProjectData,
} from '@jc/portfolio';

export const climateDataVizFileSystemItem: FileSystemItem<
  ProjectData,
  BrutalistTemplateProps
> = {
  id: uuidv4(),
  name: 'Planet-Habitability.proj',
  icon: <ThermostatAuto fontSize="large" />,
  type: 'file',
  size: 428800, // ~419KB - complex data visualization with multiple charts
  mimeType: 'application/pdf',
  dateModified: new Date('2023-12-15'),
  dateCreated: new Date('2023-09-01'),
  path: '',
  parentId: '',
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
    thumbnail: climateDataVizProject.media.hero,
    description:
      'Interactive climate impact visualization exploring temperature and weather correlations',
  },
  fileData: climateDataVizProject,
  renderer: {
    component: BrutalistTemplate,
    props: {},
  },
};
