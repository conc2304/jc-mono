import React, { useRef, useEffect, ReactNode } from 'react';
import { gsap } from 'gsap';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/700.css';
import { Typography, TypographyProps } from '@mui/material';

interface GlitchTextProps extends TypographyProps {
  children: ReactNode;
  className?: string;
  intensity?: 'low' | 'medium' | 'high' | 'extreme';
  triggerOnHover?: boolean;
  autoGlitch?: boolean;
  autoGlitchInterval?: number;
  scrambleOnLeave?: boolean;
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
  autoGlitchInterval = 3000,
  scrambleOnLeave = true,
  ...typographyProps
}) => {
  const textRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLSpanElement>(null);
  const isGlitching = useRef<boolean>(false);
  const isScrambling = useRef<boolean>(false);
  const sx = typographyProps.sx || {};

  useEffect(() => {
    const setupGlitchEffects = () => {
      const text = textRef.current;
      const container = containerRef.current;

      if (!text || !container) return;

      const originalText = text.textContent || '';

      // Create multiple text layers for complex glitch effects
      const createGlitchLayers = (): HTMLSpanElement[] => {
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
      };

      const glitchChars =
        '█▓▒░▀▄▌▐│┤┐└┴┬├─┼╔╗╚╝║═╬◄►▲▼!@#$%^&*()_+-=[]{}|;:,.<>?~`';
      const alienFonts = [
        // 'Wingdings',
        // 'Webdings',
        'Symbol',
        // 'Zapf Dingbats',
        'Glyphz',
      ];

      const getIntensitySettings = (): IntensitySettings => {
        const settings: Record<string, IntensitySettings> = {
          low: { duration: 0.8, layers: 2, scrambleChance: 0.3, colorShift: 2 },
          medium: {
            duration: 1.2,
            layers: 3,
            scrambleChance: 0.5,
            colorShift: 5,
          },
          high: {
            duration: 1.8,
            layers: 4,
            scrambleChance: 0.7,
            colorShift: 10,
          },
          extreme: {
            duration: 2.5,
            layers: 5,
            scrambleChance: 0.9,
            colorShift: 20,
          },
        };
        return settings[intensity] || settings.medium;
      };

      const performGlitch = (): void => {
        if (isGlitching.current || isScrambling.current) return;
        isGlitching.current = true;

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
      };

      // New scramble effect for mouse leave
      const performScrambleLeave = (): void => {
        // First, interrupt any ongoing glitch animation
        if (
          isGlitching.current &&
          container &&
          (container as any)._glitchTimeline
        ) {
          (container as any)._glitchTimeline.kill();
          isGlitching.current = false;
          // Clean up any existing layers
          const existingLayers = container.querySelectorAll('.glitch-layer');
          existingLayers.forEach((layer) => layer.remove());
        }

        if (isScrambling.current) return;
        isScrambling.current = true;

        // Kill any existing animations on the text and container
        gsap.killTweensOf(text);
        gsap.killTweensOf(container);

        const tl = gsap.timeline({
          onComplete: () => {
            isScrambling.current = false;
            // Ensure we're back to original state
            if (text) {
              text.textContent = originalText;
              text.style.fontFamily = '';
              text.style.color = '';
              text.style.textShadow = '';
            }
            gsap.set([text, container], {
              scale: 1,
              rotationX: 0,
              rotationY: 0,
              filter: 'none',
              opacity: 1,
              x: 0,
              y: 0,
            });
          },
        });

        // Shorter, snappier scramble effect
        const scrambleText = (): string => {
          const chars = originalText.split('');
          const scrambledChars = chars.map((char) => {
            if (char === ' ') return ' ';
            return Math.random() < 0.7
              ? glitchChars[Math.floor(Math.random() * glitchChars.length)]
              : char;
          });
          return scrambledChars.join('');
        };

        // Quick scale down effect
        tl.to(text, {
          duration: 0.08,
          scale: 0.95,
          ease: 'power2.inOut',
        });

        // Fast scramble sequence (fewer frames for quicker effect)
        const scrambleFrames = 5;
        for (let i = 0; i < scrambleFrames; i++) {
          tl.call(
            () => {
              if (text) {
                text.textContent = scrambleText();

                // Subtle color shift on scramble
                if (Math.random() < 0.4) {
                  text.style.color = `hsl(${
                    Math.random() * 60 + 180
                  }, 60%, 60%)`;
                }
              }
            },
            [],
            0.1 + i * 0.05
          );
        }

        // Restore to original text and style
        tl.call(
          () => {
            if (text) {
              text.textContent = originalText;
              text.style.color = '';
              text.style.fontFamily = '';
              text.style.textShadow = '';
            }
          },
          [],
          0.1 + scrambleFrames * 0.05
        ).to(
          text,
          {
            duration: 0.25,
            scale: 1,
            ease: 'back.out(1.5)',
          },
          0.1 + scrambleFrames * 0.05
        );
      };

      // Setup event listeners
      let cleanup: (() => void) | undefined;

      if (triggerOnHover) {
        const handleMouseEnter = () => performGlitch();
        const handleMouseLeave = () => {
          if (scrambleOnLeave) {
            performScrambleLeave();
          }
        };

        container.addEventListener('mouseenter', handleMouseEnter);
        container.addEventListener('mouseleave', handleMouseLeave);

        cleanup = () => {
          container.removeEventListener('mouseenter', handleMouseEnter);
          container.removeEventListener('mouseleave', handleMouseLeave);
        };
      }

      // Auto glitch interval
      if (autoGlitch) {
        const interval = setInterval(performGlitch, autoGlitchInterval);
        const intervalCleanup = () => clearInterval(interval);

        if (cleanup) {
          const originalCleanup = cleanup;
          cleanup = () => {
            originalCleanup();
            intervalCleanup();
          };
        } else {
          cleanup = intervalCleanup;
        }
      }

      return cleanup;
    };

    const cleanup = setupGlitchEffects();
    return cleanup;
  }, [
    intensity,
    triggerOnHover,
    autoGlitch,
    autoGlitchInterval,
    scrambleOnLeave,
  ]);
  console.log({ sx });
  return (
    <Typography
      component="span"
      ref={containerRef}
      className={`select-none ${className}`}
      sx={{
        ...(Array.isArray(sx) ? sx : [sx]),
        perspective: '1000px',
        transformStyle: 'preserve-3d',
        display: 'inline-block',
        position: 'relative',
        cursor: 'pointer',
      }}
      {...typographyProps}
    >
      <Typography
        component={typographyProps.component || 'span'}
        variant={typographyProps.variant}
        ref={textRef}
        sx={[
          ...(Array.isArray(sx) ? sx : [sx]),
          (theme) => ({
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
          }),
        ]}
        // {...typographyProps}
      >
        {children}
      </Typography>
    </Typography>
  );
};
