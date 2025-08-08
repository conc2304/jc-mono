import React, { useState, useRef } from 'react';
import {
  Box,
  IconButton,
  Typography,
  CircularProgress,
  useTheme,
  Fade,
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  VolumeUp,
  VolumeOff,
  Fullscreen,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { ImageContainer } from '@jc/ui-components';

interface VideoData {
  url: string;
  title?: string;
  type?: 'demo' | 'process' | 'final' | 'inspiration';
  thumbnail?: string;
  caption?: string;
}

interface VideoPlayerProps {
  video: VideoData;
  sx?: any;
  autoPlay?: boolean;
  controls?: boolean;
  muted?: boolean;
  loop?: boolean;
  onPlay?: () => void;
  onPause?: () => void;
  onError?: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  video,
  sx = {},
  autoPlay = false,
  controls = true,
  muted = true,
  loop = false,
  onPlay,
  onPause,
  onError,
}) => {
  const theme = useTheme();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isMuted, setIsMuted] = useState(muted);
  const [showControls, setShowControls] = useState(false);
  const [showThumbnail, setShowThumbnail] = useState(!!video.thumbnail);

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
      setShowThumbnail(false);
      onPlay?.();
    }
  };

  const handlePause = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
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

  const handleVideoError = (e) => {
    setIsLoading(false);
    setHasError(true);
    onError?.();
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

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        backgroundColor: 'black',
        ...sx,
      }}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
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
      {showThumbnail && video.thumbnail && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 2,
            cursor: 'pointer',
          }}
          onClick={handlePlay}
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
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              bgcolor: 'rgba(0, 0, 0, 0.7)',
              borderRadius: '50%',
              p: 2,
            }}
          >
            <PlayArrow sx={{ color: 'text.primary', fontSize: 48 }} />
          </Box>
        </Box>
      )}

      {/* Video Element */}
      <Box
        component="video"
        ref={videoRef}
        src={video.url}
        autoPlay={autoPlay}
        muted={isMuted}
        loop={loop}
        onLoadedData={handleVideoLoad}
        onError={handleVideoError}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        sx={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: showThumbnail ? 'none' : 'block',
        }}
      />

      {/* Loading Spinner */}
      {isLoading && !showThumbnail && (
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
      {controls && !showThumbnail && (
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
          >
            <Box display="flex" alignItems="center" gap={1}>
              <IconButton
                onClick={togglePlayPause}
                sx={{ color: 'red' }}
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
