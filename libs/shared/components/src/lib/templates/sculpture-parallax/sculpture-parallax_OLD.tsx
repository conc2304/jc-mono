import React, { useRef, useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  Container,
  Grid,
  CardMedia,
  Chip,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { gsap } from 'gsap';
import { Observer } from 'gsap/Observer';
import { useGSAP } from '@gsap/react';
import { Sculpture } from '@jc/portfolio';
// Register GSAP plugins
gsap.registerPlugin(Observer, useGSAP);

// Styled components
const FullScreenContainer = styled(Box)(({ theme }) => ({
  height: '100vh',
  width: '100vw',
  overflow: 'hidden',
  position: 'fixed',
  top: 0,
  left: 0,
  backgroundColor: theme.palette.background.default,
  fontFamily: theme.typography.fontFamily,
}));

const SlideContainer = styled(Box)(({ theme }) => ({
  height: '100%',
  width: '100%',
  position: 'fixed',
  top: 0,
  visibility: 'hidden',
  zIndex: 1,
}));

const SlideOuter = styled(Box)({
  width: '100%',
  height: '100%',
  overflow: 'hidden',
});

const SlideInner = styled(Box)({
  width: '100%',
  height: '100%',
  overflow: 'hidden',
});

const SlideContent = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'absolute',
  height: '100%',
  width: '100%',
  top: 0,
});

const GradientBox = styled(Box)(({ gradientcolors }) => ({
  background: `linear-gradient(135deg, ${gradientcolors[0]} 0%, ${gradientcolors[1]} 100%)`,
  width: '100%',
  height: '100%',
}));

const SculptureImage = styled(CardMedia)(({ theme }) => ({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  borderRadius: theme.spacing(1),
  cursor: 'pointer',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

const ModalOverlay = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(0, 0, 0, 0.8)',
  backdropFilter: 'blur(10px)',
  zIndex: 1000,
  opacity: 0,
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
}));

const ModalContent = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: '100%',
  cursor: 'pointer',
});

const ModalImage = styled('img')(({ theme }) => ({
  maxWidth: '90vw',
  maxHeight: '90vh',
  objectFit: 'contain',
  borderRadius: theme.spacing(1.5),
  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
  cursor: 'default',
}));

const NavigationContainer = styled(Paper)(({ theme }) => ({
  position: 'fixed',
  zIndex: 999,
  bottom: theme.spacing(3),
  left: '50%',
  transform: 'translateX(-50%)',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  backdropFilter: 'blur(10px)',
  padding: theme.spacing(1, 2),
  borderRadius: theme.spacing(6),
  border: `1px solid rgba(255, 255, 255, 0.1)`,
}));

const OverlayCounter = styled(Typography)(({ theme }) => ({
  position: 'fixed',
  top: theme.spacing(4),
  right: theme.spacing(4),
  zIndex: 2,
  fontFamily: '"Playfair Display", serif',
  fontSize: 'clamp(4rem, 8vw, 8rem)',
  fontWeight: 300,
  color: 'rgba(255, 255, 255, 0.1)',
  lineHeight: 0.8,
  pointerEvents: 'none',
}));

// Gradient color mapping based on sculpture themes
const getGradientColors = (title: string, date: string): [string, string] => {
  // Map based on sculpture characteristics
  if (title.includes('Hoodie')) return ['#667eea', '#764ba2']; // Blue-purple for tech/modern
  if (title.includes('Square')) return ['#f093fb', '#f5576c']; // Pink for geometric
  if (
    title.includes('Belly') ||
    title.includes('Heart') ||
    title.includes('Rolls')
  )
    return ['#43e97b', '#38f9d7']; // Green for body positivity series
  if (title.includes('Intersections')) return ['#4facfe', '#00f2fe']; // Cyan for mixed materials
  if (title.includes('Spinal')) return ['#fa709a', '#fee140']; // Warm for organic forms

  // Default based on date as fallback
  const year = parseInt(date.match(/\d{4}/)?.[0] || '2020');
  if (year >= 2018) return ['#667eea', '#764ba2'];
  if (year >= 2016) return ['#f093fb', '#f5576c'];
  if (year >= 2010) return ['#4facfe', '#00f2fe'];
  return ['#43e97b', '#38f9d7'];
};

// Component props interface
export interface SculpturePortfolioProps {
  sculpturesData: Sculpture[];
}

export const SculpturePortfolio: React.FC<SculpturePortfolioProps> = ({
  sculpturesData,
}) => {
  const theme = useTheme();
  const containerRef = useRef(null);
  const slidesRef = useRef([]);
  const outerWrappersRef = useRef([]);
  const innerWrappersRef = useRef([]);
  const modalRef = useRef(null);
  const modalContentRef = useRef(null);
  const countRef = useRef(null);
  const navCounterRef = useRef(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState(null);
  const [originalImageState, setOriginalImageState] = useState(null);

  // GSAP animations using useGSAP hook
  useGSAP(() => {
    // Set initial positions
    gsap.set(outerWrappersRef.current, { xPercent: 100 });
    gsap.set(innerWrappersRef.current, { xPercent: -100 });
    gsap.set(outerWrappersRef.current[0], { xPercent: 0 });
    gsap.set(innerWrappersRef.current[0], { xPercent: 0 });

    // Set first slide as visible
    if (slidesRef.current[0]) {
      slidesRef.current[0].style.visibility = 'visible';
    }

    // Create mouse parallax effect
    let mouseY = 0;
    let targetY = 0;

    const handleMouseMove = (e) => {
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    document.addEventListener('mousemove', handleMouseMove);

    const ticker = gsap.ticker.add(() => {
      if (isModalOpen) return;

      targetY += (mouseY - targetY) * 0.05;

      const allImages = document.querySelectorAll('.sculpture-img');
      allImages.forEach((img, index) => {
        if (img.closest('.slide-container').style.visibility !== 'hidden') {
          const speed = parseFloat(img.dataset.speed) || 1;
          gsap.set(img, {
            yPercent: targetY * 10 * speed,
            rotationY: targetY * 5 * speed,
          });
        }
      });
    });

    // Observer for navigation
    const observer = Observer.create({
      type: 'wheel,touch,pointer',
      preventDefault: true,
      wheelSpeed: -1,
      onUp: () => {
        if (animating || isModalOpen) return;
        gotoSection(currentIndex + 1, +1);
      },
      onDown: () => {
        if (animating || isModalOpen) return;
        gotoSection(currentIndex - 1, -1);
      },
      tolerance: 10,
    });

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      gsap.ticker.remove(ticker);
      observer.kill();
    };
  }, [currentIndex, animating, isModalOpen]);

  // Navigation function
  const gotoSection = useCallback(
    (index, direction) => {
      if (animating) return;

      setAnimating(true);
      const wrappedIndex = gsap.utils.wrap(0, sculpturesData.length)(index);

      const tl = gsap.timeline({
        defaults: { duration: 1.2, ease: 'expo.inOut' },
        onComplete: () => {
          setAnimating(false);
          setCurrentIndex(wrappedIndex);
        },
      });

      const currentSection = slidesRef.current[currentIndex];
      const nextSection = slidesRef.current[wrappedIndex];
      const heading = currentSection?.querySelector('.slide-title');
      const nextHeading = nextSection?.querySelector('.slide-title');

      // Set z-index and visibility
      gsap.set(slidesRef.current, { zIndex: 0, autoAlpha: 0 });
      gsap.set(currentSection, { zIndex: 1, autoAlpha: 1 });
      gsap.set(nextSection, { zIndex: 2, autoAlpha: 1 });

      // Update counters
      tl.set(
        countRef.current,
        { text: (wrappedIndex + 1).toString() },
        0.32
      ).set(
        navCounterRef.current,
        { text: (wrappedIndex + 1).toString().padStart(2, '0') },
        0.32
      );

      // Slide animations
      tl.fromTo(
        outerWrappersRef.current[wrappedIndex],
        {
          xPercent: 100 * direction,
        },
        {
          xPercent: 0,
        },
        0
      ).fromTo(
        innerWrappersRef.current[wrappedIndex],
        {
          xPercent: -100 * direction,
        },
        {
          xPercent: 0,
        },
        0
      );

      // Text animations
      if (heading) {
        tl.to(
          heading,
          {
            xPercent: 30 * direction,
            opacity: 0.3,
          },
          0
        );
      }

      if (nextHeading) {
        tl.fromTo(
          nextHeading,
          {
            xPercent: -30 * direction,
            opacity: 0,
          },
          {
            xPercent: 0,
            opacity: 1,
          },
          0
        );
      }

      // Image animations
      const currentImages = currentSection?.querySelectorAll('.sculpture-img');
      const nextImages = nextSection?.querySelectorAll('.sculpture-img');

      if (currentImages) {
        tl.to(
          currentImages,
          {
            yPercent: -50 * direction,
            scale: 0.8,
            opacity: 0.3,
            stagger: 0.05,
          },
          0
        );
      }

      if (nextImages) {
        tl.fromTo(
          nextImages,
          {
            yPercent: 50 * direction,
            scale: 1.3,
            opacity: 0,
          },
          {
            yPercent: 0,
            scale: 1,
            opacity: 1,
            stagger: 0.05,
          },
          0.3
        );
      }
    },
    [animating, currentIndex]
  );

  // Modal functions
  const openImageModal = useCallback(
    (img) => {
      if (isModalOpen || animating) return;

      setIsModalOpen(true);

      const rect = img.getBoundingClientRect();
      const imageState = {
        element: img,
        x: rect.left,
        y: rect.top,
        width: rect.width,
        height: rect.height,
      };
      setOriginalImageState(imageState);

      const modalImg = img.cloneNode(true);
      modalImg.className = 'modal-image-clone';
      setModalImage(modalImg);
      modalContentRef.current.appendChild(modalImg);

      gsap.set(modalImg, {
        position: 'fixed',
        top: imageState.y,
        left: imageState.x,
        width: imageState.width,
        height: imageState.height,
        transform: 'none',
        zIndex: 1001,
      });

      gsap.set(img, { opacity: 0 });
      gsap.set(modalRef.current, { display: 'flex' });

      const tl = gsap.timeline();
      tl.to(modalRef.current, {
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out',
      }).to(
        modalImg,
        {
          top: '50%',
          left: '50%',
          width: 'auto',
          height: '90vh',
          transform: 'translate(-50%, -50%)',
          duration: 0.8,
          ease: 'expo.out',
        },
        0.1
      );
    },
    [isModalOpen, animating]
  );

  const closeImageModal = useCallback(() => {
    if (!isModalOpen || !modalImage || !originalImageState) return;

    const tl = gsap.timeline({
      onComplete: () => {
        modalContentRef.current.innerHTML = '';
        gsap.set(modalRef.current, { display: 'none' });
        gsap.set(originalImageState.element, { opacity: 1 });

        setModalImage(null);
        setOriginalImageState(null);
        setIsModalOpen(false);
      },
    });

    tl.to(modalImage, {
      top: originalImageState.y,
      left: originalImageState.x,
      width: originalImageState.width,
      height: originalImageState.height,
      transform: 'none',
      duration: 0.6,
      ease: 'expo.out',
    }).to(
      modalRef.current,
      {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.out',
      },
      0.2
    );
  }, [isModalOpen, modalImage, originalImageState]);

  // Event handlers
  const handleKeyPress = useCallback(
    (e) => {
      if (isModalOpen) {
        if (e.code === 'Escape') {
          closeImageModal();
        }
        return;
      }

      if ((e.code === 'ArrowUp' || e.code === 'ArrowLeft') && !animating) {
        gotoSection(currentIndex - 1, -1);
      }
      if (
        (e.code === 'ArrowDown' ||
          e.code === 'ArrowRight' ||
          e.code === 'Space' ||
          e.code === 'Enter') &&
        !animating
      ) {
        e.preventDefault();
        gotoSection(currentIndex + 1, 1);
      }
    },
    [isModalOpen, animating, currentIndex, gotoSection, closeImageModal]
  );

  const handleModalBackdropClick = useCallback(
    (e) => {
      if (
        e.target === modalRef.current ||
        e.target === modalContentRef.current
      ) {
        closeImageModal();
      }
    },
    [closeImageModal]
  );

  const handleImageClick = useCallback(
    (e) => {
      e.stopPropagation();
      openImageModal(e.target);
    },
    [openImageModal]
  );

  // Effects
  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  return (
    <FullScreenContainer ref={containerRef}>
      {sculpturesData.map((sculpture, index) => {
        const gradientColors = getGradientColors(
          sculpture.title,
          sculpture.date
        );
        return (
          <SlideContainer
            key={sculpture.id}
            className="slide-container"
            ref={(el) => (slidesRef.current[index] = el)}
          >
            <SlideOuter ref={(el) => (outerWrappersRef.current[index] = el)}>
              <SlideInner ref={(el) => (innerWrappersRef.current[index] = el)}>
                <SlideContent>
                  <GradientBox gradientcolors={gradientColors}>
                    <Container maxWidth="xl" sx={{ height: '90vh', py: 4 }}>
                      <Grid
                        container
                        spacing={4}
                        sx={{ height: '100%', alignItems: 'center' }}
                      >
                        <Grid item xs={12} md={6}>
                          <Box>
                            <Typography
                              variant="h1"
                              className="slide-title"
                              sx={{
                                color: theme.palette.text.primary,
                                mixBlendMode: 'difference',
                                mb: 2,
                              }}
                            >
                              {sculpture.title}
                            </Typography>

                            {sculpture.subtitle && (
                              <Typography
                                variant="h2"
                                sx={{
                                  color: theme.palette.text.secondary,
                                  mb: 3,
                                }}
                              >
                                {sculpture.subtitle}
                              </Typography>
                            )}

                            <Box
                              sx={{
                                mb: 3,
                                display: 'flex',
                                gap: 2,
                                flexWrap: 'wrap',
                              }}
                            >
                              <Chip
                                label={`Date: ${sculpture.date}`}
                                variant="outlined"
                                sx={{
                                  color: theme.palette.text.primary,
                                  borderColor: theme.palette.text.primary,
                                }}
                              />
                              <Chip
                                label={`Materials: ${sculpture.materials}`}
                                variant="outlined"
                                sx={{
                                  color: theme.palette.text.primary,
                                  borderColor: theme.palette.text.primary,
                                }}
                              />
                            </Box>

                            <Typography
                              variant="body1"
                              sx={{
                                color: theme.palette.text.secondary,
                                maxWidth: 500,
                              }}
                            >
                              {sculpture.description}
                            </Typography>
                          </Box>
                        </Grid>

                        <Grid item xs={12} md={6}>
                          <Box
                            sx={{
                              height: '100%',
                              position: 'relative',
                              overflow: 'hidden',
                            }}
                          >
                            <Grid container spacing={1} sx={{ height: '120%' }}>
                              {sculpture.images.map((image, imgIndex) => {
                                // Calculate grid positioning based on number of images
                                const isEven = imgIndex % 2 === 0;
                                const rowSpan =
                                  sculpture.images.length <= 2 ? 6 : 3;
                                const colSpan =
                                  sculpture.images.length === 1
                                    ? 12
                                    : isEven
                                    ? 7
                                    : 5;

                                return (
                                  <Grid
                                    item
                                    key={imgIndex}
                                    xs={colSpan}
                                    sx={{
                                      height:
                                        sculpture.images.length <= 2
                                          ? '50%'
                                          : imgIndex < 2
                                          ? '40%'
                                          : '60%',
                                      '&:nth-of-type(3)': { order: 3 },
                                      '&:nth-of-type(4)': { order: 4 },
                                    }}
                                  >
                                    <SculptureImage
                                      component="img"
                                      className="sculpture-img"
                                      data-speed={
                                        [0.8, 1.1, 0.9, 1.2, 1.0][imgIndex] ||
                                        1.0
                                      }
                                      src={image.relativePath}
                                      alt={image.alt}
                                      onClick={handleImageClick}
                                      sx={{
                                        height: '100%',
                                        '&:hover': {
                                          transform: 'scale(1.1)',
                                        },
                                      }}
                                    />
                                  </Grid>
                                );
                              })}
                            </Grid>
                          </Box>
                        </Grid>
                      </Grid>
                    </Container>
                  </GradientBox>
                </SlideContent>
              </SlideInner>
            </SlideOuter>
          </SlideContainer>
        );
      })}

      {/* Overlay Counter */}
      <OverlayCounter>
        0<span ref={countRef}>1</span>
      </OverlayCounter>

      {/* Navigation */}
      <NavigationContainer>
        <Typography
          ref={navCounterRef}
          variant="body1"
          sx={{ fontWeight: 600, color: theme.palette.text.primary }}
        >
          01
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: theme.palette.text.secondary }}
        >
          / {sculpturesData.length.toString().padStart(2, '0')}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: theme.palette.text.secondary,
            ml: 2,
            display: { xs: 'none', sm: 'block' },
          }}
        >
          Scroll or use arrow keys to navigate
        </Typography>
      </NavigationContainer>

      {/* Image Modal */}
      <ModalOverlay
        ref={modalRef}
        onClick={handleModalBackdropClick}
        sx={{ display: 'none' }}
      >
        <ModalContent ref={modalContentRef} />
      </ModalOverlay>
    </FullScreenContainer>
  );
};
