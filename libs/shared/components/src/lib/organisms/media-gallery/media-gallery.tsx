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
  VideoPlayer,
} from '@jc/ui-components';
import { MediaItem, ImageMediaData, VideoMediaData } from './types';
import { MediaModal } from './components';
import { ensureContrast } from '@jc/utils';

export interface MediaGalleryProps extends ImageLoadingProps {
  images?: ImageMediaData[];
  videos?: VideoMediaData[];
  onMediaClick?: (mediaItem: MediaItem) => void;
}

export const MediaGallery = ({
  images = [],
  videos = [],
  showSkeletonDuration,
  lazy,
  rootMargin,
  threshold,
  onMediaClick,
}: MediaGalleryProps) => {
  const theme = useTheme();
  const galleryRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentModalIndex, setCurrentModalIndex] = useState(0);

  // Combine screenshots and videos into a single media array
  const mediaItems: MediaItem[] = [
    ...images.map((screenshot, index) => ({
      type: 'image' as const,
      data: screenshot,
      index,
    })),
    ...videos.map((video, index) => ({
      type: 'video' as const,
      data: video,
      index: images.length + index,
    })),
  ];

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

  const isMobile = containerWidth < 768; // Responsive based on container width

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
    const { type, data } = mediaItem;

    return (
      <Box
        key={`mobile-${type}-${index}`}
        component="button"
        onClick={() => handleMediaClick(mediaItem)}
        sx={{
          flexShrink: 0,
          width: 80,
          height: 64,
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
            src={(data as ImageMediaData).src}
            srcSet={(data as ImageMediaData).srcSet}
            sizes={(data as ImageMediaData).sizes}
            alt={(data as ImageMediaData).alt}
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
              video={data as VideoMediaData}
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
    const { type, data, index } = mediaItem;

    if (type === 'image') {
      const image = data as ImageMediaData;

      return (
        <Grid size={{ xs: 12, lg: 6 }} key={`image-${index}`}>
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
            <Box sx={{ height: 256, overflow: 'hidden' }}>
              <ImageContainer
                src={image.src}
                srcSet={image.srcSet}
                sizes={image.sizes}
                alt={image.alt}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.3s ease',
                  background: theme.palette.background.default,
                }}
              />
            </Box>
            {image.caption && (
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
                  {image.caption}
                </Typography>
              </CardContent>
            )}
          </Paper>
        </Grid>
      );
    }

    if (type === 'video') {
      const video = { ...(data as VideoMediaData) };

      return (
        <Grid size={{ xs: 12, lg: 6 }} key={`video-${index}`}>
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
            <Box sx={{ height: 256, position: 'relative' }}>
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

  if (mediaItems.length === 0) {
    return null;
  }

  return (
    <Box ref={galleryRef}>
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

      {/* Mobile: Horizontal scrolling thumbnails */}
      {isMobile && mediaItems.length > 1 ? (
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
              '&::-webkit-scrollbar-track': {
                bgcolor: theme.palette.grey[200],
                borderRadius: 2,
              },
              '&::-webkit-scrollbar-thumb': {
                bgcolor: theme.palette.grey[400],
                borderRadius: 2,
                '&:hover': {
                  bgcolor: theme.palette.grey[600],
                },
              },
            }}
          >
            {mediaItems.map((mediaItem, index) =>
              renderMobileThumbnail(mediaItem, index)
            )}
          </Box>
        </Box>
      ) : (
        /* Desktop: Grid layout */
        <Grid container spacing={isMobile ? 2 : 3}>
          {mediaItems.map(renderDesktopMediaItem)}
        </Grid>
      )}

      {/* Media Modal */}
      <MediaModal
        mediaItems={mediaItems}
        currentIndex={currentModalIndex}
        open={modalOpen}
        onClose={handleModalClose}
        onNavigate={handleModalNavigate}
      />
    </Box>
  );
};
