'use client';
import React, { memo, useRef, useCallback, useMemo } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { TextPlugin } from 'gsap/TextPlugin';
import { Box } from '@mui/system';
import { Property } from 'csstype';
import { Typography, TypographyProps } from '@mui/material';

// Register plugins
gsap.registerPlugin(useGSAP, TextPlugin);

interface ScrambleTextProps extends TypographyProps {
  defaultText: string;
  hoverText: string;
  className?: string;
  textColor?: Property.Color;
  scrambleChars?: number;
  scrambleDuration?: number;
  scrambleCharSet?: string;
  style?: React.CSSProperties;
}

const ScrambleTextInner: React.FC<ScrambleTextProps> = ({
  defaultText,
  hoverText,
  className = '',
  textColor = '#ffffff',
  scrambleChars = 6,
  scrambleDuration = 0.4,
  scrambleCharSet = '!@#$%^&*()_+-=[]{}|;:,.<>?ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
  style = {},
  ...typographyProps
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const hoverAnimationRef = useRef<gsap.core.Timeline | null>(null);

  // Generate a unique ID for this component instance
  const uniqueId = useMemo(() => Math.random().toString(36).substr(2, 9), []);

  // Function to get random character from scramble set
  const getRandomChar = () => {
    return scrambleCharSet[Math.floor(Math.random() * scrambleCharSet.length)];
  };

  // Function to create hover scrambling animation
  const createHoverScrambleAnimation = (
    fromText: string,
    toText: string,
    duration: number = scrambleDuration,
    scrambleCount: number = scrambleChars
  ) => {
    const textElement = containerRef.current?.querySelector(
      '.scramble-text-content'
    ) as HTMLElement;

    if (!textElement) return gsap.timeline();

    const tl = gsap.timeline();

    // Get all character spans with the unique ID
    const charElements = textElement.querySelectorAll(
      `[class*="scramble-char-${uniqueId}-"]`
    ) as NodeListOf<HTMLElement>;

    // Calculate the maximum length to handle different text lengths
    const maxLength = Math.max(fromText.length, toText.length);

    // Ensure we have enough character elements
    const currentLength = charElements.length;
    if (currentLength < maxLength) {
      // Add more character spans if needed
      for (let i = currentLength; i < maxLength; i++) {
        const charSpan = document.createElement('span');
        charSpan.className = `scramble-char-${uniqueId}-${i}`;
        charSpan.style.display = 'inline-block';
        charSpan.style.width = 'auto';
        charSpan.style.overflow = 'hidden';
        charSpan.style.whiteSpace = 'pre'; // Preserve spaces
        charSpan.style.verticalAlign = 'text-top';
        charSpan.textContent = ' ';
        textElement.appendChild(charSpan);
      }
    }

    // Update charElements to include new spans
    const allCharElements = textElement.querySelectorAll(
      `[class*="scramble-char-${uniqueId}-"]`
    ) as NodeListOf<HTMLElement>;

    // Animate each character position
    for (let i = 0; i < maxLength; i++) {
      const charElement = allCharElements[i];
      if (!charElement) continue;

      const fromChar = i < fromText.length ? fromText[i] : '';
      const toChar = i < toText.length ? toText[i] : '';

      const charSelector = `.scramble-char-${uniqueId}-${i}`;
      const startTime = i * 0.02; // Slight stagger for effect

      // If characters are the same, just set directly without scrambling
      if (fromChar === toChar) {
        tl.set(
          charSelector,
          {
            text: { value: toChar, rtl: false },
          },
          startTime
        );
        continue;
      }

      // Handle spaces - don't scramble them, just transition directly
      if (toChar === ' ') {
        tl.to(
          charSelector,
          {
            duration: duration / scrambleCount,
            text: {
              value: ' ',
              rtl: false,
            },
            ease: 'none',
          },
          startTime
        );
        continue;
      }

      // Create scrambling sequence for non-space characters
      const scrambleInterval = duration / scrambleCount;

      for (let j = 0; j < scrambleCount; j++) {
        const scrambledChar =
          j === scrambleCount - 1 ? toChar : getRandomChar();

        tl.to(
          charSelector,
          {
            duration: scrambleInterval,
            text: {
              value: scrambledChar,
              rtl: false,
            },
            ease: 'none',
          },
          startTime + j * scrambleInterval
        );
      }
    }

    // Hide extra characters if target text is shorter
    if (toText.length < fromText.length) {
      for (let i = toText.length; i < fromText.length; i++) {
        const charSelector = `.scramble-char-${uniqueId}-${i}`;
        tl.set(
          charSelector,
          {
            text: { value: '', rtl: false },
            display: 'none',
          },
          0
        );
      }
    }

    // Show characters if target text is longer
    if (toText.length > fromText.length) {
      for (let i = fromText.length; i < toText.length; i++) {
        const charSelector = `.scramble-char-${uniqueId}-${i}`;
        tl.set(
          charSelector,
          {
            display: 'inline-block',
          },
          0
        );
      }
    }

    return tl;
  };

  // Function to handle hover events
  const handleHover = useCallback(
    (isHovering: boolean) => {
      // Kill any existing hover animation
      if (hoverAnimationRef.current) {
        hoverAnimationRef.current.kill();
      }

      const fromText = isHovering ? defaultText : hoverText;
      const toText = isHovering ? hoverText : defaultText;

      // Create and store the new animation
      const hoverAnimation = createHoverScrambleAnimation(fromText, toText);
      hoverAnimationRef.current = hoverAnimation;

      // Play the animation
      hoverAnimation.play();
    },
    [defaultText, hoverText, scrambleChars, scrambleDuration, uniqueId]
  );

  // Initialize the component with character spans
  useGSAP(
    () => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const textElement = container.querySelector(
        '.scramble-text-content'
      ) as HTMLElement;

      if (!textElement) return;

      // Clear and setup initial text
      textElement.innerHTML = '';

      // Create character spans for the default text
      const maxLength = Math.max(defaultText.length, hoverText.length);

      for (let i = 0; i < maxLength; i++) {
        const charSpan = document.createElement('span');
        charSpan.className = `scramble-char-${uniqueId}-${i}`;
        charSpan.textContent = i < defaultText.length ? defaultText[i] : '';
        charSpan.style.display = 'inline-block';
        charSpan.style.width = 'auto';
        charSpan.style.overflow = 'hidden';
        charSpan.style.whiteSpace = 'pre'; // Preserve spaces
        charSpan.style.verticalAlign = 'text-top';

        // Hide extra characters initially if default text is shorter
        if (i >= defaultText.length) {
          charSpan.style.display = 'none';
        }

        textElement.appendChild(charSpan);
      }
    },
    {
      scope: containerRef,
      dependencies: [defaultText, hoverText, uniqueId],
    }
  );

  return (
    <Box
      ref={containerRef}
      className={`scramble-text-container ${className}`}
      sx={{
        // display: 'inline-block',
        cursor: 'pointer',
        transition: 'background-color 0.2s ease',
        padding: '2px 4px',
        color: textColor,
        ...style,
      }}
      onMouseEnter={() => handleHover(true)}
      onMouseLeave={() => handleHover(false)}
    >
      <Typography
        className="scramble-text-content"
        style={{ display: 'inline' }}
        component="span"
        {...typographyProps}
        sx={{ ...typographyProps.sx, '*': { minWidth: '0.5rem' } }}
      >
        {/* Character spans will be dynamically generated here */}
      </Typography>
    </Box>
  );
};

// Memoize the component to prevent unnecessary re-renders
export const ScrambleText = memo(ScrambleTextInner);
