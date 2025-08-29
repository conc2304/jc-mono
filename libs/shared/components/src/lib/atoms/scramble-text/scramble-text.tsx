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

  // Function to split text into words and characters for proper wrapping
  const parseTextStructure = (text: string) => {
    const words = text.split(' ');
    const structure: Array<{
      type: 'word' | 'space';
      content: string;
      wordIndex?: number;
    }> = [];

    words.forEach((word, wordIndex) => {
      if (word.length > 0) {
        structure.push({ type: 'word', content: word, wordIndex });
      }
      // Add space after each word except the last one
      if (wordIndex < words.length - 1) {
        structure.push({ type: 'space', content: ' ' });
      }
    });

    return structure;
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

    // Parse both texts into word structures
    const fromStructure = parseTextStructure(fromText);
    const toStructure = parseTextStructure(toText);

    // Get the maximum number of elements needed
    const maxElements = Math.max(fromStructure.length, toStructure.length);

    // Ensure we have enough word/space containers
    const existingContainers = textElement.querySelectorAll(
      `[class*="scramble-element-${uniqueId}-"]`
    );

    if (existingContainers.length < maxElements) {
      // Add more containers if needed
      for (let i = existingContainers.length; i < maxElements; i++) {
        const elementContainer = document.createElement('span');
        elementContainer.className = `scramble-element-${uniqueId}-${i}`;
        elementContainer.style.display = 'inline-block';
        textElement.appendChild(elementContainer);
      }
    }

    // Process each element (word or space)
    for (let elementIndex = 0; elementIndex < maxElements; elementIndex++) {
      const fromElement =
        elementIndex < fromStructure.length
          ? fromStructure[elementIndex]
          : null;
      const toElement =
        elementIndex < toStructure.length ? toStructure[elementIndex] : null;

      const container = textElement.querySelector(
        `.scramble-element-${uniqueId}-${elementIndex}`
      ) as HTMLElement;

      if (!container) continue;

      // Handle case where we're removing an element
      if (!toElement) {
        tl.set(container, { display: 'none' }, 0);
        continue;
      }

      // Show container if it was hidden
      tl.set(container, { display: 'inline-block' }, 0);

      // Handle spaces
      if (toElement.type === 'space') {
        container.innerHTML = ' ';
        container.style.whiteSpace = 'pre';
        continue;
      }

      // Handle words - create character spans within the word container
      const fromWord = fromElement?.type === 'word' ? fromElement.content : '';
      const toWord = toElement.content;
      const maxCharLength = Math.max(fromWord.length, toWord.length);

      // Clear and rebuild character structure for this word
      container.innerHTML = '';
      for (let charIndex = 0; charIndex < maxCharLength; charIndex++) {
        const charSpan = document.createElement('span');
        charSpan.className = `scramble-char-${uniqueId}-${elementIndex}-${charIndex}`;
        charSpan.style.display = 'inline-block';
        charSpan.style.minWidth = '0';
        charSpan.textContent =
          charIndex < fromWord.length ? fromWord[charIndex] : '';

        if (charIndex >= fromWord.length) {
          charSpan.style.display = 'none';
        }

        container.appendChild(charSpan);
      }

      // Animate each character in the word
      for (let charIndex = 0; charIndex < maxCharLength; charIndex++) {
        const fromChar = charIndex < fromWord.length ? fromWord[charIndex] : '';
        const toChar = charIndex < toWord.length ? toWord[charIndex] : '';

        const charSelector = `.scramble-char-${uniqueId}-${elementIndex}-${charIndex}`;
        const startTime = elementIndex * 0.05 + charIndex * 0.02;

        // Show/hide character spans based on target word length
        if (charIndex >= toWord.length) {
          tl.set(charSelector, { display: 'none' }, startTime);
          continue;
        } else if (charIndex >= fromWord.length) {
          tl.set(charSelector, { display: 'inline-block' }, startTime);
        }

        // If characters are the same, just set directly without scrambling
        if (fromChar === toChar && fromChar !== '') {
          tl.set(
            charSelector,
            {
              text: { value: toChar, rtl: false },
            },
            startTime
          );
          continue;
        }

        // Create scrambling sequence for different characters
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

  // Initialize the component with word and character structure
  useGSAP(
    () => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const textElement = container.querySelector(
        '.scramble-text-content'
      ) as HTMLElement;

      if (!textElement) return;

      // Clear and setup initial text structure
      textElement.innerHTML = '';

      // Parse the default text into word/space structure
      const defaultStructure = parseTextStructure(defaultText);
      const hoverStructure = parseTextStructure(hoverText);
      const maxElements = Math.max(
        defaultStructure.length,
        hoverStructure.length
      );

      // Create containers for each word/space element
      for (let elementIndex = 0; elementIndex < maxElements; elementIndex++) {
        const elementContainer = document.createElement('span');
        elementContainer.className = `scramble-element-${uniqueId}-${elementIndex}`;
        elementContainer.style.display = 'inline-block';

        const defaultElement =
          elementIndex < defaultStructure.length
            ? defaultStructure[elementIndex]
            : null;

        if (!defaultElement) {
          elementContainer.style.display = 'none';
        } else if (defaultElement.type === 'space') {
          elementContainer.innerHTML = ' ';
          elementContainer.style.whiteSpace = 'pre';
        } else {
          // Create character spans for the word
          const word = defaultElement.content;
          for (let charIndex = 0; charIndex < word.length; charIndex++) {
            const charSpan = document.createElement('span');
            charSpan.className = `scramble-char-${uniqueId}-${elementIndex}-${charIndex}`;
            charSpan.textContent = word[charIndex];
            charSpan.style.display = 'inline-block';
            charSpan.style.minWidth = '0';
            elementContainer.appendChild(charSpan);
          }
        }

        textElement.appendChild(elementContainer);
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
        cursor: 'pointer',
        transition: 'background-color 0.2s ease',
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
        sx={{ ...typographyProps.sx }}
      >
        {/* Word and character spans will be dynamically generated here */}
      </Typography>
    </Box>
  );
};

// Memoize the component to prevent unnecessary re-renders
export const ScrambleText = memo(ScrambleTextInner);
