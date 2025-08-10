// Cloudflare Images transformation utilities

// Your actual configuration
const R2_CUSTOM_URL = 'https://media.clyzby.com';
const CF_ZONE = 'clyzby.com';

/**
 * Generate optimized image URL using Cloudflare Images transformations
 * Based on: https://developers.cloudflare.com/images/transform-images/transform-via-url/
 */
export function getImageUrl(
  path: string,
  variant: 'thumbnail' | 'gallery' | 'hero' | 'full' = 'gallery'
): string {
  const fullR2Url = `${R2_CUSTOM_URL}/${path}`;

  // Define transformation options for each variant
  const variantOptions = {
    thumbnail: 'width=300,quality=85,format=auto,fit=scale-down',
    gallery: 'width=800,quality=85,format=auto,fit=scale-down',
    hero: 'width=1200,quality=90,format=auto,fit=scale-down',
    full: 'quality=90,format=auto', // Original size, just optimized format
  };

  const options = variantOptions[variant];

  // Use Cloudflare Images URL format: /cdn-cgi/image/<OPTIONS>/<SOURCE-IMAGE>
  return `https://${CF_ZONE}/cdn-cgi/image/${options}/${fullR2Url}`;
}

/**
 * Generate video URL (direct from R2, no optimization)
 */
export function getVideoUrl(path: string): string {
  return `${R2_CUSTOM_URL}/${path}`;
}

/**
 * Generate responsive image srcSet for different screen sizes
 */
export function getResponsiveImageSet(path: string) {
  return {
    src: getImageUrl(path, 'gallery'),
    srcSet: [
      `${getImageUrl(path, 'thumbnail')} 300w`,
      `${getImageUrl(path, 'gallery')} 800w`,
      `${getImageUrl(path, 'hero')} 1200w`,
      `${getImageUrl(path, 'full')} 1600w`,
    ].join(', '),
    sizes: '(max-width: 768px) 300px, (max-width: 1200px) 800px, 1200px',
  };
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

/**
 * Batch generate URLs for multiple media items
 */
export function generateMediaUrls(mediaPaths: string[]) {
  return mediaPaths.map((path) => ({
    path,
    isVideo: isVideo(path),
    url: isVideo(path) ? getVideoUrl(path) : getImageUrl(path),
    responsive: isImage(path) ? getResponsiveImageSet(path) : null,
  }));
}
