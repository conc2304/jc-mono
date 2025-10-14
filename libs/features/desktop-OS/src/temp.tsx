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
  Button,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
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
        height: '100%',
        overflow: 'hidden',
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
  const [showMore, setShowMore] = useState(false);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const [needsShowMore, setNeedsShowMore] = useState(false);

  useEffect(() => {
    if (descriptionRef.current) {
      const lineHeight = parseInt(
        window.getComputedStyle(descriptionRef.current).lineHeight
      );
      const maxLines = 4;
      const maxHeight = lineHeight * maxLines;
      setNeedsShowMore(descriptionRef.current.scrollHeight > maxHeight);
    }
  }, [sculpture.description]);

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography
        variant="h2"
        className="sculpture-title"
        sx={{
          fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.75rem' },
          mb: 1,
          lineHeight: 1.1,
          fontWeight: 600,
        }}
      >
        {sculpture.title}
      </Typography>

      {sculpture.subtitle && (
        <Typography
          variant="h3"
          className="sculpture-subtitle"
          sx={{
            fontSize: { xs: '1rem', sm: '1.25rem' },
            fontWeight: 300,
            mb: 2,
            color: '#999',
            fontStyle: 'italic',
          }}
        >
          {sculpture.subtitle}
        </Typography>
      )}

      <Box
        className="sculpture-meta"
        sx={{
          mb: 2,
          pb: 2,
          borderBottom: '1px solid #333',
        }}
      >
        <Typography
          sx={{
            my: 0.5,
            fontSize: { xs: '0.75rem', sm: '0.85rem' },
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
            fontSize: { xs: '0.75rem', sm: '0.85rem' },
            color: '#aaa',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}
        >
          {sculpture.materials}
        </Typography>
      </Box>

      <Box
        sx={{
          flex: 1,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Typography
          ref={descriptionRef}
          className="sculpture-description"
          sx={{
            fontSize: { xs: '0.95rem', sm: '1rem' },
            lineHeight: 1.6,
            color: '#ccc',
            fontWeight: 300,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: showMore ? 'unset' : 4,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {sculpture.description}
        </Typography>

        {needsShowMore && (
          <Button
            onClick={() => setShowMore(!showMore)}
            sx={{
              mt: 1,
              color: 'white',
              textTransform: 'none',
              fontSize: '0.85rem',
              alignSelf: 'flex-start',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            {showMore ? 'Show Less' : 'Show More'}
          </Button>
        )}
      </Box>
    </Box>
  );
};

// Navigation Arrow Component
const NavigationArrow: React.FC<{
  direction: 'up' | 'down';
  onClick: () => void;
  disabled?: boolean;
}> = ({ direction, onClick, disabled }) => {
  return (
    <Box
      sx={{
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-50%)',
        [direction === 'up' ? 'top' : 'bottom']: 8,
        zIndex: 10,
      }}
    >
      <IconButton
        onClick={onClick}
        disabled={disabled}
        sx={{
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          color: 'white',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
          },
          '&.Mui-disabled': {
            opacity: 0.3,
            color: 'white',
          },
        }}
      >
        {direction === 'up' ? (
          <KeyboardArrowUpIcon />
        ) : (
          <KeyboardArrowDownIcon />
        )}
      </IconButton>
    </Box>
  );
};

// Sculpture Section Component
const SculptureSection: React.FC<{
  sculpture: Sculpture;
  index: number;
  sectionRef: (el: HTMLElement | null) => void;
  containerHeight: number;
  onNavigateUp: () => void;
  onNavigateDown: () => void;
  isFirst: boolean;
  isLast: boolean;
}> = ({
  sculpture,
  index,
  sectionRef,
  containerHeight,
  onNavigateUp,
  onNavigateDown,
  isFirst,
  isLast,
}) => {
  return (
    <Box
      ref={sectionRef}
      className="sculpture-section"
      component="section"
      sx={{
        height: containerHeight,
        width: '100%',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <NavigationArrow
        direction="up"
        onClick={onNavigateUp}
        disabled={isFirst}
      />

      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          pt: 8,
          pb: 6,
        }}
      >
        <Box
          sx={{
            flex: { xs: '0 0 40%', sm: '0 0 50%' },
            minHeight: 0,
            px: 2,
          }}
        >
          <ImageCarousel sculpture={sculpture} />
        </Box>

        <Box
          sx={{
            flex: { xs: '1 1 60%', sm: '1 1 50%' },
            minHeight: 0,
            px: 3,
            py: 2,
            overflow: 'auto',
          }}
        >
          <SculptureDetails sculpture={sculpture} />
        </Box>
      </Box>

      <NavigationArrow
        direction="down"
        onClick={onNavigateDown}
        disabled={isLast}
      />
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
        scrollTo: { y: section, offsetY: 0 },
        duration: 1,
        ease: 'power2.inOut',
      });
      setMenuOpen(false);
    }
  };

  const scrollToSection = (index: number) => {
    const section = sectionsRef.current[index];
    if (section && scrollerRef.current) {
      gsap.to(scrollerRef.current, {
        scrollTo: { y: section, offsetY: 0 },
        duration: 0.8,
        ease: 'power2.inOut',
      });
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
          onNavigateUp={() => {
            if (index === 0) {
              scrollerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
              scrollToSection(index - 1);
            }
          }}
          onNavigateDown={() => scrollToSection(index + 1)}
          isFirst={index === 0}
          isLast={index === sculptures.length - 1}
        />
      ))}
    </Box>
  );
};
