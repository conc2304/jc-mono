import { FileSystemItem } from '@jc/file-system';
import {
  ArtGalleryMedia_iOS_Made,
  ArtGalleryProcessProps,
  HighlightVideo,
  MediaGalleryPage,
  ProcessDecorImages,
  ProcessEndImages,
  ProcessStartImages,
} from '@jc/portfolio';
import { DefaultTileContent, MediaGalleryProps } from '@jc/ui-components';
import { Image } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

export const iOSImageGalleryFileSystemItem: FileSystemItem<
  void,
  MediaGalleryProps & ArtGalleryProcessProps
> = {
  id: uuidv4(),
  name: 'iOS Art',
  icon: <Image />,
  type: 'file',
  size: 206862749, // 206.9 MB from Storage
  mimeType: 'jpegs',
  dateModified: new Date('2016-01-30'),
  dateCreated: new Date('2011-03-01'),
  path: '',
  parentId: '',
  metadata: {
    tags: [],
    favorite: true,
    thumbnail: ArtGalleryMedia_iOS_Made[0],
    description:
      'A collection of digital media that was made exclusively on my iPhone using iOS apps.',
  },
  fileData: undefined,
  tileRenderer: {
    component: DefaultTileContent,
    config: {
      size: 'small',
      color: 'secondary',
    },
  },
  renderer: {
    component: MediaGalleryPage,
    props: {
      images: ArtGalleryMedia_iOS_Made,
      processStartImages: ProcessStartImages,
      processEndImages: ProcessEndImages,
      decorImages: ProcessDecorImages,
      highlightVideo: HighlightVideo,
      lazy: true,
      showSkeletonDuration: 0,
      rootMargin: '800px',
      threshold: 0.05,
    },
  },
};
