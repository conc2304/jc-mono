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
import { ImageContainer, VideoPlayer } from '@jc/ui-components';
import { MediaItem, ImageMediaData, VideoMediaData } from './types';
import { MediaModal } from './components';
import { ensureContrast } from '@jc/utils';

interface MediaGalleryProps {
  screenshots: ImageMediaData[];
  videos?: VideoMediaData[];
  onMediaClick?: (mediaItem: MediaItem) => void;
}

export const MediaGallery = ({
  screenshots,
  videos = [],
  onMediaClick,
}: MediaGalleryProps) => {
  const theme = useTheme();
  const galleryRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentModalIndex, setCurrentModalIndex] = useState(0);

  // Combine screenshots and videos into a single media array
  const mediaItems: MediaItem[] = [
    ...screenshots.map((screenshot, index) => ({
      type: 'image' as const,
      data: screenshot,
      index,
    })),
    ...videos.map((video, index) => ({
      type: 'video' as const,
      data: video,
      index: screenshots.length + index,
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

  const renderMediaItem = (mediaItem: MediaItem) => {
    const { type, data, index } = mediaItem;

    if (type === 'image') {
      const screenshot = data as ImageMediaData;
      // const imgSrcProps = getResponsiveImageSet(screenshot.url);

      return (
        <Grid size={{ xs: 12, lg: isMobile ? 12 : 6 }} key={`image-${index}`}>
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
            <Box sx={{ height: isMobile ? 200 : 256, overflow: 'hidden' }}>
              <ImageContainer
                src={screenshot.src}
                srcSet={screenshot.srcSet}
                sizes={screenshot.sizes}
                alt={screenshot.alt}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.3s ease',
                  background: theme.palette.background.default,
                }}
              />
            </Box>
            {screenshot.caption && (
              <CardContent sx={{ p: isMobile ? 1.5 : 2 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: ensureContrast(
                      theme.palette.text.primary,
                      theme.palette.getInvertedMode('secondary'),
                      2.5
                    ),
                    // color: theme.palette.text.primary,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  {screenshot.caption}
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
        <Grid size={{ xs: 12, lg: isMobile ? 12 : 6 }} key={`video-${index}`}>
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
            <Box sx={{ height: isMobile ? 200 : 256, position: 'relative' }}>
              <VideoPlayer
                video={video}
                sx={{
                  width: '100%',
                  height: '100%',
                }}
                muted={true}
                controls={false} // Disable controls in gallery view
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
                <PlayArrow
                  sx={{ color: 'white', fontSize: isMobile ? 40 : 48 }}
                />
              </Box>
            </Box>
            {(video.caption || video.title || video.type) && (
              <CardContent sx={{ p: isMobile ? 1.5 : 2 }}>
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
          {screenshots.length > 0 && (
            <Chip
              label={`${screenshots.length} Image${
                screenshots.length !== 1 ? 's' : ''
              }`}
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

      <Grid container spacing={isMobile ? 2 : 3}>
        {mediaItems.map(renderMediaItem)}
      </Grid>

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
