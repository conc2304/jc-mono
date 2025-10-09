import { BaseImageData } from '@jc/ui-components';
import { PortfolioGalleryItem } from './iOS-made-media';

/**
 * Converts portfolio data to ImageMediaData format
 * @param portfolioData - Array of portfolio items
 * @param baseRelativePath - Base path for relative URLs (e.g., '/images/portfolio/')
 * @param generateSrcSet - Whether to generate srcSet for responsive images
 * @returns Array of ImageMediaData objects
 */
export function convertPortfolioGalleryToImageData(
  portfolioData: PortfolioGalleryItem[],
  baseRelativePath: string = '/gallery/'
): BaseImageData[] {
  return portfolioData.map((item) => {
    // Create relative path
    const relativePath = `${baseRelativePath}${item.filename}`;

    // Create alt text from title and medium
    const altText = item.medium
      ? `${item.title} - ${item.medium}`
      : item.title || '';

    // Create short caption (title with year if available)
    const shortCaption = item.year
      ? `${item.title} (${item.year})`
      : item.title || '';

    // Create detailed caption with all metadata
    const detailedParts = [
      item.title,
      item.year ? `${item.year}` : null,
      item.medium || null,

      item.categories && item.categories.length > 0
        ? `Categories: ${item.categories.join(', ')}`
        : null,
      item.tags && item.tags.length > 0
        ? `Tags: ${item.tags.join(', ')}`
        : null,
    ].filter(Boolean);

    const detailedCaption = detailedParts.join(' | ');

    return {
      relativePath,
      alt: altText,
      caption: shortCaption,
      detailedCaption,
    };
  });
}

/**
 * Filter function to get images by category
 */
export function filterByCategory(
  portfolioData: PortfolioGalleryItem[],
  category: string
): BaseImageData[] {
  const filteredPortfolioData = portfolioData.filter(
    (item) => item.categories && item.categories.includes(category)
  );

  return convertPortfolioGalleryToImageData(filteredPortfolioData);
}

/**
 * Filter function to get images by tag
 */
export function filterByTag(
  portfolioData: PortfolioGalleryItem[],
  tag: string
): BaseImageData[] {
  const filteredPortfolioData = portfolioData.filter(
    (item) => item.tags && item.tags.includes(tag)
  );

  return convertPortfolioGalleryToImageData(filteredPortfolioData);
}

/**
 * Filter function to get images by year
 */
export function filterByYear(
  portfolioData: PortfolioGalleryItem[],
  year: number
): BaseImageData[] {
  const filteredPortfolioData = portfolioData.filter(
    (item) => item.year === year
  );

  return convertPortfolioGalleryToImageData(filteredPortfolioData);
}
