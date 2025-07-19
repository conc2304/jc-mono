'use client';
import React, { useRef, ReactNode, useCallback } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/700.css';
import { Typography, TypographyProps } from '@mui/material';
import { Box } from '@mui/system';

// Register the useGSAP plugin
gsap.registerPlugin(useGSAP);

interface GlitchTextProps extends TypographyProps {
  children: ReactNode;
  className?: string;
  intensity?: 'low' | 'medium' | 'high' | 'extreme';
  triggerOnHover?: boolean;
  autoGlitch?: boolean;
  autoGlitchIntervalTime?: number;
}

interface IntensitySettings {
  duration: number;
  layers: number;
  scrambleChance: number;
  colorShift: number;
}

export const GlitchText: React.FC<GlitchTextProps> = ({
  children,
  className = '',
  intensity = 'medium',
  triggerOnHover = true,
  autoGlitch = false,
  autoGlitchIntervalTime = 3000,
  component,
  variant,
  ...typographyProps
}) => {
  const textRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLSpanElement>(null);
  const isGlitching = useRef<boolean>(false);
  const autoGlitchInterval = useRef<NodeJS.Timeout | null>(null);
  const originalTextRef = useRef<string>('');

  const glitchChars =
    '█▓▒░▀▄▌▐│┤┐└┴┬├─┼╔╗╚╝║═╬◄►▲▼!@#$%^&*()_+-=[]{}|;:,.<>?~`';
  const alienFonts = ['Wingdings', 'Webdings', 'Symbol', 'Zapf Dingbats'];

  const getIntensitySettings = useCallback((): IntensitySettings => {
    const settings: Record<string, IntensitySettings> = {
      low: { duration: 0.8, layers: 2, scrambleChance: 0.3, colorShift: 2 },
      medium: { duration: 1.2, layers: 3, scrambleChance: 0.5, colorShift: 5 },
      high: { duration: 1.8, layers: 4, scrambleChance: 0.7, colorShift: 10 },
      extreme: {
        duration: 2.5,
        layers: 5,
        scrambleChance: 0.9,
        colorShift: 20,
      },
    };
    return settings[intensity] || settings.medium;
  }, [intensity]);

  const createGlitchLayers = useCallback((): HTMLSpanElement[] => {
    const container = containerRef.current;
    const text = textRef.current;
    if (!container || !text) return [];

    // Use stored original text instead of current text content
    const originalText = originalTextRef.current;

    // Clear existing layers
    const existingLayers = container.querySelectorAll('.glitch-layer');
    existingLayers.forEach((layer) => layer.remove());

    const layers: HTMLSpanElement[] = [];

    for (let i = 0; i < 5; i++) {
      const layer = document.createElement('span');
      layer.className = `glitch-layer glitch-layer-${i}`;
      layer.textContent = originalText;
      layer.style.position = 'absolute';
      layer.style.top = '0';
      layer.style.left = '0';
      layer.style.width = '100%';
      layer.style.height = '100%';
      layer.style.opacity = '0';
      layer.style.pointerEvents = 'none';
      container.appendChild(layer);
      layers.push(layer);
    }

    return layers;
  }, []);

  const performReverseAnimation = useCallback((): void => {
    if (!textRef.current || !containerRef.current) return;

    const text = textRef.current;
    const container = containerRef.current;
    const originalText = originalTextRef.current; // Use stored original text

    // Kill any ongoing animations
    gsap.killTweensOf([text, container]);

    // Clear any glitch layers
    const existingLayers = container.querySelectorAll('.glitch-layer');
    existingLayers.forEach((layer) => layer.remove());

    // Smooth transition back to original state
    const tl = gsap.timeline({
      onComplete: () => {
        // Ensure original text is restored
        text.textContent = originalText;
        text.style.fontFamily = '';
        text.style.color = '';
        text.style.textShadow = '';
        isGlitching.current = false;
      },
    });

    // Gentle reverse animation
    tl.to([text, container], {
      duration: 0.4,
      opacity: 1,
      scale: 1,
      rotationX: 0,
      rotationY: 0,
      filter: 'none',
      ease: 'power2.out',
    }).call(
      () => {
        // Restore original text content and styles
        text.textContent = originalText;
        text.style.fontFamily = '';
        text.style.color = '';
        text.style.textShadow = '';
      },
      [],
      0.2
    );
  }, []);

  const performGlitch = useCallback((): void => {
    if (isGlitching.current || !textRef.current || !containerRef.current)
      return;

    isGlitching.current = true;
    const text = textRef.current;
    const container = containerRef.current;
    const originalText = originalTextRef.current; // Use stored original text
    const settings = getIntensitySettings();
    const layers = createGlitchLayers();

    const tl = gsap.timeline({
      onComplete: () => {
        isGlitching.current = false;
        // Clean up layers
        layers.forEach((layer) => layer.remove());
      },
    });

    // Main text glitch sequence
    tl.to(text, {
      duration: 0.1,
      opacity: 0.8,
      scale: 1.05,
      ease: 'power2.inOut',
    });

    // Layer animations with different effects
    layers.forEach((layer, index) => {
      const delay = index * 0.05;
      const xOffset = (Math.random() - 0.5) * settings.colorShift;
      const yOffset = (Math.random() - 0.5) * settings.colorShift;

      // Set layer colors and blend modes
      if (index === 0) {
        layer.style.color = '#ff0080';
        layer.style.mixBlendMode = 'screen';
      } else if (index === 1) {
        layer.style.color = '#00ffff';
        layer.style.mixBlendMode = 'multiply';
      } else if (index === 2) {
        layer.style.color = '#ffff00';
        layer.style.mixBlendMode = 'overlay';
      } else {
        layer.style.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
        layer.style.mixBlendMode = 'difference';
      }

      tl.to(
        layer,
        {
          duration: 0.1,
          opacity: 0.7,
          x: xOffset,
          y: yOffset,
          ease: 'power2.inOut',
        },
        delay
      )
        .to(
          layer,
          {
            duration: 0.05,
            scaleX: 1 + Math.random() * 0.1,
            scaleY: 1 + Math.random() * 0.1,
            ease: 'power2.inOut',
          },
          delay + 0.1
        )
        .to(
          layer,
          {
            duration: 0.1,
            opacity: 0,
            ease: 'power2.inOut',
          },
          delay + settings.duration - 0.2
        );
    });

    // Text scrambling effect
    const scrambleText = (): string => {
      const chars = originalText.split('');
      const scrambledChars = chars.map((char) => {
        if (char === ' ') return ' ';
        return Math.random() < settings.scrambleChance
          ? glitchChars[Math.floor(Math.random() * glitchChars.length)]
          : char;
      });
      return scrambledChars.join('');
    };

    // Scramble sequence
    const scrambleFrames = 8 + settings.layers * 2;
    for (let i = 0; i < scrambleFrames; i++) {
      tl.call(
        () => {
          text.textContent = scrambleText();

          // Random font changes
          if (Math.random() < 0.3) {
            text.style.fontFamily =
              alienFonts[Math.floor(Math.random() * alienFonts.length)];
          }

          // Random color shifts
          if (Math.random() < 0.4) {
            text.style.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
            text.style.textShadow = `
              ${Math.random() * 4 - 2}px ${Math.random() * 4 - 2}px 0 #ff0080,
              ${Math.random() * 4 - 2}px ${Math.random() * 4 - 2}px 0 #00ffff
            `;
          }
        },
        [],
        i * 0.08
      );
    }

    // Container distortion effects
    tl.to(
      container,
      {
        duration: 0.15,
        rotationX: Math.random() * 4 - 2,
        rotationY: Math.random() * 4 - 2,
        ease: 'power2.inOut',
      },
      0.2
    )
      .to(
        container,
        {
          duration: 0.1,
          filter: `
            brightness(${1.2 + Math.random() * 0.5})
            contrast(${1.3 + Math.random() * 0.5})
            hue-rotate(${Math.random() * 180}deg)
            saturate(${1.5 + Math.random()})
          `,
          ease: 'power2.inOut',
        },
        0.3
      )
      // Restore original state
      .call(
        () => {
          text.textContent = originalText;
          text.style.fontFamily = '';
          text.style.color = '';
          text.style.textShadow = '';
        },
        [],
        settings.duration - 0.3
      )
      .to(
        [text, container],
        {
          duration: 0.3,
          opacity: 1,
          scale: 1,
          rotationX: 0,
          rotationY: 0,
          filter: 'none',
          ease: 'back.out(1.7)',
        },
        settings.duration - 0.3
      );
  }, [getIntensitySettings, createGlitchLayers, glitchChars, alienFonts]);

  // useGSAP hook handles all GSAP-related setup and cleanup
  useGSAP(
    () => {
      const container = containerRef.current;
      const text = textRef.current;
      if (!container || !text) return;

      // Store the original text content on mount
      originalTextRef.current = text.textContent || '';

      // Setup hover event listeners
      let hoverCleanup: (() => void) | undefined;

      if (triggerOnHover) {
        const handleMouseEnter = () => performGlitch();
        const handleMouseLeave = () => performReverseAnimation();

        container.addEventListener('mouseenter', handleMouseEnter);
        container.addEventListener('mouseleave', handleMouseLeave);

        hoverCleanup = () => {
          container.removeEventListener('mouseenter', handleMouseEnter);
          container.removeEventListener('mouseleave', handleMouseLeave);
        };
      }

      // Setup auto glitch interval
      if (autoGlitch) {
        autoGlitchInterval.current = setInterval(
          performGlitch,
          autoGlitchIntervalTime
        );
      }

      // Cleanup function
      return () => {
        // Clear hover listener
        if (hoverCleanup) {
          hoverCleanup();
        }

        // Clear auto glitch interval
        if (autoGlitchInterval.current) {
          clearInterval(autoGlitchInterval.current);
          autoGlitchInterval.current = null;
        }

        // Clean up any remaining glitch layers
        if (containerRef.current) {
          const existingLayers =
            containerRef.current.querySelectorAll('.glitch-layer');
          existingLayers.forEach((layer) => layer.remove());
        }

        // Reset glitching state
        isGlitching.current = false;
      };
    },
    {
      scope: containerRef,
      dependencies: [
        intensity,
        triggerOnHover,
        autoGlitch,
        autoGlitchInterval,
        performGlitch,
        performReverseAnimation,
      ],
    }
  );

  return (
    <Box
      component="span"
      ref={containerRef}
      className={`select-none ${className}`}
      sx={{
        fontFamily: '"JetBrains Mono", monospace',
        perspective: '1000px',
        transformStyle: 'preserve-3d',
        display: 'inline-block',
        position: 'relative',
        cursor: 'pointer',
      }}
    >
      <Typography
        component={component || 'span'}
        variant={variant}
        ref={textRef}
        {...typographyProps}
        sx={(theme) => ({
          position: 'relative',
          zIndex: 10,
          display: 'inline-block',
          transition: theme.transitions.create(['all'], {
            duration: theme.transitions.duration.short,
            easing: theme.transitions.easing.easeOut,
          }),
          fontFamily: 'inherit',
          fontSize: 'inherit',
          fontWeight: 'inherit',
          lineHeight: 'inherit',
          letterSpacing: 'inherit',
          transform: 'scale(1)',

          '&:hover': {
            transform: 'scale(1.05)',
          },
          // ...typographyProps.sx,
        })}
      >
        {children}
      </Typography>
    </Box>
  );
};
