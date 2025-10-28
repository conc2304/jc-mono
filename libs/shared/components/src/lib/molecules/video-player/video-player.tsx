import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  IconButton,
  Typography,
  CircularProgress,
  useTheme,
  Fade,
  SxProps,
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  VolumeUp,
  VolumeOff,
  Fullscreen,
  Error as ErrorIcon,
} from '@mui/icons-material';

import { ImageContainer } from '../../atoms';
import { VideoRenderAttributes } from '../../organisms';

interface VideoPlayerProps {
  video: VideoRenderAttributes;
  sx?: SxProps;
  autoPlay?: boolean;
  controls?: boolean;
  muted?: boolean;
  loop?: boolean;
  lazy?: boolean;
  lazyOffset?: string | number;
  onPlay?: () => void;
  onPause?: () => void;
  onError?: () => void;
  onLazyLoad?: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  video,
  sx = {},
  autoPlay = false,
  controls = true,
  muted = true,
  loop = false,
  lazy = false,
  lazyOffset = '100px',
  onPlay,
  onPause,
  onError,
  onLazyLoad,
}) => {
  const theme = useTheme();
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(!lazy);
  const [hasError, setHasError] = useState(false);
  const [isMuted, setIsMuted] = useState(muted);
  const [showControls, setShowControls] = useState(false);
  const [showThumbnail, setShowThumbnail] = useState(!!video.thumbnail);
  const [shouldLoad, setShouldLoad] = useState(!lazy);
  const [_isIntersecting, setIsIntersecting] = useState(false);
  const [showPlayOverlay, setShowPlayOverlay] = useState(true);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!lazy || shouldLoad) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setIsIntersecting(entry.isIntersecting);

        if (entry.isIntersecting) {
          setShouldLoad(true);
          setIsLoading(true);
          onLazyLoad?.();
          observer.disconnect();
        }
      },
      {
        rootMargin:
          typeof lazyOffset === 'number' ? `${lazyOffset}px` : lazyOffset,
        threshold: 0.1,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [lazy, lazyOffset, shouldLoad, onLazyLoad]);

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
      setShowThumbnail(false);
      setShowPlayOverlay(false);
      onPlay?.();
    }
  };

  const handlePause = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
      setShowPlayOverlay(true);
      onPause?.();
    }
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      handlePause();
    } else {
      handlePlay();
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const handleVideoLoad = () => {
    setIsLoading(false);
  };

  const handleVideoError = () => {
    setIsLoading(false);
    setHasError(true);
    onError?.();
  };

  const handleThumbnailClick = () => {
    if (!shouldLoad) {
      setShouldLoad(true);
      setIsLoading(true);
    } else {
      handlePlay();
    }
  };

  const handleVideoClick = () => {
    if (isPlaying) {
      handlePause();
    } else {
      handlePlay();
    }
  };

  const getTypeColor = (type?: string) => {
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

  if (hasError) {
    return (
      <Box
        ref={containerRef}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'grey.100',
          border: '2px dashed',
          borderColor: 'grey.300',
          p: 3,
          ...sx,
        }}
      >
        <ErrorIcon sx={{ color: 'grey.400', fontSize: 48, mb: 1 }} />
        <Typography variant="body2" color="text.secondary">
          Failed to load video
        </Typography>
        {video.title && (
          <Typography variant="caption" color="text.secondary">
            {video.title}
          </Typography>
        )}
      </Box>
    );
  }

  // Lazy loading placeholder
  if (lazy && !shouldLoad) {
    return (
      <Box
        ref={containerRef}
        sx={{
          position: 'relative',
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          backgroundColor: 'black',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          ...sx,
        }}
        onClick={handleThumbnailClick}
      >
        {/* Video Type Badge */}
        {video.type && (
          <Box
            sx={{
              position: 'absolute',
              top: 8,
              left: 8,
              zIndex: 3,
              bgcolor: getTypeColor(video.type),
              color: 'white',
              px: 1,
              py: 0.5,
              borderRadius: 1,
              typography: 'caption',
              textTransform: 'capitalize',
            }}
          >
            {video.type}
          </Box>
        )}

        {/* Thumbnail or Placeholder */}
        {video.thumbnail ? (
          <>
            <ImageContainer
              src={video.thumbnail}
              alt={video.title || 'Video thumbnail'}
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
            {/* Large Play Button Overlay */}
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                bgcolor: 'rgba(0, 0, 0, 0.8)',
                borderRadius: '50%',
                p: 3,
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  bgcolor: 'rgba(0, 0, 0, 0.9)',
                  transform: 'translate(-50%, -50%) scale(1.1)',
                },
              }}
            >
              <PlayArrow sx={{ color: 'white', fontSize: 72 }} />
            </Box>
          </>
        ) : (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              color: 'white',
            }}
          >
            <Box
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '50%',
                p: 3,
                mb: 2,
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  transform: 'scale(1.1)',
                },
              }}
            >
              <PlayArrow sx={{ fontSize: 72 }} />
            </Box>
            <Typography variant="body2">Click to load video</Typography>
            {video.title && (
              <Typography variant="caption" sx={{ mt: 1, textAlign: 'center' }}>
                {video.title}
              </Typography>
            )}
          </Box>
        )}
      </Box>
    );
  }

  return (
    <Box
      ref={containerRef}
      sx={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        backgroundColor: 'black',
        cursor: 'pointer',
        ...sx,
      }}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
      onClick={handleVideoClick}
    >
      {/* Video Type Badge */}
      {video.type && (
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            left: 8,
            zIndex: 3,
            bgcolor: getTypeColor(video.type),
            color: 'white',
            px: 1,
            py: 0.5,
            borderRadius: 1,
            typography: 'caption',
            textTransform: 'capitalize',
          }}
        >
          {video.type}
        </Box>
      )}

      {/* Thumbnail Overlay */}
      {showThumbnail && video.thumbnail && shouldLoad && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 2,
          }}
        >
          <ImageContainer
            src={video.thumbnail}
            alt={video.title || 'Video thumbnail'}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
          {/* Large Play Button Overlay */}
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              bgcolor: 'rgba(0, 0, 0, 0.8)',
              borderRadius: '50%',
              p: 3,
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.9)',
                transform: 'translate(-50%, -50%) scale(1.1)',
              },
            }}
          >
            <PlayArrow sx={{ color: 'white', fontSize: 72 }} />
          </Box>
        </Box>
      )}

      {/* Large Play Button Overlay for Paused Video */}
      {!showThumbnail && showPlayOverlay && !isPlaying && shouldLoad && (
        <Fade in={showPlayOverlay}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 2,
              bgcolor: 'rgba(0, 0, 0, 0.8)',
              borderRadius: '50%',
              p: 3,
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.9)',
                transform: 'translate(-50%, -50%) scale(1.1)',
              },
            }}
          >
            <PlayArrow sx={{ color: 'white', fontSize: 72 }} />
          </Box>
        </Fade>
      )}

      {/* Video Element - only render when shouldLoad is true */}
      {shouldLoad && (
        <Box
          component="video"
          ref={videoRef}
          src={video.url}
          autoPlay={autoPlay}
          muted={isMuted}
          loop={loop}
          onLoadedData={handleVideoLoad}
          onError={handleVideoError}
          onPlay={() => {
            setIsPlaying(true);
            setShowPlayOverlay(false);
          }}
          onPause={() => {
            setIsPlaying(false);
            setShowPlayOverlay(true);
          }}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: showThumbnail ? 'none' : 'block',
          }}
        />
      )}

      {/* Loading Spinner */}
      {isLoading && shouldLoad && !showThumbnail && (
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 2,
          }}
        >
          <CircularProgress sx={{ color: 'white' }} />
        </Box>
      )}

      {/* Custom Controls */}
      {controls && !showThumbnail && shouldLoad && (
        <Fade in={showControls || !isPlaying}>
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
              p: 2,
              zIndex: 2,
            }}
            onClick={(e) => e.stopPropagation()} // Prevent video click handler
          >
            <Box display="flex" alignItems="center" gap={1}>
              <IconButton
                onClick={togglePlayPause}
                sx={{ color: 'white' }}
                size="small"
              >
                {isPlaying ? <Pause /> : <PlayArrow />}
              </IconButton>

              <IconButton
                onClick={toggleMute}
                sx={{ color: 'white' }}
                size="small"
              >
                {isMuted ? <VolumeOff /> : <VolumeUp />}
              </IconButton>

              <Box sx={{ flexGrow: 1 }} />

              <IconButton
                onClick={toggleFullscreen}
                sx={{ color: 'white' }}
                size="small"
              >
                <Fullscreen />
              </IconButton>
            </Box>

            {video.title && (
              <Typography
                variant="caption"
                sx={{
                  color: 'white',
                  display: 'block',
                  mt: 1,
                  opacity: 0.9,
                }}
              >
                {video.title}
              </Typography>
            )}
          </Box>
        </Fade>
      )}
    </Box>
  );
};
