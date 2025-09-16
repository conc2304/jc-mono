import { ImageMediaSource } from '../../organisms';

export type MediaContextSize =
  | 'thumbnail'
  | 'gallery'
  | 'hero'
  | 'modal'
  | 'full';

export interface MediaProviderType {
  name: string;
  generateImageSources(
    path: string,
    context: MediaContextSize
  ): ImageMediaSource;
  generateVideoUrl(path: string): string;
  generatePlaceholder(path: string): string;
  isVideo(path: string): boolean;
  isImage(path: string): boolean;
}
