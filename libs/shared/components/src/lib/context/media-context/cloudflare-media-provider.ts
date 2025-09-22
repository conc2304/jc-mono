import type { MediaContextSize, MediaProviderType } from './types';
import { ImageMediaSource } from '../../organisms';
import { getContextualImage, getPlaceholderImage } from '@jc/utils';

export class CloudflareMediaProvider implements MediaProviderType {
  name = 'cloudflare';

  generateImageSources(
    path: string,
    context: MediaContextSize
  ): ImageMediaSource {
    const contextualData = getContextualImage(path, context);
    return {
      src: contextualData.src,
      srcSet: contextualData.srcSet,
      sizes: contextualData.sizes,
    };
  }

  generateVideoUrl(path: string): string {
    return `https://media.clyzby.com/${path}`;
  }

  generatePlaceholder(
    path: string,
    width: number = 50,
    quality: number = 30,
    blur: number = 6
  ): string {
    // Get low-quality placeholder
    return getPlaceholderImage(path, width, quality, blur);
  }

  isVideo(path: string): boolean {
    const videoExtensions = ['.mp4', '.webm', '.mov', '.avi'];
    return videoExtensions.some((ext) => path.toLowerCase().endsWith(ext));
  }

  isImage(path: string): boolean {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
    return imageExtensions.some((ext) => path.toLowerCase().endsWith(ext));
  }
}
