import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  useTheme,
  Chip,
  Modal,
  IconButton,
  Fade,
  Backdrop,
  TextField,
  InputAdornment,
} from '@mui/material';
import { Close, ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { VideoPlayer } from '@jc/ui-components';
import { MediaItem, ImageMediaData, VideoMediaData } from '../types';

interface MediaModalProps {
  mediaItems: MediaItem[];
  currentIndex: number;
  open: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export const MediaModal = ({
  mediaItems,
  currentIndex,
  open,
  onClose,
  onNavigate,
}: MediaModalProps) => {
  const theme = useTheme();
  const modalRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [pageInput, setPageInput] = useState(currentIndex + 1);

  const currentMedia = mediaItems[currentIndex];
  const isMobile = containerWidth < 768; // Responsive based on container width
  const showDots = mediaItems.length <= 10;

  // Update container width on resize
  useEffect(() => {
    const updateWidth = () => {
      if (modalRef.current) {
        setContainerWidth(modalRef.current.clientWidth);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, [open]);

  // Update page input when currentIndex changes
  useEffect(() => {
    setPageInput(currentIndex + 1);
  }, [currentIndex]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (!open) return;

      switch (event.key) {
        case 'ArrowLeft':
          handlePrevious();
          break;
        case 'ArrowRight':
          handleNext();
          break;
        case 'Escape':
          onClose();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [open, currentIndex, mediaItems.length]);

  const handlePrevious = () => {
    const newIndex =
      currentIndex > 0 ? currentIndex - 1 : mediaItems.length - 1;
    onNavigate(newIndex);
  };

  const handleNext = () => {
    const newIndex =
      currentIndex < mediaItems.length - 1 ? currentIndex + 1 : 0;
    onNavigate(newIndex);
  };

  const handleDotClick = (index: number) => {
    onNavigate(index);
  };

  const handlePageInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setPageInput(parseInt(value) || 1);
  };

  const handlePageInputSubmit = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === 'Enter') {
      const newIndex = Math.max(
        0,
        Math.min(pageInput - 1, mediaItems.length - 1)
      );
      onNavigate(newIndex);
    }
  };

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

  const getDetailedCaption = (media: MediaItem) => {
    if (media.type === 'video') {
      const video = media.data as VideoMediaData;
      return video.detailedCaption || video.caption || video.title;
    } else {
      const image = media.data as ImageMediaData;
      return image.detailedCaption || image.caption;
    }
  };

  if (!currentMedia) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
        sx: { backgroundColor: 'rgba(0, 0, 0, 0.9)' },
      }}
    >
      <Fade in={open}>
        <Box
          ref={modalRef}
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: isMobile ? '95%' : '90%',
            height: isMobile ? '90%' : '85%',
            maxWidth: 1200,
            maxHeight: 800,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: isMobile ? 1 : 2,
              borderBottom: `1px solid ${theme.palette.divider}`,
              minHeight: 56,
            }}
          >
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant={isMobile ? 'subtitle1' : 'h6'}
                component="div"
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {currentMedia.type === 'video'
                  ? (currentMedia.data as VideoMediaData).title || 'Video'
                  : (currentMedia.data as ImageMediaData).alt || 'Image'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {currentIndex + 1} of {mediaItems.length} • {currentMedia.type}
              </Typography>
            </Box>

            {currentMedia.type === 'video' &&
              (currentMedia.data as VideoMediaData).type && (
                <Chip
                  label={(currentMedia.data as VideoMediaData).type}
                  size="small"
                  sx={{
                    bgcolor: getVideoTypeColor(
                      (currentMedia.data as VideoMediaData).type
                    ),
                    color: 'white',
                    textTransform: 'capitalize',
                    mr: 1,
                    display: isMobile ? 'none' : 'inline-flex',
                  }}
                />
              )}

            <IconButton onClick={onClose} sx={{ color: 'text.secondary' }}>
              <Close />
            </IconButton>
          </Box>

          {/* Media Content */}
          <Box
            sx={{
              flex: 1,
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: currentMedia.type === 'video' ? 'black' : 'grey.100',
              overflow: 'hidden',
            }}
          >
            {/* Navigation Arrows */}
            {mediaItems.length > 1 && (
              <>
                <IconButton
                  onClick={handlePrevious}
                  sx={{
                    position: 'absolute',
                    left: isMobile ? 8 : 16,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    zIndex: 2,
                    bgcolor: 'rgba(0, 0, 0, 0.5)',
                    color: 'white',
                    width: isMobile ? 40 : 48,
                    height: isMobile ? 40 : 48,
                    '&:hover': {
                      bgcolor: 'rgba(0, 0, 0, 0.7)',
                    },
                  }}
                >
                  <ArrowBackIos sx={{ fontSize: isMobile ? 16 : 20 }} />
                </IconButton>

                <IconButton
                  onClick={handleNext}
                  sx={{
                    position: 'absolute',
                    right: isMobile ? 8 : 16,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    zIndex: 2,
                    bgcolor: 'rgba(0, 0, 0, 0.5)',
                    color: 'white',
                    width: isMobile ? 40 : 48,
                    height: isMobile ? 40 : 48,
                    '&:hover': {
                      bgcolor: 'rgba(0, 0, 0, 0.7)',
                    },
                  }}
                >
                  <ArrowForwardIos sx={{ fontSize: isMobile ? 16 : 20 }} />
                </IconButton>
              </>
            )}

            {/* Media Display */}
            {currentMedia.type === 'image' ? (
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  p: isMobile ? 1 : 2,
                }}
              >
                <Box
                  component="img"
                  src={(currentMedia.data as ImageMediaData).url}
                  alt={(currentMedia.data as ImageMediaData).alt}
                  sx={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain',
                    borderRadius: 1,
                  }}
                />
              </Box>
            ) : (
              <Box sx={{ width: '100%', height: '100%' }}>
                <VideoPlayer
                  video={{
                    ...(currentMedia.data as VideoMediaData),
                  }}
                  sx={{ width: '100%', height: '100%' }}
                  controls={true}
                  muted={false}
                />
              </Box>
            )}
          </Box>

          {/* Navigation Controls */}
          {mediaItems.length > 1 && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                py: isMobile ? 1 : 2,
                px: isMobile ? 1 : 3,
                borderTop: `1px solid ${theme.palette.divider}`,
                minHeight: isMobile ? 48 : 64,
              }}
            >
              {showDots ? (
                // Pagination Dots
                <Box
                  sx={{
                    display: 'flex',
                    gap: 0.5,
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                  }}
                >
                  {mediaItems.map((_, index) => (
                    <Box
                      key={index}
                      onClick={() => handleDotClick(index)}
                      sx={{
                        width: isMobile ? 6 : 8,
                        height: isMobile ? 6 : 8,
                        borderRadius: '50%',
                        bgcolor:
                          index === currentIndex ? 'primary.main' : 'grey.400',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          bgcolor:
                            index === currentIndex
                              ? 'primary.dark'
                              : 'grey.600',
                          transform: 'scale(1.2)',
                        },
                      }}
                    />
                  ))}
                </Box>
              ) : (
                // Page Input
                <TextField
                  size="small"
                  value={pageInput}
                  onChange={handlePageInputChange}
                  onKeyPress={handlePageInputSubmit}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Typography variant="caption" color="text.secondary">
                          / {mediaItems.length}
                        </Typography>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    width: isMobile ? 100 : 120,
                    '& .MuiInputBase-input': {
                      textAlign: 'center',
                      fontSize: isMobile ? '0.875rem' : '1rem',
                    },
                  }}
                  inputProps={{
                    min: 1,
                    max: mediaItems.length,
                    type: 'number',
                  }}
                />
              )}
            </Box>
          )}

          {/* Detailed Caption */}
          {getDetailedCaption(currentMedia) && (
            <Box
              sx={{
                p: isMobile ? 2 : 3,
                borderTop: `1px solid ${theme.palette.divider}`,
                bgcolor: 'background.default',
                maxHeight: isMobile ? '25%' : '30%',
                overflow: 'auto',
              }}
            >
              <Typography
                variant={isMobile ? 'body2' : 'body1'}
                color="text.primary"
                sx={{ lineHeight: 1.6 }}
              >
                {getDetailedCaption(currentMedia)}
              </Typography>
            </Box>
          )}
        </Box>
      </Fade>
    </Modal>
  );
};
