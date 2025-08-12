export interface ImageMediaData {
  relativePath: string;
  url: string;
  src: string;
  srcSet?: string;
  sizes?: string;
  alt: string;
  caption?: string;
  detailedCaption?: string; // For longer captions in modal
}

export interface VideoMediaData {
  url: string;
  title?: string;
  type?: 'demo' | 'process' | 'final' | 'inspiration';
  thumbnail?: string;
  caption?: string;
  detailedCaption?: string; // For longer captions in modal
}

export interface MediaItem {
  type: 'image' | 'video';
  data: ImageMediaData | VideoMediaData;
  index: number;
}
