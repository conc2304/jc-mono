import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  CardContent,
  useTheme,
  Chip,
} from '@mui/material';
import { PlayArrow } from '@mui/icons-material';
import {
  ImageContainer,
  ImageLoadingProps,
  MediaContextSize,
  useMediaProvider,
  VideoPlayer,
} from '@jc/ui-components';
import {
  MediaItem,
  ImageRenderAttributes,
  VideoRenderAttributes,
  BaseImageData,
  BaseVideoData,
} from './types';
import { MediaModal } from './components';
import { ensureContrast } from '@jc/utils';

export interface MediaGalleryProps extends ImageLoadingProps {
  images?: BaseImageData[];
  videos?: BaseVideoData[];
  onMediaClick?: (mediaItem: MediaItem) => void;
  /**
   * Whether to enable horizontal scrolling layout on mobile devices
   * When false, will always use grid layout regardless of screen size
   * @default true
   */
  allowMobileScrolling?: boolean;
  /**
   * Breakpoint width (in pixels) to determine mobile layout
   * Only applies when allowMobileScrolling is true
   * @default 768
   */
  mobileBreakpoint?: number;
  /**
   * Custom sort function to control the order of media items
   * If not provided, videos will be shown first, followed by images
   */
  sortFunction?: (a: MediaItem, b: MediaItem) => number;
}

export const MediaGallery = ({
  images = [],
  videos = [],
  showSkeletonDuration,
  lazy,
  rootMargin,
  threshold,
  onMediaClick,
  allowMobileScrolling = true,
  mobileBreakpoint = 768,
  sortFunction,
}: MediaGalleryProps) => {
  const theme = useTheme();
  const galleryRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentModalIndex, setCurrentModalIndex] = useState(0);

  const { generateImageSources, generateVideoUrl } =
    useMediaProvider().provider;

  // Combine images and videos into a single media array
  const createMediaItems = (contextSize: MediaContextSize): MediaItem[] => {
    const unsortedItems: MediaItem[] = [
      ...videos.map((video, index) => ({
        type: 'video' as const,
        data: { url: generateVideoUrl(video.relativePath), ...video },
        index: images.length + index, // Temporary index
      })),
      ...images.map((image, index) => ({
        type: 'image' as const,
        data: {
          ...image,
          ...generateImageSources(image.relativePath, 'gallery'),
        },
        index, // Temporary index
      })),
    ];

    // Apply custom sort function if provided
    const sortedItems = sortFunction
      ? unsortedItems.sort(sortFunction)
      : unsortedItems;

    // Reassign indices after sorting to ensure proper modal navigation
    return sortedItems.map((item, index) => ({
      ...item,
      index,
    }));
  };

  const mediaItemsGallery: MediaItem[] = createMediaItems('gallery');
  const mediaItemsModal: MediaItem[] = createMediaItems('modal');

  // Update container width for responsive behavior
  useEffect(() => {
    const updateWidth = () => {
      if (galleryRef.current) {
        setContainerWidth(galleryRef.current.clientWidth);
      }
    };

    updateWidth();
    const resizeObserver = new ResizeObserver(updateWidth);
    if (galleryRef.current) {
      resizeObserver.observe(galleryRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  // Determine if we should use mobile layout
  const isMobile = containerWidth < mobileBreakpoint;
  const useMobileScrolling =
    allowMobileScrolling && isMobile && mediaItemsGallery.length > 1;

  const getVideoTypeColor = (type?: string) => {
    switch (type) {
      case 'demo':
        return theme.palette.primary.main;
      case 'process':
        return theme.palette.secondary.main;
      case 'final':
        return theme.palette.success.main;
      case 'inspiration':
        return theme.palette.info.main;
      default:
        return theme.palette.text.secondary;
    }
  };

  const handleMediaClick = (mediaItem: MediaItem) => {
    setCurrentModalIndex(mediaItem.index);
    setModalOpen(true);
    onMediaClick?.(mediaItem);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleModalNavigate = (index: number) => {
    setCurrentModalIndex(index);
  };

  const renderMobileThumbnail = (mediaItem: MediaItem, index: number) => {
    const { type, data: media } = mediaItem;
    return (
      <Box
        className="MediaGallery--mobile-root"
        key={`mobile-${type}-${index}`}
        component="button"
        onClick={() => handleMediaClick(mediaItem)}
        sx={{
          flexShrink: 0,
          width: 80 * 3,
          height: 64 * 3,
          borderRadius: 1,
          overflow: 'hidden',
          border: 2,
          p: 0,
          borderColor: theme.palette.primary.main,
          cursor: 'pointer',
          transition: 'border-color 0.3s, transform 0.2s',
          position: 'relative',
          '&:hover': {
            borderColor: theme.palette.grey[500],
            transform: 'scale(1.05)',
          },
        }}
      >
        {type === 'image' ? (
          <ImageContainer
            src={(media as ImageRenderAttributes).src}
            srcSet={(media as ImageRenderAttributes).srcSet}
            sizes={(media as ImageRenderAttributes).sizes}
            alt={(media as ImageRenderAttributes).alt}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
            showSkeletonDuration={showSkeletonDuration}
            lazy={lazy}
            rootMargin={rootMargin}
            threshold={threshold}
          />
        ) : (
          <>
            <VideoPlayer
              video={media as VideoRenderAttributes}
              sx={{
                width: '100%',
                height: '100%',
              }}
              muted={true}
              controls={false}
            />
            {/* Play icon overlay for videos */}
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                bgcolor: 'rgba(0, 0, 0, 0.6)',
                borderRadius: '50%',
                width: 24,
                height: 24,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <PlayArrow sx={{ color: 'white', fontSize: 14 }} />
            </Box>
          </>
        )}
      </Box>
    );
  };

  const renderDesktopMediaItem = (mediaItem: MediaItem) => {
    const { type, data: media, index } = mediaItem;

    // Adjust grid sizing based on whether we're forcing desktop layout on mobile
    const gridSize = useMobileScrolling
      ? { xs: 12, lg: 6 }
      : { xs: 12, sm: 6, lg: 6 };

    if (type === 'image') {
      const imageMedia = media as ImageRenderAttributes;
      return (
        <Grid
          className="MediaGallery--desktop-root"
          size={gridSize}
          key={`image-${index}`}
        >
          <Paper
            sx={{
              overflow: 'hidden',
              backgroundColor: theme.palette.getInvertedMode('secondary'),
              border: `1px solid ${theme.palette.divider}`,
              cursor: 'pointer',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: theme.shadows[8],
                '& img': {
                  transform: 'scale(1.05)',
                },
              },
            }}
            onClick={() => handleMediaClick(mediaItem)}
          >
            <Box
              sx={{
                height: isMobile && !useMobileScrolling ? 200 : 256,
                overflow: 'hidden',
              }}
            >
              <ImageContainer
                src={imageMedia.src}
                srcSet={imageMedia.srcSet}
                sizes={imageMedia.sizes}
                alt={imageMedia.alt}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.3s ease',
                  background: theme.palette.background.default,
                }}
                showSkeletonDuration={showSkeletonDuration}
                lazy={lazy}
                rootMargin={rootMargin}
                threshold={threshold}
              />
            </Box>
            {media.caption && (
              <CardContent sx={{ p: 2, overflowY: 'auto' }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: ensureContrast(
                      theme.palette.text.primary,
                      theme.palette.getInvertedMode('secondary'),
                      2.5
                    ),
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  {media.caption}
                </Typography>
              </CardContent>
            )}
          </Paper>
        </Grid>
      );
    }

    if (type === 'video') {
      const video = { ...(media as VideoRenderAttributes) };

      return (
        <Grid size={gridSize} key={`video-${index}`}>
          <Paper
            sx={{
              overflow: 'hidden',
              backgroundColor:
                theme.palette.getInvertedMode?.('secondary') ||
                theme.palette.grey[100],
              border: `1px solid ${theme.palette.divider}`,
              cursor: 'pointer',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: theme.shadows[8],
              },
            }}
            onClick={() => handleMediaClick(mediaItem)}
          >
            <Box
              sx={{
                height: isMobile && !useMobileScrolling ? 200 : 256,
                position: 'relative',
              }}
            >
              <VideoPlayer
                video={video}
                sx={{
                  width: '100%',
                  height: '100%',
                }}
                muted={true}
                controls={false}
              />
              {/* Click overlay with play icon */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  bgcolor: 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: 0,
                  transition: 'opacity 0.3s ease',
                  '&:hover': {
                    opacity: 1,
                    bgcolor: 'rgba(0, 0, 0, 0.3)',
                  },
                }}
              >
                <PlayArrow sx={{ color: 'white', fontSize: 48 }} />
              </Box>
            </Box>
            {(video.caption || video.title || video.type) && (
              <CardContent sx={{ p: 2 }}>
                <Box
                  display="flex"
                  alignItems="flex-start"
                  gap={1}
                  mb={1}
                  flexWrap="wrap"
                >
                  {video.type && (
                    <Chip
                      label={video.type}
                      size="small"
                      sx={{
                        bgcolor: getVideoTypeColor(video.type),
                        color: 'white',
                        textTransform: 'capitalize',
                        fontSize: '0.75rem',
                      }}
                    />
                  )}
                  {video.title && (
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: ensureContrast(
                          theme.palette.text.primary,
                          theme.palette.getInvertedMode('secondary'),
                          2
                        ),
                        fontWeight: 'medium',
                        flex: 1,
                        minWidth: 0,
                      }}
                    >
                      {video.title}
                    </Typography>
                  )}
                </Box>
                {video.caption && (
                  <Typography
                    variant="body2"
                    sx={{
                      color: ensureContrast(
                        theme.palette.text.primary,
                        theme.palette.getInvertedMode('secondary'),
                        2.5
                      ),
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {video.caption}
                  </Typography>
                )}
              </CardContent>
            )}
          </Paper>
        </Grid>
      );
    }

    return null;
  };

  if (mediaItemsGallery.length === 0) {
    return null;
  }

  return (
    <Box ref={galleryRef} className="MediaGallery--root">
      <Box
        display="flex"
        alignItems="center"
        gap={isMobile ? 1 : 2}
        mb={3}
        flexWrap="wrap"
      >
        <Typography
          variant={isMobile ? 'h5' : 'h4'}
          sx={{ fontWeight: 'bold' }}
        >
          Gallery
        </Typography>
        <Box display="flex" gap={1} flexWrap="wrap">
          {images.length > 0 && (
            <Chip
              label={`${images.length} Image${images.length !== 1 ? 's' : ''}`}
              size="small"
              variant="outlined"
              sx={{ color: theme.palette.text.secondary }}
            />
          )}
          {videos.length > 0 && (
            <Chip
              label={`${videos.length} Video${videos.length !== 1 ? 's' : ''}`}
              size="small"
              variant="outlined"
              sx={{ color: theme.palette.text.secondary }}
            />
          )}
        </Box>
      </Box>

      {/* Conditional rendering based on mobile scrolling setting */}
      {useMobileScrolling ? (
        /* Mobile: Horizontal scrolling thumbnails */
        <Box sx={{ mb: 3 }}>
          <Box
            sx={{
              display: 'flex',
              gap: 1.5,
              overflowX: 'auto',
              pb: 1.5,
              // Custom scrollbar styling
              '&::-webkit-scrollbar': {
                height: 4,
              },
            }}
          >
            {mediaItemsGallery.map((mediaItem, index) =>
              renderMobileThumbnail(mediaItem, index)
            )}
          </Box>
        </Box>
      ) : (
        /* Desktop/Grid layout */
        <Grid container spacing={isMobile ? 2 : 3}>
          {mediaItemsGallery.map(renderDesktopMediaItem)}
        </Grid>
      )}

      {/* Media Modal */}
      <MediaModal
        mediaItems={mediaItemsModal}
        currentIndex={currentModalIndex}
        open={modalOpen}
        onClose={handleModalClose}
        onNavigate={handleModalNavigate}
      />
    </Box>
  );
};
