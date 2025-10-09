import { ImageMediaSource, MediaContextSize } from '@jc/utils';

export interface MediaProviderType {
  name: string;
  generateImageSources(
    path: string,
    context: MediaContextSize
  ): ImageMediaSource;
  generateVideoUrl(path: string): string;
  generatePlaceholder(
    path: string,
    width?: number,
    quality?: number,
    blur?: number
  ): string;
  isVideo(path: string): boolean;
  isImage(path: string): boolean;
}
