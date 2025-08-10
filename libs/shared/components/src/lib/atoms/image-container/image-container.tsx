import { useState, useEffect } from 'react';
import { Box, Skeleton, Typography, BoxProps, SxProps } from '@mui/material';
import { Image, Error } from '@mui/icons-material';

interface ImageContainerProps extends Omit<BoxProps, 'component'> {
  src: string;
  srcSet?: string;
  sizes?: string;
  fallbackSrc?: string;
  fallbackSrcSet?: string;
  alt?: string;
  sx?: SxProps;
  skeletonSx?: SxProps;
  errorSx?: SxProps;
  /**
   * Minimum duration (in milliseconds) to show the skeleton loader
   * This ensures the skeleton is visible for a minimum time for better UX
   * @default 300
   */
  showSkeletonDuration?: number;
}

export const ImageContainer = ({
  src,
  srcSet,
  sizes,
  fallbackSrc,
  fallbackSrcSet,
  alt = '',
  sx = {},
  skeletonSx = {},
  errorSx = {},
  showSkeletonDuration = 300,
  ...props
}: ImageContainerProps) => {
  const [imageState, setImageState] = useState('loading');
  const [currentSrc, setCurrentSrc] = useState(src);
  const [currentSrcSet, setCurrentSrcSet] = useState(srcSet);
  const [showSkeleton, setShowSkeleton] = useState(true);

  useEffect(() => {
    setImageState('loading');
    setCurrentSrc(src);
    setCurrentSrcSet(srcSet);
    setShowSkeleton(true);

    // Minimum skeleton display time for better UX
    const skeletonTimer = setTimeout(() => {
      setShowSkeleton(false);
    }, showSkeletonDuration);

    return () => clearTimeout(skeletonTimer);
  }, [src, srcSet, showSkeletonDuration]);

  const handleImageLoad = () => {
    setImageState('loaded');
  };

  const handleImageError = () => {
    if (currentSrc === src && fallbackSrc) {
      // Try fallback image
      setCurrentSrc(fallbackSrc);
      setCurrentSrcSet(fallbackSrcSet);
      setImageState('loading');
    } else {
      // No fallback or fallback also failed
      setImageState('error');
    }
  };

  // Skeleton loader component
  const SkeletonLoader = () => (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'grey.200',
        ...sx,
        ...skeletonSx,
      }}
      {...props}
    >
      <Skeleton
        variant="rectangular"
        width="100%"
        height="100%"
        animation="wave"
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />
      <Image sx={{ color: 'grey.400', zIndex: 1 }} />
    </Box>
  );

  // Error fallback component
  const ErrorFallback = () => (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        bgcolor: 'grey.100',
        border: '2px dashed',
        borderColor: 'grey.300',
        gap: 1,
        ...sx,
        ...errorSx,
      }}
      {...props}
    >
      <Error sx={{ color: 'grey.400' }} />
      <Typography variant="caption" color="text.secondary">
        Failed to load image
      </Typography>
    </Box>
  );

  // Show skeleton while loading or during minimum display time
  if (imageState === 'loading' && showSkeleton) {
    return <SkeletonLoader />;
  }

  // Show error fallback
  if (imageState === 'error') {
    return <ErrorFallback />;
  }

  // Show actual image (may still be loading but skeleton time is over)
  return (
    <Box sx={{ position: 'relative', ...sx }}>
      <Box
        component="img"
        src={currentSrc}
        srcSet={currentSrcSet}
        sizes={sizes}
        alt={alt}
        onLoad={handleImageLoad}
        onError={handleImageError}
        sx={{
          width: '100%',
          height: '100%',
          opacity: imageState === 'loading' ? 0 : 1,
          transition: 'opacity 0.3s ease-in-out',
          objectFit: 'cover',
        }}
        {...props}
      />
      {imageState === 'loading' && !showSkeleton && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'grey.200',
          }}
        >
          <Skeleton
            variant="rectangular"
            width="100%"
            height="100%"
            animation="wave"
            sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          />
          <Image sx={{ color: 'grey.400', zIndex: 1 }} />
        </Box>
      )}
    </Box>
  );
};
