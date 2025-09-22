import type {
  ImageMediaData,
  ImageMediaSource,
  MediaContextSize,
} from '@jc/ui-components';

// Add this new type for images with placeholders
export interface ImageMediaSourceWithPlaceholder extends ImageMediaSource {
  placeholder?: string;
}

export interface ImageMediaDataWithPlaceholder
  extends Omit<ImageMediaData, 'sources'> {
  sources: ImageMediaSourceWithPlaceholder[];
}

// ... (keep all your existing code) ...

/**
 * Generate a low-quality blurred placeholder image
 * Perfect for blur-up loading effect
 */
export function getPlaceholderImage(
  path: string,
  width: number = 50,
  quality: number = 30,
  blur: number = 10
): string {
  const fullR2Url = `${R2_CUSTOM_URL}/${path}`;
  const options = `width=${width},quality=${quality},blur=${blur},format=auto,fit=scale-down`;
  return `https://${CF_ZONE}/cdn-cgi/image/${options}/${fullR2Url}`;
}

/**
 * Generate context-aware responsive image data WITH placeholder
 * Enhanced version that includes a blurred placeholder
 */
export function getContextualImageWithPlaceholder(
  path: string,
  context: MediaContextSize
): ImageMediaSourceWithPlaceholder {
  const config = IMAGE_CONTEXTS[context];

  // Generate srcSet with context-appropriate breakpoints
  const srcSet = config.breakpoints
    .map((width) => `${getImageUrl(path, width, config.quality)} ${width}w`)
    .join(', ');

  return {
    src: getImageUrl(path, config.maxWidth, config.quality),
    srcSet,
    sizes: config.sizes,
    placeholder: getPlaceholderImage(path), // Add placeholder
  };
}

/**
 * Batch generate contextual images with placeholders for multiple contexts
 */
export function getMultiContextImageWithPlaceholder(
  path: string,
  alt: string,
  contexts: MediaContextSize[],
  caption?: string,
  detailedCaption?: string
): Record<MediaContextSize, ImageMediaDataWithPlaceholder> {
  const result = {} as Record<MediaContextSize, ImageMediaDataWithPlaceholder>;

  contexts.forEach((context) => {
    result[context] = {
      sources: [getContextualImageWithPlaceholder(path, context)],
      alt,
      caption,
      detailedCaption,
    };
  });

  return result;
}

/**
 * Generate base64 inline placeholder for ultra-fast loading
 * Note: This returns the URL that can be used directly, but if you need
 * actual base64, you'd need to fetch and convert it
 */
export function getTinyPlaceholder(path: string): string {
  return getPlaceholderImage(path, 20, 20, 15);
}

// Updated preset with better placeholder option
export const ImagePresets = {
  // High quality for hero images
  heroHighQ: 'width=1200,quality=95,format=auto,fit=scale-down,sharpen=1',

  // Optimized for mobile
  mobile: 'width=400,quality=80,format=auto,fit=scale-down',

  // Square thumbnails for cards
  squareThumb:
    'width=300,height=300,quality=85,format=auto,fit=cover,gravity=auto',

  // Blurred placeholder (for loading states) - improved
  placeholder: 'width=50,quality=30,blur=10,format=auto,fit=scale-down',

  // Ultra-tiny placeholder for inline/base64
  tinyPlaceholder: 'width=20,quality=20,blur=15,format=auto,fit=scale-down',

  // High compression for slow connections
  lowBandwidth: 'width=600,quality=60,format=auto,fit=scale-down',
} as const;
