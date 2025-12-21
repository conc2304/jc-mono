'use client';
import React, { memo, useRef, useCallback, useEffect } from 'react';
import { Typography, TypographyProps } from '@mui/material';
import { useGSAP } from '@gsap/react';
import { Property } from 'csstype';
import { gsap } from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';

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
  const containerRef = useRef<HTMLSpanElement>(null);
  const textElementRef = useRef<HTMLSpanElement>(null);
  const hoverAnimationRef = useRef<gsap.core.Timeline | null>(null);
  const isHoveringRef = useRef(false);

  // Function to get random character from scramble set
  const getRandomChar = useCallback(() => {
    return scrambleCharSet[Math.floor(Math.random() * scrambleCharSet.length)];
  }, [scrambleCharSet]);

  // Helper function to split text into words and spaces
  const splitTextIntoTokens = useCallback((text: string) => {
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
  }, []);

  // Helper function to rebuild DOM structure for hover animation
  const rebuildDOMForText = useCallback(
    (targetText: string) => {
      const textElement = textElementRef.current;
      if (!textElement) return;

      // Clear existing content
      textElement.innerHTML = '';

      // Split target text into tokens
      const tokens = splitTextIntoTokens(targetText);

      // Create DOM structure for tokens
      tokens.forEach((token, tokenIndex) => {
        const tokenSpan = document.createElement('span');
        tokenSpan.className = `token-${tokenIndex}`;

        if (token.isSpace) {
          // Space token - simple span
          tokenSpan.style.whiteSpace = 'pre';
          tokenSpan.textContent = ' ';
        } else {
          // Word token - prevent breaking within the word
          tokenSpan.style.display = 'inline-block';
          tokenSpan.style.whiteSpace = 'nowrap';

          // Create character spans within the word
          token.content.split('').forEach((char, charIndex) => {
            const charSpan = document.createElement('span');
            charSpan.className = `char-${tokenIndex}-${charIndex}`;
            charSpan.textContent = char;
            charSpan.style.display = 'inline-block';
            charSpan.style.whiteSpace = 'pre';
            charSpan.style.verticalAlign = 'text-top';
            tokenSpan.appendChild(charSpan);
          });
        }

        textElement.appendChild(tokenSpan);
      });
    },
    [splitTextIntoTokens]
  );

  // Function to create hover scrambling animation
  const createHoverScrambleAnimation = useCallback(
    (
      fromText: string,
      toText: string,
      duration: number = scrambleDuration,
      scrambleCount: number = scrambleChars
    ) => {
      const textElement = textElementRef.current;
      if (!textElement) return gsap.timeline();

      // Rebuild DOM structure to match the target text
      rebuildDOMForText(toText);

      // Set initial text content to fromText
      const fromTokens = splitTextIntoTokens(fromText);
      const toTokens = splitTextIntoTokens(toText);

      // Set initial state to fromText
      fromTokens.forEach((fromToken, tokenIndex) => {
        if (fromToken.isSpace) {
          const tokenElement = textElement.querySelector(
            `.token-${tokenIndex}`
          );
          if (tokenElement) {
            tokenElement.textContent = ' ';
          }
        } else {
          fromToken.content.split('').forEach((char, charIndex) => {
            const charElement = textElement.querySelector(
              `.char-${tokenIndex}-${charIndex}`
            );
            if (charElement) {
              charElement.textContent = char;
            }
          });
        }
      });

      const tl = gsap.timeline();

      // Process each token for animation
      const maxTokens = Math.max(fromTokens.length, toTokens.length);

      for (let tokenIndex = 0; tokenIndex < maxTokens; tokenIndex++) {
        const fromToken = fromTokens[tokenIndex];
        const toToken = toTokens[tokenIndex];

        // Handle missing tokens
        if (!fromToken && toToken) {
          // New token being added
          if (toToken.isSpace) {
            const tokenSelector = `.token-${tokenIndex}`;
            tl.set(
              tokenSelector,
              {
                text: { value: ' ', rtl: false },
              },
              0
            );
          } else {
            toToken.content.split('').forEach((char, charIndex) => {
              const charSelector = `.char-${tokenIndex}-${charIndex}`;
              const startTime = tokenIndex * 0.02 + charIndex * 0.01;

              // Set initial to random char, then scramble to target
              tl.set(
                charSelector,
                {
                  text: { value: getRandomChar(), rtl: false },
                },
                startTime
              );

              const scrambleInterval = duration / scrambleCount;
              for (let j = 0; j < scrambleCount; j++) {
                const scrambledChar =
                  j === scrambleCount - 1 ? char : getRandomChar();
                tl.to(
                  charSelector,
                  {
                    duration: scrambleInterval,
                    text: { value: scrambledChar, rtl: false },
                    ease: 'none',
                  },
                  startTime + j * scrambleInterval
                );
              }
            });
          }
          continue;
        }

        if (fromToken && !toToken) {
          // Token being removed - fade out or scramble away
          if (!fromToken.isSpace) {
            fromToken.content.split('').forEach((char, charIndex) => {
              const charSelector = `.char-${tokenIndex}-${charIndex}`;
              // Check if element exists before animating
              const element = textElement.querySelector(charSelector);
              if (element) {
                const startTime = tokenIndex * 0.02 + charIndex * 0.01;
                tl.to(
                  charSelector,
                  {
                    duration: duration,
                    text: { value: '', rtl: false },
                    ease: 'power2.inOut',
                  },
                  startTime
                );
              }
            });
          }
          continue;
        }

        if (!fromToken || !toToken) continue;

        if (fromToken.isSpace || toToken.isSpace) {
          // Handle spaces
          const tokenSelector = `.token-${tokenIndex}`;
          const element = textElement.querySelector(tokenSelector);
          if (element) {
            tl.set(
              tokenSelector,
              {
                text: { value: toToken?.content || '', rtl: false },
              },
              0
            );
          }
          continue;
        }

        // Handle words - scramble each character
        const fromWord = fromToken.content;
        const toWord = toToken.content;
        const maxLength = Math.max(fromWord.length, toWord.length);

        for (let charIndex = 0; charIndex < maxLength; charIndex++) {
          const fromChar =
            charIndex < fromWord.length ? fromWord[charIndex] : '';
          const toChar = charIndex < toWord.length ? toWord[charIndex] : '';

          const charSelector = `.char-${tokenIndex}-${charIndex}`;
          const element = textElement.querySelector(charSelector);

          // Only animate if element exists and chars are different
          if (element && fromChar !== toChar) {
            const startTime = tokenIndex * 0.02 + charIndex * 0.01;
            const scrambleInterval = duration / scrambleCount;

            for (let j = 0; j < scrambleCount; j++) {
              const scrambledChar =
                j === scrambleCount - 1 ? toChar : getRandomChar();

              tl.to(
                charSelector,
                {
                  duration: scrambleInterval,
                  text: { value: scrambledChar, rtl: false },
                  ease: 'none',
                },
                startTime + j * scrambleInterval
              );
            }
          }
        }
      }

      return tl;
    },
    [
      getRandomChar,
      rebuildDOMForText,
      splitTextIntoTokens,
      scrambleDuration,
      scrambleChars,
    ]
  );

  // Function to handle hover events
  const handleHover = useCallback(
    (isHovering: boolean) => {
      // Prevent re-triggering if already in the same state
      if (isHoveringRef.current === isHovering) {
        return;
      }

      isHoveringRef.current = isHovering;

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
    [defaultText, hoverText, createHoverScrambleAnimation]
  );

  // Initialize the component with default text
  useEffect(() => {
    if (textElementRef.current) {
      rebuildDOMForText(defaultText);

      // Set initial content
      const fromTokens = splitTextIntoTokens(defaultText);
      fromTokens.forEach((token, tokenIndex) => {
        if (token.isSpace) {
          const tokenElement = textElementRef.current?.querySelector(
            `.token-${tokenIndex}`
          );
          if (tokenElement) {
            tokenElement.textContent = ' ';
          }
        } else {
          token.content.split('').forEach((char, charIndex) => {
            const charElement = textElementRef.current?.querySelector(
              `.char-${tokenIndex}-${charIndex}`
            );
            if (charElement) {
              charElement.textContent = char;
            }
          });
        }
      });
    }
  }, [defaultText, rebuildDOMForText, splitTextIntoTokens]);

  // Cleanup animation on unmount
  useEffect(() => {
    return () => {
      if (hoverAnimationRef.current) {
        hoverAnimationRef.current.kill();
      }
    };
  }, []);

  const combinedStyle = {
    color: typographyProps.color ?? textColor,
    cursor: 'pointer',
    whiteSpace: 'pre-wrap' as const,
    wordWrap: 'break-word' as const,
    overflowWrap: 'break-word' as const,
    transition: 'background-color 0.2s ease',
    ...style,
  };

  return (
    <Typography
      ref={containerRef}
      className={`ScrambleText--root scramble-text ${className}`}
      style={combinedStyle}
      onMouseEnter={() => handleHover(true)}
      onMouseLeave={() => handleHover(false)}
      {...typographyProps}
    >
      <span ref={textElementRef} style={{ display: 'inline' }}>
        {/* Content will be dynamically generated */}
      </span>
    </Typography>
  );
};

// Memoize the component to prevent unnecessary re-renders
export const ScrambleText = memo(ScrambleTextInner);
