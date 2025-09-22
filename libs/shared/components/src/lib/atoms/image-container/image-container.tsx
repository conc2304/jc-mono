import { useState, useEffect, useRef, useCallback } from 'react';
import { Box, Skeleton, Typography, BoxProps, SxProps } from '@mui/material';
import { Error } from '@mui/icons-material';
import { useMediaProvider } from '../../context';

// Utility function to find the closest scrollable parent
const findScrollableParent = (element: Element | null): Element | null => {
  if (!element) {
    return null;
  }

  // Check if we've reached the document element
  if (element === document.documentElement) {
    return null;
  }

  const style = getComputedStyle(element);
  const overflowY = style.overflowY;
  const overflowX = style.overflowX;
  const overflow = style.overflow;

  // Check if element is scrollable and actually has scrollable content
  const isScrollable =
    overflowY === 'scroll' ||
    overflowY === 'auto' ||
    overflowX === 'scroll' ||
    overflowX === 'auto' ||
    overflow === 'scroll' ||
    overflow === 'auto';

  if (isScrollable) {
    // Additional check: does it actually have scrollable height?
    const hasScrollableContent =
      element.scrollHeight > element.clientHeight ||
      element.scrollWidth > element.clientWidth;

    if (hasScrollableContent) {
      return element;
    }
  }

  return findScrollableParent(element.parentElement);
};

interface ImageContainerProps
  extends Omit<BoxProps, 'component'>,
    ImageLoadingProps {
  src: string;
  srcSet?: string;
  sizes?: string;
  skeletonSrc?: string;
  fallbackSrc?: string;
  fallbackSrcSet?: string;
  alt?: string;
  sx?: SxProps;
  skeletonSx?: SxProps;
  errorSx?: SxProps;
}

export interface ImageLoadingProps {
  showSkeletonDuration?: number;
  lazy?: boolean;
  rootMargin?: string;
  threshold?: number;
  /**
   * The root element to use for intersection observer
   * If not provided, will attempt to find the closest scrollable parent
   * @default null (viewport)
   */
  scrollRoot?: Element | null;
  debug?: boolean;
}

export const ImageContainer = ({
  src,
  srcSet,
  sizes,
  skeletonSrc,
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
  scrollRoot,
  debug = false,
  ...props
}: ImageContainerProps) => {
  const [imageState, setImageState] = useState('loading');
  const [currentSrc, setCurrentSrc] = useState(lazy ? '' : src);
  const [currentSrcSet, setCurrentSrcSet] = useState(lazy ? '' : srcSet);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [isIntersecting, setIsIntersecting] = useState(!lazy);
  const [shouldLoad, setShouldLoad] = useState(!lazy);

  const containerRef = useRef<HTMLDivElement>(null);

  const {
    provider: { generateImageSources, generatePlaceholder },
  } = useMediaProvider();

  // Intersection Observer hook
  const observerCallback = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;

      // Debug logging
      if (debug) {
        console.log('Intersection Observer triggered:', {
          isIntersecting: entry.isIntersecting,
          intersectionRatio: entry.intersectionRatio,
          boundingClientRect: entry.boundingClientRect,
          rootBounds: entry.rootBounds,
          shouldLoad: shouldLoad,
          src: src,
        });
      }

      if (entry.isIntersecting && !shouldLoad) {
        setIsIntersecting(true);
        setShouldLoad(true);
      }
    },
    [shouldLoad, src]
  );

  const skeletonImageUrl = skeletonSrc
    ? generatePlaceholder(skeletonSrc)
    : generateImageSources('textures/ui/static.jpg', 'thumbnail');

  useEffect(() => {
    if (!lazy) return;

    const element = containerRef.current;
    if (!element) return;

    // Determine the root element for intersection observer
    let root: Element | null = null;

    if (scrollRoot !== undefined) {
      // Use explicitly provided scroll root
      root = scrollRoot;
    } else {
      // Auto-detect scrollable parent
      root = findScrollableParent(element.parentElement);
    }

    if (debug) {
      console.log('IntersectionObserver setup:', {
        root: root
          ? root.tagName + (root.className ? `.${root.className}` : '')
          : 'viewport',
        rootMargin,
        threshold,
        elementPosition: element.getBoundingClientRect(),
      });
    }

    const observer = new IntersectionObserver(observerCallback, {
      root,
      rootMargin,
      threshold,
    });

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [lazy, observerCallback, rootMargin, threshold, scrollRoot]);

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

  // Cached skeleton loader component
  const SkeletonLoader = () => (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.paper',
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
      <Box
        sx={{
          background: `url(${skeletonImageUrl})`,
          width: '100%',
          height: '100%',
          backgroundSize: '100% 100%',
          backgroundPosition: 'center center',
          // opacity: 0.5,
          // mixBlendMode: 'overlay',
          border: '2px solid red',
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
          ...sx,
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
          <Box
            component="img"
            alt="Loading"
            sx={{
              backgroundImage: `url(${skeletonImageUrl})`,
              backgroundSize: '100% 100%',
              backgroundPosition: 'center center',
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: 0.5,
              mixBlendMode: 'overlay',
            }}
          />
        </Box>
      )}
    </Box>
  );
};
