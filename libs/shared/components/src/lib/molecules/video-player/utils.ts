import { MediaItem, VideoMediaData } from '../../organisms';

export const simplePriorityVideoSort = (a: MediaItem, b: MediaItem): number => {
  const getPriority = (item: MediaItem): number => {
    if (item.type === 'video') {
      const video = item.data as VideoMediaData;
      switch (video.type) {
        case 'demo':
          return 1;
        case 'process':
          return 2;
        case 'final':
          return 3;
        case 'inspiration':
          return 5;
        default:
          return 6;
      }
    }
    return 4; // Images
  };

  return getPriority(a) - getPriority(b);
};
