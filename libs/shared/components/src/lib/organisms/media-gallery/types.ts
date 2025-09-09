export interface ImageMediaSource {
  src: string;
  srcSet?: string;
  sizes?: string;
}

interface ImageMediaData {
  sources: MediaSource[];
  alt: string;
  caption?: string;
  detailedCaption?: string; // For longer captions in modal
}

interface VideoMediaData {
  url: string;
  title?: string;
  type?: 'demo' | 'process' | 'final' | 'inspiration';
  thumbnail?: string;
  caption?: string;
  detailedCaption?: string; // For longer captions in modal
}

interface MediaItem {
  type: 'image' | 'video';
  data: ImageMediaData | VideoMediaData;
  index: number;
}

export type { ImageMediaData, VideoMediaData, MediaItem };
