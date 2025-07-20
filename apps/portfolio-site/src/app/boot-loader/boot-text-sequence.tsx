'use client';
import React, { memo, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { TextPlugin } from 'gsap/TextPlugin';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/700.css';
import { Typography, Box } from '@mui/material';

const bootMessages = [
  'Initializing system...',
  'Loading kernel modules...',
  'Starting network services...',
  'Mounting file systems...',
  'Starting user services...',
  'System boot complete.',
  '',
  'Welcome to Terminal OS v2.1.0',
  'Type "help" for available commands.',
];

// Register plugins
gsap.registerPlugin(useGSAP, TextPlugin);

interface BootTextProps {
  bootMessages: string[];
  className?: string;
  autoStart?: boolean;
  typeSpeed?: number;
  lineDelay?: number;
  cursorChar?: string;
  scrambleChars?: number; // Number of characters to cycle through
  scrambleDuration?: number; // Duration of scrambling per character
  charDelay?: number; // Delay between starting each character's animation
  scrambleCharSet?: string; // Set of characters to use for scrambling
  onComplete?: () => void;
  onProgress?: (current: number, total: number, message: string) => void;
}

const BootTextInner: React.FC<BootTextProps> = ({
  bootMessages,
  className = '',
  autoStart = true,
  typeSpeed = 2,
  lineDelay = 0.5,
  cursorChar = '_',
  scrambleChars = 8,
  scrambleDuration = 0.8,
  charDelay = 0.05,
  scrambleCharSet = '!@#$%^&*()_+-=[]{}|;:,.<>?ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
  onComplete,
  onProgress,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const currentLineRef = useRef<number>(0);

  // Store callbacks in refs to avoid dependency issues
  const onCompleteRef = useRef(onComplete);
  const onProgressRef = useRef(onProgress);

  // Update refs when callbacks change
  onCompleteRef.current = onComplete;
  onProgressRef.current = onProgress;

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
      bootMessages.forEach((message, index) => {
        const messageBlock = document.createElement('div');
        messageBlock.className = `boot-message boot-message-${index}`;
        messageBlock.style.fontFamily = '"JetBrains Mono", monospace';
        messageBlock.style.color = '#00ff41';
        messageBlock.style.fontSize = '14px';
        // messageBlock.style.lineHeight = '1.6';
        messageBlock.style.whiteSpace = 'pre-wrap';
        messageBlock.style.display = 'flex';
        messageBlock.style.alignItems = 'flexstart';

        messageBlock.style.minHeight = message === '' ? '1.6em' : 'auto'; // Preserve empty lines

        const textElement = document.createElement('span');
        textElement.className = `boot-text-${index}`;
        textElement.style.display = 'inline';

        messageBlock.appendChild(textElement);
        container.appendChild(messageBlock);
        messageBlocks.push(messageBlock);
      });

      // Create cursor element (only show on current active line)
      const cursorElement = document.createElement('span');
      cursorElement.className = 'boot-cursor';
      cursorElement.textContent = cursorChar;
      cursorElement.style.marginLeft = '4px';
      cursorElement.style.color = '#00ff41';
      cursorElement.style.marginTop = '-2px'; // move the cursor up to match text for this character "█"

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

      // Function to get random character from scramble set
      const getRandomChar = () => {
        return scrambleCharSet[
          Math.floor(Math.random() * scrambleCharSet.length)
        ];
      };

      // Function to create scrambling animation for a single character
      const createScrambleAnimation = (
        textSelector: string,
        targetChar: string,
        charIndex: number,
        messageLength: number
      ) => {
        const tl = gsap.timeline();

        // Skip scrambling for spaces to keep them clean
        if (targetChar === ' ') {
          // Start width animation and set text immediately for spaces
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

        // Start by setting width to auto to reveal the character span
        tl.set(textSelector, {
          width: 'auto',
        });

        // Create scrambling effect
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
          // Handle empty messages quickly
          tl.set(`.boot-text-${messageIndex}`, {
            text: { value: '', rtl: false },
          });
          if (onMessageComplete) {
            tl.call(onMessageComplete);
          }
          return tl;
        }

        // Create individual character elements for better control
        const messageBlock = messageBlocks[messageIndex];
        const textElement = messageBlock.querySelector(
          `.boot-text-${messageIndex}`
        ) as HTMLElement;

        // Clear the text element and create spans for each character
        textElement.innerHTML = '';
        const charElements: HTMLSpanElement[] = [];

        for (let i = 0; i < message.length; i++) {
          const charSpan = document.createElement('span');
          charSpan.className = `char-${messageIndex}-${i}`;
          charSpan.textContent = ' '; // Start with space

          // Set initial styles - start with width 0 and hidden overflow
          charSpan.style.display = 'inline-block';
          charSpan.style.width = '0';
          charSpan.style.overflow = 'hidden';
          charSpan.style.whiteSpace = 'nowrap';

          charSpan.style.verticalAlign = 'text-top';

          textElement.appendChild(charSpan);
          charElements.push(charSpan);
        }

        // Animate each character with staggered delay
        message.split('').forEach((char, charIndex) => {
          const charSelector = `.char-${messageIndex}-${charIndex}`;
          const startTime = charIndex * charDelay;

          const charAnimation = createScrambleAnimation(
            charSelector,
            char,
            charIndex,
            message.length
          );

          // Add character animation at staggered time
          tl.add(charAnimation, startTime);
        });

        // Calculate when the entire message will be complete
        const totalDuration =
          (message.length - 1) * charDelay + scrambleDuration;

        // Add completion callback at the right time
        if (onMessageComplete) {
          tl.call(onMessageComplete, [], totalDuration);
        }

        return tl;
      };

      // Animate each message sequentially
      bootMessages.forEach((message, index) => {
        const textSelector = `.boot-text-${index}`;
        const messageBlock = messageBlocks[index];

        // Add cursor to current line
        masterTimeline.call(() => {
          // Remove cursor from previous line
          const prevCursor = container.querySelector('.boot-cursor');
          if (prevCursor) {
            prevCursor.remove();
          }

          // Add cursor to current line
          const newCursor = cursorElement.cloneNode(true) as HTMLElement;
          messageBlock.appendChild(newCursor);

          // Start cursor blinking
          if (cursor.paused()) {
            cursor.play();
          }
        });

        // Create the scrambling message animation
        const messageAnimation = createMessageAnimation(message, index, () => {
          // Notify progress after each line completes
          onProgressRef.current?.(index + 1, bootMessages.length, message);
        });

        // Add the message animation to master timeline
        masterTimeline.add(messageAnimation);

        // Add delay between lines (except for last message)
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

      // Start the animation
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
      ],
    }
  );

  return (
    <Box
      ref={containerRef}
      className={`boot-text-container ${className}`}
      sx={{
        fontFamily: '"JetBrains Mono", monospace',
        backgroundColor: '#0a0a0a',
        color: '#00ff41',
        padding: '20px',
        borderRadius: '8px',
        border: '1px solid #333',
        minHeight: '200px',
        fontSize: '14px',
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
        },

        // Terminal-like styling
        boxShadow: 'inset 0 0 20px rgba(0,255,65,0.1)',

        // Style for individual message blocks
        '& .boot-message': {
          display: 'block',
          margin: 0,
          padding: 0,
        },
      }}
    >
      {/* Content will be dynamically generated */}
    </Box>
  );
};

// Memoize the component to prevent unnecessary re-renders
export const BootText = memo(BootTextInner);

// Example usage component with progress tracking
export const BootTextExample: React.FC = () => {
  const [progress, setProgress] = React.useState({
    current: 0,
    total: 0,
    message: '',
  });
  const [isComplete, setIsComplete] = React.useState(false);

  // Use useCallback to prevent function recreation on every render
  const handleProgress = useCallback(
    (current: number, total: number, message: string) => {
      setProgress({ current, total, message });
    },
    []
  );

  const handleBootComplete = useCallback(() => {
    setIsComplete(true);
    console.log('Boot sequence complete!');
  }, []);

  return (
    <div
      style={{
        padding: '40px',
        backgroundColor: '#1a1a1a',
        minHeight: '100vh',
      }}
    >
      <Typography
        variant="h4"
        sx={{
          color: '#00ff41',
          textAlign: 'center',
          marginBottom: '20px',
          fontFamily: '"JetBrains Mono", monospace',
        }}
      >
        Boot Sequence Demo
      </Typography>

      {/* Progress Display */}
      <Box
        sx={{
          textAlign: 'center',
          marginBottom: '20px',
          fontFamily: '"JetBrains Mono", monospace',
          color: '#00ff41',
        }}
      >
        <Typography variant="body2">
          Progress: {progress.current}/{progress.total}
          {progress.message && ` - ${progress.message}`}
        </Typography>
        <div
          style={{
            width: '300px',
            height: '4px',
            backgroundColor: '#333',
            margin: '10px auto',
            borderRadius: '2px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${
                progress.total > 0
                  ? (progress.current / progress.total) * 100
                  : 0
              }%`,
              height: '100%',
              backgroundColor: '#00ff41',
              transition: 'width 0.3s ease',
            }}
          />
        </div>
        {isComplete && (
          <Typography
            variant="body2"
            sx={{ color: '#ffff00', marginTop: '10px' }}
          >
            ✓ Boot Complete!
          </Typography>
        )}
      </Box>

      <BootText
        bootMessages={bootMessages}
        typeSpeed={1.8}
        lineDelay={2}
        cursorChar="█"
        scrambleChars={12}
        scrambleDuration={0.6}
        charDelay={0.05}
        scrambleCharSet="!@#$%^&*()_+-=[]{}|;:,.<>?ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
        onProgress={handleProgress}
        onComplete={handleBootComplete}
      />
    </div>
  );
};
