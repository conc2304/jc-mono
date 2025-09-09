import type { ImageMediaData } from '@jc/ui-components';

// Cloudflare Images transformation utilities

type ImageContext = 'thumbnail' | 'gallery' | 'hero' | 'full';

interface ImageContextConfig {
  maxWidth: number;
  quality: number;
  sizes: string;
  breakpoints: number[];
}

const IMAGE_CONTEXTS: Record<ImageContext, ImageContextConfig> = {
  thumbnail: {
    maxWidth: 400,
    quality: 80,
    sizes: '(max-width: 640px) 200px, (max-width: 1024px) 300px, 400px',
    breakpoints: [200, 300, 400],
  },
  gallery: {
    maxWidth: 800,
    quality: 85,
    sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 800px',
    breakpoints: [400, 600, 800],
  },
  hero: {
    maxWidth: 1400,
    quality: 90,
    sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 1400px',
    breakpoints: [640, 1024, 1400],
  },
  full: {
    maxWidth: 2000,
    quality: 95,
    sizes:
      '(max-width: 640px) 100vw, (max-width: 1024px) 90vw, (max-width: 1400px) 80vw, 2000px',
    breakpoints: [800, 1200, 1600, 2000],
  },
};

// Your actual configuration
const R2_CUSTOM_URL = 'https://media.clyzby.com';
const CF_ZONE = 'clyzby.com';

/**
 * Generate optimized image URL using Cloudflare Images transformations
 * Based on: https://developers.cloudflare.com/images/transform-images/transform-via-url/
 */
export function getImageUrl(
  path: string,
  width: number,
  quality: number = 85
): string {
  const fullR2Url = `${R2_CUSTOM_URL}/${path}`;
  const options = `width=${width},quality=${quality},format=auto,fit=scale-down`;
  return `https://${CF_ZONE}/cdn-cgi/image/${options}/${fullR2Url}`;
}

/**
 * Generate context-aware responsive image data
 * This is the main function you'll use throughout your app
 */
export function getContextualImage(
  path: string,
  context: ImageContext,
  alt: string,
  caption?: string,
  detailedCaption?: string
): ImageMediaData {
  const config = IMAGE_CONTEXTS[context];

  // Generate srcSet with context-appropriate breakpoints
  const srcSet = config.breakpoints
    .map((width) => `${getImageUrl(path, width, config.quality)} ${width}w`)
    .join(', ');

  return {
    src: getImageUrl(path, config.maxWidth, config.quality),
    srcSet,
    sizes: config.sizes,
    alt,
    caption,
    detailedCaption,
  };
}

/**
 * Batch generate contextual images for multiple contexts
 * Useful when you need the same image in different contexts
 */
export function getMultiContextImage(
  path: string,
  alt: string,
  contexts: ImageContext[],
  caption?: string,
  detailedCaption?: string
): Record<ImageContext, ImageMediaData> {
  const result = {} as Record<ImageContext, ImageMediaData>;

  contexts.forEach((context) => {
    result[context] = getContextualImage(
      path,
      context,
      alt,
      caption,
      detailedCaption
    );
  });

  return result;
}

/**
 * Generate video URL (direct from R2, no optimization)
 */
export function getVideoUrl(path: string): string {
  return `${R2_CUSTOM_URL}/${path}`;
}

/**
 * Legacy function - generates responsive set but now you should use getContextualImage
 * @deprecated Use getContextualImage instead for better optimization
 */
export function getResponsiveImageSet(path: string) {
  return getContextualImage(path, 'gallery', '');
}

/**
 * Generate image URL with custom options
 * For advanced use cases where you need specific transformations
 */
export function getCustomImageUrl(path: string, options: string): string {
  const fullR2Url = `${R2_CUSTOM_URL}/${path}`;
  return `https://${CF_ZONE}/cdn-cgi/image/${options}/${fullR2Url}`;
}

/**
 * Predefined transformation presets for common use cases
 */
export const ImagePresets = {
  // High quality for hero images
  heroHighQ: 'width=1200,quality=95,format=auto,fit=scale-down,sharpen=1',

  // Optimized for mobile
  mobile: 'width=400,quality=80,format=auto,fit=scale-down',

  // Square thumbnails for cards
  squareThumb:
    'width=300,height=300,quality=85,format=auto,fit=cover,gravity=auto',

  // Blurred placeholder (for loading states)
  placeholder: 'width=50,quality=50,blur=5,format=auto',

  // High compression for slow connections
  lowBandwidth: 'width=600,quality=60,format=auto,fit=scale-down',
} as const;

/**
 * Check if a file path is a video
 */
export function isVideo(path: string): boolean {
  const videoExtensions = ['.mp4', '.webm', '.mov', '.avi'];
  return videoExtensions.some((ext) => path.toLowerCase().endsWith(ext));
}

/**
 * Check if a file path is an image
 */
export function isImage(path: string): boolean {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'];
  return imageExtensions.some((ext) => path.toLowerCase().endsWith(ext));
}
