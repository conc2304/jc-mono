import React, { useEffect, useRef, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  Typography,
  Box,
  Container,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { BaseImageData, useMediaProvider } from '@jc/ui-components';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

interface Sculpture {
  id: number;
  title: string;
  subtitle?: string;
  date: string;
  materials: string;
  images: BaseImageData[];
  description: string;
}

export interface SculpturePortfolioProps {
  sculptures: Sculpture[];
}

// Header Component
const SculptureHeader: React.FC<{ onMenuClick: () => void }> = ({
  onMenuClick,
}) => {
  return (
    <AppBar
      position="fixed"
      className="sticky-header"
      sx={{
        background: 'rgba(10, 10, 10, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid transparent',
        boxShadow: 'none',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography
          variant="display"
          className="header-logo"
          sx={{ fontSize: '2rem', position: 'fixed' }}
        >
          Sculpture
        </Typography>
        <IconButton
          className="menu-button"
          onClick={onMenuClick}
          sx={{
            color: 'white',
            opacity: 0,
            ml: 'auto',
          }}
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

// Navigation Component
const NavigationMenu: React.FC<{
  open: boolean;
  onClose: () => void;
  sculptures: Sculpture[];
  onNavigate: (index: number) => void;
}> = ({ open, onClose, sculptures, onNavigate }) => {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            width: { xs: '100%', sm: 400 },
            background: 'rgba(15, 15, 15, 0.98)',
            backdropFilter: 'blur(20px)',
            borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
          },
        },
      }}
    >
      <Box sx={{ p: 4, pt: 10 }}>
        <Typography
          variant="h6"
          sx={{
            mb: 4,
            color: 'rgba(255, 255, 255, 0.9)',
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            fontWeight: 700,
          }}
        >
          Sculptures
        </Typography>
        <List>
          {sculptures.map((sculpture, index) => (
            <ListItem key={sculpture.id} disablePadding>
              <ListItemButton
                className="nav-item"
                onClick={() => onNavigate(index)}
                sx={{
                  display: 'flex',
                  gap: 2,
                  py: 2,
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    pl: 2,
                  },
                }}
              >
                <Typography
                  sx={{
                    fontSize: '1rem',
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontWeight: 500,
                  }}
                >
                  {String(index + 1).padStart(2, '0')}
                </Typography>
                <Typography
                  sx={{
                    fontSize: '1.5rem',
                    fontWeight: 300,
                    color: 'rgba(255, 255, 255, 0.6)',
                  }}
                >
                  {sculpture.title}
                </Typography>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

// Intro Section Component
const IntroSection: React.FC<{ containerHeight: number }> = ({
  containerHeight,
}) => {
  const speeds = [0.95, 0.9, 0.85, 0.8, 0.75, 0.7];

  return (
    <Box
      className="intro-section"
      sx={{ height: containerHeight, position: 'relative' }}
    >
      <Box
        className="intro-heading"
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: containerHeight,
          textAlign: 'center',
          zIndex: 99,
          pointerEvents: 'none',
        }}
      >
        <Box
          className="text-container"
          sx={{ position: 'relative', width: '100%', height: '100%' }}
        >
          {speeds.map((speed, i) => (
            <Typography
              key={i}
              variant="display"
              className="sculpture-text"
              data-speed={speed}
              sx={{
                position: 'fixed',
                left: '50%',
                fontWeight: 700,
                lineHeight: 0.9,
                margin: 0,
                textAlign: 'center',
                letterSpacing: '-0.02em',
                color: 'transparent',
                WebkitTextStroke: '1.5px white',
                zIndex: 99,
              }}
            >
              Sculpture
            </Typography>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

// Image Carousel Component
const ImageCarousel: React.FC<{
  sculpture: Sculpture;
}> = ({ sculpture }) => {
  const { generateImageSources } = useMediaProvider().provider;
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? sculpture.images.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev === sculpture.images.length - 1 ? 0 : prev + 1
    );
  };

  const showControls = sculpture.images.length > 1;

  return (
    <Box
      className="image-container"
      sx={{
        position: 'relative',
        width: '100%',
        height: { xs: 300, md: 500 },
        overflow: 'hidden',
        borderRadius: 1,
      }}
    >
      <Box
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img
          src={
            generateImageSources(
              sculpture.images[currentIndex].relativePath,
              'modal'
            ).src
          }
          alt={
            sculpture.images[currentIndex].alt ||
            `${sculpture.title} - Image ${currentIndex + 1}`
          }
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            display: 'block',
          }}
        />
      </Box>

      {showControls && (
        <>
          <IconButton
            onClick={handlePrev}
            sx={{
              position: 'absolute',
              left: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
              },
            }}
          >
            <ChevronLeftIcon />
          </IconButton>

          <IconButton
            onClick={handleNext}
            sx={{
              position: 'absolute',
              right: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
              },
            }}
          >
            <ChevronRightIcon />
          </IconButton>

          <Box
            sx={{
              position: 'absolute',
              bottom: 16,
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: 1,
            }}
          >
            {sculpture.images.map((_, index) => (
              <Box
                key={index}
                onClick={() => setCurrentIndex(index)}
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor:
                    index === currentIndex
                      ? 'white'
                      : 'rgba(255, 255, 255, 0.4)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
              />
            ))}
          </Box>
        </>
      )}
    </Box>
  );
};

// Sculpture Details Component
const SculptureDetails: React.FC<{ sculpture: Sculpture }> = ({
  sculpture,
}) => {
  return (
    <Box sx={{ p: 2 }}>
      <Typography
        variant="h2"
        className="parallax-content sculpture-title"
        sx={{
          fontSize: { xs: '2.5rem', md: '3.5rem' },
          mb: 2,
          lineHeight: 1.1,
        }}
      >
        {sculpture.title}
      </Typography>

      {sculpture.subtitle && (
        <Typography
          variant="h3"
          className="parallax-content sculpture-subtitle"
          sx={{
            fontSize: '1.75rem',
            fontWeight: 300,
            mb: 3,
            color: '#999',
            fontStyle: 'italic',
          }}
        >
          {sculpture.subtitle}
        </Typography>
      )}

      <Box
        className="parallax-content sculpture-meta"
        sx={{
          mb: 3,
          pb: 3,
          borderBottom: '1px solid #333',
        }}
      >
        <Typography
          sx={{
            my: 0.5,
            fontSize: '0.95rem',
            color: '#fff',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}
        >
          {sculpture.date}
        </Typography>
        <Typography
          sx={{
            my: 0.5,
            fontSize: '0.95rem',
            color: '#aaa',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}
        >
          {sculpture.materials}
        </Typography>
      </Box>

      <Typography
        className="parallax-content sculpture-description"
        sx={{
          fontSize: '1.1rem',
          lineHeight: 1.8,
          color: '#ccc',
          fontWeight: 300,
        }}
      >
        {sculpture.description}
      </Typography>
    </Box>
  );
};

// Sculpture Section Component
const SculptureSection: React.FC<{
  sculpture: Sculpture;
  index: number;
  sectionRef: (el: HTMLElement | null) => void;
  containerHeight: number;
}> = ({ sculpture, index, sectionRef, containerHeight }) => {
  const isEven = index % 2 === 0;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box
      ref={sectionRef}
      className="sculpture-section"
      component="section"
      sx={{
        height: containerHeight,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: { xs: 2, md: 4 },
        position: 'relative',
      }}
    >
      <Container maxWidth="lg">
        <Box
          className={`section-content ${isEven ? 'image-left' : 'image-right'}`}
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: { xs: 2, md: 4 },
            alignItems: 'center',
          }}
        >
          <Box sx={{ order: isMobile ? 1 : isEven ? 1 : 2 }}>
            <ImageCarousel sculpture={sculpture} />
          </Box>
          <Box sx={{ order: isMobile ? 2 : isEven ? 2 : 1 }}>
            <SculptureDetails sculpture={sculpture} />
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

// Main Portfolio Component
export const SculpturePortfolio: React.FC<SculpturePortfolioProps> = ({
  sculptures,
}) => {
  const sectionsRef = useRef<(HTMLElement | null)[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState(800);

  // Measure container height
  useEffect(() => {
    if (scrollerRef.current) {
      const updateHeight = () => {
        setContainerHeight(scrollerRef.current?.clientHeight || 800);
      };
      updateHeight();

      const resizeObserver = new ResizeObserver(updateHeight);
      resizeObserver.observe(scrollerRef.current);

      return () => resizeObserver.disconnect();
    }
  }, []);

  useGSAP(
    () => {
      // Set the scroller for all ScrollTriggers
      if (scrollerRef.current) {
        ScrollTrigger.defaults({
          scroller: scrollerRef.current,
        });
      }

      const fontSize = Math.min(containerHeight * 0.08, 80);

      // Initial GSAP setup
      gsap.set('.header-logo', {
        position: 'fixed',
        top: containerHeight / 2,
        left: '50%',
        xPercent: -50,
        yPercent: -50,
        fontSize: fontSize,
        zIndex: 100,
      });

      gsap.set('.sculpture-text', {
        position: 'fixed',
        top: containerHeight / 2,
        left: '50%',
        xPercent: -50,
        yPercent: -50,
        fontSize: fontSize,
        zIndex: 99,
      });

      gsap.set('.menu-button', {
        opacity: 0,
      });

      gsap.set('.sticky-header', {
        borderBottomColor: 'rgba(255, 255, 255, 0)',
      });

      const logoTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: '.intro-section',
          start: 'top top',
          end: () => containerHeight * 1.2,
          scrub: 0.6,
        },
      });

      logoTimeline.fromTo(
        '.header-logo',
        {
          top: containerHeight / 2,
          yPercent: -50,
          xPercent: -50,
          fontSize: fontSize,
        },
        {
          top: '0.75rem',
          yPercent: 0,
          xPercent: -50,
          fontSize: '2rem',
          duration: 0.8,
        }
      );

      gsap.utils.toArray('.sculpture-text').forEach((text: any) => {
        const speed = parseFloat(text.getAttribute('data-speed') || '1');
        const delay = (1 - speed) * 0.4;

        const textTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: '.intro-section',
            start: 'top top',
            end: () => containerHeight * 1.2,
            scrub: 0.6,
          },
        });

        textTimeline.fromTo(
          text,
          {
            top: containerHeight / 2,
            yPercent: -50,
            xPercent: -50,
            fontSize: fontSize,
            opacity: 1,
          },
          {
            top: '1.5rem',
            yPercent: 0,
            xPercent: -50,
            fontSize: '2rem',
            opacity: 0,
            duration: 0.8,
          },
          delay
        );
      });

      logoTimeline.fromTo(
        '.menu-button',
        {
          opacity: 0,
        },
        {
          opacity: 1,
          duration: 0.1,
        },
        0.9
      );

      logoTimeline.fromTo(
        '.sticky-header',
        {
          boxShadow: '0px 0px 10px rgba(0,0,0,0)',
          borderBottomColor: 'rgba(255, 255, 255, 0)',
        },
        {
          boxShadow: '0px 0px 10px rgba(0,0,0,0.5)',
          borderBottomColor: 'rgba(255, 255, 255, 0.1)',
          duration: 0.2,
        },
        0.9
      );

      sectionsRef.current.forEach((section) => {
        if (!section) return;

        const content = section.querySelectorAll('.parallax-content');
        const imageContainer = section.querySelector('.image-container');

        gsap.fromTo(
          content,
          { y: 150, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.2,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top 60%', // Changed from 'top bottom' - triggers when section top hits 60% from top
              end: 'top 30%', // Changed from 'top 20%' - completes when section top hits 30% from top
              scrub: 1.5,
            },
          }
        );

        gsap.fromTo(
          imageContainer,
          { y: 150, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top 60%', // Match with content
              end: 'top 30%', // Match with content
              scrub: 1.5,
            },
          }
        );

        gsap.fromTo(
          content,
          { y: 0, opacity: 1 },
          {
            y: -150,
            opacity: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'bottom 70%', // Changed from 'bottom 80%' - triggers when section bottom hits 70% from top
              end: 'bottom 40%', // Changed from 'bottom top' - completes when section bottom hits 40% from top
              scrub: 1.5,
            },
          }
        );

        gsap.fromTo(
          imageContainer,
          { y: 0, opacity: 1 },
          {
            y: -150,
            opacity: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'bottom 80%',
              end: 'bottom top',
              scrub: 1.5,
            },
          }
        );
      });

      // Cleanup
      return () => {
        ScrollTrigger.defaults({ scroller: window });
      };
    },
    {
      scope: scrollerRef,
      dependencies: [sculptures, containerHeight],
      revertOnUpdate: true,
    }
  );

  const handleNavClick = (index: number) => {
    const section = sectionsRef.current[index];
    if (section && scrollerRef.current) {
      gsap.to(scrollerRef.current, {
        scrollTo: { y: section, offsetY: 100 },
        duration: 1,
        ease: 'power2.inOut',
      });
      setMenuOpen(false);
    }
  };

  return (
    <Box
      ref={scrollerRef}
      sx={{
        background: '#0a0a0a',
        color: '#ffffff',
        height: '100%',
        maxHeight: '100%',
        overflowY: 'auto',
        overflowX: 'hidden',
        position: 'relative',
      }}
      className="SculpturePortfolio--root"
    >
      <SculptureHeader onMenuClick={() => setMenuOpen(true)} />

      <NavigationMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        sculptures={sculptures}
        onNavigate={handleNavClick}
      />

      <IntroSection containerHeight={containerHeight} />

      {sculptures.map((sculpture, index) => (
        <SculptureSection
          key={`${sculpture.id}-section_${index}`}
          sculpture={sculpture}
          index={index}
          sectionRef={(el) => (sectionsRef.current[index] = el)}
          containerHeight={containerHeight}
        />
      ))}
    </Box>
  );
};
