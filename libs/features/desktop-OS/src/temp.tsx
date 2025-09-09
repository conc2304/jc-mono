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
