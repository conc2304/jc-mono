'use client';
import React, { memo, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { TextPlugin } from 'gsap/TextPlugin';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/700.css';
import { alpha, Box } from '@mui/system';
import { BootMessage } from '../../types';
import { Property } from 'csstype';

// Register plugins
gsap.registerPlugin(useGSAP, TextPlugin);

interface BootTextProps {
  bootMessages: BootMessage[];
  className?: string;
  autoStart?: boolean;
  typeSpeed?: number;
  lineDelay?: number;
  textColor?: Property.Color;
  cursorChar?: string;
  cursorAdjustment?: Partial<
    Record<'top' | 'right' | 'bottom' | 'left', Property.MarginTop>
  >;
  scrambleChars?: number;
  scrambleDuration?: number;
  charDelay?: number;
  scrambleCharSet?: string;
  hoverScrambleChars?: number; // Number of characters to cycle through on hover
  hoverScrambleDuration?: number; // Duration of scrambling on hover

  onComplete?: () => void;
  onProgress?: (current: number, total: number, message: string) => void;
}

const BootTextInner: React.FC<BootTextProps> = ({
  bootMessages,
  className = '',
  autoStart = true,
  typeSpeed = 2,
  lineDelay = 0.5,
  textColor = '#ffffff',
  cursorChar = '_',
  scrambleChars = 8,
  scrambleDuration = 0.8,
  charDelay = 0.05,
  scrambleCharSet = '!@#$%^&*()_+-=[]{}|;:,.<>?ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
  hoverScrambleChars = 6,
  hoverScrambleDuration = 0.4,
  cursorAdjustment = {
    left: '4px',
    top: '-2px',
  },
  onComplete,
  onProgress,
}) => {
  // const theme = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const currentLineRef = useRef<number>(0);
  const hoverAnimationsRef = useRef<Map<number, gsap.core.Timeline>>(new Map());

  // Store callbacks in refs to avoid dependency issues
  const onCompleteRef = useRef(onComplete);
  const onProgressRef = useRef(onProgress);

  // Update refs when callbacks change
  onCompleteRef.current = onComplete;
  onProgressRef.current = onProgress;

  // Helper function to normalize boot messages
  const normalizeBootMessage = (message: BootMessage): [string, string?] => {
    if (typeof message === 'string') {
      return [message];
    }
    if (Array.isArray(message)) {
      if (message.length === 1) {
        return [message[0]];
      }
      if (message.length >= 2) {
        return [message[0], message[1]];
      }
    }
    return [''];
  };

  // Function to get random character from scramble set
  const getRandomChar = () => {
    return scrambleCharSet[Math.floor(Math.random() * scrambleCharSet.length)];
  };

  // Function to create hover scrambling animation
  const createHoverScrambleAnimation = (
    messageIndex: number,
    fromText: string,
    toText: string,
    duration: number = hoverScrambleDuration,
    scrambleCount: number = hoverScrambleChars
  ) => {
    const textElement = containerRef.current?.querySelector(
      `.boot-text-${messageIndex}`
    ) as HTMLElement;

    if (!textElement) return gsap.timeline();

    const tl = gsap.timeline();

    // Get all character spans
    const charElements = textElement.querySelectorAll(
      `[class*="char-${messageIndex}-"]`
    ) as NodeListOf<HTMLElement>;

    // Calculate the maximum length to handle different text lengths
    const maxLength = Math.max(fromText.length, toText.length);

    // Ensure we have enough character elements
    const currentLength = charElements.length;
    if (currentLength < maxLength) {
      // Add more character spans if needed
      for (let i = currentLength; i < maxLength; i++) {
        const charSpan = document.createElement('span');
        charSpan.className = `char-${messageIndex}-${i}`;
        charSpan.style.display = 'inline-block';
        charSpan.style.width = 'auto';
        charSpan.style.overflow = 'hidden';
        charSpan.style.whiteSpace = 'nowrap';
        charSpan.style.verticalAlign = 'text-top';
        charSpan.textContent = ' ';
        textElement.appendChild(charSpan);
      }
    }

    // Update charElements to include new spans
    const allCharElements = textElement.querySelectorAll(
      `[class*="char-${messageIndex}-"]`
    ) as NodeListOf<HTMLElement>;

    // Animate each character position
    for (let i = 0; i < maxLength; i++) {
      const charElement = allCharElements[i];
      if (!charElement) continue;

      const fromChar = i < fromText.length ? fromText[i] : '';
      const toChar = i < toText.length ? toText[i] : '';

      // If characters are the same, skip scrambling
      if (fromChar === toChar) {
        continue;
      }

      const charSelector = `.char-${messageIndex}-${i}`;
      const startTime = i * 0.02; // Slight stagger for effect

      // Create scrambling sequence
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
        const charSelector = `.char-${messageIndex}-${i}`;
        tl.set(charSelector, { text: { value: '', rtl: false } }, 0);
      }
    }

    return tl;
  };

  // Function to handle hover events
  const handleMessageHover = useCallback(
    (messageIndex: number, isHovering: boolean) => {
      const [defaultMessage, hiddenMessage] = normalizeBootMessage(
        bootMessages[messageIndex]
      );

      // Only proceed if there's a hidden message
      if (!hiddenMessage) return;

      // Kill any existing hover animation for this message
      const existingAnimation = hoverAnimationsRef.current.get(messageIndex);
      if (existingAnimation) {
        existingAnimation.kill();
      }

      const fromText = isHovering ? defaultMessage : hiddenMessage;
      const toText = isHovering ? hiddenMessage : defaultMessage;

      // Create and store the new animation
      const hoverAnimation = createHoverScrambleAnimation(
        messageIndex,
        fromText,
        toText
      );
      hoverAnimationsRef.current.set(messageIndex, hoverAnimation);

      // Play the animation
      hoverAnimation.play();
    },
    [bootMessages, hoverScrambleChars, hoverScrambleDuration]
  );

  useGSAP(
    () => {
      if (!autoStart || !containerRef.current || bootMessages.length === 0)
        return;

      const container = containerRef.current;

      // Clear container and reset
      container.innerHTML = '';
      currentLineRef.current = 0;

      // Create message blocks for each boot message
      const messageBlocks: HTMLDivElement[] = [];
      bootMessages.forEach((messageData, index) => {
        const [defaultMessage, hiddenMessage] =
          normalizeBootMessage(messageData);

        const messageBlock = document.createElement('div');
        messageBlock.className = `boot-message boot-message-${index}`;

        messageBlock.style.minHeight = defaultMessage === '' ? '1.6em' : 'auto';

        // Add hover functionality if there's a hidden message
        if (hiddenMessage) {
          messageBlock.style.cursor = 'pointer';
          messageBlock.style.transition = 'background-color 0.2s ease';

          messageBlock.addEventListener('mouseenter', () => {
            messageBlock.style.backgroundColor = 'rgba(0, 255, 65, 0.05)';
            handleMessageHover(index, true);
          });

          messageBlock.addEventListener('mouseleave', () => {
            messageBlock.style.backgroundColor = 'transparent';
            handleMessageHover(index, false);
          });
        }

        const textElement = document.createElement('span');
        textElement.className = `boot-text-${index}`;
        textElement.style.display = 'inline';

        messageBlock.appendChild(textElement);
        container.appendChild(messageBlock);
        messageBlocks.push(messageBlock);
      });

      // Create cursor element
      const cursorElement = document.createElement('span');
      cursorElement.className = 'boot-cursor';
      cursorElement.textContent = ' ' + cursorChar;

      // Cursor animation
      let cursor = gsap
        .to('.boot-cursor', {
          opacity: 0,
          ease: 'power2.inOut',
          repeat: -1,
          duration: 0.8,
        })
        .pause();

      // Main animation timeline
      let masterTimeline = gsap
        .timeline({
          onComplete: () => {
            cursor.pause();
            gsap.set('.boot-cursor', { opacity: 0 });
            onCompleteRef.current?.();
          },
        })
        .pause();

      // Function to create scrambling animation for a single character
      const createScrambleAnimation = (
        textSelector: string,
        targetChar: string,
        charIndex: number,
        messageLength: number
      ) => {
        const tl = gsap.timeline();

        if (targetChar === ' ') {
          tl.set(textSelector, {
            width: 'auto',
          }).set(
            textSelector,
            {
              text: {
                value: targetChar,
                rtl: false,
              },
            },
            0
          );
          return tl;
        }

        tl.set(textSelector, {
          width: 'auto',
        });

        const scrambleInterval = scrambleDuration / scrambleChars;

        for (let i = 0; i < scrambleChars; i++) {
          const scrambledChar =
            i === scrambleChars - 1 ? targetChar : getRandomChar();

          tl.to(textSelector, {
            duration: scrambleInterval,
            text: {
              value: scrambledChar,
              rtl: false,
            },
            ease: 'none',
          });
        }

        return tl;
      };

      // Function to animate a complete message with staggered character scrambling
      const createMessageAnimation = (
        message: string,
        messageIndex: number,
        onMessageComplete?: () => void
      ) => {
        const tl = gsap.timeline();

        if (message === '') {
          tl.set(`.boot-text-${messageIndex}`, {
            text: { value: '', rtl: false },
          });
          if (onMessageComplete) {
            tl.call(onMessageComplete);
          }
          return tl;
        }

        const messageBlock = messageBlocks[messageIndex];
        const textElement = messageBlock.querySelector(
          `.boot-text-${messageIndex}`
        ) as HTMLElement;

        textElement.innerHTML = '';
        const charElements: HTMLSpanElement[] = [];

        for (let i = 0; i < message.length; i++) {
          const charSpan = document.createElement('span');
          charSpan.className = `char-${messageIndex}-${i}`;
          charSpan.textContent = ' ';

          charSpan.style.display = 'inline-block';
          charSpan.style.width = '0';
          charSpan.style.overflow = 'hidden';
          charSpan.style.whiteSpace = 'nowrap';
          charSpan.style.verticalAlign = 'text-top';

          textElement.appendChild(charSpan);
          charElements.push(charSpan);
        }

        message.split('').forEach((char, charIndex) => {
          const charSelector = `.char-${messageIndex}-${charIndex}`;
          const startTime = charIndex * charDelay;

          const charAnimation = createScrambleAnimation(
            charSelector,
            char,
            charIndex,
            message.length
          );

          tl.add(charAnimation, startTime);
        });

        const totalDuration =
          (message.length - 1) * charDelay + scrambleDuration;

        if (onMessageComplete) {
          tl.call(onMessageComplete, [], totalDuration);
        }

        return tl;
      };

      // Animate each message sequentially
      bootMessages.forEach((messageData, index) => {
        const [defaultMessage] = normalizeBootMessage(messageData);
        const textSelector = `.boot-text-${index}`;
        const messageBlock = messageBlocks[index];

        // Add cursor to current line
        masterTimeline.call(() => {
          const prevCursor = container.querySelector('.boot-cursor');
          if (prevCursor) {
            prevCursor.remove();
          }

          const newCursor = cursorElement.cloneNode(true) as HTMLElement;
          messageBlock.appendChild(newCursor);

          if (cursor.paused()) {
            cursor.play();
          }
        });

        // Create the scrambling message animation
        const messageAnimation = createMessageAnimation(
          defaultMessage,
          index,
          () => {
            onProgressRef.current?.(
              index + 1,
              bootMessages.length,
              defaultMessage
            );
          }
        );

        masterTimeline.add(messageAnimation);

        if (index < bootMessages.length - 1) {
          masterTimeline.set({}, {}, `+=${lineDelay}`);
        }
      });

      // Remove cursor after completion
      masterTimeline.call(() => {
        const finalCursor = container.querySelector('.boot-cursor');
        if (finalCursor) {
          finalCursor.remove();
        }
      });

      masterTimeline.play();
    },
    {
      scope: containerRef,
      dependencies: [
        bootMessages,
        autoStart,
        typeSpeed,
        lineDelay,
        cursorChar,
        scrambleChars,
        scrambleDuration,
        charDelay,
        scrambleCharSet,
        hoverScrambleChars,
        hoverScrambleDuration,
      ],
    }
  );

  return (
    // TODO - ADD Augmentations
    <Box
      ref={containerRef}
      className={`boot-text-container ${className}`}
      sx={(theme) => ({
        fontFamily: '"JetBrains Mono", monospace',
        backgroundColor: theme.palette.background.paper,
        color: textColor,
        padding: 2.5,
        width: '100%',
        height: '100%',
        border: `1px solid ${textColor}`,

        minHeight: '200px',
        fontSize: '16px',
        lineHeight: 1.4,
        overflow: 'hidden',
        position: 'relative',

        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            'radial-gradient(ellipse at center, rgba(0,255,65,0.03) 0%, transparent 70%)',
          pointerEvents: 'none',

          '& .boot-message': {
            fontFamily: '"JetBrains Mono", monospace',
            color: textColor,
            whiteSpace: 'pre-wrap',
            display: 'flex',
            alignItems: 'flex-start',
          },

          '& .boot-cursor': {
            color: textColor,
            marginLeft: String(cursorAdjustment?.left ?? ''),
            marginTop: String(cursorAdjustment?.top ?? ''),
            marginBottom: String(cursorAdjustment?.bottom ?? ''),
            marginRight: String(cursorAdjustment?.right ?? ''),
          },
        },

        boxShadow: `inset 0 0 20px ${alpha(textColor, 0.1)}`,

        '& .boot-message': {
          display: 'block',
          margin: 0,
          padding: '2px 4px',
          borderRadius: '2px',
        },
      })}
    >
      {/* NOTE - Content will be dynamically generated here */}
    </Box>
  );
};

// Memoize the component to prevent unnecessary re-renders
export const BootText = memo(BootTextInner);
