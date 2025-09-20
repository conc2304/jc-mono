export const SculpturePortfolio: React.FC<SculpturePortfolioProps> = ({
  sculptures,
}) => {
  const sectionsRef = useRef<(HTMLElement | null)[]>([]);
  const imageContainersRef = useRef<(HTMLDivElement | null)[]>([]);
  const ditherInstancesRef = useRef<any[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);

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
        fontSize: '15vw',
        zIndex: 100,
      });

      gsap.set('.sculpture-text', {
        position: 'fixed',
        top: '50vh',
        left: '50%',
        xPercent: -50,
        yPercent: -50,
        fontSize: '15vw',
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
          fontSize: '15vw',
        },
        {
          top: '1.5rem',
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
            fontSize: '15vw',
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
          const imageUrls = sculpture.images.map((img) => img.relativePath);

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
        /* ... your existing styles ... */
      `}</style>
    </Box>
  );
};
