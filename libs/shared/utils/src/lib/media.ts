const R2_CUSTOM_URL = 'https://media.clyzby.com'; // Your new custom R2 domain
const CF_ZONE = 'clyzby.com'; // Your main domain

export function getImageUrl(
  path: string,
  variant: 'thumbnail' | 'gallery' | 'hero' | 'full' = 'gallery'
): string {
  const fullR2Url = `${R2_CUSTOM_URL}/${path}`;

  // Use Cloudflare Images transformations via your domain
  return `https://${CF_ZONE}/cdn-cgi/imagedelivery/transform/${variant}/${encodeURIComponent(
    fullR2Url
  )}`;
}

export function getVideoUrl(path: string): string {
  return `${R2_CUSTOM_URL}/${path}`;
}

// Keep your responsive image utilities the same
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
