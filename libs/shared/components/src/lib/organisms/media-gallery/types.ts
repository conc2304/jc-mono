interface BaseImageData {
  relativePath: string;
  alt: string;
  caption?: string;
  detailedCaption?: string;
}
interface BaseVideoData {
  relativePath: string;
  title?: string;
  type?: 'demo' | 'process' | 'final' | 'inspiration';
  thumbnail?: string;
  caption?: string;
  detailedCaption?: string;
}

interface ImageRenderAttributes {
  src: string;
  srcSet?: string;
  sizes?: string;
  alt: string;
  caption?: string;
  detailedCaption?: string;
  aspectRatio?: number;
}

interface VideoRenderAttributes {
  url: string;
  title?: string;
  type?: 'demo' | 'process' | 'final' | 'inspiration';
  thumbnail?: string;
  caption?: string;
  detailedCaption?: string;
}

interface MediaItem {
  type: 'image' | 'video';
  data: ImageRenderAttributes | VideoRenderAttributes;
  index: number;
}

export type {
  BaseImageData,
  BaseVideoData,
  ImageRenderAttributes,
  VideoRenderAttributes,
  MediaItem,
};
