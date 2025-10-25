import { FileSystemItem } from '@jc/file-system';
import {
  DefaultTileContent,
  YouTubePlaylistPlayerProps,
  YouTubePlaylistPlayer,
} from '@jc/ui-components';
import { v4 as uuidv4 } from 'uuid';
import { FaceMeltIcon } from './face-melt-icon';

export const VJSetsPortfolioFileSystemItem: FileSystemItem<
  void,
  YouTubePlaylistPlayerProps
> = {
  id: uuidv4(),
  icon: <FaceMeltIcon width={24} height={24} />,
  name: 'VJ Sets',
  type: 'file',
  size: 347562,
  mimeType: 'interactive/vj-sets',
  dateModified: new Date('2025-10-10'),
  dateCreated: new Date('2020-10-20'),
  path: '',
  metadata: {
    tags: ['art', 'visuals', 'creative-technology', 'vj sets', 'raves', 'edm'],
    favorite: false,
    description:
      'Collection of videos of concerts and raves where I have run live visuals.',
    thumbnail: {
      relativePath: 'vj-media/vj-playlist-thumbnail.jpg',
      caption: 'Live VJ Set at Burning Man for Robot Heart Art Car',
      alt: 'Live VJ Set at Burning Man for Robot Heart Art Car',
    },
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
