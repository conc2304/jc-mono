'use client';
import React, { memo, useRef, useCallback, useEffect } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { TextPlugin } from 'gsap/TextPlugin';
import { Box, useMediaQuery, useTheme } from '@mui/system';
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
  hoverScrambleChars?: number;
  hoverScrambleDuration?: number;

  // Flex properties for flexibility
  flex?: string | number;
  maxHeight?: string | number;
  minHeight?: string | number;
  autoScroll?: boolean;

  // Text wrapping behavior
  textWrapMode?: 'ellipsis' | 'wrap' | 'nowrap';

  onComplete?: () => void;
  onProgress?: (
    percentComplete: number,
    currentMessage: string,
    messageIndex: number,
    charIndex: number
  ) => void;
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
  // Flex defaults
  flex = 1,
  maxHeight,
  minHeight = 0,
  autoScroll = true,
  textWrapMode = 'wrap',
  onComplete,
  onProgress,
}) => {
  const theme = useTheme();

  // Mobile breakpoint detection
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const getFontSize = () => {
    if (isMobile) return '0.75rem';
    if (isTablet) return '1rem';
    return '1rem';
  };

  const getMaxHeight = () => {
    if (maxHeight) return maxHeight;
    return '100%';
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const currentLineRef = useRef<number>(0);
  const hoverAnimationsRef = useRef<Map<number, gsap.core.Timeline>>(new Map());

  // Store callbacks in refs to avoid dependency issues
  const onCompleteRef = useRef(onComplete);
  const onProgressRef = useRef(onProgress);

  // Update refs when callbacks change
  onCompleteRef.current = onComplete;
  onProgressRef.current = onProgress;

  // Scroll to top whenever new messages are passed in
  useEffect(() => {
    if (!containerRef.current) return;

    containerRef.current.scrollTo({
      top: 0,
      behavior: 'instant',
    });
  }, [bootMessages]);

  // Smart scrolling function - only scrolls when needed for new lines
  const checkAndScrollForNewLine = useCallback(
    (messageIndex: number) => {
      if (!autoScroll || !containerRef.current) return;

      const container = containerRef.current;
      const messageElement = container.querySelector(
        `.boot-message-${messageIndex}`
      ) as HTMLElement;

      if (!messageElement) return;

      const containerRect = container.getBoundingClientRect();
      const containerBottom = containerRect.bottom;

      const messageRect = messageElement.getBoundingClientRect();
      const messageBottom = messageRect.bottom;

      // Check if the message would be partially or fully outside the visible area
      if (messageBottom > containerBottom) {
        // Calculate how much we need to scroll to bring this line into view
        const scrollAmount = messageBottom - containerBottom + 20; // 20px padding
        const currentScrollTop = container.scrollTop;

        container.scrollTo({
          top: currentScrollTop + scrollAmount,
          behavior: 'smooth',
        });
      }
    },
    [autoScroll]
  );

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

  // Helper function to split text into words and spaces
  const splitTextIntoTokens = (text: string) => {
    const tokens: Array<{ content: string; isSpace: boolean }> = [];
    let currentWord = '';

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (char === ' ') {
        if (currentWord) {
          tokens.push({ content: currentWord, isSpace: false });
          currentWord = '';
        }
        tokens.push({ content: ' ', isSpace: true });
      } else {
        currentWord += char;
      }
    }

    if (currentWord) {
      tokens.push({ content: currentWord, isSpace: false });
    }

    return tokens;
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

    // Split both texts into tokens
    const fromTokens = splitTextIntoTokens(fromText);
    const toTokens = splitTextIntoTokens(toText);
    const maxTokens = Math.max(fromTokens.length, toTokens.length);

    // Process each token
    for (let tokenIndex = 0; tokenIndex < maxTokens; tokenIndex++) {
      const fromToken = fromTokens[tokenIndex];
      const toToken = toTokens[tokenIndex];

      if (!fromToken || !toToken) continue;

      if (fromToken.isSpace || toToken.isSpace) {
        // Handle spaces - just update content directly
        const tokenSelector = `.token-${messageIndex}-${tokenIndex}`;
        tl.set(
          tokenSelector,
          {
            text: { value: toToken?.content || '', rtl: false },
          },
          0
        );
        continue;
      }

      // Handle words - scramble each character
      const fromWord = fromToken.content;
      const toWord = toToken.content;
      const maxLength = Math.max(fromWord.length, toWord.length);

      for (let charIndex = 0; charIndex < maxLength; charIndex++) {
        const fromChar = charIndex < fromWord.length ? fromWord[charIndex] : '';
        const toChar = charIndex < toWord.length ? toWord[charIndex] : '';

        if (fromChar === toChar) continue;

        const charSelector = `.char-${messageIndex}-${tokenIndex}-${charIndex}`;
        const startTime = tokenIndex * 0.02 + charIndex * 0.01;

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

      // Calculate total characters across all messages for progress tracking
      const normalizedMessages = bootMessages.map(
        (msg) => normalizeBootMessage(msg)[0]
      );
      const totalCharacters = normalizedMessages.reduce(
        (sum, msg) => sum + Math.max(msg.length, 1),
        0
      );
      let cumulativeCharacters = 0;

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

      // Function to create scrambling animation for individual characters
      const createCharScrambleAnimation = (
        textSelector: string,
        targetChar: string
      ) => {
        const tl = gsap.timeline();

        if (targetChar === ' ') {
          tl.set(textSelector, {
            width: 'auto',
            text: {
              value: targetChar,
              rtl: false,
            },
          });
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

      // Function to animate a complete message with word-aware wrapping
      const createMessageAnimation = (
        message: string,
        messageIndex: number,
        messageStartCharIndex: number,
        onMessageComplete?: () => void
      ) => {
        const tl = gsap.timeline();

        if (message === '') {
          tl.set(`.boot-text-${messageIndex}`, {
            text: { value: '', rtl: false },
          });

          const progressPercent = Math.min(
            100,
            ((messageStartCharIndex + 1) / totalCharacters) * 100
          );
          tl.call(() => {
            onProgressRef.current?.(progressPercent, message, messageIndex, 0);
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

        // Split message into tokens (words and spaces)
        const tokens = splitTextIntoTokens(message);
        let globalCharIndex = 0;

        // Create DOM structure for tokens
        tokens.forEach((token, tokenIndex) => {
          const tokenSpan = document.createElement('span');
          tokenSpan.className = `token-${messageIndex}-${tokenIndex}`;

          if (token.isSpace) {
            // Space token - simple span
            tokenSpan.style.whiteSpace = 'pre';
            tokenSpan.textContent = ' '; // Start with space, will be revealed
          } else {
            // Word token - prevent breaking within the word
            tokenSpan.style.display = 'inline-block';
            tokenSpan.style.whiteSpace = 'nowrap';

            // Create character spans within the word
            token.content.split('').forEach((char, charIndex) => {
              const charSpan = document.createElement('span');
              charSpan.className = `char-${messageIndex}-${tokenIndex}-${charIndex}`;
              charSpan.textContent = ' '; // Start invisible
              charSpan.style.display = 'inline-block';
              charSpan.style.width = '0';
              charSpan.style.overflow = 'hidden';
              charSpan.style.whiteSpace = 'pre';
              charSpan.style.verticalAlign = 'text-top';
              tokenSpan.appendChild(charSpan);
            });
          }

          textElement.appendChild(tokenSpan);
        });

        // Animate each character with proper timing
        tokens.forEach((token, tokenIndex) => {
          if (token.isSpace) {
            // Simple space reveal
            const startTime = globalCharIndex * charDelay;
            const tokenSelector = `.token-${messageIndex}-${tokenIndex}`;

            tl.set(
              tokenSelector,
              {
                text: { value: ' ', rtl: false },
              },
              startTime
            );

            // Progress callback
            const progressPercent = Math.min(
              100,
              ((messageStartCharIndex + globalCharIndex + 1) /
                totalCharacters) *
                100
            );
            tl.call(
              () => {
                onProgressRef.current?.(
                  progressPercent,
                  message,
                  messageIndex,
                  globalCharIndex
                );
              },
              [],
              startTime
            );

            globalCharIndex++;
          } else {
            // Animate each character in the word
            token.content.split('').forEach((char, charIndex) => {
              const charSelector = `.char-${messageIndex}-${tokenIndex}-${charIndex}`;
              const startTime = globalCharIndex * charDelay;

              const charAnimation = createCharScrambleAnimation(
                charSelector,
                char
              );
              tl.add(charAnimation, startTime);

              // Progress callback
              const progressPercent = Math.min(
                100,
                ((messageStartCharIndex + globalCharIndex + 1) /
                  totalCharacters) *
                  100
              );
              tl.call(
                () => {
                  onProgressRef.current?.(
                    progressPercent,
                    message,
                    messageIndex,
                    globalCharIndex
                  );
                },
                [],
                startTime
              );

              globalCharIndex++;
            });
          }
        });

        const totalDuration =
          (message.length - 1) * charDelay + scrambleDuration;

        if (onMessageComplete) {
          tl.call(onMessageComplete, [], totalDuration);
        }

        return tl;
      };

      // Animate each message sequentially with smart scrolling
      bootMessages.forEach((messageData, index) => {
        const [defaultMessage] = normalizeBootMessage(messageData);
        const messageBlock = messageBlocks[index];

        // BEFORE starting each message, check if we need to scroll
        masterTimeline.call(() => {
          // Add cursor to current line first
          const prevCursor = container.querySelector('.boot-cursor');
          if (prevCursor) {
            prevCursor.remove();
          }

          const newCursor = cursorElement.cloneNode(true) as HTMLElement;
          messageBlock.appendChild(newCursor);

          if (cursor.paused()) {
            cursor.play();
          }

          // Now check if this message line would be outside visible bounds
          setTimeout(() => {
            checkAndScrollForNewLine(index);
          }, 10);
        });

        // Create the message animation
        const messageAnimation = createMessageAnimation(
          defaultMessage,
          index,
          cumulativeCharacters
        );

        masterTimeline.add(messageAnimation);

        // Update cumulative character count for next message
        cumulativeCharacters += Math.max(defaultMessage.length, 1);

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
        flex,
        maxHeight,
        minHeight,
        autoScroll,
        textWrapMode,
      ],
    }
  );

  return (
    <Box
      ref={containerRef}
      className={`boot-text-container ${className}`}
      sx={(theme) => ({
        // Flex properties for flexibility - CRITICAL for preventing overflow
        flex: flex,
        minHeight: 0, // Allow flex item to shrink below content size
        maxHeight: getMaxHeight(),

        // Layout properties
        display: 'flex',
        flexDirection: 'column',
        alignSelf: 'stretch',

        // Typography and visual
        color: textColor,
        fontSize: getFontSize(),
        lineHeight: 1.4,
        padding: 2.5,

        // CRITICAL: Overflow behavior to enable scrolling
        overflow: 'hidden auto', // Hide horizontal, auto vertical
        overflowWrap: 'break-word', // Ensure long words break
        wordBreak: 'break-word', // Additional word breaking

        position: 'relative',

        // Ensure the component doesn't grow beyond its container
        flexShrink: 1,
        flexGrow: flex === 1 ? 1 : 0,

        // Custom scrollbar for better terminal appearance
        scrollbarWidth: 'thin', // Firefox - make visible but thin
        scrollbarColor: `${textColor}40 transparent`, // Semi-transparent scrollbar

        '&::-webkit-scrollbar': {
          width: '8px', // Make scrollbar visible but thin
        },
        '&::-webkit-scrollbar-track': {
          background: 'transparent',
        },
        '&::-webkit-scrollbar-thumb': {
          background: `${textColor}40`, // Semi-transparent thumb
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          background: `${textColor}60`, // Slightly more visible on hover
        },

        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
        },

        '& .boot-message': {
          display: 'block',
          margin: 0,
          padding: '2px 4px',
          borderRadius: '2px',
          minHeight: '1.4em',
          // Enhanced word wrapping for terminal behavior
          wordWrap: 'break-word',
          overflowWrap: 'break-word',
          whiteSpace: 'pre-wrap', // Preserve formatting but allow wrapping
        },

        '& .boot-cursor': {
          color: textColor,
          marginLeft: String(cursorAdjustment?.left ?? ''),
          marginTop: String(cursorAdjustment?.top ?? ''),
          marginBottom: String(cursorAdjustment?.bottom ?? ''),
          marginRight: String(cursorAdjustment?.right ?? ''),
        },
      })}
    >
      {/* Content will be dynamically generated here */}
    </Box>
  );
};

// Memoize the component to prevent unnecessary re-renders
export const BootText = memo(BootTextInner);
