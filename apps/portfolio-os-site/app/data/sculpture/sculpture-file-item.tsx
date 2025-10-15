import { FileSystemItem } from '@jc/file-system';
import {
  Sculpture,
  SculpturePortfolio,
  SculpturePortfolioProps,
  sculpturesData,
} from '@jc/portfolio';
import { DefaultTileContent } from '@jc/ui-components';
import { v4 as uuidv4 } from 'uuid';
import { SculptIcon } from './sculpture-icon';

export const SculpturePortfolioFileSystemItem: FileSystemItem<
  Sculpture[],
  SculpturePortfolioProps
> = {
  id: uuidv4(),
  name: 'Sculpture',
  icon: <SculptIcon width={24} height={24} />,
  type: 'file',
  size: sculpturesData.reduce(
    (total, sculpture) => total + sculpture.images.length * 2000000,
    0
  ), // Approximate size based on image count
  mimeType: 'interactive/sculpture-portfolio',
  dateModified: new Date(), // Most recent sculpture date
  dateCreated: new Date(
    Math.min(
      ...sculpturesData.map((s) =>
        new Date(s.date.replace(/\w+ /, '') + '-01-01').getTime()
      )
    )
  ), // Earliest sculpture date
  path: '',
  metadata: {
    tags: ['art', 'sculpture', 'portfolio', 'interactive', 'gsap'],
    favorite: false,
    description: 'Interactive sculpture portfolio',
    thumbnail: sculpturesData[0]?.images[0], // First image as thumbnail
    customProperties: {
      sculptureCount: sculpturesData.length,
      totalImages: sculpturesData.reduce(
        (total, s) => total + s.images.length,
        0
      ),
      materials: [...new Set(sculpturesData.map((s) => s.materials))],
      dateRange: {
        earliest: Math.min(
          ...sculpturesData.map((s) =>
            new Date(s.date.replace(/\w+ /, '') + '-01-01').getTime()
          )
        ),
        latest: Math.max(
          ...sculpturesData.map((s) =>
            new Date(s.date.replace(/\w+ /, '') + '-01-01').getTime()
          )
        ),
      },
    },
  },
  fileData: sculpturesData,
  tileRenderer: {
    component: DefaultTileContent,
    config: {
      size: 'small',
      color: 'secondary',
    },
  },
  renderer: {
    component: SculpturePortfolio,
    props: {
      sculptures: sculpturesData,
    },
    shouldNavigate: false,
  },
};
