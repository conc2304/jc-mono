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
import { Sculpture } from '@jc/portfolio';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { createDitherClass } from './dithering-class';
import { useMediaProvider } from '../../context';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

export interface SculpturePortfolioProps {
  sculptures: Sculpture[];
}

// Header Component
const SculptureHeader: React.FC<{ onMenuClick: () => void }> = ({
  onMenuClick,
}) => {
  const { generateImageSources } = useMediaProvider().provider;

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
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 400 },
          background: 'rgba(15, 15, 15, 0.98)',
          backdropFilter: 'blur(20px)',
          borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
        },
      }}
    >
      <Box sx={{ p: 4, pt: 10 }}>
        <Typography
          variant="h6"
          sx={{
            mb: 4,
            color: 'rgba(255, 255, 255, 0.5)',
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
                    color: 'rgba(255, 255, 255, 0.4)',
                    fontWeight: 500,
                  }}
                >
                  {String(index + 1).padStart(2, '0')}
                </Typography>
                <Typography sx={{ fontSize: '1.5rem', fontWeight: 300 }}>
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
const IntroSection: React.FC = () => {
  const speeds = [0.95, 0.9, 0.85, 0.8, 0.75, 0.7];

  return (
    <Box
      className="intro-section"
      sx={{ minHeight: '150vh', position: 'relative' }}
    >
      <Box
        className="intro-heading"
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
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

// Image Container Component
const DitherImageContainer: React.FC<{
  sculpture: Sculpture;
  containerRef: (el: HTMLDivElement | null) => void;
}> = ({ sculpture, containerRef }) => {
  const { generateImageSources } = useMediaProvider().provider;

  return (
    <Box
      ref={containerRef}
      className="image-container parallax-image"
      sx={{
        position: 'relative',
        width: '100%',
        height: { xs: '50vh', md: '70vh' },
        overflow: 'hidden',
        borderRadius: 1,
        '& img': {
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
        },
      }}
    >
      {sculpture.images.length === 1 && (
        <img
          src={
            generateImageSources(sculpture.images[0]?.relativePath, 'modal').src
          }
          alt={sculpture.images[0]?.alt || sculpture.title}
        />
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
  imageContainerRef: (el: HTMLDivElement | null) => void;
}> = ({ sculpture, index, sectionRef, imageContainerRef }) => {
  const isEven = index % 2 === 0;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box
      ref={sectionRef}
      className="sculpture-section"
      component="section"
      sx={{
        minHeight: '100vh',
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
            <DitherImageContainer
              sculpture={sculpture}
              containerRef={imageContainerRef}
            />
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
  const imageContainersRef = useRef<(HTMLDivElement | null)[]>([]);
  const ditherInstancesRef = useRef<any[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const { generateImageSources } = useMediaProvider().provider;

  useGSAP(
    () => {
      const DitherTransitionPlaylist = createDitherClass();

      // Set the scroller for all ScrollTriggers
      if (scrollerRef.current) {
        ScrollTrigger.defaults({
          scroller: scrollerRef.current,
        });
      }

      // Initial GSAP setup
      gsap.set('.header-logo', {
        position: 'fixed',
        top: '50vh',
        left: '50%',
        xPercent: -50,
        yPercent: -50,
        fontSize: '5vw',
        zIndex: 100,
      });

      gsap.set('.sculpture-text', {
        position: 'fixed',
        top: '50vh',
        left: '50%',
        xPercent: -50,
        yPercent: -50,
        fontSize: '5vw',
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
          end: () => window.innerHeight * 1.2,
          scrub: 0.6,
        },
      });

      logoTimeline.fromTo(
        '.header-logo',
        {
          top: '50vh',
          yPercent: -50,
          xPercent: -50,
          fontSize: '5vw',
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
            end: () => window.innerHeight * 1.2,
            scrub: 0.6,
          },
        });

        textTimeline.fromTo(
          text,
          {
            top: '50vh',
            yPercent: -50,
            xPercent: -50,
            fontSize: '5vw',
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

      sectionsRef.current.forEach((section, index) => {
        if (!section) return;

        const sculpture = sculptures[index];
        const content = section.querySelectorAll('.parallax-content');
        const imageContainer = imageContainersRef.current[index];
        const hasMultipleImages = sculpture.images.length > 1;

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
              start: 'top bottom',
              end: 'top 20%',
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
              start: 'top bottom',
              end: 'top 20%',
              scrub: 1.5,
            },
          }
        );

        if (hasMultipleImages && imageContainer) {
          const imageUrls = sculpture.images.map(
            (img) => generateImageSources(img.relativePath, 'gallery').src
          );

          const ditherInstance = new DitherTransitionPlaylist(imageContainer, {
            images: imageUrls,
            algorithm: 'floyd-steinberg',
            maxPixelation: 16,
            blendMode: 'normal',
            autoActivate: false,
          });

          ditherInstancesRef.current[index] = ditherInstance;

          ScrollTrigger.create({
            trigger: section,
            start: 'top top',
            end: () =>
              `+=${(sculpture.images.length - 1) * window.innerHeight}`,
            pin: true,
            scrub: 0.5,
            onEnter: () => {
              ditherInstance.activate();
            },
            onUpdate: (self) => {
              if (ditherInstance && ditherInstance.state.isActive) {
                ditherInstance.updateTransition(self.progress);
              }
            },
            onLeave: () => {
              ditherInstance.deactivate();
            },
            onEnterBack: () => {
              ditherInstance.activate();
            },
            onLeaveBack: () => {
              ditherInstance.deactivate();
            },
          });
        }

        const exitStart = hasMultipleImages
          ? `+=${(sculpture.images.length - 1) * window.innerHeight}`
          : 'bottom 80%';

        gsap.fromTo(
          content,
          { y: 0, opacity: 1 },
          {
            y: -150,
            opacity: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: exitStart,
              end: hasMultipleImages
                ? `+=${window.innerHeight * 0.8}`
                : 'bottom top',
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
              start: exitStart,
              end: hasMultipleImages
                ? `+=${window.innerHeight * 0.8}`
                : 'bottom top',
              scrub: 1.5,
            },
          }
        );
      });

      // Cleanup
      return () => {
        ScrollTrigger.defaults({ scroller: window });
        ditherInstancesRef.current.forEach((instance) => {
          if (instance && instance.destroy) {
            instance.destroy();
          }
        });
        ditherInstancesRef.current = [];
      };
    },
    {
      scope: scrollerRef, // Changed from containerRef to scrollerRef
      dependencies: [sculptures],
      revertOnUpdate: true, // Add this to clean up on re-render
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
        height: '100vh',
        overflowY: 'auto',
        overflowX: 'hidden',
        position: 'relative', // Important for fixed positioning to work
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

      <IntroSection />

      {sculptures.map((sculpture, index) => (
        <SculptureSection
          key={sculpture.id}
          sculpture={sculpture}
          index={index}
          sectionRef={(el) => (sectionsRef.current[index] = el)}
          imageContainerRef={(el) => (imageContainersRef.current[index] = el)}
        />
      ))}

      <style>{`
          .dither-playlist-wrapper {
            position: relative;
            width: 100%;
            height: 100%;
          }

          .dither-canvas-layer {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            image-rendering: pixelated;
            transition: opacity 0.3s ease;
            will-change: opacity;
            border-radius: 8px;
          }

          .dither-progress-dots {
            position: absolute;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 8px;
            z-index: 10;
          }

          .dither-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transition: all 0.3s ease;
          }

          .dither-dot.active {
            background: rgba(255, 255, 255, 0.9);
            transform: scale(1.5);
            box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
          }
        `}</style>
    </Box>
  );
};
