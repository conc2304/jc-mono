import { useState, useEffect, useRef, useCallback } from 'react';
import { Box, Skeleton, Typography, BoxProps, SxProps } from '@mui/material';
import { Image, Error } from '@mui/icons-material';

interface ImageContainerProps
  extends Omit<BoxProps, 'component'>,
    ImageLoadingProps {
  src: string;
  srcSet?: string;
  sizes?: string;
  fallbackSrc?: string;
  fallbackSrcSet?: string;
  alt?: string;
  sx?: SxProps;
  skeletonSx?: SxProps;
  errorSx?: SxProps;
}

export interface ImageLoadingProps {
  /**
   * Minimum duration (in milliseconds) to show the skeleton loader
   * This ensures the skeleton is visible for a minimum time for better UX
   * @default 300
   */
  showSkeletonDuration?: number;
  /**
   * Enable lazy loading using Intersection Observer
   * @default true
   */
  lazy?: boolean;
  /**
   * Root margin for Intersection Observer (how far from viewport to start loading)
   * @default '50px'
   */
  rootMargin?: string;
  /**
   * Threshold for Intersection Observer (0 = any pixel visible, 1 = fully visible)
   * @default 0.1
   */
  threshold?: number;
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
  lazy = true,
  rootMargin = '50px',
  threshold = 0.1,
  ...props
}: ImageContainerProps) => {
  const [imageState, setImageState] = useState('loading');
  const [currentSrc, setCurrentSrc] = useState(lazy ? '' : src);
  const [currentSrcSet, setCurrentSrcSet] = useState(lazy ? '' : srcSet);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [isIntersecting, setIsIntersecting] = useState(!lazy);
  const [shouldLoad, setShouldLoad] = useState(!lazy);

  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer hook
  const observerCallback = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && !shouldLoad) {
        setIsIntersecting(true);
        setShouldLoad(true);
      }
    },
    [shouldLoad]
  );

  useEffect(() => {
    if (!lazy) return;

    const element = containerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(observerCallback, {
      rootMargin,
      threshold,
    });

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [lazy, observerCallback, rootMargin, threshold]);

  // Handle image source updates
  useEffect(() => {
    if (!shouldLoad) return;

    setImageState('loading');
    setCurrentSrc(src);
    setCurrentSrcSet(srcSet);
    setShowSkeleton(true);

    // Minimum skeleton display time for better UX
    const skeletonTimer = setTimeout(() => {
      setShowSkeleton(false);
    }, showSkeletonDuration);

    return () => clearTimeout(skeletonTimer);
  }, [src, srcSet, showSkeletonDuration, shouldLoad]);

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
      {/* <Image sx={{ color: 'grey.400', zIndex: 1 }} /> */}
      <Box
        component="img"
        src="gifs/Static.gif"
        alt={'Loading'}
        sx={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: 0.2,
        }}
      />
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

  // Show skeleton while not intersecting (lazy loading) or while loading/during minimum display time
  if (!shouldLoad || (imageState === 'loading' && showSkeleton)) {
    return (
      <Box ref={containerRef} sx={{ position: 'relative', ...sx }} {...props}>
        <SkeletonLoader />
      </Box>
    );
  }

  // Show error fallback
  if (imageState === 'error') {
    return (
      <Box ref={containerRef} sx={{ position: 'relative', ...sx }} {...props}>
        <ErrorFallback />
      </Box>
    );
  }

  // Show actual image (may still be loading but skeleton time is over)
  return (
    <Box ref={containerRef} sx={{ position: 'relative', ...sx }} {...props}>
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
          {/* <Image sx={{ color: 'grey.400', zIndex: 1 }} /> */}
          <Box
            component="img"
            src="gifs/Static.gif"
            alt={'Loading'}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: 0.2,
            }}
          />
        </Box>
      )}
    </Box>
  );
};
