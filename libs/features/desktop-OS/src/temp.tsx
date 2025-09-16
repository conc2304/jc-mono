// ============================================================================
// MIGRATION GUIDE: UPDATING YOUR EXISTING COMPONENTS
// ============================================================================

// Step 1: Update your project data structure
// OLD: projects/project-data.ts
/*
const media: ProjectMedia = {
  hero: {
    ...getResponsiveImageSet('projects/lightform/hero.jpg'),
    alt: 'Lightform LF2+ AR Projector',
  },
  screenshots: [
    {
      ...getResponsiveImageSet('projects/lightform/App-Header.jpg'),
      alt: 'Web Application Header Interface',
      caption: 'Main application header',
    },
  ],
};
*/

// NEW: projects/project-data.ts
export const LIGHTFORM_RAW_DATA: RawProjectData = {
  projectName: 'Lightform LF2+ AR Projector',
  projectSubtitle: 'Web-based AR projection mapping controller',
  media: {
    heroPath: 'projects/lightform/lf2-upside-down-gradpink-1-800x450.jpg',
    screenshots: [
      {
        path: 'projects/lightform/App-Header.jpg',
        alt: 'Web Application Header Interface',
        caption: 'Main application header showing navigation',
        detailedCaption:
          'Main application header showing navigation, device status, and project management controls for the Lightform web interface.',
      },
      {
        path: 'projects/lightform/Desktop-View.jpg',
        alt: 'Desktop Application Interface',
        caption: 'Full desktop application view',
        detailedCaption:
          'Complete desktop application interface showcasing the projection mapping tools and real-time preview capabilities.',
      },
    ],
    videos: [
      {
        path: 'projects/lightform/Desktop-View-Full-With-Errors-.mp4',
        title: 'Desktop Application Demo with Error Handling',
        type: 'demo',
        caption:
          'Complete desktop application walkthrough including error state management',
      },
    ],
  },
  content: {
    overview: 'Revolutionary AR projection mapping technology...',
    process: 'The development process involved...',
    // ... other content
  },
};

// ============================================================================
// Step 2: Update your BrutalistTemplate to use the new architecture
// ============================================================================

// templates/BrutalistTemplate.tsx (updated)
import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, useTheme, styled } from '@mui/material';
import { useProjectMedia } from '../hooks/useProjectMedia';
import { RawProjectData } from '../types/project-data';
import { NavigationContext } from '@jc/file-system';

// ... existing styled components ...

export interface BrutalistTemplateProps {
  hasNavigation?: boolean;
  rawProject: RawProjectData; // Changed from ProjectData to RawProjectData
}

export const BrutalistTemplate: React.FC<
  BrutalistTemplateProps & NavigationContext
> = ({
  hasNavigation = false,
  onNext,
  onPrevious,
  onSelectItem,
  navigationInfo,
  rawProject, // Raw data input
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<string>('overview');

  // Transform raw project data using the hook
  const transformedMedia = useProjectMedia(rawProject);

  // ... existing state and handlers ...

  return (
    <ResponsiveContainer ref={containerRef}>
      {/* Navigation components remain the same */}
      <MobileNavigation
        hasNavigation={hasNavigation}
        onMenuClick={(e) => setMobileMenuAnchor(e.currentTarget)}
        onNext={onNext}
        onPrevious={onPrevious}
        navigationInfo={navigationInfo}
      />

      {/* Hero section now uses transformed data */}
      <HeroSection
        heroImage={transformedMedia.hero} // Generic image data
        projectName={rawProject.projectName}
        description={rawProject.basics?.description}
        projectSubtitle={rawProject.projectSubtitle}
      />

      {/* Content sections pass transformed data */}
      <MobileContent
        activeTab={activeTab}
        rawProject={rawProject}
        transformedMedia={transformedMedia}
        renderContent={renderContent}
      />

      <DesktopContent
        rawProject={rawProject}
        transformedMedia={transformedMedia}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        tabs={tabsData}
        renderContent={renderContent}
      />
    </ResponsiveContainer>
  );
};

// ============================================================================
// Step 3: Update HeroSection to use GenericImageData
// ============================================================================

// components/hero/HeroSection.tsx (updated)
import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { GenericImageData } from '../../types/media-core';
import { GenericImage } from '../GenericImage';

interface HeroSectionProps {
  heroImage: GenericImageData; // Changed from ImageMediaData
  projectName: string;
  description?: string;
  projectSubtitle?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  heroImage,
  projectName,
  description,
  projectSubtitle,
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: { xs: '60vh', md: '70vh' },
        overflow: 'hidden',
        mb: 4,
      }}
    >
      {/* Background Image */}
      <GenericImage
        imageData={heroImage}
        loading="eager"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 1,
        }}
      />

      {/* Overlay Content */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
          color: 'white',
          p: { xs: 3, md: 4 },
          zIndex: 2,
        }}
      >
        <Typography
          variant="h2"
          component="h1"
          sx={{ fontWeight: 'bold', mb: 1 }}
        >
          {projectName}
        </Typography>
        {projectSubtitle && (
          <Typography variant="h5" sx={{ mb: 2, opacity: 0.9 }}>
            {projectSubtitle}
          </Typography>
        )}
        {description && (
          <Typography variant="body1" sx={{ maxWidth: '600px' }}>
            {description}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

// ============================================================================
// Step 4: Update DesktopContent to use transformed data
// ============================================================================

// components/desktop/DesktopContent.tsx (updated)
import React from 'react';
import { Box, Tabs, Tab, Typography, useTheme } from '@mui/material';
import { RawProjectData } from '../../types/project-data';
import { GenericImageData, GenericVideoData } from '../../types/media-core';
import { GenericMediaGallery } from '../GenericMediaGallery';

interface TransformedMedia {
  hero: GenericImageData;
  thumbnail: GenericImageData;
  screenshots: GenericImageData[];
  videos: GenericVideoData[];
}

interface DesktopContentProps {
  rawProject: RawProjectData;
  transformedMedia: TransformedMedia;
  activeTab: string;
  onTabChange: (event: React.SyntheticEvent, newValue: string) => void;
  tabs: Array<{ key: string; label: string }>;
  renderContent: (content?: string | string[]) => React.ReactNode;
}

export const DesktopContent: React.FC<DesktopContentProps> = ({
  rawProject,
  transformedMedia,
  activeTab,
  onTabChange,
  tabs,
  renderContent,
}) => {
  const theme = useTheme();

  return (
    <Box sx={{ maxWidth: '1200px', mx: 'auto', px: 4 }}>
      {/* Tab Navigation */}
      <Tabs
        value={activeTab}
        onChange={onTabChange}
        sx={{
          mb: 4,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        {tabs.map((tab) => (
          <Tab key={tab.key} label={tab.label} value={tab.key} />
        ))}
      </Tabs>

      {/* Tab Content */}
      <Box sx={{ mb: 8 }}>
        {rawProject.content?.[activeTab] && (
          <Box>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </Typography>
            {renderContent(rawProject.content[activeTab])}
          </Box>
        )}
      </Box>

      {/* Gallery Component - Now provider-agnostic */}
      {(transformedMedia.screenshots.length > 0 ||
        transformedMedia.videos.length > 0) && (
        <GenericMediaGallery
          images={transformedMedia.screenshots}
          videos={transformedMedia.videos}
          onMediaClick={(item) => console.log('Media clicked:', item)}
        />
      )}
    </Box>
  );
};

// ============================================================================
// Step 5: Create a compatibility adapter for existing components
// ============================================================================

// adapters/legacy-adapter.ts
import { GenericImageData, GenericVideoData } from '../types/media-core';

// For components that still expect the old ImageMediaData format
export interface LegacyImageMediaData {
  src: string;
  srcSet?: string;
  sizes?: string;
  alt: string;
  caption?: string;
  detailedCaption?: string;
}

export interface LegacyVideoMediaData {
  url: string;
  title?: string;
  type?: 'demo' | 'process' | 'final' | 'inspiration';
  thumbnail?: string;
  caption?: string;
  detailedCaption?: string;
}

/**
 * Convert GenericImageData to legacy format for backward compatibility
 */
export function toLegacyImageData(
  genericImage: GenericImageData
): LegacyImageMediaData {
  const primarySource = genericImage.sources[0];
  return {
    src: primarySource.src,
    srcSet: primarySource.srcSet,
    sizes: primarySource.sizes,
    alt: genericImage.alt,
    caption: genericImage.caption,
    detailedCaption: genericImage.detailedCaption,
  };
}

/**
 * Convert GenericVideoData to legacy format
 */
export function toLegacyVideoData(
  genericVideo: GenericVideoData
): LegacyVideoMediaData {
  return {
    url: genericVideo.url,
    title: genericVideo.title,
    type: genericVideo.type,
    thumbnail: genericVideo.thumbnail,
    caption: genericVideo.caption,
    detailedCaption: genericVideo.detailedCaption,
  };
}

// ============================================================================
// Step 6: Gradual migration wrapper for existing MediaGallery
// ============================================================================

// components/MediaGalleryWrapper.tsx
import React from 'react';
import { MediaGallery as ExistingMediaGallery } from '@jc/ui-components';
import { GenericImageData, GenericVideoData } from '../types/media-core';
import {
  toLegacyImageData,
  toLegacyVideoData,
} from '../adapters/legacy-adapter';

interface MediaGalleryWrapperProps {
  images?: GenericImageData[];
  videos?: GenericVideoData[];
  onMediaClick?: (mediaItem: any) => void;
  [key: string]: any; // Allow other props to pass through
}

/**
 * Wrapper that converts new format to legacy format for existing MediaGallery
 * Use this during migration period
 */
export const MediaGalleryWrapper: React.FC<MediaGalleryWrapperProps> = ({
  images = [],
  videos = [],
  onMediaClick,
  ...otherProps
}) => {
  // Convert to legacy format
  const legacyImages = images.map(toLegacyImageData);
  const legacyVideos = videos.map(toLegacyVideoData);

  return (
    <ExistingMediaGallery
      images={legacyImages}
      videos={legacyVideos}
      onMediaClick={onMediaClick}
      {...otherProps}
    />
  );
};

// ============================================================================
// Step 7: Application setup with provider
// ============================================================================

// App.tsx or main application entry point
import React from 'react';
import { MediaProviderComponent } from './context/MediaContext';
import { CloudflareMediaProvider } from './providers/cloudflare-provider';
import { BrutalistTemplate } from './templates/BrutalistTemplate';
import { LIGHTFORM_RAW_DATA } from './projects/project-data';

// Initialize your media provider
const mediaProvider = new CloudflareMediaProvider();

export const App: React.FC = () => {
  return (
    <MediaProviderComponent provider={mediaProvider} defaultContext="gallery">
      <BrutalistTemplate
        rawProject={LIGHTFORM_RAW_DATA}
        hasNavigation={true}
        // ... other props
      />
    </MediaProviderComponent>
  );
};

// ============================================================================
// Step 8: Alternative - Project-level data transformation
// ============================================================================

// If you prefer to transform data at the project level rather than component level
// services/project-service.ts
import { CloudflareMediaProvider } from '../providers/cloudflare-provider';
import { RawProjectData } from '../types/project-data';
import { GenericImageData, GenericVideoData } from '../types/media-core';

export class ProjectService {
  constructor(private mediaProvider: MediaProvider) {}

  transformProject(rawProject: RawProjectData) {
    return {
      ...rawProject,
      media: {
        hero: this.transformImage(
          rawProject.media.heroPath,
          'hero',
          `${rawProject.projectName} - Hero`
        ),
        thumbnail: this.transformImage(
          rawProject.media.heroPath,
          'thumbnail',
          `${rawProject.projectName} - Thumbnail`
        ),
        screenshots:
          rawProject.media.screenshots?.map((screenshot) =>
            this.transformImage(
              screenshot.path,
              'gallery',
              screenshot.alt,
              screenshot.caption,
              screenshot.detailedCaption
            )
          ) || [],
        videos:
          rawProject.media.videos?.map((video) => ({
            url: this.mediaProvider.generateVideoUrl(video.path),
            title: video.title,
            type: video.type,
            caption: video.caption,
            detailedCaption: video.detailedCaption,
          })) || [],
      },
    };
  }

  private transformImage(
    path: string,
    context: MediaContext,
    alt: string,
    caption?: string,
    detailedCaption?: string
  ): GenericImageData {
    return {
      sources: this.mediaProvider.generateImageSources(path, context),
      alt,
      caption,
      detailedCaption,
    };
  }
}

// Usage in your application
const projectService = new ProjectService(new CloudflareMediaProvider());
const transformedProject = projectService.transformProject(LIGHTFORM_RAW_DATA);

// ============================================================================
// MIGRATION CHECKLIST
// ============================================================================

/*
□ 1. Create new raw project data structure (remove Cloudflare-specific URLs)
□ 2. Set up MediaProvider and context in your app root
□ 3. Update project templates to use useProjectMedia hook
□ 4. Update hero/gallery components to use GenericImageData
□ 5. Use MediaGalleryWrapper for gradual migration of existing components
□ 6. Test with Cloudflare provider
□ 7. Create alternative providers for testing (generic, local, etc.)
□ 8. Remove legacy adapters once migration is complete
□ 9. Update any remaining components to use new architecture
□ 10. Remove old media utility functions
*/

// ============================================================================
// STRATEGY 1: ADAPTER PATTERN WITH GENERIC INTERFACES
// ============================================================================

// types/media-core.ts - Generic, provider-agnostic types
export interface MediaSource {
  src: string;
  srcSet?: string;
  sizes?: string;
}

export interface GenericImageData {
  sources: MediaSource[];
  alt: string;
  caption?: string;
  detailedCaption?: string;
  aspectRatio?: number;
}

export interface GenericVideoData {
  url: string;
  title?: string;
  type?: 'demo' | 'process' | 'final' | 'inspiration';
  thumbnail?: string;
  caption?: string;
  detailedCaption?: string;
  duration?: number;
}

export interface GenericMediaItem {
  type: 'image' | 'video';
  data: GenericImageData | GenericVideoData;
  index: number;
}

// types/project-data.ts - Raw project data (provider-agnostic)
export interface RawProjectMedia {
  heroPath: string;
  screenshots?: Array<{
    path: string;
    alt: string;
    caption?: string;
    detailedCaption?: string;
  }>;
  videos?: Array<{
    path: string;
    title?: string;
    type?: 'demo' | 'process' | 'final' | 'inspiration';
    caption?: string;
    detailedCaption?: string;
  }>;
}

export interface RawProjectData {
  projectName: string;
  projectSubtitle?: string;
  media: RawProjectMedia;
  // ... other project fields
}

// ============================================================================
// STRATEGY 2: MEDIA PROVIDER INTERFACE
// ============================================================================

export type MediaContext = 'thumbnail' | 'gallery' | 'hero' | 'modal';

export interface MediaProvider {
  name: string;
  generateImageSources(path: string, context: MediaContext): MediaSource[];
  generateVideoUrl(path: string): string;
  generatePlaceholder(path: string): string;
  isVideo(path: string): boolean;
  isImage(path: string): boolean;
}

// providers/cloudflare-provider.ts
import { getContextualImage } from '../cloudflare/media';

export class CloudflareMediaProvider implements MediaProvider {
  name = 'cloudflare';

  generateImageSources(path: string, context: MediaContext): MediaSource[] {
    const contextualData = getContextualImage(path, context, '');
    return [
      {
        src: contextualData.src,
        srcSet: contextualData.srcSet,
        sizes: contextualData.sizes,
      },
    ];
  }

  generateVideoUrl(path: string): string {
    return `https://media.clyzby.com/${path}`;
  }

  generatePlaceholder(path: string): string {
    // Generate low-quality placeholder
    return `https://clyzby.com/cdn-cgi/image/width=50,quality=50,blur=5,format=auto/https://media.clyzby.com/${path}`;
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

// providers/generic-provider.ts - Fallback for other providers
export class GenericMediaProvider implements MediaProvider {
  name = 'generic';
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  generateImageSources(path: string, context: MediaContext): MediaSource[] {
    // Simple responsive images without transformation
    const baseUrl = `${this.baseUrl}/${path}`;
    return [
      {
        src: baseUrl,
        srcSet: `${baseUrl} 1x, ${baseUrl} 2x`,
        sizes: this.getSizesForContext(context),
      },
    ];
  }

  generateVideoUrl(path: string): string {
    return `${this.baseUrl}/${path}`;
  }

  generatePlaceholder(path: string): string {
    // Return a simple placeholder or data URL
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+Cjwvc3ZnPgo=';
  }

  isVideo(path: string): boolean {
    const videoExtensions = ['.mp4', '.webm', '.mov', '.avi'];
    return videoExtensions.some((ext) => path.toLowerCase().endsWith(ext));
  }

  isImage(path: string): boolean {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
    return imageExtensions.some((ext) => path.toLowerCase().endsWith(ext));
  }

  private getSizesForContext(context: MediaContext): string {
    switch (context) {
      case 'thumbnail':
        return '(max-width: 640px) 200px, 300px';
      case 'gallery':
        return '(max-width: 640px) 100vw, 50vw';
      case 'hero':
        return '100vw';
      case 'modal':
        return '90vw';
      default:
        return '100vw';
    }
  }
}

// ============================================================================
// STRATEGY 3: REACT CONTEXT AND HOOKS
// ============================================================================

// context/MediaContext.tsx
import React, { createContext, useContext, ReactNode } from 'react';

interface MediaContextType {
  provider: MediaProvider;
  defaultContext: MediaContext;
}

const MediaContext = createContext<MediaContextType | null>(null);

interface MediaProviderProps {
  provider: MediaProvider;
  defaultContext?: MediaContext;
  children: ReactNode;
}

export const MediaProviderComponent: React.FC<MediaProviderProps> = ({
  provider,
  defaultContext = 'gallery',
  children,
}) => {
  return (
    <MediaContext.Provider value={{ provider, defaultContext }}>
      {children}
    </MediaContext.Provider>
  );
};

export const useMediaProvider = () => {
  const context = useContext(MediaContext);
  if (!context) {
    throw new Error(
      'useMediaProvider must be used within a MediaProviderComponent'
    );
  }
  return context;
};

// hooks/useMedia.ts
import { useMemo } from 'react';
import { useMediaProvider } from '../context/MediaContext';

export const useMedia = (path: string, context?: MediaContext) => {
  const { provider, defaultContext } = useMediaProvider();
  const resolvedContext = context || defaultContext;

  const mediaData = useMemo(() => {
    if (provider.isImage(path)) {
      return {
        type: 'image' as const,
        sources: provider.generateImageSources(path, resolvedContext),
        placeholder: provider.generatePlaceholder(path),
      };
    } else if (provider.isVideo(path)) {
      return {
        type: 'video' as const,
        url: provider.generateVideoUrl(path),
      };
    }
    return null;
  }, [path, resolvedContext, provider]);

  return mediaData;
};

// hooks/useProjectMedia.ts
import { useMemo } from 'react';
import { useMediaProvider } from '../context/MediaContext';

export const useProjectMedia = (rawProject: RawProjectData) => {
  const { provider } = useMediaProvider();

  const transformedMedia = useMemo(() => {
    // Transform hero image
    const hero: GenericImageData = {
      sources: provider.generateImageSources(rawProject.media.heroPath, 'hero'),
      alt: `${rawProject.projectName} - Hero Image`,
    };

    const thumbnail: GenericImageData = {
      sources: provider.generateImageSources(
        rawProject.media.heroPath,
        'thumbnail'
      ),
      alt: `${rawProject.projectName} - Thumbnail`,
    };

    // Transform screenshots
    const screenshots: GenericImageData[] =
      rawProject.media.screenshots?.map((screenshot) => ({
        sources: provider.generateImageSources(screenshot.path, 'gallery'),
        alt: screenshot.alt,
        caption: screenshot.caption,
        detailedCaption: screenshot.detailedCaption,
      })) || [];

    // Transform videos
    const videos: GenericVideoData[] =
      rawProject.media.videos?.map((video) => ({
        url: provider.generateVideoUrl(video.path),
        title: video.title,
        type: video.type,
        caption: video.caption,
        detailedCaption: video.detailedCaption,
      })) || [];

    return {
      hero,
      thumbnail,
      screenshots,
      videos,
    };
  }, [rawProject, provider]);

  return transformedMedia;
};

// ============================================================================
// STRATEGY 4: UPDATED UI COMPONENTS
// ============================================================================

// components/GenericImage.tsx
import React from 'react';
import { GenericImageData } from '../types/media-core';

interface GenericImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  imageData: GenericImageData;
  loading?: 'lazy' | 'eager';
}

export const GenericImage: React.FC<GenericImageProps> = ({
  imageData,
  loading = 'lazy',
  ...props
}) => {
  // Use the first (best) source
  const primarySource = imageData.sources[0];

  return (
    <img
      src={primarySource.src}
      srcSet={primarySource.srcSet}
      sizes={primarySource.sizes}
      alt={imageData.alt}
      loading={loading}
      {...props}
    />
  );
};

// components/AdaptiveImage.tsx
import React from 'react';
import { useMedia } from '../hooks/useMedia';

interface AdaptiveImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  path: string;
  alt: string;
  context?: MediaContext;
  loading?: 'lazy' | 'eager';
}

export const AdaptiveImage: React.FC<AdaptiveImageProps> = ({
  path,
  alt,
  context,
  loading = 'lazy',
  ...props
}) => {
  const mediaData = useMedia(path, context);

  if (!mediaData || mediaData.type !== 'image') {
    return <div>Invalid image</div>;
  }

  const primarySource = mediaData.sources[0];

  return (
    <img
      src={primarySource.src}
      srcSet={primarySource.srcSet}
      sizes={primarySource.sizes}
      alt={alt}
      loading={loading}
      {...props}
    />
  );
};

// ============================================================================
// STRATEGY 5: UPDATED MEDIA GALLERY (GENERIC)
// ============================================================================

// components/GenericMediaGallery.tsx
import React, { useState } from 'react';
import {
  GenericImageData,
  GenericVideoData,
  GenericMediaItem,
} from '../types/media-core';
import { GenericImage } from './GenericImage';

interface GenericMediaGalleryProps {
  images?: GenericImageData[];
  videos?: GenericVideoData[];
  onMediaClick?: (mediaItem: GenericMediaItem) => void;
  className?: string;
}

export const GenericMediaGallery: React.FC<GenericMediaGalleryProps> = ({
  images = [],
  videos = [],
  onMediaClick,
  className,
}) => {
  const [selectedMedia, setSelectedMedia] = useState<GenericMediaItem | null>(
    null
  );

  // Combine images and videos
  const mediaItems: GenericMediaItem[] = [
    ...images.map((image, index) => ({
      type: 'image' as const,
      data: image,
      index,
    })),
    ...videos.map((video, index) => ({
      type: 'video' as const,
      data: video,
      index: images.length + index,
    })),
  ];

  const handleMediaClick = (mediaItem: GenericMediaItem) => {
    setSelectedMedia(mediaItem);
    onMediaClick?.(mediaItem);
  };

  return (
    <div className={`media-gallery ${className || ''}`}>
      <div className="media-grid">
        {mediaItems.map((mediaItem) => (
          <div
            key={mediaItem.index}
            className="media-item"
            onClick={() => handleMediaClick(mediaItem)}
          >
            {mediaItem.type === 'image' ? (
              <GenericImage
                imageData={mediaItem.data as GenericImageData}
                className="gallery-image"
                loading="lazy"
              />
            ) : (
              <video
                src={(mediaItem.data as GenericVideoData).url}
                className="gallery-video"
                muted
                preload="metadata"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// STRATEGY 6: USAGE EXAMPLES
// ============================================================================

// App.tsx - Setup providers
import React from 'react';
import { CloudflareMediaProvider } from './providers/cloudflare-provider';
import { MediaProviderComponent } from './context/MediaContext';
import { ProjectPage } from './pages/ProjectPage';

const cloudflareProvider = new CloudflareMediaProvider();

export const App: React.FC = () => {
  return (
    <MediaProviderComponent
      provider={cloudflareProvider}
      defaultContext="gallery"
    >
      <ProjectPage />
    </MediaProviderComponent>
  );
};

// pages/ProjectPage.tsx - Use the transformed data
import React from 'react';
import { useProjectMedia } from '../hooks/useProjectMedia';
import { GenericMediaGallery } from '../components/GenericMediaGallery';

const rawProjectData: RawProjectData = {
  projectName: 'Lightform',
  media: {
    heroPath: 'projects/lightform/lf2-upside-down-gradpink-1-800x450.jpg',
    screenshots: [
      {
        path: 'projects/lightform/App-Header.jpg',
        alt: 'Web Application Header Interface',
        caption: 'Main application header',
      },
    ],
    videos: [
      {
        path: 'projects/lightform/Desktop-View-Full-With-Errors-.mp4',
        title: 'Desktop Application Demo',
        type: 'demo',
      },
    ],
  },
};

export const ProjectPage: React.FC = () => {
  const media = useProjectMedia(rawProjectData);

  return (
    <div>
      <h1>{rawProjectData.projectName}</h1>

      {/* Hero section */}
      <div className="hero">
        <GenericImage imageData={media.hero} loading="eager" />
      </div>

      {/* Gallery */}
      <GenericMediaGallery
        images={media.screenshots}
        videos={media.videos}
        onMediaClick={(item) => console.log('Clicked:', item)}
      />
    </div>
  );
};

// Alternative: Direct path usage with AdaptiveImage
import { AdaptiveImage } from '../components/AdaptiveImage';

export const AlternativeUsage: React.FC = () => {
  return (
    <div>
      {/* Hero with specific context */}
      <AdaptiveImage
        path="projects/lightform/hero.jpg"
        alt="Project Hero"
        context="hero"
        loading="eager"
      />

      {/* Gallery thumbnails */}
      <div className="gallery">
        <AdaptiveImage
          path="projects/lightform/screenshot1.jpg"
          alt="Screenshot 1"
          context="gallery"
          loading="lazy"
        />
      </div>
    </div>
  );
};
