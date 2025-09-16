import { useMemo } from 'react';
import { ProjectData } from '../../templates';
import { ImageMediaData, VideoMediaData } from '../../organisms';
import { useMediaProvider } from '../../context';

export const useProjectMedia = (projectData: ProjectData) => {
  const { provider } = useMediaProvider();

  const transformedMedia = useMemo(() => {
    // Transform hero image
    const hero: ImageMediaData = {
      sources: provider.generateImageSources(
        projectData.media.hero.relativePath,
        'hero'
      ),
      alt: `${projectData.projectName} - Hero Image`,
    };

    const thumbnail: ImageMediaData = {
      sources: provider.generateImageSources(
        projectData.media.hero.relativePath,
        'thumbnail'
      ),
      alt: `${projectData.projectName} - Thumbnail`,
    };

    // Transform screenshots
    const screenshots: ImageMediaData[] =
      projectData.media.screenshots?.map((screenshot) => ({
        sources: provider.generateImageSources(
          screenshot.relativePath,
          'gallery'
        ),
        alt: screenshot.alt,
        caption: screenshot.caption,
        detailedCaption: screenshot.detailedCaption,
      })) || [];

    // Transform videos
    const videos: VideoMediaData[] =
      projectData.media.videos?.map((video) => ({
        url: provider.generateVideoUrl(video.relativePath),
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
  }, [projectData, provider]);

  return transformedMedia;
};
