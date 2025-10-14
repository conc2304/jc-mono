import { FileSystemItem } from '@jc/file-system';
import {
  YouTubePlaylistPlayerProps,
  YouTubePlaylistPlayer,
} from '@jc/portfolio';
import { DefaultTileContent } from '@jc/ui-components';
import { ListMusic } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

export const vjSetsPortfolioFileSystemItem: FileSystemItem<
  void,
  YouTubePlaylistPlayerProps
> = {
  id: uuidv4(),
  icon: <ListMusic />,
  name: 'VJ sets',
  type: 'file',
  size: 3475620347650287,
  mimeType: 'interactive/sculpture-portfolio',
  dateModified: new Date('2025-10-10'),
  dateCreated: new Date('2020-10-20'),
  path: '',
  metadata: {
    tags: ['art', 'visuals', 'creative-technology', 'vj sets', 'raves', 'edm'],
    favorite: false,
    description: 'Interactive sculpture portfolio',
    // thumbnail: // TODO
  },
  tileRenderer: {
    component: DefaultTileContent,
    config: {
      size: 'small',
      color: 'secondary',
    },
  },
  renderer: {
    component: YouTubePlaylistPlayer,
    props: {
      apiKey: import.meta.env.VITE_YOUTUBE_DATA_API_KEY,
      playlistId: 'PLRbyDb_RHK_drwr7yHb3iPGmh9aTZo1M0', // vj set playlist id
    },
    shouldNavigate: false,
  },
};
